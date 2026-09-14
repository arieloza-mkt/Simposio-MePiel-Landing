"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteProgramaItem,
  saveProgramaItem,
  type ProgramaItemInput,
} from "@/app/actions/admin/programa";
import {
  PROGRAMA_DIA_LABEL,
  PROGRAMA_ICONS,
  PROGRAMA_KINDS,
  PROGRAMA_MODO_FORANEOS,
  PROGRAMA_MODO_LOCALES,
  type ProgramaItemKind,
  type ProgramaModo,
} from "@/lib/programa";
import { Button, Field, Select, TextArea, TextInput } from "@/components/admin/ui";

export interface ProgramaItemRow {
  id: string;
  day: number;
  start: string;
  end: string;
  title: string;
  speakers: string[];
  salon: string | null;
  nota: string | null;
  kind: ProgramaItemKind;
  modo: string | null;
  icon: string;
}

const DAYS = [1, 2, 3] as const;
const MODOS: { value: ProgramaModo; label: string }[] = [
  { value: PROGRAMA_MODO_FORANEOS, label: "Solo Foráneos" },
  { value: PROGRAMA_MODO_LOCALES, label: "Solo Locales" },
];

function ProgramItemFields({
  idPrefix,
  defaults,
}: {
  idPrefix: string;
  defaults: {
    day: number;
    start: string;
    end: string;
    title: string;
    speakers: string[];
    salon: string | null;
    nota: string | null;
    kind: ProgramaItemKind;
    modo: string | null;
    icon: string;
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
      <Field label="Día" htmlFor={`${idPrefix}-day`}>
        <Select id={`${idPrefix}-day`} name="day" defaultValue={String(defaults.day)}>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {PROGRAMA_DIA_LABEL[day]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Modalidad" htmlFor={`${idPrefix}-modo`} hint="Vacío = ambas pestañas">
        <Select id={`${idPrefix}-modo`} name="modo" defaultValue={defaults.modo ?? ""}>
          <option value="">Todas</option>
          {MODOS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Inicio (24h)" htmlFor={`${idPrefix}-start`} hint='Ej. "09:00". Vacío para llegada/sin hora.'>
        <TextInput
          id={`${idPrefix}-start`}
          name="start"
          placeholder="09:00"
          defaultValue={defaults.start}
        />
      </Field>
      <Field label="Fin (24h)" htmlFor={`${idPrefix}-end`} hint='Ej. "10:00". Vacío si no aplica.'>
        <TextInput
          id={`${idPrefix}-end`}
          name="end"
          placeholder="10:00"
          defaultValue={defaults.end}
        />
      </Field>
      <Field label="Tipo" htmlFor={`${idPrefix}-kind`}>
        <Select id={`${idPrefix}-kind`} name="kind" defaultValue={defaults.kind}>
          {PROGRAMA_KINDS.map((kind) => (
            <option key={kind.value} value={kind.value}>
              {kind.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field
        label="Ícono"
        htmlFor={`${idPrefix}-icon`}
        hint="Automático asigna uno según el tipo.">
        <Select id={`${idPrefix}-icon`} name="icon" defaultValue={defaults.icon}>
          <option value="">Automático (por tipo)</option>
          {PROGRAMA_ICONS.map((ic) => (
            <option key={ic.value} value={ic.value}>
              {ic.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Salón" htmlFor={`${idPrefix}-salon`}>
        <TextInput
          id={`${idPrefix}-salon`}
          name="salon"
          placeholder="Plenaria"
          defaultValue={defaults.salon ?? ""}
        />
      </Field>
      <Field
        label="Ponentes (uno por línea)"
        htmlFor={`${idPrefix}-speakers`}
      >
        <TextArea
          id={`${idPrefix}-speakers`}
          name="speakers"
          rows={3}
          defaultValue={defaults.speakers.join("\n")}
        />
      </Field>
      <Field label="Nota" htmlFor={`${idPrefix}-nota`}>
        <TextArea
          id={`${idPrefix}-nota`}
          name="nota"
          rows={3}
          defaultValue={defaults.nota ?? ""}
        />
      </Field>
    </div>
  );
}

function parseProgramaItem(formData: FormData, id?: string): ProgramaItemInput {
  return {
    ...(id ? { id } : {}),
    day: Number(formData.get("day") ?? 2),
    start: String(formData.get("start") ?? "").trim(),
    end: String(formData.get("end") ?? "").trim(),
    title: String(formData.get("title") ?? ""),
    speakers: String(formData.get("speakers") ?? ""),
    salon: String(formData.get("salon") ?? "").trim() || null,
    nota: String(formData.get("nota") ?? "").trim() || null,
    kind: String(formData.get("kind") ?? "conferencia") as ProgramaItemKind,
    modo: String(formData.get("modo") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
  };
}

export function ProgramaItemEditor({ item }: { item: ProgramaItemRow }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <li className="rounded-xl border border-border bg-surface/30">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <span className="w-24 shrink-0 font-mono text-sm tabular-nums text-muted">
          {item.start}
          {item.end ? ` – ${item.end}` : ""}
        </span>
        <span className="w-24 shrink-0 rounded-md bg-surface/70 px-1.5 py-0.5 text-center font-mono text-xs text-muted">
          {PROGRAMA_DIA_LABEL[item.day as 1 | 2 | 3] ?? `Día ${item.day}`}
        </span>
        <p className="min-w-0 flex-1 truncate font-medium">{item.title}</p>
        <span className="hidden text-xs text-muted sm:block">
          {PROGRAMA_KINDS.find((k) => k.value === item.kind)?.label ?? item.kind}
        </span>
        <Button variant="ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Cancelar" : "Editar"}
        </Button>
      </div>

      {open && (
        <form
          action={(formData: FormData) => {
            setMessage(null);
            startTransition(async () => {
              const result = await saveProgramaItem(
                parseProgramaItem(formData, item.id),
              );
              if (result.ok) {
                setOpen(false);
                router.refresh();
              } else setMessage(result.error ?? "Error al guardar.");
            });
          }}
          className="border-t border-border/60 p-4"
        >
          <ProgramItemFields
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
                    await deleteProgramaItem(item.id);
                    router.refresh();
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

export function NewProgramaItemForm() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ Agregar actividad</Button>;
  }

  return (
    <form
      action={(formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await saveProgramaItem(parseProgramaItem(formData));
          if (result.ok) {
            setOpen(false);
            router.refresh();
          } else setMessage(result.error ?? "Error al guardar.");
        });
      }}
      className="rounded-xl border border-accent/30 bg-accent/[0.04] p-4"
    >
      <ProgramItemFields
        idPrefix="new-programa"
        defaults={{
          day: 2,
          start: "",
          end: "",
          title: "",
          speakers: [],
          salon: null,
          nota: null,
          kind: "conferencia",
          modo: null,
          icon: "",
        }}
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
