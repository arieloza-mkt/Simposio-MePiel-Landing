import { eq } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { labs } from "@/lib/db/schema";

async function main() {
  await ensureDb();
  const db = await getDbReady();
  const row = await db.select().from(labs).where(eq(labs.name, "ISDIN"));
  const id = row[0]?.id;
  console.log("id:", id);
  const r = await db
    .update(labs)
    .set({ imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg" })
    .where(eq(labs.id, id))
    .returning({ id: labs.id });
  console.log("filas actualizadas:", r.length);
  const back = await db.select().from(labs).where(eq(labs.name, "ISDIN"));
  console.log("url ahora:", back[0]?.imageUrl);
}
main();
