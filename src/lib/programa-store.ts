import "server-only";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { programaItems } from "@/lib/db/schema";
import { PROGRAMA_BY_DAY, type ProgramaItem } from "@/lib/programa";

export type ProgramaData = {
  items: ProgramaItem[];
};

function mapItem(row: {
  id: string;
  day: number;
  start: string;
  end: string;
  title: string;
  speakers: string[];
  salon: string | null;
  nota: string | null;
  kind: string;
  modo: string | null;
  icon: string;
}): ProgramaItem {
  const day = row.day === 1 || row.day === 2 || row.day === 3 ? row.day : 2;
  return {
    id: row.id,
    day,
    start: row.start,
    end: row.end,
    title: row.title,
    speakers: row.speakers ?? [],
    salon: row.salon ?? undefined,
    nota: row.nota ?? undefined,
    kind: row.kind as ProgramaItem["kind"],
    modo:
      row.modo === "FORÁNEOS" || row.modo === "LOCALES"
        ? row.modo
        : undefined,
    icon: row.icon || undefined,
  };
}

export async function getProgramaData(): Promise<ProgramaData> {
  await ensureDb();
  const db = await getDbReady();

  const itemRows = await db
    .select()
    .from(programaItems)
    .orderBy(programaItems.day, programaItems.sortOrder, programaItems.start);

  if (itemRows.length === 0) {
    return {
      items: Object.values(PROGRAMA_BY_DAY)
        .flat()
        .map((item) => ({ ...item })),
    };
  }

  return { items: itemRows.map(mapItem) };
}