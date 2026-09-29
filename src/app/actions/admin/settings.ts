"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { siteSettings } from "@/lib/db/schema";

/* endsAt es opcional: solo lo usa la ventana de escaneo de entradas
   (lib/entrada.ts). El countdown de la edición 3 únicamente lee startsAt, así
   que exigirlo impedía configurar solo la fecha que muestra el contador. */
const eventConfigSchema = z.object({
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z
    .string()
    .trim()
    .refine((v) => v === "" || !Number.isNaN(new Date(v).getTime()), "Fecha inválida")
    .transform((v) => v || null)
    .nullable()
    .optional(),
});

export async function saveEventScheduleWindow(
  startsAt: string,
  endsAt: string,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = eventConfigSchema.safeParse({
    startsAt: startsAt.trim(),
    endsAt: endsAt.trim(),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ??
        "Fechas inválidas. Usa el formato con zona horaria, p. ej. 2026-10-15T09:00:00-06:00.",
    };
  }

  await ensureDb();
  const db = await getDbReady();
  const current = await db_getEventConfig();

  // Solo se sobreescriben las claves enviadas: eventConfig también guarda
  // timezone, dateLabel y venueLabel, que este formulario no expone.
  await db
    .insert(siteSettings)
    .values({
      key: "eventConfig",
      value: { ...current, ...parsed.data },
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: { ...current, ...parsed.data } },
    });

  revalidatePath("/");
  return { ok: true };
}

async function db_getEventConfig(): Promise<Record<string, unknown>> {
  await ensureDb();
  const db = await getDbReady();
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "eventConfig"))
    .limit(1);
  return (row?.value as Record<string, unknown>) ?? {};
}
