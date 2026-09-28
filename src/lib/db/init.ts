import { eq, isNull, sql } from "drizzle-orm";
import { newAccessCode } from "@/lib/access-code";
import { getDbReady, resetDb } from "./client";
import { DDL_STATEMENTS } from "./ddl";
import { splitLegacyHeadline } from "../hero-headline";
import {
  EDITION_SEED,
  FAQ_SEED,
  LAB_SEED,
  PROGRAMA_ITEM_SEED,
  SCHEDULE_SEED,
  SETTINGS_SEED,
  SPEAKER_SEED,
} from "./seed-data";
import * as schema from "./schema";

const globalForInit = globalThis as unknown as {
  __simposioInit?: Promise<void>;
};

const RETRY_ATTEMPTS = 3;
const RETRY_BACKOFF_MS = [1000, 4000];
const ATTEMPT_TIMEOUT_MS = 20_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runWithRetries(fn: () => Promise<void>): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(`timeout tras ${ATTEMPT_TIMEOUT_MS}ms sin respuesta`),
              ),
            ATTEMPT_TIMEOUT_MS,
          ),
        ),
      ]);
      return;
    } catch (error) {
      lastError = error;
      resetDb();
      if (attempt < RETRY_ATTEMPTS) {
        const backoff = RETRY_BACKOFF_MS[attempt - 1] ?? 1000;
        console.warn(
          `[db:init] intento ${attempt}/${RETRY_ATTEMPTS} falló (${error instanceof Error ? error.message : String(error)}); reintentando en ${backoff}ms…`,
        );
        await sleep(backoff);
      }
    }
  }
  throw lastError;
}

async function init(): Promise<void> {
  const run = async (): Promise<void> => {
    const db = await getDbReady();

    for (const statement of DDL_STATEMENTS) {
      await db.execute(sql.raw(statement));
    }

    const seeded = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "seeded"))
      .limit(1);

    if (seeded.length === 0) {
      await db.insert(schema.speakers).values(SPEAKER_SEED).onConflictDoNothing();
      await db.insert(schema.editions).values(EDITION_SEED).onConflictDoNothing();
      await db.insert(schema.labs).values(LAB_SEED).onConflictDoNothing();
      await db
        .insert(schema.scheduleItems)
        .values(SCHEDULE_SEED)
        .onConflictDoNothing();
      await db.insert(schema.faqItems).values(FAQ_SEED).onConflictDoNothing();
      await db
        .insert(schema.siteSettings)
        .values(
          Object.entries(SETTINGS_SEED).map(([key, value]) => ({ key, value })),
        )
        .onConflictDoNothing();
      await db
        .insert(schema.siteSettings)
        .values({ key: "seeded", value: { at: new Date().toISOString() } })
        .onConflictDoNothing();
    }

    // Backfill: código de acceso para registros creados antes de la migración.
    // Temario de ediciones: se rellena solo si la edición ya existe y su temario
    // está vacío, para no pisar contenido editado desde /admin/ediciones.
    for (const seed of EDITION_SEED) {
      if (!seed.temario || seed.temario.length === 0) continue;
      const rows = await db
        .select({ id: schema.editions.id, temario: schema.editions.temario })
        .from(schema.editions)
        .where(sql`${schema.editions.year} = ${seed.year}`);
      for (const row of rows) {
        if (row.temario.length === 0) {
          await db
            .update(schema.editions)
            .set({ temario: seed.temario })
            .where(eq(schema.editions.id, row.id));
        }
      }
    }
    // Normalización del temario (formato viejo): en `speaker` venía el nombre y
    // el puesto combinados ("NOMBRE · PUESTO"). Se separa en description (nombre)
    // y speaker (puesto). Idempotente: solo actúa si el item aún tiene " · ".
    const temarioEditions = await db
      .select({ id: schema.editions.id, temario: schema.editions.temario })
      .from(schema.editions);
    for (const row of temarioEditions) {
      const items = Array.isArray(row.temario) ? row.temario : [];
      let changed = false;
      const next = items.map((item) => {
        const t = item as Partial<schema.EditionTemarioItem>;
        if (typeof t.speaker === "string" && t.speaker.includes("·")) {
          const parts = t.speaker.split("·").map((p: string) => p.trim());
          changed = true;
          return {
            title: t.title ?? "",
            description: parts[0] ?? "",
            speaker: parts.slice(1).join(" · ") || undefined,
          };
        }
        return t as schema.EditionTemarioItem;
      });
      if (changed) {
        await db
          .update(schema.editions)
          .set({ temario: next })
          .where(eq(schema.editions.id, row.id));
      }
    }
    // El título del hero pasó de `headline` (HTML de TipTap) a `h1` + `h2`
    // (texto plano). Idempotente: solo actúa si la fila aún no tiene `h1`.
    const heroRow = await db
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "hero"))
      .limit(1);
    const storedHero = heroRow[0]?.value as
      | (Record<string, unknown> & { headline?: unknown })
      | undefined;
    if (storedHero && !storedHero.h1) {
      const { h1, h2 } = splitLegacyHeadline(storedHero.headline);
      const next: Record<string, unknown> = { ...storedHero, h1, h2 };
      delete next.headline;
      await db
        .update(schema.siteSettings)
        .set({ value: next, updatedAt: new Date() })
        .where(eq(schema.siteSettings.key, "hero"));
    }

    // Programa (3 días): se siembra solo si la tabla está vacía,
    // para no pisar las ediciones hechas desde /admin/programa.
    const programCount = await db
      .select({ id: schema.programaItems.id })
      .from(schema.programaItems)
      .limit(1);
    if (programCount.length === 0) {
      await db
        .insert(schema.programaItems)
        .values(PROGRAMA_ITEM_SEED)
        .onConflictDoNothing();
    }

    for (;;) {
      const missing = await db
        .select({ id: schema.registrations.id })
        .from(schema.registrations)
        .where(isNull(schema.registrations.accessCode))
        .limit(100);
      if (missing.length === 0) break;
      for (const row of missing) {
        await db
          .update(schema.registrations)
          .set({ accessCode: newAccessCode() })
          .where(eq(schema.registrations.id, row.id));
      }
    }
  };

  try {
    await runWithRetries(run);
  } catch (error) {
    resetDb();
    throw error;
  }
}

export function ensureDb(): Promise<void> {
  if (!globalForInit.__simposioInit) {
    globalForInit.__simposioInit = init().catch((error) => {
      const cause =
        error && typeof error === "object" && "cause" in error
          ? (error as { cause?: unknown }).cause
          : undefined;
      console.error(
        "[db:init] no se pudo inicializar la base de datos. Verifica que DATABASE_URL siga vigente en Neon y que esta máquina alcance el host (red/VPN).",
        error instanceof Error ? error.message : error,
        cause ? `\ncausa: ${String(cause)}` : "",
      );
      globalForInit.__simposioInit = undefined;
      throw error;
    });
  }
  return globalForInit.__simposioInit;
}