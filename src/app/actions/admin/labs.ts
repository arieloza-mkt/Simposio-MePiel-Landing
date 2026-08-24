"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

  revalidatePath("/");
  revalidatePath("/admin/contenido");
  return { ok: true };
}
