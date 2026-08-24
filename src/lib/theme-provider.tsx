"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "admin-theme";

/** Hora CDMX: oscuro de 19:00 a 07:00. Función pura, testeable. */
export function isDarkHour(date: Date): boolean {
  const hour = Number.parseInt(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Mexico_City",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date),
    10,
  );
  return hour >= 19 || hour < 7;
}

function resolveTheme(mode: ThemeMode, date: Date): ResolvedTheme {
  if (mode === "light" || mode === "dark") return mode;
  return isDarkHour(date) ? "dark" : "light";
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", resolved);
}

const listeners = new Set<() => void>();

const themeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "auto";
  },
  getServerSnapshot(): ThemeMode {
    return "auto";
  },
  set(mode: ThemeMode) {
    if (mode === "auto") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
    applyTheme(resolveTheme(mode, new Date()));
    listeners.forEach((listener) => listener());
  },
};

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolve: (mode?: ThemeMode) => ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "auto",
  setMode: () => {},
  resolve: () => "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const setMode = useCallback((next: ThemeMode) => themeStore.set(next), []);

  const resolve = useCallback(
    (forMode?: ThemeMode) => resolveTheme(forMode ?? mode, new Date()),
    [mode],
  );

  const value = useMemo(
    () => ({ mode, setMode, resolve }),
    [mode, setMode, resolve],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
