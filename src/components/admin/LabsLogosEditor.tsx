"use client";

import { useState, useTransition } from "react";
import { updateLabLogo } from "@/app/actions/admin/labs";
import { Button, TextInput } from "@/components/admin/ui";

export interface LabRowData {
  id: string;
  name: string;
  imageUrl: string;
}

function LabLogoRow({ lab }: { lab: LabRowData }) {
  const [url, setUrl] = useState(lab.imageUrl);
  const [message, setMessage] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState(lab.imageUrl);
  const [pending, startTransition] = useTransition();

  const dirty = url !== savedUrl;

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateLabLogo({ id: lab.id, imageUrl: url.trim() });
      if (result.ok) {
        setSavedUrl(url.trim());
        setMessage("Guardado.");
      } else {
        setMessage(result.error ?? "Error al guardar.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border p-3 sm:flex-row sm:items-center sm:gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dirty ? url : savedUrl}
        alt={`Logo de ${lab.name}`}
        className="h-10 w-16 shrink-0 rounded bg-white object-contain p-1"
      />
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium">{lab.name}</p>
        <TextInput
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setMessage(null);
          }}
          placeholder="https://res.cloudinary.com/…"
          aria-label={`Logo de ${lab.name}`}
        />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {message && (
          <span
            className={
              message === "Guardado."
                ? "text-xs text-emerald-600 dark:text-emerald-400"
                : "text-xs text-red-600 dark:text-red-400"
            }
          >
            {message}
          </span>
        )}
        <Button type="button" onClick={save} disabled={pending || !dirty}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </div>
  );
}

export function LabsLogosEditor({ labsList }: { labsList: LabRowData[] }) {
  return (
    <div className="flex flex-col gap-3">
      {labsList.map((lab) => (
        <LabLogoRow key={lab.id} lab={lab} />
      ))}
    </div>
  );
}
