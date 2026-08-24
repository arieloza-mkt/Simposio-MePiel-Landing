import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { neon } from "@neondatabase/serverless";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzleNeon<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __simposioDb?: Db;
  __simposioDbReady?: Promise<void>;
};

function createDb(): { db: Db; ready: Promise<void> } {
  const url = process.env.DATABASE_URL;

  if (url) {
    const sql = neon(url);
    return { db: drizzleNeon(sql, { schema }), ready: Promise.resolve() };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL es obligatoria en producción. Ejemplo: postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require",
    );
  }

  // Fallback de desarrollo sin DATABASE_URL: Postgres embebido en memoria.
  const client = new PGlite();
  const db = drizzlePglite(client, { schema }) as unknown as Db;
  return { db, ready: Promise.resolve() };
}

export function getDb(): Db {
  if (!globalForDb.__simposioDb) {
    const { db, ready } = createDb();
    globalForDb.__simposioDb = db;
    globalForDb.__simposioDbReady = ready;
  }
  return globalForDb.__simposioDb;
}

export async function getDbReady(): Promise<Db> {
  const db = getDb();
  await globalForDb.__simposioDbReady;
  return db;
}
