"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { siteSettings } from "@/lib/db/schema";

const benefit = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
});

const benefitLines = z.string().transform((raw) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon = "", title = "", ...rest] = line.split("|").map((p) => p.trim());
      return { icon, title, description: rest.join(" | ") };
    })
    .filter((b) => b.title !== ""),
);

const pairLines = z.string().transform((raw) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value = "", label = ""] = line.split("|").map((p) => p.trim());
      return { value, label };
    })
    .filter((p) => p.value !== ""),
);

export type ContentKey =
  | "site"
  | "hero"
  | "queEs"
  | "mepielAlianza"
  | "benefits"
  | "labFeatures"
  | "attendeeTypes"
  | "tracks"
  | "ctaCierre";

const CONTENT_SCHEMAS: Record<ContentKey, z.ZodTypeAny> = {
  site: z.object({
    name: z.string().trim().min(2),
    edition: z.string().trim().min(1),
    year: z.coerce.number().int().min(2020).max(2100),
    tagline: z.string(),
    description: z.string(),
  }),
  hero: z.object({
    videoId: z.string().trim().max(120),
    metrics: pairLines,
  }),
  queEs: z.object({
    title: z.string().trim().min(2),
    highlight: z.string().trim(),
    intro: z.string(),
    experienceIntro: z.string(),
    experienceItems: z
      .string()
      .transform((raw) =>
        raw.split("\n").map((l) => l.trim()).filter(Boolean),
      ),
  }),
  mepielAlianza: z.object({
    eyebrow: z.string().trim(),
    title: z.string().trim().min(2),
    highlight: z.string().trim(),
    paragraphs: z
      .string()
      .transform((raw) =>
        raw.split("\n").map((l) => l.trim()).filter(Boolean),
      ),
    imageUrl: z.string().trim(),
  }),
  benefits: z.object({ items: benefitLines }),
  labFeatures: z.object({ items: benefitLines }),
  attendeeTypes: z.object({
    items: z.string().transform((raw) =>
      raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [icon = "", label = ""] = line.split("|").map((p) => p.trim());
          return { icon, label };
        })
        .filter((a) => a.label !== ""),
    ),
  }),
  tracks: z.object({
    items: z.string().transform((raw) =>
      raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [num = "", title = "", ...rest] = line
            .split("|")
            .map((p) => p.trim());
          return { num, title, description: rest.join(" | ") };
        })
        .filter((t) => t.title !== ""),
    ),
  }),
  ctaCierre: z.object({
    description: z.string().trim().min(2),
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

  const parsed = CONTENT_SCHEMAS[key].safeParse(rawValues);
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

  revalidatePath("/");
  revalidatePath("/admin/contenido");
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
