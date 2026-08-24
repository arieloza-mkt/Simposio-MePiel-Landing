"use client";

import { useState, useTransition } from "react";
import { saveEdition, type EditionInput } from "@/app/actions/admin/editions";
import { Button, Field, TextArea, TextInput } from "@/components/admin/ui";

export function NewEditionForm({
  nextOrdinal,
  suggestedYear,
}: {
  nextOrdinal: string;
  suggestedYear: number;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Agregar edición</Button>;
  }

  return (
    <form
      action={(formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
          const input = {
            ordinal: String(formData.get("ordinal") ?? ""),
            year: Number(formData.get("year") ?? 0),
            eyebrow: String(formData.get("eyebrow") ?? ""),
            title: String(formData.get("title") ?? ""),
            description: String(formData.get("description") ?? ""),
            backdropUrl: null,
            logoUrl: null,
            videoId: "",
            stats: "",
            images: "",
            labs: "",
            speakerIds: [],
          } as unknown as EditionInput;
          const result = await saveEdition(input);
          if (result.ok) setOpen(false);
          else setMessage(result.error ?? "Error al guardar.");
        });
      }}
      className="rounded-xl border border-accent/30 bg-accent/[0.04] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ordinal" htmlFor="new-ord">
          <TextInput id="new-ord" name="ordinal" defaultValue={nextOrdinal} required />
        </Field>
        <Field label="Año" htmlFor="new-year">
          <TextInput
            id="new-year"
            name="year"
            type="number"
            defaultValue={suggestedYear}
            required
          />
        </Field>
        <Field label="Etiqueta superior" htmlFor="new-eyebrow">
          <TextInput id="new-eyebrow" name="eyebrow" />
        </Field>
        <Field label="Título" htmlFor="new-title">
          <TextInput id="new-title" name="title" required />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Descripción" htmlFor="new-desc">
            <TextArea id="new-desc" name="description" rows={2} />
          </Field>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        Stats, galería, laboratorios y ponentes se agregan después editando la
        edición.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear edición"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        {message && <p className="text-sm text-error">{message}</p>}
      </div>
    </form>
  );
}
