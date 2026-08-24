"use client";

import { useState, useTransition } from "react";
import {
  deleteEdition,
  saveEdition,
  type EditionInput,
} from "@/app/actions/admin/editions";
import { Button, Field, TextArea, TextInput } from "@/components/admin/ui";

export interface EditionRowData {
  id: string;
  ordinal: string;
  year: number;
  eyebrow: string | null;
  title: string;
  description: string | null;
  backdropUrl: string | null;
  logoUrl: string | null;
  videoId: string | null;
  stats: { value: string; label: string }[];
  images: { src: string; alt: string }[];
  labs: { name: string; image: string }[];
  speakerIds: string[];
}

const statsToText = (stats: { value: string; label: string }[]) =>
  stats.map((s) => `${s.value} | ${s.label}`).join("\n");
const imagesToText = (images: { src: string; alt: string }[]) =>
  images.map((i) => `${i.src} | ${i.alt}`).join("\n");
const labsToText = (labs: { name: string; image: string }[]) =>
  labs.map((l) => `${l.name} | ${l.image}`).join("\n");

export function EditionEditor({
  edition,
  allSpeakers,
}: {
  edition: EditionRowData;
  allSpeakers: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <li className="rounded-xl border border-border bg-surface/30">
      <div className="flex items-center gap-3 p-4">
        <span className="rounded-md bg-surface/70 px-2 py-1 font-mono text-xs text-muted">
          {edition.ordinal} · {edition.year}
        </span>
        <p className="min-w-0 flex-1 truncate font-medium">{edition.title}</p>
        <span className="hidden text-xs text-muted sm:block">
          {edition.stats.length} stats · {edition.labs.length} labs ·{" "}
          {edition.speakerIds.length} ponentes
        </span>
        <Button variant="ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Cancelar" : "Editar"}
        </Button>
      </div>

      {open && (
        <form
          action={(formData: FormData) => {
            setMessage(null);
            const speakerIds = allSpeakers
              .filter((s) => formData.get(`sp-${s.id}`) === "on")
              .map((s) => s.id);

            startTransition(async () => {
            const input = {
              id: edition.id,
              ordinal: String(formData.get("ordinal") ?? ""),
              year: Number(formData.get("year") ?? 0),
              eyebrow: String(formData.get("eyebrow") ?? ""),
              title: String(formData.get("title") ?? ""),
              description: String(formData.get("description") ?? ""),
              backdropUrl: String(formData.get("backdropUrl") ?? "") || null,
              logoUrl: String(formData.get("logoUrl") ?? "") || null,
              videoId: String(formData.get("videoId") ?? ""),
              stats: String(formData.get("stats") ?? ""),
              images: String(formData.get("images") ?? ""),
              labs: String(formData.get("labs") ?? ""),
              speakerIds,
            } as unknown as EditionInput;
              const result = await saveEdition(input);
              if (result.ok) setOpen(false);
              else setMessage(result.error ?? "Error al guardar.");
            });
          }}
          className="border-t border-border/60 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Ordinal" htmlFor={`ord-${edition.id}`} hint="Ej. 01">
              <TextInput
                id={`ord-${edition.id}`}
                name="ordinal"
                defaultValue={edition.ordinal}
                required
              />
            </Field>
            <Field label="Año" htmlFor={`year-${edition.id}`}>
              <TextInput
                id={`year-${edition.id}`}
                name="year"
                type="number"
                min={2020}
                max={2100}
                defaultValue={edition.year}
                required
              />
            </Field>
            <Field label="Etiqueta superior" htmlFor={`eyebrow-${edition.id}`}>
              <TextInput
                id={`eyebrow-${edition.id}`}
                name="eyebrow"
                defaultValue={edition.eyebrow ?? ""}
              />
            </Field>
            <Field label="Título" htmlFor={`title-${edition.id}`}>
              <TextInput
                id={`title-${edition.id}`}
                name="title"
                defaultValue={edition.title}
                required
              />
            </Field>
            <Field label="Logo (URL)" htmlFor={`logo-${edition.id}`} hint="Imagen del logotipo de la edición">
              <TextInput
                id={`logo-${edition.id}`}
                name="logoUrl"
                defaultValue={edition.logoUrl ?? ""}
                placeholder="https://res.cloudinary.com/..."
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Descripción" htmlFor={`desc-${edition.id}`}>
                <TextArea
                  id={`desc-${edition.id}`}
                  name="description"
                  rows={2}
                  defaultValue={edition.description ?? ""}
                />
              </Field>
            </div>

            <Field label="URL de backdrop" htmlFor={`backdrop-${edition.id}`}>
              <TextInput
                id={`backdrop-${edition.id}`}
                name="backdropUrl"
                type="url"
                defaultValue={edition.backdropUrl ?? ""}
                placeholder="https://…"
              />
            </Field>
            <Field label="ID de YouTube" htmlFor={`video-${edition.id}`}>
              <TextInput
                id={`video-${edition.id}`}
                name="videoId"
                defaultValue={edition.videoId ?? ""}
              />
            </Field>

            <div className="sm:col-span-2 grid gap-3 lg:grid-cols-3">
              <Field
                label="Stats"
                htmlFor={`stats-${edition.id}`}
                hint='Una por línea: "500 | Asistentes"'
              >
                <TextArea
                  id={`stats-${edition.id}`}
                  name="stats"
                  defaultValue={statsToText(edition.stats)}
                />
              </Field>
              <Field
                label="Galería"
                htmlFor={`images-${edition.id}`}
                hint="Una URL por línea"
              >
                <TextArea
                  id={`images-${edition.id}`}
                  name="images"
                  defaultValue={imagesToText(edition.images)}
                />
              </Field>
              <Field
                label="Laboratorios"
                htmlFor={`labs-${edition.id}`}
                hint='"Nombre | https://logo.png"'
              >
                <TextArea
                  id={`labs-${edition.id}`}
                  name="labs"
                  defaultValue={labsToText(edition.labs)}
                />
              </Field>
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                Ponentes de esta edición
              </legend>
              <div className="grid max-h-48 grid-cols-1 gap-1 overflow-y-auto rounded-lg border border-border bg-surface/50 p-3 sm:grid-cols-2 lg:grid-cols-3">
                {allSpeakers.map((speaker) => (
                  <label
                    key={speaker.id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-fg"
                  >
                    <input
                      type="checkbox"
                      name={`sp-${speaker.id}`}
                      defaultChecked={edition.speakerIds.includes(speaker.id)}
                      className="accent-[var(--color-accent)]"
                    />
                    {speaker.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando…" : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={pending}
              onClick={() => {
                if (
                  confirm(
                    `¿Eliminar la edición ${edition.ordinal} (${edition.year})? No se puede deshacer.`,
                  )
                ) {
                  startTransition(async () => {
                    await deleteEdition(edition.id);
                  });
                }
              }}
            >
              Eliminar
            </Button>
            {message && <p className="text-sm text-error">{message}</p>}
          </div>
        </form>
      )}
    </li>
  );
}
