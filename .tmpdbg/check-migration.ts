import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { sql } from "drizzle-orm";

async function main() {
  await ensureDb();
  const db = await getDbReady();
  const res = await db.execute(sql`SELECT count(*)::int AS total, count(access_code)::int AS con_codigo FROM registrations`);
  console.log(JSON.stringify(res.rows[0]));
  const sample = await db.execute(sql`SELECT left(access_code, 6) AS prefijo FROM registrations LIMIT 3`);
  console.log(JSON.stringify(sample.rows));
}
main().then(() => process.exit(0));
