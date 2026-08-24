"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <input type="hidden" name="next" value={next} />
      <div className="rounded-2xl border border-border bg-surface/40 p-8 backdrop-blur">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-accent">
          Simposio Dermocosmético
        </p>
        <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-fg">
          Panel de administración
        </h1>

        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-muted"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={Boolean(state.error)}
          className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-fg outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
        />

        {state.error ? (
          <p role="alert" className="mt-3 text-sm text-error">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-xl bg-accent px-5 py-3 font-semibold text-dark transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Verificando…" : "Entrar"}
        </button>
      </div>
    </form>
  );
}
