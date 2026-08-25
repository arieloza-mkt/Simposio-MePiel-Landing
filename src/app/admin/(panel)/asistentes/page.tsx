import { and, desc, ilike, or, sql, type SQL } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { registrations, checkins } from "@/lib/db/schema";
import { AsistentesView } from "@/components/admin/AsistentesView";

const PAGE_SIZE = 25;

export default async function AdminAsistentesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; tab?: string }>;
}) {
  const { q = "", status = "", page = "1", tab = "registros" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  await ensureDb();
  const db = await getDbReady();

  // Registros query
  const filters: SQL[] = [];
  if (q.trim()) {
    const term = `%${q.trim()}%`;
    filters.push(
      or(
        ilike(registrations.nombre, term),
        ilike(registrations.email, term),
        ilike(registrations.empresa, term),
        sql`cast(${registrations.id} as text) ilike ${term}`,
      )!,
    );
  }
  if (status === "pendiente" || status === "aprobado" || status === "rechazado") {
    filters.push(ilike(registrations.status, status));
  }
  const where = filters.length ? and(...filters) : undefined;

  const rows = await db
    .select()
    .from(registrations)
    .where(where)
    .orderBy(desc(registrations.createdAt))
    .limit(PAGE_SIZE + 1)
    .offset((currentPage - 1) * PAGE_SIZE);

  const hasNext = rows.length > PAGE_SIZE;
  const registrosData = rows.slice(0, PAGE_SIZE).map((r) => ({
    id: r.id,
    nombre: r.nombre,
    email: r.email,
    telefono: r.telefono,
    empresa: r.empresa,
    perfil: r.perfil,
    status: r.status,
    accessCode: r.accessCode,
    createdAt: r.createdAt,
  }));

  // Asistencia query
  const asistenciaTerm = `%${q.trim()}%`;
  const asistenciaRows = await db
    .select({
      id: registrations.id,
      nombre: registrations.nombre,
      email: registrations.email,
      status: registrations.status,
      createdAt: registrations.createdAt,
      checkinId: checkins.id,
      checkinAt: checkins.checkedInAt,
    })
    .from(registrations)
    .leftJoin(
      checkins,
      sql`${checkins.registrationId} = ${registrations.id} and ${checkins.kind} = 'asistente'`,
    )
    .where(
      q.trim()
        ? or(
            ilike(registrations.nombre, asistenciaTerm),
            ilike(registrations.email, asistenciaTerm),
            sql`cast(${registrations.id} as text) ilike ${asistenciaTerm}`,
          )
        : undefined,
    )
    .orderBy(desc(checkins.checkedInAt), desc(registrations.createdAt))
    .limit(50);

  const asistenciaData = asistenciaRows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    email: r.email,
    status: r.status,
    createdAt: r.createdAt,
    checkinId: r.checkinId,
    checkinAt: r.checkinAt,
  }));

  return (
    <AsistentesView
      initialTab={tab === "asistencia" ? "asistencia" : "registros"}
      registrosData={registrosData}
      asistenciaData={asistenciaData}
      q={q}
      status={status}
      page={currentPage}
      hasNext={hasNext}
    />
  );
}
