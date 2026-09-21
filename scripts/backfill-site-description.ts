import { eq } from "drizzle-orm";
import { ensureDb } from "../src/lib/db/init";
import { getDbReady } from "../src/lib/db/client";
import { siteSettings } from "../src/lib/db/schema";
import { SETTINGS_SEED } from "../src/lib/db/seed-data";
import type { SiteInfo } from "../src/lib/content";

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.includes("neon.tech")) {
    console.error(
      "DATABASE_URL no apunta a Neon. Corre con: node --env-file=.env.local --import tsx scripts/backfill-site-description.ts",
    );
    process.exit(1);
  }

  await ensureDb();
  const db = await getDbReady();

  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "site"));

  if (rows.length === 0) {
    console.error("No existe la fila 'site' en la DB.");
    process.exit(1);
  }

  const seed = SETTINGS_SEED.site as SiteInfo;
  if (!seed.description) {
    console.error("El seed 'site' no trae description válida.");
    process.exit(1);
  }

  const current = rows[0].value as Partial<SiteInfo>;
  const next = {
    ...current,
    description: seed.description,
  } as SiteInfo;

  await db
    .update(siteSettings)
    .set({ value: next, updatedAt: new Date() })
    .where(eq(siteSettings.key, "site"));

  console.log("OK: fila 'site' actualizada con la nueva description.");
}

main().catch((error) => {
  console.error("Fallo:", error);
  process.exit(1);
});
