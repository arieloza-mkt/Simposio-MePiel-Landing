"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { siteSettings } from "@/lib/db/schema";

const transmisionSchema = z.object({
  isLive: z.boolean(),
  videoId: z.string().trim().max(120).transform((v) => v || null),
  title: z.string().trim().min(1),
  description: z.string().trim(),
  backdropUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\//.test(v), "Debe ser URL http(s)")
    .transform((v) => v || null),
});

export type TransmisionInput = z.infer<typeof transmisionSchema>;

const eventConfigSchema = z.object({
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
});

export async function saveTransmision(
  input: TransmisionInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = transmisionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos." };
  }

  await ensureDb();
  const db = await getDbReady();

  await db
    .insert(siteSettings)
    .values({ key: "transmision", value: parsed.data })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: parsed.data },
    });

  return { ok: true };
}

export async function saveEventScheduleWindow(
  startsAt: string,
  endsAt: string,
): Promise<{ ok: boolean; error?: string }> {
  const currentResult = await db_getEventConfig();
  const parsed = eventConfigSchema.safeParse({
    startsAt,
    endsAt,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error:
        "Fechas inválidas. Usa el formato con zona horaria, p. ej. 2026-10-15T09:00:00-06:00.",
    };
  }

  await ensureDb();
  const db = await getDbReady();

  await db
    .insert(siteSettings)
    .values({
      key: "eventConfig",
      value: { ...currentResult, ...parsed.data },
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: { ...currentResult, ...parsed.data } },
    });

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
