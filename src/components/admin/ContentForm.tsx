"use client";

import { useState, useTransition } from "react";
import { saveContentForm } from "@/app/actions/admin/content";
import { Button, Field, TextArea, TextInput } from "@/components/admin/ui";

export interface FieldDef {
  name: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
}

export function ContentForm({
  settingKey,
  fields,
  defaults,
}: {
  settingKey: string;
  fields: FieldDef[];
  defaults: Record<string, string>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await saveContentForm(settingKey, formData);
          setMessage(
            result.ok ? "Guardado ✓" : (result.error ?? "Error al guardar."),
          );
        });
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.multiline ? "sm:col-span-2" : ""}
          >
            <Field label={field.label} hint={field.hint} htmlFor={`${settingKey}-${field.name}`}>
              {field.multiline ? (
                <TextArea
                  id={`${settingKey}-${field.name}`}
                  name={field.name}
                  rows={field.rows ?? 4}
                  defaultValue={defaults[field.name] ?? ""}
                />
              ) : (
                <TextInput
                  id={`${settingKey}-${field.name}`}
                  name={field.name}
                  defaultValue={defaults[field.name] ?? ""}
                />
              )}
            </Field>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        {message && (
          <p className={`text-sm ${message.includes("✓") ? "text-emerald-300" : "text-error"}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
