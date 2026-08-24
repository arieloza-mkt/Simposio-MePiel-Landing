"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { speakers } from "@/lib/db/schema";

const speakerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "El nombre es obligatorio"),
  role: z.string().trim().nullable(),
  company: z.string().trim().nullable(),
  imageUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\//.test(v), {
      message: "La imagen debe ser una URL http(s)",
    })
    .nullable(),
  sortOrder: z.number().int().min(0).max(9999),
});

export type SpeakerInput = z.infer<typeof speakerSchema>;

export async function saveSpeaker(
  input: SpeakerInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = speakerSchema.safeParse(input);
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
    name: data.name,
    role: data.role || null,
    company: data.company || null,
    imageUrl: data.imageUrl || null,
    sortOrder: data.sortOrder,
  };

  if (data.id) {
    await db.update(speakers).set(values).where(eq(speakers.id, data.id));
  } else {
    const [{ value: maxOrder }] = await db
      .select({ value: sql<number>`coalesce(max(${speakers.sortOrder}), -1)` })
      .from(speakers);
    await db.insert(speakers).values({ ...values, sortOrder: maxOrder + 1 });
  }

  revalidatePath("/admin/ponentes");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSpeaker(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();
  await db.delete(speakers).where(eq(speakers.id, id));

  revalidatePath("/admin/ponentes");
  revalidatePath("/");
  return { ok: true };
}
