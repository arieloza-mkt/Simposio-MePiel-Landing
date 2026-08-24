import { eq, isNull, sql } from "drizzle-orm";
import { newAccessCode } from "@/lib/access-code";
import { getDbReady } from "./client";
import { DDL_STATEMENTS } from "./ddl";
import {
  EDITION_SEED,
  FAQ_SEED,
  LAB_SEED,
  SCHEDULE_SEED,
  SETTINGS_SEED,
  SPEAKER_SEED,
} from "./seed-data";
import * as schema from "./schema";

const globalForInit = globalThis as unknown as {
  __simposioInit?: Promise<void>;
};

async function init(): Promise<void> {
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
}

export function ensureDb(): Promise<void> {
  if (!globalForInit.__simposioInit) {
    globalForInit.__simposioInit = init().catch((error) => {
      const cause =
        error && typeof error === "object" && "cause" in error
          ? (error as { cause?: unknown }).cause
          : undefined;
      console.error(
        "[db:init] falló inicialización:",
        error instanceof Error ? error.message : error,
        cause ? `\ncausa: ${String(cause)}` : "",
      );
      globalForInit.__simposioInit = undefined;
      throw error;
    });
  }
  return globalForInit.__simposioInit;
}
