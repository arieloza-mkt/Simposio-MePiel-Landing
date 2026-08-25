"use client";

import { useState, useTransition } from "react";
import {
  deleteSpeaker,
  saveSpeaker,
  type SpeakerInput,
} from "@/app/actions/admin/speakers";
import { Button, Field, TextInput, TextArea } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";
import { SpeakerCheckInButton } from "@/components/admin/CheckInButtons";

export interface SpeakerRowData {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  imageUrl: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
}

export function SpeakerEditor({
  speaker,
  checkedIn,
}: {
  speaker: SpeakerRowData;
  checkedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const input: SpeakerInput = {
        id: speaker.id,
        name: String(formData.get("name") ?? ""),
        role: String(formData.get("role") ?? "") || null,
        company: String(formData.get("company") ?? "") || null,
        imageUrl: String(formData.get("imageUrl") ?? "") || null,
        bio: String(formData.get("bio") ?? "") || null,
        linkedinUrl: String(formData.get("linkedinUrl") ?? "") || null,
        websiteUrl: String(formData.get("websiteUrl") ?? "") || null,
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      };
      const result = await saveSpeaker(input);
      if (result.ok) {
        setOpen(false);
      } else {
        setMessage(result.error ?? "Error al guardar.");
      }
    });
  };

  return (
    <li className="rounded-xl border border-border bg-surface/30">
      <div className="flex items-center gap-3 p-4">
        {speaker.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={speaker.imageUrl}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface/70 text-sm text-muted">
            {speaker.name.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{speaker.name}</p>
          <p className="truncate text-xs text-muted">
            {[speaker.role, speaker.company].filter(Boolean).join(" · ") ||
              "Sin cargo"}
          </p>
        </div>
        <SpeakerCheckInButton speakerId={speaker.id} checkedIn={checkedIn} />
        <span className="hidden font-mono text-xs text-muted sm:block">
          #{speaker.sortOrder}
        </span>
        <Button variant="ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Cancelar" : "Editar"}
        </Button>
      </div>

      {open && (
        <form action={submit} className="border-t border-border/60 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nombre" htmlFor={`name-${speaker.id}`}>
              <TextInput
                id={`name-${speaker.id}`}
                name="name"
                defaultValue={speaker.name}
                required
              />
            </Field>
            <Field label="Cargo" htmlFor={`role-${speaker.id}`}>
              <TextInput
                id={`role-${speaker.id}`}
                name="role"
                defaultValue={speaker.role ?? ""}
              />
            </Field>
            <Field label="Empresa" htmlFor={`company-${speaker.id}`}>
              <TextInput
                id={`company-${speaker.id}`}
                name="company"
                defaultValue={speaker.company ?? ""}
              />
            </Field>
            <Field
              label="Orden"
              htmlFor={`order-${speaker.id}`}
              hint="Menor número = aparece primero"
            >
              <TextInput
                id={`order-${speaker.id}`}
                name="sortOrder"
                type="number"
                min={0}
                max={9999}
                defaultValue={speaker.sortOrder}
              />
            </Field>
          </div>

          <div className="mt-3">
            <ImageField
              name="imageUrl"
              label="Foto del ponente"
              defaultValue={speaker.imageUrl ?? ""}
            />
          </div>

          <div className="mt-3">
            <Field label="Biografía" htmlFor={`bio-${speaker.id}`}>
              <TextArea
                id={`bio-${speaker.id}`}
                name="bio"
                rows={3}
                defaultValue={speaker.bio ?? ""}
                placeholder="Breve descripción del ponente..."
              />
            </Field>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="LinkedIn" htmlFor={`linkedin-${speaker.id}`} hint="URL completa">
              <TextInput
                id={`linkedin-${speaker.id}`}
                name="linkedinUrl"
                type="url"
                defaultValue={speaker.linkedinUrl ?? ""}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
            <Field label="Website" htmlFor={`website-${speaker.id}`} hint="URL completa">
              <TextInput
                id={`website-${speaker.id}`}
                name="websiteUrl"
                type="url"
                defaultValue={speaker.websiteUrl ?? ""}
                placeholder="https://..."
              />
            </Field>
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
                  confirm(`¿Eliminar a ${speaker.name}? No se puede deshacer.`)
                ) {
                  startTransition(async () => {
                    await deleteSpeaker(speaker.id);
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

export function NewSpeakerForm() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>+ Agregar ponente</Button>
    );
  }

  return (
    <form
      action={(formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await saveSpeaker({
            name: String(formData.get("name") ?? ""),
            role: String(formData.get("role") ?? "") || null,
            company: String(formData.get("company") ?? "") || null,
            imageUrl: String(formData.get("imageUrl") ?? "") || null,
            bio: String(formData.get("bio") ?? "") || null,
            linkedinUrl: String(formData.get("linkedinUrl") ?? "") || null,
            websiteUrl: String(formData.get("websiteUrl") ?? "") || null,
            sortOrder: Number(formData.get("sortOrder") ?? 0),
          });
          if (result.ok) setOpen(false);
          else setMessage(result.error ?? "Error al guardar.");
        });
      }}
      className="rounded-xl border border-accent/30 bg-accent/[0.04] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="new-name">
          <TextInput id="new-name" name="name" required autoFocus />
        </Field>
        <Field label="Cargo" htmlFor="new-role">
          <TextInput id="new-role" name="role" />
        </Field>
        <Field label="Empresa" htmlFor="new-company">
          <TextInput id="new-company" name="company" />
        </Field>
        <Field label="Orden" htmlFor="new-order" hint="Menor = primero">
          <TextInput id="new-order" name="sortOrder" type="number" min={0} defaultValue={0} />
        </Field>
      </div>

      <div className="mt-3">
        <ImageField name="imageUrl" label="Foto del ponente" />
      </div>

      <div className="mt-3">
        <Field label="Biografía" htmlFor="new-bio">
          <TextArea id="new-bio" name="bio" rows={3} placeholder="Breve descripción..." />
        </Field>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="LinkedIn" htmlFor="new-linkedin" hint="URL completa">
          <TextInput id="new-linkedin" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="Website" htmlFor="new-website" hint="URL completa">
          <TextInput id="new-website" name="websiteUrl" type="url" placeholder="https://..." />
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear ponente"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        {message && <p className="text-sm text-error">{message}</p>}
      </div>
    </form>
  );
}
