"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, X } from "lucide-react";
import {
  PROGRAMA_MODOS,
  getProgramaPdfDownloadUrl,
  getProgramaPdfUrl,
  type ProgramaModo,
} from "@/lib/programa";

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

  // Focus, scroll-lock, escape.
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

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Programa completo"
    >
      <div
        className="absolute inset-0 bg-[#04070f]/90 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      <header className="relative z-10 shrink-0 border-b border-program-blue/50 bg-[#0a1320]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-program-cyan">
              Programa
            </p>
            <h3 className="font-display text-[18px] leading-tight tracking-[0.04em] text-program-white sm:text-[22px]">
              Simposio Dermocosmético 2026
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="tablist"
              aria-label="Modalidad del programa"
              className="flex items-center gap-1 rounded-full border border-program-blue bg-program-navy-dark p-1"
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
                    className="relative rounded-full px-4 py-2 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-program-cyan"
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-full bg-program-white" />
                    )}
                    <span
                      className={`relative z-10 uppercase tracking-[0.14em] transition-colors ${
                        active
                          ? "text-program-navy"
                          : "text-program-lilac hover:text-program-white"
                      }`}
                    >
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir PDF en una pestaña nueva"
              title="Abrir en una pestaña nueva"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-program-blue/60 bg-program-navy text-program-lilac-text transition-colors hover:border-program-cyan/50 hover:text-program-white"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            <a
              href={downloadUrl}
              aria-label="Descargar programa en PDF"
              title="Descargar PDF"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-program-blue/60 bg-program-navy text-program-lilac-text transition-colors hover:border-program-cyan/50 hover:text-program-white"
            >
              <Download className="h-5 w-5" />
            </a>
            <button
              type="button"
              ref={closeRef}
              onClick={onClose}
              aria-label="Cerrar programa"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-program-blue/60 bg-program-navy text-program-lilac-text transition-colors hover:border-program-cyan/50 hover:text-program-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 min-h-0 flex-1 bg-[linear-gradient(180deg,#04070f,#0a1320)]">
        <iframe
          key={viewUrl}
          src={viewUrl}
          title={`Programa ${modo} · Simposio Dermocosmético 2026`}
          className="h-full w-full border-0"
        />
      </div>
    </div>,
    document.body,
  );
}
