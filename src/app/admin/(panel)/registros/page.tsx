import { and, desc, ilike, or, sql, type SQL } from "drizzle-orm";
import Link from "next/link";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { registrations } from "@/lib/db/schema";
import { RegistrationActions } from "@/components/admin/RegistrationActions";
import { Badge, EmptyState } from "@/components/admin/ui";
import { PROFILE_OPTIONS } from "@/lib/constants";

const PAGE_SIZE = 25;

function profileLabel(value: string): string {
  return PROFILE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export default async function AdminRegistrosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q = "", status = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  await ensureDb();
  const db = await getDbReady();

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
  const visible = rows.slice(0, PAGE_SIZE);

  const buildQuery = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q);
    if (status) params.set("status", status);
    for (const [key, value] of Object.entries(overrides)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    return `/admin/registros${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Registros
          </h1>
          <p className="mt-1 text-sm text-muted">
            Solicitudes de asistencia al simposio. Aprueba o rechaza cada
            solicitud.
          </p>
        </div>
        <a
          href="/admin/api/registros/csv"
          className="rounded-lg border border-border px-4 py-2 text-sm text-fg transition hover:bg-fg/5"
        >
          Exportar CSV
        </a>
      </header>

      <form
        method="get"
        action="/admin/registros"
        className="mb-5 flex flex-wrap gap-3"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, email, empresa o folio…"
          className="min-w-[240px] flex-1 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-fg outline-none focus:border-accent/60"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobado">Aprobados</option>
          <option value="rechazado">Rechazados</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-dark transition hover:brightness-110"
        >
          Filtrar
        </button>
      </form>

      {visible.length === 0 ? (
        <EmptyState message="No hay registros que coincidan con la búsqueda." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/40 text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Asistente</th>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Perfil</th>
                <th className="px-4 py-3 font-medium">Folio</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/60 last:border-0 hover:bg-surface/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.nombre}</p>
                    <p className="text-xs text-muted">{row.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{row.empresa}</p>
                    <p className="text-xs text-muted">{row.telefono}</p>
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-muted">
                    {profileLabel(row.perfil)}
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-fg/5 px-1.5 py-0.5 font-mono text-xs">
                      {row.id.slice(0, 8)}
                    </code>
                    <Link
                      href={`/entrada/${row.accessCode ?? ""}`}
                      target="_blank"
                      className="ml-2 text-xs text-accent underline-offset-2 hover:underline"
                    >
                      Ver QR
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Intl.DateTimeFormat("es-MX", {
                      dateStyle: "short",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    }).format(row.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        row.status as
                          | "pendiente"
                          | "aprobado"
                          | "rechazado"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <RegistrationActions id={row.id} status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(currentPage > 1 || hasNext) && (
        <div className="mt-5 flex items-center justify-between text-sm text-muted">
          {currentPage > 1 ? (
            <Link href={buildQuery({ page: String(currentPage - 1) })}>
              ← Anterior
            </Link>
          ) : (
            <span />
          )}
          <span>Página {currentPage}</span>
          {hasNext ? (
            <Link href={buildQuery({ page: String(currentPage + 1) })}>
              Siguiente →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </>
  );
}
