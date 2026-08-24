"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const emptySubscribe = () => () => {};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  label,
  className,
  children,
}: ModalProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className="fixed inset-0 bg-dark/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className={cn(
            "relative flex max-h-[calc(100dvh_-_2rem)] w-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface shadow-2xl sm:max-h-[calc(100dvh_-_3rem)]",
            className ?? "max-w-lg",
          )}
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border-none bg-surface text-muted transition-colors hover:bg-border/50 hover:text-fg"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
          <div className="min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
