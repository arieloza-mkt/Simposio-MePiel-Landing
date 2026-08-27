"use client";

import { useState } from "react";
import Link from "next/link";
import { RegistrationActions } from "@/components/admin/RegistrationActions";
import { RegistrationCheckInButton } from "@/components/admin/CheckInButtons";
import {
  Badge,
  Button,
  EmptyState,
  Select,
  TextInput,
} from "@/components/admin/ui";
import { PROFILE_OPTIONS } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

function profileLabel(value: string): string {
  return PROFILE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

type Tab = "registros" | "asistencia";

export function AsistentesView({
  initialTab,
  registrosData,
  asistenciaData,
  q,
  status,
  page,
  hasNext,
}: {
  initialTab: Tab;
  registrosData: Array<{
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    empresa: string;
    perfil: string;
    status: string;
    accessCode: string | null;
    createdAt: Date;
  }>;
  asistenciaData: Array<{
    id: string;
    nombre: string;
    email: string;
    status: string;
    createdAt: Date;
    checkinId: string | null;
    checkinAt: Date | null;
  }>;
  q: string;
  status: string;
  page: number;
  hasNext: boolean;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Asistentes
        </h1>
        <p className="mt-1 text-sm text-muted">
          Gestiona registros, aprobaciones y check-in del evento.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-surface/40 p-1">
        {([
          { key: "registros" as Tab, label: "Registros", count: registrosData.length },
          { key: "asistencia" as Tab, label: "Asistencia", count: asistenciaData.length },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-accent text-dark"
                : "text-muted hover:bg-fg/5 hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "registros" ? (
        <RegistrosTab
          data={registrosData}
          q={q}
          status={status}
          page={page}
          hasNext={hasNext}
        />
      ) : (
        <AsistenciaTab data={asistenciaData} q={q} />
      )}
    </>
  );
}

function RegistrosTab({
  data,
  q,
  status,
  page,
  hasNext,
}: {
  data: Array<{
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    empresa: string;
    perfil: string;
    status: string;
    accessCode: string | null;
    createdAt: Date;
  }>;
  q: string;
  status: string;
  page: number;
  hasNext: boolean;
}) {
  const buildQuery = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    params.set("tab", "registros");
    if (q.trim()) params.set("q", q);
    if (status) params.set("status", status);
    for (const [key, value] of Object.entries(overrides)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    return `/admin/asistentes${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <form
        method="get"
        action="/admin/asistentes"
        className="mb-5 flex flex-wrap gap-3"
      >
        <input type="hidden" name="tab" value="registros" />
        <TextInput
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, email, empresa o folio…"
          className="min-w-[240px] flex-1"
        />
        <Select
          name="status"
          defaultValue={status}
          className="w-auto"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobado">Aprobados</option>
          <option value="rechazado">Rechazados</option>
        </Select>
        <Button type="submit">Filtrar</Button>
      </form>

      {data.length === 0 ? (
        <EmptyState message="No hay registros que coincidan con la búsqueda." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Asistente</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Folio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">{row.nombre}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                  </TableCell>
                  <TableCell>
                    <p>{row.empresa}</p>
                    <p className="text-xs text-muted-foreground">{row.telefono}</p>
                  </TableCell>
                  <TableCell className="max-w-[200px] text-xs text-muted-foreground">
                    {profileLabel(row.perfil)}
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                      {row.id.slice(0, 8)}
                    </code>
                    <Link
                      href={`/entrada/${row.accessCode ?? ""}`}
                      target="_blank"
                      className="ml-2 text-xs text-primary underline-offset-2 hover:underline"
                    >
                      Ver QR
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("es-MX", {
                      dateStyle: "short",
                      timeStyle: "short",
                      timeZone: "America/Mexico_City",
                    }).format(row.createdAt)}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <RegistrationActions id={row.id} status={row.status as "pendiente" | "aprobado" | "rechazado"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {(page > 1 || hasNext) && (
        <div className="mt-5 flex items-center justify-between text-sm text-muted">
          {page > 1 ? (
            <Link href={buildQuery({ page: String(page - 1) })}>
              ← Anterior
            </Link>
          ) : (
            <span />
          )}
          <span>Página {page}</span>
          {hasNext ? (
            <Link href={buildQuery({ page: String(page + 1) })}>
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

function AsistenciaTab({
  data,
  q,
}: {
  data: Array<{
    id: string;
    nombre: string;
    email: string;
    status: string;
    createdAt: Date;
    checkinId: string | null;
    checkinAt: Date | null;
  }>;
  q: string;
}) {
  return (
    <>
      <form
        method="get"
        action="/admin/asistentes"
        className="mb-5 flex flex-wrap gap-3"
      >
        <input type="hidden" name="tab" value="asistencia" />
        <TextInput
          type="search"
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Nombre, email o folio…"
          className="min-w-[240px] flex-1"
        />
        <Button type="submit">Buscar</Button>
      </form>

      {data.length === 0 ? (
        <EmptyState
          message={
            q.trim()
              ? "Sin resultados para esa búsqueda."
              : "Aún no hay registros. Aparecerán aquí cuando la gente se inscriba."
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/30 p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{row.nombre}</p>
                  <Badge tone={row.status as "pendiente" | "aprobado" | "rechazado"}>{row.status}</Badge>
                  {row.checkinAt && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
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
