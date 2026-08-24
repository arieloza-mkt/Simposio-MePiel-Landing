"use client";

import { useTheme, type ThemeMode } from "@/lib/theme-provider";

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
  { value: "auto", label: "Auto" },
];

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
        Apariencia
      </p>
      <div
        role="radiogroup"
        aria-label="Tema de la interfaz"
        className="grid grid-cols-3 gap-0.5 rounded-lg border border-border bg-surface/60 p-0.5"
      >
        {OPTIONS.map((option) => {
          const active = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(option.value)}
              title={
                option.value === "auto"
                  ? "Sigue el horario: oscuro de 19:00 a 07:00"
                  : undefined
              }
              className={`rounded-md px-2 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:bg-fg/5 hover:text-fg"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
