"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <input type="hidden" name="next" value={next} />
      <Card>
        <CardHeader>
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.08em] text-primary">
            Simposio Dermocosmético
          </p>
          <CardTitle>Panel de administración</CardTitle>
          <CardDescription>Inicia sesión para gestionar el evento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(state.error)}
            />
          </div>

          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Verificando…" : "Entrar"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
