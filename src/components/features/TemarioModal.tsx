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
               {item.speaker ? (
                <h3 className="mt-0.5 text-lg font-bold leading-relaxed">
                  {item.speaker}
                </h3>
              ) : null}
               <h4 className="mb-1 mt-0.5 text-base font-normal leading-snug text-fg">
                {item.title}
              </h4>
              {item.description ? (
                <p className="m-0 text-sm font-light leading-snug text-muted stext-fg">
                  {item.description}
                </p>
              ) : null}
            
            </div>
          </li>
        ))}
      </ol>
    </Modal>
  );
}