import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { scheduleItems } from "@/lib/db/schema";
import {
  NewScheduleItemForm,
  ScheduleEditor,
} from "@/components/admin/ScheduleEditor";
import { EmptyState } from "@/components/admin/ui";

export default async function AdminCronogramaPage() {
  await ensureDb();
  const db = await getDbReady();
  const rows = await db
    .select()
    .from(scheduleItems)
    .orderBy(scheduleItems.day, scheduleItems.sortOrder, scheduleItems.time);

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Cronograma
          </h1>
          <p className="mt-1 text-sm text-muted">
            Programa del evento por día. Alimenta la sección Programa en la
            landing.
          </p>
        </div>
        <NewScheduleItemForm />
      </header>

      {rows.length === 0 ? (
        <EmptyState message="No hay actividades todavía." />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((item) => (
            <ScheduleEditor key={item.id} item={item} />
          ))}
        </ul>
      )}
    </>
  );
}
