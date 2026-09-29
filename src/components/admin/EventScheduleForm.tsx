"use client";

import { useState, useTransition } from "react";
import { saveEventScheduleWindow } from "@/app/actions/admin/settings";
import { Button, Field, TextInput } from "@/components/admin/ui";

/* Las fechas del evento son un ajuste global (site_settings.eventConfig). El
   countdown de la tercera edición cuenta hacia startsAt; endsAt solo acota la
   ventana de escaneo de entradas. */
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
        hint="Alimenta el countdown de la edición 3. Con zona horaria (-06:00 = CDMX)."
      >
        <TextInput id="startsAt" name="startsAt" defaultValue={initialStartsAt} />
      </Field>
      <Field
        label="Fin del evento"
        htmlFor="endsAt"
        hint="Opcional. Solo se usa para la ventana de escaneo de entradas."
      >
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
