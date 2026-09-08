"use client";

import { useState, useTransition } from "react";
import {
  deleteScheduleItem,
  saveScheduleItem,
  type ScheduleItemInput,
} from "@/app/actions/admin/schedule";
import { Button, Field, Select, TextArea, TextInput } from "@/components/admin/ui";

export interface ScheduleRowData {
  id: string;
  day: number;
  title: string;
  time: string;
  description: string | null;
  tag: string;
}

const TAGS = ["Conferencia", "Panel", "Networking", "Activo", "Cierre"] as const;
const DAYS = [1, 2, 3] as const;

function ScheduleFields({
  idPrefix,
  defaults,
}: {
  idPrefix: string;
  defaults: {
    day: number;
    title: string;
    time: string;
    description: string | null;
    tag: string;
  };
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Título" htmlFor={`${idPrefix}-title`}>
        <TextInput
          id={`${idPrefix}-title`}
          name="title"
          defaultValue={defaults.title}
          required
        />
      </Field>
      <Field
        label="Hora de inicio"
        htmlFor={`${idPrefix}-time`}
        hint='Formato 24h. Ej. 9:30 — define los estados del cronograma.'
      >
        <TextInput
          id={`${idPrefix}-time`}
          name="time"
          type="time"
          defaultValue={defaults.time}
          required
        />
      </Field>
      <Field label="Día" htmlFor={`${idPrefix}-day`}>
        <Select id={`${idPrefix}-day`} name="day" defaultValue={String(defaults.day)}>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              Día {day}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Tipo" htmlFor={`${idPrefix}-tag`}>
        <Select id={`${idPrefix}-tag`} name="tag" defaultValue={defaults.tag}>
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Descripción" htmlFor={`${idPrefix}-description`}>
        <TextArea
          id={`${idPrefix}-description`}
          name="description"
          rows={2}
          defaultValue={defaults.description ?? ""}
        />
      </Field>
    </div>
  );
}

function parseInput(formData: FormData, id?: string): ScheduleItemInput {
  return {
    ...(id ? { id } : {}),
    day: Number(formData.get("day") ?? 1),
    title: String(formData.get("title") ?? ""),
    time: String(formData.get("time") ?? "").slice(0, 5),
    description: String(formData.get("description") ?? "") || null,
    tag: String(formData.get("tag") ?? "Conferencia") as ScheduleItemInput["tag"],
  };
}

export function ScheduleEditor({ item }: { item: ScheduleRowData }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <li className="rounded-xl border border-border bg-surface/30">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          item.tag === "Conferencia" ? "bg-gc"
          : item.tag === "Panel" ? "bg-gm"
          : item.tag === "Networking" ? "bg-gp"
          : item.tag === "Activo" ? "bg-accent"
          : "bg-fg"
        }`} />
        <span className="w-14 shrink-0 font-mono text-sm tabular-nums text-muted">
          {item.time}
        </span>
        <span className="w-12 shrink-0 rounded-md bg-surface/70 px-1.5 py-0.5 text-center font-mono text-xs text-muted">
          Día {item.day}
        </span>
        <p className="min-w-0 flex-1 truncate font-medium">{item.title}</p>
        <span className="hidden text-xs text-muted sm:block">{item.tag}</span>
        <Button variant="ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Cancelar" : "Editar"}
        </Button>
      </div>

      {open && (
        <form
          action={(formData: FormData) => {
            setMessage(null);
            startTransition(async () => {
              const result = await saveScheduleItem(
                parseInput(formData, item.id),
              );
              if (result.ok) setOpen(false);
              else setMessage(result.error ?? "Error al guardar.");
            });
          }}
          className="border-t border-border/60 p-4"
        >
          <ScheduleFields
            idPrefix={`edit-${item.id.slice(0, 8)}`}
            defaults={item}
          />
          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando…" : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={pending}
              onClick={() => {
                if (confirm(`¿Eliminar "${item.title}"? No se puede deshacer.`)) {
                  startTransition(async () => {
                    await deleteScheduleItem(item.id);
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

export function NewScheduleItemForm() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Agregar actividad</Button>;
  }

  return (
    <form
      action={(formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await saveScheduleItem(parseInput(formData));
          if (result.ok) setOpen(false);
          else setMessage(result.error ?? "Error al guardar.");
        });
      }}
      className="rounded-xl border border-accent/30 bg-accent/[0.04] p-4"
    >
      <ScheduleFields
        idPrefix="new"
        defaults={{ day: 1, title: "", time: "09:00", description: null, tag: "Conferencia" }}
      />
      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear actividad"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        {message && <p className="text-sm text-error">{message}</p>}
      </div>
    </form>
  );
}
