"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, X } from "lucide-react";
import {
  PROGRAMA_MODOS,
  getProgramaPdfDownloadUrl,
  getProgramaPdfPreviewUrl,
  getProgramaPdfUrl,
  type ProgramaModo,
} from "@/lib/programa";
import { cn } from "@/lib/cn";

const emptySubscribe = () => () => {};

export function ProgramaModal({
  open,
  onClose,
  modo,
  onModoChange,
}: {
  open: boolean;
  onClose: () => void;
  modo: ProgramaModo;
  onModoChange: (m: ProgramaModo) => void;
}) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  // Focus, scroll-lock, escape. El subtree del portal se remonta al abrir,
  // por lo que el estado de la vista previa se reinicia solo.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const viewUrl = getProgramaPdfUrl(modo);
  const downloadUrl = getProgramaPdfDownloadUrl(modo);
  const previewUrl = getProgramaPdfPreviewUrl(modo);
  const activeLabel = PROGRAMA_MODOS.find((m) => m.value === modo)?.label;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Programa completo"
    >
      <div
        className="absolute inset-0 animate-in bg-[#04070f]/90 backdrop-blur-[2px] fade-in-0 duration-300"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative flex max-h-[88dvh] w-full max-w-3xl animate-in flex-col overflow-hidden rounded-t-[var(--radius-lg)] border border-b-0 border-program-blue/50 bg-[#0a1320] shadow-2xl slide-in-from-bottom-8 duration-400 ease-[var(--ease-out-expo)] sm:mb-6 sm:max-h-[90dvh] sm:border-b sm:rounded-[var(--radius-lg)]">
        <header className="shrink-0 border-b border-program-blue/50 px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-program-cyan">
                Programa
              </p>
              <h3 className="font-display text-[20px] leading-tight tracking-[0.04em] text-program-white">
                Simposio Dermocosmético 2026
              </h3>
            </div>

            <button
              type="button"
              ref={closeRef}
              onClick={onClose}
              aria-label="Cerrar"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-program-turquoise text-program-navy transition-transform duration-200 hover:scale-105 focus-visible:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-cyan active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            role="tablist"
            aria-label="Modalidad del programa"
            className="mt-4 flex items-center gap-1 rounded-full border border-program-blue bg-program-navy-dark p-1"
          >
            {PROGRAMA_MODOS.map((m) => {
              const active = m.value === modo;
              return (
                <button
                  key={m.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onModoChange(m.value)}
                  className="relative flex-1 rounded-full px-4 py-2.5 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-program-cyan"
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-program-white" />
                  )}
                  <span
                    className={cn(
                      "relative z-10 uppercase tracking-[0.14em] transition-colors",
                      active
                        ? "text-program-navy"
                        : "text-program-lilac-text hover:text-program-white",
                    )}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 py-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[calc(var(--radius-lg)*0.75)] border border-program-blue/50 bg-[#04070f]">
            <div className="flex shrink-0 items-center justify-between border-b border-program-blue/50 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-program-lilac-text">
                Vista previa
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-program-cyan">
                {activeLabel}
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {previewFailed ? (
                <div className="grid min-h-full place-items-center p-6 text-center">
                  <p className="max-w-[34ch] text-sm leading-relaxed text-program-lilac-text">
                    No se pudo mostrar la vista previa. Puedes ver el programa
                    completo en otra pestaña.
                  </p>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt={`Vista previa del programa ${activeLabel} en PDF`}
                  className="h-auto w-full"
                  onError={() => setPreviewFailed(true)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-1 sm:flex-row">
          <a
            href={downloadUrl}
            aria-label="Descargar programa en PDF"
            className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-program-cyan px-5 text-base font-semibold text-program-navy transition-colors hover:bg-program-turquoise focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-cyan"
          >
            <Download className="h-5 w-5" />
            Descargar programa (PDF)
          </a>
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-program-white px-5 text-sm font-semibold text-program-navy transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-cyan"
          >
            <ExternalLink className="h-4 w-4" />
            Ver completo
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}