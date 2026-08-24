"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { editions } from "@/lib/db/schema";

const urlOrNull = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//.test(v), "Debe ser URL http(s)")
  .transform((v) => v || null);

const pipeLines = <T,>(parse: (parts: string[]) => T | null) =>
  z
    .string()
    .transform((raw) =>
      raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => parse(line.split("|").map((p) => p.trim())))
        .filter((v): v is T => v !== null),
    );

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
  stats: pipeLines((parts) =>
    parts.length >= 1 && parts[0]
      ? { value: parts[0], label: parts[1] ?? "" }
      : null,
  ),
  images: pipeLines((parts) =>
    parts[0]
      ? { src: parts[0], alt: parts.slice(1).join(" | ") || "Foto de la edición" }
      : null,
  ),
  labs: pipeLines((parts) =>
    parts[0] ? { name: parts[0], image: parts[1] ?? "" } : null,
  ),
  speakerIds: z.array(z.string().uuid()).default([]),
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
