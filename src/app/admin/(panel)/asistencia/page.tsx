import { desc, ilike, or, sql } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { checkins, registrations } from "@/lib/db/schema";
import { RegistrationCheckInButton } from "@/components/admin/CheckInButtons";
import { Badge, EmptyState } from "@/components/admin/ui";

export default async function AdminAsistenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  await ensureDb();
  const db = await getDbReady();

  const term = `%${q.trim()}%`;
  const rows = await db
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
            ilike(registrations.nombre, term),
            ilike(registrations.email, term),
            sql`cast(${registrations.id} as text) ilike ${term}`,
          )
        : undefined,
    )
    .orderBy(desc(checkins.checkedInAt), desc(registrations.createdAt))
    .limit(50);

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Asistencia
        </h1>
        <p className="mt-1 text-sm text-muted">
          Registra la entrada el día del evento. Busca por nombre, email o folio.
        </p>
      </header>

      <form
        method="get"
        action="/admin/asistencia"
        className="mb-5 flex flex-wrap gap-3"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Nombre, email o folio…"
          className="min-w-[240px] flex-1 rounded-lg border border-border bg-surface/60 px-4 py-2.5 text-base text-fg outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-dark transition hover:brightness-110"
        >
          Buscar
        </button>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          message={
            q.trim()
              ? "Sin resultados para esa búsqueda."
              : "Aún no hay registros. Aparecerán aquí cuando la gente se inscriba."
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/30 p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{row.nombre}</p>
                  <Badge tone={row.status}>{row.status}</Badge>
                  {row.checkinAt && (
                    <span className="text-xs text-emerald-300">
                      ✓{" "}
                      {new Intl.DateTimeFormat("es-MX", {
                        timeStyle: "short",
                        timeZone: "America/Mexico_City",
                      }).format(row.checkinAt)}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {row.email} · <code>{row.id.slice(0, 8)}</code>
                </p>
              </div>
              <RegistrationCheckInButton
                registrationId={row.id}
                checkedIn={Boolean(row.checkinId)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
