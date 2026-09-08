"use client";

import { useEffect, useState } from "react";
import type { EventConfig, ScheduleItem } from "@/lib/content";
import { Modal } from "@/components/ui/Modal";

const TAG_COLOR: Record<string, string> = {
  Conferencia: "bg-gc",
  Panel: "bg-gm",
  Networking: "bg-gp",
  Activo: "bg-accent",
  Cierre: "bg-fg",
};

export type ItemStatus = "pasado" | "actual" | "proximo";

export function zonedNow(tz: string): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const minutes =
    Number.parseInt(get("hour"), 10) * 60 + Number.parseInt(get("minute"), 10);
  return { date, minutes };
}

function toMinutes(time: string): number {
  const [h = "0", m = "0"] = time.split(":");
  return Number.parseInt(h, 10) * 60 + Number.parseInt(m, 10);
}

export function getItemStatuses(
  items: ScheduleItem[],
  eventConfig: EventConfig,
  now: { date: string; minutes: number },
): ItemStatus[] {
  const eventDate = eventConfig.startsAt.slice(0, 10);
  if (now.date < eventDate) return items.map(() => "proximo");
  if (now.date > eventDate) return items.map(() => "pasado");

  const starts = items.map((item) => toMinutes(item.time));
  return items.map((_, i) => {
    const start = starts[i] ?? 0;
    const end = i + 1 < items.length ? (starts[i + 1] ?? start + 60) : start + 90;
    if (now.minutes >= end) return "pasado";
    if (now.minutes >= start) return "actual";
    return "proximo";
  });
}

export function ScheduleRow({
  item,
  status,
}: {
  item: ScheduleItem;
  status: ItemStatus;
}) {
  return (
    <li
      className={`group relative -mx-4 grid grid-cols-[56px_1fr] gap-x-5 rounded-[var(--radius-lg)] px-4 pb-8 pt-1 transition-all duration-300 ease-[var(--ease-out-expo)] last:pb-0 sm:grid-cols-[72px_1fr] ${
        status === "actual"
          ? "bg-accent/[0.07]"
          : status === "pasado"
            ? "opacity-40 saturate-[0.4]"
            : "hover:bg-accent/[0.05]"
      }`}
      data-status={status}
    >
      <div
        className={`pt-0.5 text-right font-mono text-sm tabular-nums transition-colors duration-200 ${
          status === "pasado"
            ? "text-muted/70"
            : "text-muted group-hover:text-accent"
        }`}
      >
        {item.time}
      </div>

      <div
        className={`relative border-l border-border pl-6 transition-transform duration-200 ease-[var(--ease-out-expo)] sm:pl-8 ${
          status === "pasado" ? "" : "group-hover:translate-x-1"
        }`}
      >
        <span
          className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ring-4 ring-surface ${TAG_COLOR[item.tag] ?? "bg-accent"} ${
            status === "actual"
              ? "scale-150 shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
              : ""
          } group-hover:scale-125`}
          aria-hidden
        />
        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span
            className={`mr-1.5 h-1 w-1 rounded-full ${TAG_COLOR[item.tag] ?? "bg-accent"}`}
            aria-hidden
          />
          {item.tag}
        </span>
        {status === "actual" ? (
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent align-middle">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            En curso
          </span>
        ) : null}
        <h3
          className={`mb-0.5 mt-2 text-base leading-snug ${
            status === "pasado" ? "font-normal text-muted line-through decoration-border" : "font-semibold"
          }`}
        >
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
  items,
  eventConfig,
}: {
  open: boolean;
  onClose: () => void;
  items: ScheduleItem[];
  eventConfig: EventConfig;
}) {
  const [statuses, setStatuses] = useState<ItemStatus[]>(() =>
    items.map(() => "proximo"),
  );

  useEffect(() => {
    if (!open) return;
    const update = () =>
      setStatuses(getItemStatuses(items, eventConfig, zonedNow(eventConfig.timezone)));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [open, items, eventConfig]);

  return (
    <Modal open={open} onClose={onClose} className="max-w-4xl" label="Cronograma del evento">
      <h3 className="m-0 mb-1.5 font-display text-2xl font-bold tracking-tight">
        Cronograma del evento
      </h3>
      <p className="m-0 mb-6 border-b border-border pb-4 text-[13px] leading-relaxed text-muted">
        {eventConfig.dateLabel} · {eventConfig.venueLabel}. Los horarios se
        confirmarán junto con la sede y la fecha oficial.
      </p>

      <ol className="m-0 list-none p-0">
        {items.map((item, i) => (
          <ScheduleRow key={item.id} item={item} status={statuses[i] ?? "proximo"} />
        ))}
      </ol>
    </Modal>
  );
}
