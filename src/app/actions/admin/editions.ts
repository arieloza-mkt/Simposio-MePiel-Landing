"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { editions } from "@/lib/db/schema";

const urlOrNull = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//.test(v), "Debe ser URL http(s)")
  .transform((v) => v || null);

const editionSchema = z.object({
  id: z.string().uuid().optional(),
  ordinal: z.string().trim().min(1).max(4),
  year: z.coerce.number().int().min(2020).max(2100),
  eyebrow: z.string().trim().min(1, "La etiqueta superior es obligatoria"),
  title: z.string().trim().min(2, "El título es obligatorio"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  backdropUrl: urlOrNull,
  logoUrl: urlOrNull,
  videoId: z.string().trim().max(120).transform((v) => v || null),
  stats: z
    .union([z.string(), z.array(z.object({ value: z.string(), label: z.string() }))])
    .transform((v) => {
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed as { value: string; label: string }[];
        } catch {}
        return v
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const parts = l.split("|").map((p) => p.trim());
            return parts[0] ? { value: parts[0], label: parts[1] ?? "" } : null;
          })
          .filter((x): x is { value: string; label: string } => x !== null);
      }
      return v;
    }),
  images: z
    .union([z.string(), z.array(z.object({ src: z.string(), alt: z.string() }))])
    .transform((v) => {
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed as { src: string; alt: string }[];
        } catch {}
        return v
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const parts = l.split("|").map((p) => p.trim());
            return parts[0]
              ? { src: parts[0], alt: parts.slice(1).join(" | ") || "Foto de la edición" }
              : null;
          })
          .filter((x): x is { src: string; alt: string } => x !== null);
      }
      return v;
    }),
  labs: z
    .union([z.string(), z.array(z.object({ name: z.string(), image: z.string() }))])
    .transform((v) => {
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed as { name: string; image: string }[];
        } catch {}
        return v
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const parts = l.split("|").map((p) => p.trim());
            return parts[0] ? { name: parts[0], image: parts[1] ?? "" } : null;
          })
          .filter((x): x is { name: string; image: string } => x !== null);
      }
      return v;
    }),
  speakerIds: z.array(z.string().uuid()).default([]),
  temario: z
    .union([
      z.string(),
      z.array(
        z.object({
          time: z.string().optional(),
          title: z.string(),
          description: z.string().optional(),
        }),
      ),
    ])
    .transform((v) => {
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
        return v
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const parts = l.split("|").map((p) => p.trim());
            return parts[0]
              ? { time: parts[0], title: parts[1] ?? "", description: parts[2] }
              : null;
          })
          .filter(
            (
              x,
            ): x is { time: string; title: string; description: string } =>
              x !== null,
          );
      }
      return v;
    })
    .default([]),
});

export type EditionInput = z.infer<typeof editionSchema>;

export async function saveEdition(
  input: EditionInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = editionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }
  const data = parsed.data;

  await ensureDb();
  const db = await getDbReady();

  const values = {
    ordinal: data.ordinal,
    year: data.year,
    eyebrow: data.eyebrow,
    title: data.title,
    description: data.description,
    backdropUrl: data.backdropUrl,
    logoUrl: data.logoUrl,
    videoId: data.videoId,
    stats: data.stats,
    images: data.images,
    labs: data.labs,
    speakerIds: data.speakerIds,
    temario: data.temario,
  };

  try {
    if (data.id) {
      await db.update(editions).set(values).where(eq(editions.id, data.id));
    } else {
      await db.insert(editions).values(values);
    }
  } catch {
    return { ok: false, error: "No se pudo guardar. ¿El año ya existe?" };
  }

  revalidatePath("/admin/ediciones");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteEdition(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();
  await db.delete(editions).where(eq(editions.id, id));

  revalidatePath("/admin/ediciones");
  revalidatePath("/");
  return { ok: true };
}
