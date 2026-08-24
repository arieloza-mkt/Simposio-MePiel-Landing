import { eq } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { labs } from "@/lib/db/schema";

async function main() {
  await ensureDb();
  const db = await getDbReady();
  const row = await db.select().from(labs).where(eq(labs.name, "ISDIN"));
  console.log(row[0]?.imageUrl);
}
main();
