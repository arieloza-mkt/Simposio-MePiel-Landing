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
import {
  Users,
  ScanLine,
  Clock,
  CheckCircle2,
  XCircle,
  Mic2,
  Calendar,
  BookOpen,
  FlaskConical,
} from "lucide-react";

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

function StatCard({
  label,
  value,
  href,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent?: boolean;
}) {
  const content = (
    <div
      className={`flex items-start gap-4 rounded-2xl border p-5 transition ${
        accent
          ? "border-accent/25 bg-accent/[0.05] shadow-sm shadow-accent/5"
          : "border-border bg-surface/30 hover:border-border hover:bg-surface/50"
      } ${href ? "cursor-pointer" : ""}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          accent ? "bg-accent/15 text-accent" : "bg-fg/5 text-muted"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div>
        <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
        <p className="mt-0.5 text-sm text-muted">{label}</p>
      </div>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Registros totales"
          value={counts.total}
          href="/admin/asistentes"
          icon={Users}
          accent
        />
        <StatCard
          label="Ingresos con QR"
          value={counts.ingresos}
          href="/admin/asistentes?tab=asistencia"
          icon={ScanLine}
        />
        <StatCard
          label="Pendientes"
          value={counts.pendiente}
          href="/admin/asistentes?status=pendiente"
          icon={Clock}
        />
        <StatCard
          label="Aprobados"
          value={counts.aprobado}
          href="/admin/asistentes?status=aprobado"
          icon={CheckCircle2}
        />
        <StatCard
          label="Rechazados"
          value={counts.rechazado}
          href="/admin/asistentes?status=rechazado"
          icon={XCircle}
        />
        <StatCard
          label="Ponentes"
          value={counts.ponentes}
          href="/admin/ponentes"
          icon={Mic2}
        />
        <StatCard
          label="Actividades"
          value={counts.actividades}
          href="/admin/cronograma"
          icon={Calendar}
        />
        <StatCard
          label="Ediciones"
          value={counts.ediciones}
          href="/admin/ediciones"
          icon={BookOpen}
        />
        <StatCard
          label="Laboratorios"
          value={counts.laboratorios}
          href="/admin/contenido"
          icon={FlaskConical}
        />
      </div>
    </>
  );
}
