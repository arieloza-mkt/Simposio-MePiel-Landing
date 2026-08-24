import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import {
  registrations,
  speakers,
  editions,
  scheduleItems,
  labs,
  checkins,
} from "@/lib/db/schema";

async function getCounts() {
  await ensureDb();
  const db = await getDbReady();
  const [regRows, speakerRow, editionRow, scheduleRow, labRow, checkinRow] =
    await Promise.all([
      db.select({ status: registrations.status }).from(registrations),
      db.select({ value: count() }).from(speakers),
      db.select({ value: count() }).from(editions),
      db.select({ value: count() }).from(scheduleItems),
      db.select({ value: count() }).from(labs),
      db
        .select({ value: count() })
        .from(checkins)
        .where(eq(checkins.kind, "asistente")),
    ]);

  const byStatus = { pendiente: 0, aprobado: 0, rechazado: 0 };
  for (const row of regRows) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
  }

  return {
    total: regRows.length,
    ...byStatus,
    ingresos: checkinRow[0]?.value ?? 0,
    ponentes: speakerRow[0]?.value ?? 0,
    ediciones: editionRow[0]?.value ?? 0,
    actividades: scheduleRow[0]?.value ?? 0,
    laboratorios: labRow[0]?.value ?? 0,
  };
}

function Stat({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number | string;
  href?: string;
  accent?: boolean;
}) {
  const content = (
    <div
      className={`h-full rounded-2xl border p-5 transition ${
        accent
          ? "border-accent/30 bg-accent/[0.06]"
          : "border-border bg-surface/30 hover:border-border"
      } ${href ? "cursor-pointer" : ""}`}
    >
      <p className="font-display text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function AdminResumenPage() {
  const counts = await getCounts();

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Resumen
        </h1>
        <p className="mt-1 text-sm text-muted">
          Estado actual del simposio y del registro de asistentes.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Registros totales"
          value={counts.total}
          href="/admin/registros"
          accent
        />
        <Stat
          label="Ingresos con QR"
          value={counts.ingresos}
          href="/admin/asistencia"
        />
        <Stat
          label="Pendientes de aprobar"
          value={counts.pendiente}
          href="/admin/registros?status=pendiente"
        />
        <Stat
          label="Aprobados"
          value={counts.aprobado}
          href="/admin/registros?status=aprobado"
        />
        <Stat
          label="Rechazados"
          value={counts.rechazado}
          href="/admin/registros?status=rechazado"
        />
        <Stat label="Ponentes" value={counts.ponentes} href="/admin/ponentes" />
        <Stat
          label="Actividades en cronograma"
          value={counts.actividades}
          href="/admin/cronograma"
        />
        <Stat
          label="Ediciones publicadas"
          value={counts.ediciones}
          href="/admin/ediciones"
        />
        <Stat
          label="Laboratorios aliados"
          value={counts.laboratorios}
          href="/admin/ediciones"
        />
      </div>
    </>
  );
}
