"use client";

import { useState, useTransition } from "react";
import {
  saveEventScheduleWindow,
  saveTransmision,
} from "@/app/actions/admin/settings";
import { Button, Field, TextArea, TextInput } from "@/components/admin/ui";

export function TransmisionForm({
  initial,
}: {
  initial: {
    isLive: boolean;
    videoId: string | null;
    title: string;
    description: string | null;
    backdropUrl: string | null;
  };
}) {
  const [isLive, setIsLive] = useState(initial.isLive);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await saveTransmision({
            isLive,
            videoId: String(formData.get("videoId") ?? "").trim(),
            title: String(formData.get("title") ?? "").trim(),
            description: String(formData.get("description") ?? "").trim(),
            backdropUrl: String(formData.get("backdropUrl") ?? "").trim(),
          });
          setMessage(
            result.ok
              ? "Guardado. La landing ya refleja los cambios."
              : (result.error ?? "Error al guardar."),
          );
        });
      }}
      className="flex flex-col gap-4"
    >
      <button
        type="button"
        role="switch"
        aria-checked={isLive}
        onClick={() => setIsLive((v) => !v)}
        className={`flex w-fit items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
          isLive
            ? "border-accent/40 bg-accent/10"
            : "border-border bg-surface/50"
        }`}
      >
        <span
          className={`relative h-6 w-11 rounded-full transition ${
            isLive ? "bg-accent" : "bg-fg/15"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-light transition-all ${
              isLive ? "left-[22px]" : "left-0.5"
            }`}
          />
        </span>
        <span>
          <span className="block text-sm font-medium">
            {isLive ? "Transmisión EN VIVO" : "Transmisión apagada"}
          </span>
          <span className="block text-xs text-muted">
            {isLive
              ? "La landing muestra el reproductor."
              : "La landing muestra el placeholder."}
          </span>
        </span>
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="ID de YouTube"
          htmlFor="videoId"
          hint="Solo el ID, p. ej. dQw4w9WgXcQ"
        >
          <TextInput
            id="videoId"
            name="videoId"
            defaultValue={initial.videoId ?? ""}
            placeholder="dQw4w9WgXcQ"
          />
        </Field>
        <Field label="URL de fondo" htmlFor="backdropUrl">
          <TextInput
            id="backdropUrl"
            name="backdropUrl"
            type="url"
            defaultValue={initial.backdropUrl ?? ""}
            placeholder="https://…"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Título de la sección" htmlFor="title">
            <TextInput
              id="title"
              name="title"
              defaultValue={initial.title}
              required
            />
          </Field>
        </div>
      </div>

      <Field label="Descripción" htmlFor="description">
        <TextArea
          id="description"
          name="description"
          defaultValue={initial.description ?? ""}
          rows={3}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar transmisión"}
        </Button>
        {message && <p className="text-sm text-muted">{message}</p>}
      </div>
    </form>
  );
}

export function EventScheduleForm({
  initialStartsAt,
  initialEndsAt,
}: {
  initialStartsAt: string;
  initialEndsAt: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await saveEventScheduleWindow(
            String(formData.get("startsAt") ?? ""),
            String(formData.get("endsAt") ?? ""),
          );
          setMessage(result.ok ? "Fechas actualizadas." : result.error ?? null);
        });
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field
        label="Inicio del evento"
        htmlFor="startsAt"
        hint="Con zona horaria (-06:00 = CDMX)"
      >
        <TextInput id="startsAt" name="startsAt" defaultValue={initialStartsAt} />
      </Field>
      <Field label="Fin del evento" htmlFor="endsAt">
        <TextInput id="endsAt" name="endsAt" defaultValue={initialEndsAt} />
      </Field>

      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" variant="ghost" disabled={pending}>
          {pending ? "Guardando…" : "Guardar fechas"}
        </Button>
        {message && <p className="text-sm text-muted">{message}</p>}
      </div>
    </form>
  );
}
