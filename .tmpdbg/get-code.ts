import { sql } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";

async function main() {
  const email = process.argv[2].toLowerCase();
  await ensureDb();
  const db = await getDbReady();
  const res = await db.execute(sql`
    SELECT id, access_code, status FROM registrations
    WHERE lower(email) = ${email} LIMIT 1`);
  console.log(JSON.stringify(res.rows[0] ?? null));
}
main().then(() => process.exit(0));
