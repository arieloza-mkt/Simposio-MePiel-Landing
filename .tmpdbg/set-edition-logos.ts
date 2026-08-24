import { asc } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { editions } from "@/lib/db/schema";

async function main() {
  await ensureDb();
  const db = await getDbReady();
  const rows = await db.select().from(editions).orderBy(asc(editions.year));
  const logos = [
    "https://res.cloudinary.com/cc4tium7/image/upload/v1787610069/logo-primera-edicion.png",
    "https://res.cloudinary.com/cc4tium7/image/upload/v1787610069/logo-segunda-edicion.png",
    "https://res.cloudinary.com/cc4tium7/image/upload/v1787610069/logo-segunda-edicion.png",
  ];
  for (let i = 0; i < rows.length; i++) {
    const url = logos[i] ?? logos[logos.length - 1];
    await db.update(editions).set({ logoUrl: url }).where(
      (await import("drizzle-orm")).eq(editions.id, rows[i].id),
    );
    console.log(`edición ${rows[i].year} (${rows[i].eyebrow}) → ${url.split("/").pop()}`);
  }
}
main().then(() => process.exit(0));
