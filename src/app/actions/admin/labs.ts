"use server";

import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { labs } from "@/lib/db/schema";

const labLogoSchema = z.object({
  id: z.string().min(1),
  imageUrl: z
    .string()
    .trim()
    .min(1, "La URL del logo es obligatoria")
    .refine((v) => /^https?:\/\//.test(v), {
      message: "El logo debe ser una URL http(s)",
    }),
});

export type LabLogoInput = z.infer<typeof labLogoSchema>;

export async function updateLabLogo(
  input: LabLogoInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = labLogoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  await ensureDb();
  const db = await getDbReady();

  const result = await db
    .update(labs)
    .set({ imageUrl: parsed.data.imageUrl })
    .where(eq(labs.id, parsed.data.id))
    .returning({ id: labs.id });

  if (!result.length) {
    return { ok: false, error: "Laboratorio no encontrado." };
  }

  return { ok: true };
}

const labItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1),
  imageUrl: z.string().trim().min(1),
});

export async function saveLabsList(
  items: Array<{ id?: string; name: string; imageUrl: string }>,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = z.array(labItemSchema).safeParse(items);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await ensureDb();
  const db = await getDbReady();

  const existing = await db.select({ id: labs.id }).from(labs);
  const existingIds = new Set(existing.map((r) => r.id));
  const incomingIds = new Set(parsed.data.filter((l) => l.id).map((l) => l.id!));

  // Delete labs not in the incoming list
  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toDelete.length) {
    await db.delete(labs).where(inArray(labs.id, toDelete));
  }

  // Upsert each lab
  for (let i = 0; i < parsed.data.length; i++) {
    const lab = parsed.data[i];
    if (lab.id && existingIds.has(lab.id)) {
      await db
        .update(labs)
        .set({ name: lab.name, imageUrl: lab.imageUrl, sortOrder: i })
        .where(eq(labs.id, lab.id));
    } else {
      await db.insert(labs).values({
        name: lab.name,
        imageUrl: lab.imageUrl,
        sortOrder: i,
      });
    }
  }

  return { ok: true };
}
