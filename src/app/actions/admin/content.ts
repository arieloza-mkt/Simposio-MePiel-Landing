"use server";

import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { siteSettings } from "@/lib/db/schema";
import { sanitizeHtml } from "@/lib/sanitize";

const benefit = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
});

function parseBenefitLines(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon = "", title = "", ...rest] = line.split("|").map((p) => p.trim());
      return { icon, title, description: rest.join(" | ") };
    })
    .filter((b) => b.title !== "");
}

const benefitLines = z.string().transform((raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, treat as pipe-delimited
  }
  return parseBenefitLines(raw);
});

function parsePairLines(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value = "", label = ""] = line.split("|").map((p) => p.trim());
      return { value, label };
    })
    .filter((p) => p.value !== "");
}

const pairLines = z.string().transform((raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, treat as pipe-delimited
  }
  return parsePairLines(raw);
});

const stringArray = z.string().transform((raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // not JSON, treat as newline-separated
  }
  return raw.split("\n").map((l) => l.trim()).filter(Boolean);
});

/* Solo se admiten longitudes CSS simples: "48px", "3rem", "7vw", "100%" y
   funciones clamp()/min()/max() con 2 o 3 longitudes separadas por "," o "/".
   Se rechaza todo lo demás (calc(), url(), var(), ;, etc.) porque el valor
   acaba en un style inline. */
const CSS_UNITS = ["px", "rem", "em", "vw", "vh", "vmin", "vmax", "%"].join("|");
const CSS_LENGTH = `(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:${CSS_UNITS})`;
const CSS_SIZE_RE = new RegExp(
  `^(?:(?:clamp|min|max)\\(\\s*${CSS_LENGTH}(?:\\s*[,/]\\s*${CSS_LENGTH}){1,2}\\s*\\)|${CSS_LENGTH})$`,
);

const cssSize = z
  .string()
  .trim()
  .max(80)
  .refine((v) => CSS_SIZE_RE.test(v), {
    message:
      "Tamaño inválido. Ej: 48px, 3rem, 7vw o clamp(48px, 7vw, 88px)",
  });

/* Pesos disponibles en las fuentes del proyecto: Montserrat carga
   300/400/500/600/700/900. Bebas Neue solo tiene 400 (el resto lo
   sintetiza el navegador), igual que la cursiva. */
const optionalWeight = z.union([
  z.literal(""),
  z.enum(["300", "400", "500", "600", "700", "900"]),
]);

const optionalFontStyle = z.union([z.literal(""), z.enum(["normal", "italic"])]);

const optionalHexColor = z
  .string()
  .trim()
  .refine((v) => v === "" || /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v), {
    message: "Color hexadecimal inválido. Ej: #ffffff",
  });

/* Estilos de un título (H1/H2). La variante de escritorio siempre tiene
   tipografía (el select no puede quedar vacío); la móvil puede quedar en ""
   para heredar el valor de escritorio dentro del media query de 1000px. */
function headlineStyle(mobile: boolean) {
  return {
    fontSize: z.union([z.literal(""), cssSize]),
    fontFamily: mobile
      ? z.union([z.literal(""), z.enum(["display", "body", "mono"])])
      : z.enum(["display", "body", "mono"]).default("display"),
    fontWeight: optionalWeight,
    fontStyle: optionalFontStyle,
    color: optionalHexColor,
  };
}

/* El prefijo de los campos guardados es "h1"/"h2" y el sufijo de viewport
   es "" (escritorio) o "Mobile". Se aplana a un objeto de una sola clave por
   propiedad porque la base de datos guarda el contenido como JSON plano. */
function headlineStyleFields(level: "h1" | "h2") {
  const desktop = headlineStyle(false);
  const mobile = headlineStyle(true);
  const fields: Record<string, z.ZodTypeAny> = {};
  for (const prop of ["fontSize", "fontFamily", "fontWeight", "fontStyle", "color"] as const) {
    const name = `${prop[0].toUpperCase()}${prop.slice(1)}`;
    fields[`${level}${name}`] = desktop[prop];
    fields[`${level}${name}Mobile`] = mobile[prop];
  }
  return fields;
}

export type ContentKey =
  | "site"
  | "seo"
  | "hero"
  | "queEs"
  | "mepielAlianza"
  | "benefits"
  | "labFeatures"
  | "attendeeTypes"
  | "tracks"
  | "ctaCierre"
  | "logoSpin"
  | "editionsModal"
  | "editionsPanel"
  | "labsSection"
  | "expositoresSection"
  | "registroSection"
  | "footer";

const linkItem = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
});

const CONTENT_SCHEMAS: Record<ContentKey, z.ZodTypeAny> = {
  site: z.object({
    name: z.string().trim().min(2),
    edition: z.string().trim().min(1),
    year: z.coerce.number().int().min(2020).max(2100),
    tagline: z.string(),
    description: z.string(),
  }),
  seo: z.object({
    title: z.string().trim().min(1),
    siteName: z.string().trim().min(1),
    keywords: z.string(),
    description: z.string(),
  }),
  hero: z.object({
    h1: z.string().trim().min(1, "El H1 no puede quedar vacío").max(120),
    h2: z.string().trim().max(160),
    subtitle: z.string(),
    videoId: z.string().trim().max(120),
    metrics: pairLines,
    ...headlineStyleFields("h1"),
    ...headlineStyleFields("h2"),
  }),
  queEs: z.object({
    eyebrow: z.string().trim(),
    title: z.string().trim().min(2),
    highlight: z.string().trim(),
    intro: z.string(),
    experienceIntro: z.string(),
    experienceItems: stringArray,
    imageUrl: z.string().trim(),
    imageAlt: z.string(),
  }),
  mepielAlianza: z.object({
    eyebrow: z.string().trim(),
    title: z.string().trim().min(2),
    highlight: z.string().trim(),
    titleLines: stringArray,
    paragraphs: stringArray,
    images: stringArray,
    imageUrl: z.string().trim(),
    imageAlt: z.string(),
  }),
  benefits: z.object({ items: benefitLines }),
  labFeatures: z.object({ items: benefitLines }),
  attendeeTypes: z.object({
    items: z.string().transform((raw) => {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // not JSON
      }
      return raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [icon = "", label = ""] = line.split("|").map((p) => p.trim());
          return { icon, label };
        })
        .filter((a) => a.label !== "");
    }),
  }),
  tracks: z.object({
    items: z.string().transform((raw) => {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // not JSON
      }
      return raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [num = "", title = "", ...rest] = line
            .split("|")
            .map((p) => p.trim());
          return { num, title, description: rest.join(" | ") };
        })
        .filter((t) => t.title !== "");
    }),
  }),
  ctaCierre: z.object({
    description: z.string().trim().min(2),
  }),
  logoSpin: z.object({
    logoUrl: z.string().trim(),
  }),
  editionsModal: z.object({
    speakersTitle: z.string().trim().min(1),
    speakersDescription: z.string(),
    labsTitle: z.string().trim().min(1),
    labsDescription: z.string(),
  }),
  editionsPanel: z.object({
    viewMoreText: z.string().trim().min(1),
  }),
  labsSection: z.object({
    eyebrow: z.string().trim(),
    title: z.string().trim().min(1),
  }),
  expositoresSection: z.object({
    eyebrow: z.string().trim(),
    title: z.string().trim().min(1),
  }),
  registroSection: z.object({
    eyebrow: z.string().trim(),
    title: z.string().trim().min(1),
    description: z.string(),
    validationText: z.string(),
    dudasLabel: z.string().trim(),
    dudasLinkText: z.string().trim(),
    submitButtonText: z.string().trim().min(1),
  }),
  footer: z.object({
    description: z.string(),
    copyright: z.string(),
    logoUrl: z.string().trim(),
    privacyLinkText: z.string().trim(),
    privacyLinkUrl: z.string().trim(),
    eventLinks: z.array(linkItem),
    participateLinks: z.array(linkItem),
    contactLinks: z.array(linkItem),
  }),
};

function isContentKey(key: string): key is ContentKey {
  return Object.hasOwn(CONTENT_SCHEMAS, key);
}

export async function saveContentSetting(
  key: string,
  rawValues: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  if (!isContentKey(key)) {
    return { ok: false, error: "Sección desconocida." };
  }

  // Only rich-text fields hold HTML. Plain-text fields (e.g. queEs.experienceIntro,
  // which is a TextInput) must stay untouched or characters like "<" get mangled.
  const sanitizedValues = { ...rawValues };
  const htmlFields: Record<string, string[]> = {
    hero: ["subtitle"],
    queEs: ["intro"],
    mepielAlianza: ["paragraphs"],
    registroSection: ["description", "validationText"],
    footer: ["description"],
    editionsModal: ["speakersDescription", "labsDescription"],
  };

  const fieldsToSanitize = htmlFields[key as keyof typeof htmlFields];
  if (fieldsToSanitize) {
    for (const field of fieldsToSanitize) {
      if (typeof sanitizedValues[field] === "string") {
        sanitizedValues[field] = sanitizeHtml(sanitizedValues[field] as string);
      } else if (Array.isArray(sanitizedValues[field])) {
        sanitizedValues[field] = (sanitizedValues[field] as string[]).map((item) =>
          sanitizeHtml(item),
        );
      }
    }
  }

  const parsed = CONTENT_SCHEMAS[key].safeParse(sanitizedValues);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  await ensureDb();
  const db = await getDbReady();

  await db
    .insert(siteSettings)
    .values({ key, value: parsed.data })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: parsed.data },
    });

  return { ok: true };
}

export async function saveContentForm(
  key: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  return saveContentSetting(
    key,
    Object.fromEntries(formData.entries()) as Record<string, unknown>,
  );
}
