"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ProgramaTimeline } from "./ProgramaTimeline";
import { PdfButton } from "./PdfButton";
import type { ProgramaItem, ProgramaModo } from "@/lib/programa";

const emptySubscribe = () => () => {};

export function ProgramaModal({
  open,
  onClose,
  items,
  initialDay,
  modo,
  onModoChange,
}: {
  open: boolean;
  onClose: () => void;
  items: ProgramaItem[];
  initialDay?: 1 | 2 | 3;
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

  // Scroll al día inicial.
  useEffect(() => {
    if (!open || !initialDay) return;
    const raf = requestAnimationFrame(() =>
      document
        .getElementById(`programa-dia-${initialDay}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
    return () => cancelAnimationFrame(raf);
  }, [open, initialDay]);

  if (!open || !mounted) return null;

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
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-program-cyan">
              Programa
            </p>
            <h3 className="font-display text-[18px] leading-tight tracking-[0.04em] text-program-white sm:text-[22px]">
              Simposio Dermocosmético 2026
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <PdfButton modo={modo} compact />
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

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,#04070f,#0a1320)]">
        <div className="mx-auto max-w-[880px] px-4 py-6 sm:px-6 sm:py-8">
          <ProgramaTimeline items={items} modo={modo} onModoChange={onModoChange} />
        </div>
      </div>
    </div>,
    document.body,
  );
}