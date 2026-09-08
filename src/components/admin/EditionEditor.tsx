"use client";

import { useState, useTransition } from "react";
import {
  deleteEdition,
  saveEdition,
  type EditionInput,
} from "@/app/actions/admin/editions";
import { Button, Field, TextArea, TextInput } from "@/components/admin/ui";
import { FieldArray } from "@/components/admin/FieldArray";
import { ImageField } from "@/components/admin/ImageField";
import { getYoutubeId } from "@/lib/video";

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

let _id = 0;
const uid = () => String(++_id);

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

function ImageGallery({
  items,
  onChange,
}: {
  items: GalleryImage[];
  onChange: (items: GalleryImage[]) => void;
}) {
  const [localItems, setLocalItems] = useState(items);

  const updateItem = (index: number, field: keyof GalleryImage, value: string) => {
    const next = [...localItems];
    next[index] = { ...next[index], [field]: value };
    setLocalItems(next);
    onChange(next);
  };

  const addItem = () => {
    const newItem = { id: uid(), src: "", alt: "" };
    const next = [...localItems, newItem];
    setLocalItems(next);
    onChange(next);
  };

  const removeItem = (index: number) => {
    const next = localItems.filter((_, i) => i !== index);
    setLocalItems(next);
    onChange(next);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...localItems];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setLocalItems(next);
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === localItems.length - 1) return;
    const next = [...localItems];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setLocalItems(next);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {localItems.length === 0 && (
        <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted">
          Sin imágenes
        </p>
      )}
      {localItems.map((item, i) => (
        <div
          key={item.id}
          className="group relative rounded-xl border border-border bg-surface/30 p-4"
        >
          <div className="absolute right-2 top-2 flex gap-1">
            <button
              type="button"
              onClick={() => moveUp(i)}
              disabled={i === 0}
              className="rounded p-0.5 text-muted hover:text-fg disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => moveDown(i)}
              disabled={i === localItems.length - 1}
              className="rounded p-0.5 text-muted hover:text-fg disabled:opacity-30"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="rounded p-0.5 text-muted hover:text-error"
            >
              ×
            </button>
          </div>
          <div className="grid gap-3 pr-16">
            <ImageField
              name={`img-${item.id}`}
              label="URL de imagen"
              hint="Pega también un enlace de YouTube (youtube.com/watch…, youtu.be/…) para crear un slide de video."
              defaultValue={item.src}
              onChange={(url) => updateItem(i, "src", url)}
            />
            {getYoutubeId(item.src) && (
              <p className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                Se mostrará como video de YouTube
              </p>
            )}
            <TextInput
              placeholder="Texto alternativo (alt)"
              value={item.alt}
              onChange={(e) => updateItem(i, "alt", e.target.value)}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted transition hover:border-accent/40 hover:text-accent"
      >
        + Agregar imagen
      </button>
    </div>
  );
}

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
        <EditionForm
          edition={edition}
          allSpeakers={allSpeakers}
          message={message}
          setMessage={setMessage}
          pending={pending}
          startTransition={startTransition}
          onSave={async (input) => {
            const result = await saveEdition(input);
            if (result.ok) setOpen(false);
            else setMessage(result.error ?? "Error al guardar.");
          }}
          onDelete={async () => {
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
        />
      )}
    </li>
  );
}

function EditionForm({
  edition,
  allSpeakers,
  message,
  setMessage,
  pending,
  startTransition,
  onSave,
  onDelete,
}: {
  edition: EditionRowData;
  allSpeakers: { id: string; name: string }[];
  message: string | null;
  setMessage: (m: string | null) => void;
  pending: boolean;
  startTransition: React.TransitionStartFunction;
  onSave: (input: EditionInput) => Promise<void>;
  onDelete: () => void;
}) {
  const [stats, setStats] = useState(() =>
    edition.stats.map((s) => ({ ...s, id: uid() }))
  );
  const [images, setImages] = useState(() =>
    edition.images.map((img) => ({ ...img, id: uid() }))
  );
  const [labs, setLabs] = useState(() =>
    edition.labs.map((l) => ({ ...l, id: uid() }))
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

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
        stats: JSON.stringify(stats.map(({ id, ...s }) => s)),
        images: JSON.stringify(images.map(({ id, ...i }) => i)),
        labs: JSON.stringify(labs.map(({ id, ...l }) => l)),
        speakerIds,
      } as unknown as EditionInput;
      await onSave(input);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
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

        <Field label="Logo (URL)" htmlFor={`logo-${edition.id}`} hint="Imagen del logotipo de la edición">
          <TextInput
            id={`logo-${edition.id}`}
            name="logoUrl"
            defaultValue={edition.logoUrl ?? ""}
            placeholder="https://res.cloudinary.com/..."
          />
        </Field>

        <Field label="URL de backdrop" htmlFor={`backdrop-${edition.id}`}>
          <TextInput
            id={`backdrop-${edition.id}`}
            name="backdropUrl"
            type="url"
            defaultValue={edition.backdropUrl ?? ""}
            placeholder="https://…"
          />
        </Field>
        <Field label="URL del video" htmlFor={`video-${edition.id}`} hint="URL del video (uploadcare, YouTube, etc.)">
          <TextInput
            id={`video-${edition.id}`}
            name="videoId"
            placeholder="https://…"
            defaultValue={edition.videoId ?? ""}
          />
        </Field>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-fg">Stats</p>
        <FieldArray
          items={stats}
          onChange={setStats}
          addLabel="Agregar stat"
          emptyLabel="Sin stats"
          renderItem={(item, _, onChange) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                placeholder="Valor (ej. +5000)"
                value={item.value}
                onChange={(e) => onChange({ ...item, value: e.target.value })}
              />
              <TextInput
                placeholder="Etiqueta (ej. Asistentes)"
                value={item.label}
                onChange={(e) => onChange({ ...item, label: e.target.value })}
              />
            </div>
          )}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-fg">Galería de imágenes</p>
        <ImageGallery items={images} onChange={setImages} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-fg">Laboratorios de la edición</p>
        <FieldArray
          items={labs}
          onChange={setLabs}
          addLabel="Agregar laboratorio"
          emptyLabel="Sin laboratorios"
          renderItem={(item, _, onChange) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                placeholder="Nombre"
                value={item.name}
                onChange={(e) => onChange({ ...item, name: e.target.value })}
              />
              <ImageField
                name={`lab-${item.id}`}
                label="Logo"
                defaultValue={item.image}
                onChange={(url) => onChange({ ...item, image: url })}
              />
            </div>
          )}
        />
      </div>

      <fieldset className="mt-4">
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

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={pending}
          onClick={onDelete}
        >
          Eliminar
        </Button>
        {message && <p className="text-sm text-error">{message}</p>}
      </div>
    </form>
  );
}
