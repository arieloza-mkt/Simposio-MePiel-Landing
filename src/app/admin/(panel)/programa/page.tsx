import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { programaItems } from "@/lib/db/schema";
import { PROGRAMA_DIA_LABEL, type ProgramaItemKind } from "@/lib/programa";
import {
  NewProgramaItemForm,
  ProgramaItemEditor,
} from "@/components/admin/ProgramaEditor";
import { EmptyState } from "@/components/admin/ui";

export default async function AdminProgramaPage() {
  await ensureDb();
  const db = await getDbReady();

  const items = await db
    .select()
    .from(programaItems)
    .orderBy(programaItems.day, programaItems.sortOrder, programaItems.start);

  const itemsByDay = [1, 2, 3].map((day) => ({
    day: day as 1 | 2 | 3,
    label: PROGRAMA_DIA_LABEL[day as 1 | 2 | 3],
    rows: items
      .filter((i) => i.day === day)
      .map((i) => ({
        id: i.id,
        day: i.day,
        start: i.start,
        end: i.end,
        title: i.title,
        speakers: i.speakers ?? [],
        salon: i.salon,
        nota: i.nota,
        kind: i.kind as ProgramaItemKind,
        modo: i.modo,
      })),
  }));

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Programa
          </h1>
          <p className="mt-1 text-sm text-muted">
            Agenda por día (Lunes 12 llegada, Martes 13 y Miércoles 14). El
            Lunes solo se muestra en la pestaña Foráneos; las actividades
            marcadas &quot;solo Foráneos&quot; se ocultan en la pestaña Locales.
          </p>
        </div>
        <NewProgramaItemForm />
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {itemsByDay.map((group) => (
          <section key={group.day}>
            <h2 className="mb-3 font-display text-lg tracking-tight">
              {group.label}
              <span className="ml-2 font-mono text-xs text-muted">
                {group.rows.length} actividades
              </span>
            </h2>
            {group.rows.length === 0 ? (
              <EmptyState message="Sin actividades." />
            ) : (
              <ul className="flex flex-col gap-3">
                {group.rows.map((row) => (
                  <ProgramaItemEditor key={row.id} item={row} />
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}