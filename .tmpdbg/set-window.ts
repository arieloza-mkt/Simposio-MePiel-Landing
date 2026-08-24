import { eq } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { siteSettings } from "@/lib/db/schema";
import { SETTINGS_SEED } from "@/lib/db/seed-data";

async function main() {
  const mode = process.argv[2];
  await ensureDb();
  const db = await getDbReady();
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, "eventConfig")).limit(1);
  const current = (row?.value ?? SETTINGS_SEED.eventConfig) as Record<string, string>;

  let value: Record<string, string>;
  if (mode === "abrir") {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const iso = (d: Date, h: number) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(h)}:00:00-06:00`;
    value = { ...current, startsAt: iso(now, 0), endsAt: iso(now, 23) };
  } else if (mode === "restaurar") {
    value = SETTINGS_SEED.eventConfig as Record<string, string>;
  } else {
    throw new Error("uso: set-window.ts abrir|restaurar");
  }

  await db
    .insert(siteSettings)
    .values({ key: "eventConfig", value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  console.log("ventana:", value.startsAt, "→", value.endsAt);
}
main().then(() => process.exit(0));
