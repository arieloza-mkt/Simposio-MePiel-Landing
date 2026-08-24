"use server";

import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { registrations } from "@/lib/db/schema";
import { generateEntradaQr } from "@/lib/entrada";
import { newAccessCode } from "@/lib/access-code";

export interface RecoverPassState {
  ok: boolean;
  error?: string;
  nombre?: string;
  folio?: string;
  qrDataUrl?: string;
}

const recoverSchema = z.object({
  email: z.string().trim().email("Escribe un correo válido."),
});

/**
 * Recuperación de pase en pantalla: rota el código de acceso del registro
 * (invalida cualquier QR previamente compartido) y devuelve el QR nuevo.
 */
export async function recoverPass(
  _prev: RecoverPassState,
  formData: FormData,
): Promise<RecoverPassState> {
  const parsed = recoverSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  await ensureDb();
  const db = await getDbReady();

  const [registration] = await db
    .select({
      id: registrations.id,
      nombre: registrations.nombre,
      status: registrations.status,
    })
    .from(registrations)
    .where(
      sql`lower(${registrations.email}) = ${parsed.data.email.toLowerCase()}`,
    )
    .limit(1);

  if (!registration) {
    return {
      ok: false,
      error:
        "No encontramos un registro con ese correo. Verifica que sea el mismo con el que te registraste.",
    };
  }

  if (registration.status === "rechazado") {
    return {
      ok: false,
      error:
        "Tu registro no está activo para generar pase. Acércate al mostrador de recepción con una identificación.",
    };
  }

  const code = newAccessCode();
  await db
    .update(registrations)
    .set({ accessCode: code })
    .where(sql`${registrations.id} = ${registration.id}`);

  revalidatePath("/admin/registros");

  return {
    ok: true,
    nombre: registration.nombre,
    folio: registration.id,
    qrDataUrl: await generateEntradaQr(code),
  };
}
