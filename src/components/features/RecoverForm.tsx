"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { recoverPass, type RecoverPassState } from "@/app/actions/pass";

const initialState: RecoverPassState = { ok: false };

function SubmitRecover() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-dark transition hover:brightness-110 disabled:opacity-50"
    >
      {pending ? "Buscando…" : "Ver mi QR"}
    </button>
  );
}

export function RecoverForm() {
  const [state, formAction] = useActionState(recoverPass, initialState);

  if (state.ok && state.qrDataUrl) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-emerald-300" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="font-display text-xl font-bold">Aquí está tu pase</h1>
        <p className="mt-1.5 text-sm text-mid">
          Hola {state.nombre}. Guarda este QR en tu teléfono: es tu acceso al
          evento.
        </p>

        <div className="mx-auto mt-6 w-fit rounded-xl bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.qrDataUrl}
            alt={`QR de entrada de ${state.nombre}`}
            width={208}
            height={208}
            className="block"
          />
        </div>

        <p className="mt-3 font-mono text-xs text-mid">Folio: {state.folio}</p>

        <p className="mt-5 rounded-xl bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-mid">
          Por seguridad, este QR reemplaza a cualquier versión anterior. Si
          compartiste tu código previamente, ya quedó invalidado.
        </p>

        <button
          type="button"
          onClick={() => location.reload()}
          className="mt-5 text-xs text-mid underline-offset-4 transition hover:text-light hover:underline"
        >
          Recuperar otro pase
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="font-display text-xl font-bold">
        Recupera tu pase de entrada
      </h1>
      <p className="mt-1.5 text-sm text-mid">
        Escribe el correo con el que te registraste y te mostraremos tu QR en
        pantalla para que lo guardes en tu teléfono.
      </p>

      <label htmlFor="email" className="mb-1.5 mt-6 block text-xs font-medium uppercase tracking-wide text-mid">
        Correo registrado
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="tu@correo.com"
        className="w-full rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-light outline-none transition placeholder:text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />

      {state.error && (
        <p role="alert" className="mt-3 rounded-xl border border-error/30 bg-error/[0.08] px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <SubmitRecover />

      <p className="mt-4 text-center text-xs leading-relaxed text-mid">
        Al recuperar tu pase se genera un código nuevo y cualquier QR anterior
        deja de funcionar.
      </p>
    </form>
  );
}
