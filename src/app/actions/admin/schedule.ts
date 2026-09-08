"use server";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { scheduleItems } from "@/lib/db/schema";

const scheduleItemSchema = z.object({
  id: z.string().uuid().optional(),
  day: z.coerce.number().int().min(1).max(30).default(1),
  title: z.string().trim().min(2, "El título es obligatorio"),
  time: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/, 'Usa formato 24h "H:MM", p. ej. 9:30'),
  description: z.string().trim().nullable(),
  tag: z.enum(["Conferencia", "Panel", "Networking", "Activo", "Cierre"]),
});

export type ScheduleItemInput = z.infer<typeof scheduleItemSchema>;

export async function saveScheduleItem(
  input: ScheduleItemInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = scheduleItemSchema.safeParse(input);
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
    day: data.day,
    title: data.title,
    time: data.time,
    description: data.description || null,
    tag: data.tag,
  };

  if (data.id) {
    await db
      .update(scheduleItems)
      .set(values)
      .where(eq(scheduleItems.id, data.id));
  } else {
    const [{ value: maxOrder }] = await db
      .select({
        value: sql<number>`coalesce(max(${scheduleItems.sortOrder}), -1)`,
      })
      .from(scheduleItems);
    await db.insert(scheduleItems).values({ ...values, sortOrder: maxOrder + 1 });
  }

  return { ok: true };
}

export async function deleteScheduleItem(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();
  await db.delete(scheduleItems).where(eq(scheduleItems.id, id));

  return { ok: true };
}
