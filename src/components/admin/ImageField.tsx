"use client";

import { useState } from "react";

export function ImageField({
  name,
  label,
  hint,
  defaultValue = "",
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
      {hint && <p className="mb-1.5 text-xs text-muted">{hint}</p>}
      <input
        type="url"
        id={name}
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://res.cloudinary.com/..."
        className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
      />
      {url && (
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Vista previa"
            className="h-32 w-full object-contain bg-fg/5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
