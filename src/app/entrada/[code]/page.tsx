import type { Metadata } from "next";
import Link from "next/link";
import { resolveEntrada } from "@/lib/entrada";
import { PROFILE_OPTIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrada · Simposio Dermocosmético",
};

const timeFmt = new Intl.DateTimeFormat("es-MX", {
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export default async function EntradaPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const state = await resolveEntrada(code);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-dark px-5 py-12 text-light">
      {state.kind === "no_encontrado" && (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/15 text-2xl">
            ✕
          </span>
          <h1 className="font-display text-xl font-bold">Registro no encontrado</h1>
          <p className="mt-2 text-sm text-mid">
            Este código no corresponde a ningún registro del simposio. Verifica
            que sea el QR correcto o regístrate en la página principal.
          </p>
          <Link
            href="/#registro"
            className="mt-6 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-dark transition hover:brightness-110"
          >
            Ir al registro
          </Link>
        </div>
      )}

      {state.kind === "bloqueado" && (
        <div className="w-full max-w-md rounded-2xl border border-error/30 bg-error/[0.06] p-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/20 text-2xl">
            ✕
          </span>
          <h1 className="font-display text-xl font-bold">
            Registro no válido
          </h1>
          <p className="mt-2 text-sm text-mid">
            Hola {state.nombre}, tu registro fue marcado como rechazado. Si
            crees que es un error, acércate al mostrador de recepción con una
            identificación.
          </p>
        </div>
      )}

      {state.kind === "fuera_de_ventana" && (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-2xl">
            ⏱
          </span>
          <h1 className="font-display text-xl font-bold">
            {state.cuando === "antes"
              ? "Aún no es la hora del evento"
              : "El evento ha finalizado"}
          </h1>
          <p className="mt-2 text-sm text-mid">
            Hola {state.nombre}, tu registro{" "}
            {state.cuando === "antes"
              ? "está listo y funcionará a partir del inicio del evento"
              : "ya no puede registrar entradas porque el evento terminó"}
            .
          </p>
          {state.cuando === "antes" && (
            <p className="mt-4 rounded-xl bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-mid">
              Fecha del evento: {state.dateLabel}. Guarda tu QR: será la llave
              de acceso ese día.
            </p>
          )}
        </div>
      )}

      {state.kind === "confirmado" && (
        <div className="w-full max-w-md">
          <div className="rounded-t-2xl border border-b-0 border-accent/25 bg-gradient-to-b from-accent/[0.12] to-transparent p-6 text-center sm:p-8">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 ring-4 ring-emerald-400/10">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-emerald-300" aria-hidden>
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {state.yaRegistrado ? "Ya estabas registrado" : "¡Asistencia confirmada!"}
            </h1>
            <p className="mt-1.5 text-sm text-mid">
              {state.yaRegistrado
                ? "Tu entrada ya había sido registrada."
                : "Tu entrada quedó registrada automáticamente."}
            </p>
          </div>

          <dl className="rounded-b-2xl border border-white/10 bg-white/[0.02] p-6 text-left sm:p-8">
            <div className="mb-4 border-b border-white/10 pb-4">
              <dt className="text-xs uppercase tracking-wide text-mid">
                Asistente
              </dt>
              <dd className="mt-1 font-display text-lg font-bold break-words">
                {state.nombre}
              </dd>
              <dd className="text-sm text-mid">{state.email}</dd>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-mid">
                  Empresa
                </dt>
                <dd className="mt-1 text-sm font-medium break-words">
                  {state.empresa}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-mid">
                  Perfil
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {PROFILE_OPTIONS.find((o) => o.value === state.perfil)?.label ??
                    state.perfil}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-mid">
                  Estatus
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                      state.status === "aprobado"
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {state.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-mid">
                  Entrada registrada
                </dt>
                <dd className="mt-1 font-mono text-sm tabular-nums">
                  {timeFmt.format(state.checkinAt)}
                </dd>
              </div>
            </div>

            <p className="mt-6 rounded-xl bg-white/[0.04] px-4 py-3 text-center text-xs leading-relaxed text-mid">
              Folio: <span className="font-mono">{state.folio}</span>
            </p>
          </dl>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-mid underline-offset-4 transition hover:text-light hover:underline">
              Volver al sitio del simposio
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
