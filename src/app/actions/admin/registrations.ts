"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { registrations } from "@/lib/db/schema";
import { newAccessCode } from "@/lib/access-code";

const setStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pendiente", "aprobado", "rechazado"]),
});

export async function setRegistrationStatus(
  id: string,
  status: "pendiente" | "aprobado" | "rechazado",
): Promise<{ ok: boolean; error?: string }> {
  const parsed = setStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos." };
  }

  await ensureDb();
  const db = await getDbReady();
  await db
    .update(registrations)
    .set({ status: parsed.data.status })
    .where(eq(registrations.id, parsed.data.id));

  return { ok: true };
}

export async function deleteRegistration(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();
  await db.delete(registrations).where(eq(registrations.id, id));

  return { ok: true };
}

/**
 * Rota el código de acceso de un registro: el QR anterior deja de
 * funcionar y debe volverse a emitir al asistente.
 */
export async function regenerateRegistrationCode(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();
  const updated = await db
    .update(registrations)
    .set({ accessCode: newAccessCode() })
    .where(eq(registrations.id, id))
    .returning({ id: registrations.id });

  if (updated.length === 0) {
    return { ok: false, error: "Registro no encontrado." };
  }

  return { ok: true };
}
