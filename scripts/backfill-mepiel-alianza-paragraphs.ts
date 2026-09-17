import { eq } from "drizzle-orm";
import { ensureDb } from "../src/lib/db/init";
import { getDbReady } from "../src/lib/db/client";
import { siteSettings } from "../src/lib/db/schema";
import { SETTINGS_SEED } from "../src/lib/db/seed-data";
import type { MepielAlianzaSettings } from "../src/lib/content";

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.includes("neon.tech")) {
    console.error(
      "DATABASE_URL no apunta a Neon. Corre con: node --env-file=.env.local --import tsx scripts/backfill-mepiel-alianza-paragraphs.ts",
    );
    process.exit(1);
  }

  await ensureDb();
  const db = await getDbReady();

  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "mepielAlianza"));

  if (rows.length === 0) {
    console.error("No existe la fila 'mepielAlianza' en la DB.");
    process.exit(1);
  }

  const seed = SETTINGS_SEED.mepielAlianza as MepielAlianzaSettings;
  if (!Array.isArray(seed.paragraphs) || seed.paragraphs.length === 0) {
    console.error("El seed 'mepielAlianza' no trae paragraphs válidos.");
    process.exit(1);
  }

  const current = rows[0].value as Partial<MepielAlianzaSettings>;
  const next = {
    ...current,
    paragraphs: seed.paragraphs,
  } as MepielAlianzaSettings;

  await db
    .update(siteSettings)
    .set({ value: next, updatedAt: new Date() })
    .where(eq(siteSettings.key, "mepielAlianza"));

  const after = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "mepielAlianza"));

  const saved = after[0].value as MepielAlianzaSettings;
  console.log(
    `OK: fila 'mepielAlianza' actualizada con ${saved.paragraphs?.length ?? 0} párrafos.`,
  );
}

main().catch((error) => {
  console.error("Fallo:", error);
  process.exit(1);
});
