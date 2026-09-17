"use client";

import type { Edition } from "@/lib/content";
import { Modal } from "@/components/ui/Modal";

export function TemarioModal({
  open,
  onClose,
  edition,
}: {
  open: boolean;
  onClose: () => void;
  edition: Edition;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      label={`Temario de la ${edition.ordinal} edición`}
      className="max-w-2xl"
    >
      <h3 className="m-0 mb-1.5 font-display text-2xl font-bold tracking-tight">
        Temario de la {edition.ordinal} edición
      </h3>
      <p className="m-0 mb-6 border-b border-border pb-4 text-[13px] leading-relaxed text-muted">
        Actividades de la {edition.eyebrow} ({edition.year}). Horarios sujetos a
        cambios por cada recinto.
      </p>

      <ol className="m-0 list-none p-0">
        {edition.temario.map((item, i) => (
          <li
            key={i}
            className="-mx-4 grid gap-x-5 rounded-[var(--radius-lg)] px-4 py-3 transition-colors duration-200 hover:bg-accent/[0.05]"
          >
            <div className="relative border-l border-border pl-6 sm:pl-8">
              <span
                className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-accent ring-4 ring-surface"
                aria-hidden
              />
              <h4 className="mb-0.5 mt-0.5 text-base font-semibold leading-snug text-fg">
                {item.title}
              </h4>
              {item.description ? (
                <p className="m-0 max-w-[52ch] text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              ) : null}
              {item.speaker ? (
                <p className="mt-1 text-sm text-muted/80">
                  {item.speaker}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Modal>
  );
}