"use client";

import { SCHEDULE, type ScheduleTag } from "@/lib/constants";
import { Modal } from "@/components/ui/Modal";

const TAG_COLOR: Record<ScheduleTag, string> = {
  Conferencia: "bg-gc",
  Panel: "bg-gm",
  Networking: "bg-gp",
  Activo: "bg-accent",
  Cierre: "bg-fg",
};

function ScheduleRow({ item }: { item: (typeof SCHEDULE)[number] }) {
  return (
    <li className="group relative -mx-4 grid grid-cols-[56px_1fr] gap-x-5 rounded-[var(--radius-lg)] px-4 pb-8 pt-1 transition-colors duration-200 ease-[var(--ease-out-expo)] last:pb-0 hover:bg-accent/[0.05] sm:grid-cols-[72px_1fr]">
      <div className="pt-0.5 text-right font-mono text-sm tabular-nums text-muted transition-colors duration-200 group-hover:text-accent">
        {item.time}
      </div>

      <div className="relative border-l border-border pl-6 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1 sm:pl-8">
        <span
          className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ring-4 ring-surface transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:scale-125 ${
            TAG_COLOR[item.tag]
          }`}
          aria-hidden
        />
        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors duration-200 group-hover:border-accent/40">
          <span
            className={`mr-1.5 h-1 w-1 rounded-full ${TAG_COLOR[item.tag]}`}
            aria-hidden
          />
          {item.tag}
        </span>
        <h3 className="mb-0.5 mt-2 text-base font-semibold leading-snug">
          {item.title}
        </h3>
        {item.description ? (
          <p className="m-0 max-w-[52ch] text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function CronogramaModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl" label="Cronograma del evento">
      <h3 className="m-0 mb-1.5 font-display text-2xl font-bold tracking-tight">
        Cronograma del evento
      </h3>
      <p className="m-0 mb-6 border-b border-border pb-4 text-[13px] leading-relaxed text-muted">
        Agenda referencial. Los horarios se confirmarán junto con la sede y la
        fecha oficial.
      </p>

      <ol className="m-0 list-none p-0">
        {SCHEDULE.map((item) => (
          <ScheduleRow key={`${item.time}-${item.title}`} item={item} />
        ))}
      </ol>
    </Modal>
  );
}
