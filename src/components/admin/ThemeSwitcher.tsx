"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type ThemeMode } from "@/lib/theme-provider";
import { cn } from "@/lib/cn";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "auto", label: "Auto", icon: Monitor },
];

export function ThemeSwitcher({
  collapsed = false,
  variant = "sidebar",
}: {
  collapsed?: boolean;
  variant?: "sidebar" | "topbar";
}) {
  const { mode, setMode } = useTheme();

  const activeCls =
    variant === "sidebar"
      ? "bg-primary text-primary-foreground"
      : "bg-secondary text-foreground";
  const idleCls =
    variant === "sidebar"
      ? "text-white/60 hover:bg-white/10 hover:text-white"
      : "text-muted-foreground hover:bg-secondary hover:text-foreground";

  return (
    <div>
      {!collapsed && variant === "sidebar" && (
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-white/50">
          Apariencia
        </p>
      )}
      <div
        role="radiogroup"
        aria-label="Tema de la interfaz"
        className={cn(
          "flex rounded-lg border border-border/20 p-0.5",
          collapsed ? "flex-col gap-0.5" : "grid grid-cols-3 gap-0.5",
          variant === "sidebar" ? "border-white/10" : "border-border",
        )}
      >
        {OPTIONS.map((option) => {
          const active = mode === option.value;
          const Icon = option.icon;
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
                  : option.label
              }
              className={cn(
                "flex items-center justify-center rounded-md transition",
                collapsed ? "h-9 w-full" : "gap-1.5 px-2 py-1.5 text-xs font-medium",
                active ? activeCls : idleCls,
              )}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{option.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
