"use server";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { programaItems } from "@/lib/db/schema";
import { PROGRAMA_MODO_FORANEOS, PROGRAMA_MODO_LOCALES } from "@/lib/programa";

const PROGRAMA_KIND_VALUES = [
  "conferencia",
  "conversatorio",
  "taller",
  "negocios",
  "break",
  "comida",
  "libre",
  "evento",
  "logistica",
] as const;

const PROGRAMA_MODOS = [PROGRAMA_MODO_FORANEOS, PROGRAMA_MODO_LOCALES] as const;

const programaItemSchema = z.object({
  id: z.string().uuid().optional(),
  day: z.coerce.number().int().min(1).max(3).default(2),
  start: z.string().trim().max(8).default(""),
  end: z.string().trim().max(8).default(""),
  title: z.string().trim().min(2, "El título es obligatorio"),
  speakers: z.string().trim().transform((v) =>
    v
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  ),
  salon: z.string().trim().nullable(),
  nota: z.string().trim().nullable(),
  kind: z.enum(PROGRAMA_KIND_VALUES).default("conferencia"),
  // "" = todas las modalidades; si no es un modo válido se guarda NULL.
  modo: z.string().trim().transform((v) =>
    PROGRAMA_MODOS.includes(v as (typeof PROGRAMA_MODOS)[number])
      ? (v as (typeof PROGRAMA_MODOS)[number])
      : null,
  ),
});

export type ProgramaItemInput = z.input<typeof programaItemSchema>;

export async function saveProgramaItem(
  input: ProgramaItemInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = programaItemSchema.safeParse(input);
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
    start: data.start,
    end: data.end,
    title: data.title,
    speakers: data.speakers,
    salon: data.salon || null,
    nota: data.nota || null,
    kind: data.kind,
    modo: data.modo,
  };

  if (data.id) {
    await db
      .update(programaItems)
      .set(values)
      .where(eq(programaItems.id, data.id));
  } else {
    const [{ value: maxOrder }] = await db
      .select({
        value: sql<number>`coalesce(max(${programaItems.sortOrder}), -1)`,
      })
      .from(programaItems);
    await db
      .insert(programaItems)
      .values({ ...values, sortOrder: maxOrder + 1 });
  }

  return { ok: true };
}

export async function deleteProgramaItem(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();
  await db.delete(programaItems).where(eq(programaItems.id, id));

  return { ok: true };
}