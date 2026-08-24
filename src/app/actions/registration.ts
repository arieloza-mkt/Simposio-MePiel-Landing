"use server";

import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { registrations } from "@/lib/db/schema";
import { generateEntradaQr } from "@/lib/entrada";
import { newAccessCode } from "@/lib/access-code";
import { PROFILE_OPTIONS } from "@/lib/constants";

const registerSchema = z.object({
  nombre: z.string().trim().min(3, "Por favor ingresa tu nombre completo"),
  email: z.string().trim().email("Por favor ingresa un correo válido"),
  telefono: z.string().trim().min(7, "Por favor ingresa tu teléfono"),
  empresa: z.string().trim().min(2, "Por favor ingresa tu empresa o farmacia"),
  perfil: z
    .string()
    .refine(
      (value) => PROFILE_OPTIONS.some((option) => option.value === value),
      "Por favor selecciona tu perfil",
    ),
});

export interface RegisterInput {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  perfil: string;
}

export interface RegisterResult {
  ok: boolean;
  error?: string;
  folio?: string;
  qrDataUrl?: string;
}

function isUniqueViolation(error: unknown): boolean {
  const raw = String(error);
  return (
    raw.includes("duplicate key") ||
    raw.includes("registrations_email_unique") ||
    raw.includes("23505")
  );
}

export async function registerAttendee(
  input: RegisterInput,
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  try {
    await ensureDb();
    const db = await getDbReady();
    const [row] = await db
      .insert(registrations)
      .values({ ...parsed.data, accessCode: newAccessCode() })
      .returning({ id: registrations.id, accessCode: registrations.accessCode });
    return {
      ok: true,
      folio: row.id,
      qrDataUrl: await generateEntradaQr(row.accessCode as string),
    };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        error:
          "Este correo ya tiene un registro activo. Si necesitas actualizar tus datos, contáctanos.",
      };
    }
    console.error("[registro] error al guardar", error);
    return {
      ok: false,
      error:
        "No pudimos guardar tu registro en este momento. Intenta de nuevo en unos minutos.",
    };
  }
}
