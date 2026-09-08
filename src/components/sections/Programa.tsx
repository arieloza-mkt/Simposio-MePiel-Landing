"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {
  PROGRAMA_DIA_LABEL,
  PROGRAMA_MODO_FORANEOS,
  PROGRAMA_MODO_LOCALES,
  PROGRAMA_VENUE,
  type ProgramaItem,
  type ProgramaItemKind,
  type ProgramaModo,
} from "@/lib/programa";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MODOS: { value: ProgramaModo; label: string }[] = [
  { value: PROGRAMA_MODO_FORANEOS, label: "Foráneos" },
  { value: PROGRAMA_MODO_LOCALES, label: "Locales" },
];

const DAY_ORDER: readonly [1 | 2 | 3, ...(1 | 2 | 3)[]] = [1, 2, 3];

const KIND_ACCENT: Record<ProgramaItemKind, string> = {
  conferencia: "border-program-purple/30 text-program-lilac",
  conversatorio: "border-program-purple/30 text-program-lilac",
  taller: "border-program-cyan/40 text-program-cyan",
  negocios: "border-program-turquoise/40 text-program-turquoise",
  evento: "border-program-orange/40 text-program-orange",
  break: "border-program-lilac/20 text-program-lilac-text",
  comida: "border-program-turquoise/30 text-program-turquoise",
  libre: "border-dashed border-program-lilac/20 text-program-lilac-text",
  logistica: "border-program-turquoise/30 text-program-turquoise",
};

function Timestamp({ item }: { item: ProgramaItem }) {
  if (item.kind === "evento" || item.kind === "logistica") {
    return null;
  }
  return (
    <p
      className={`m-0 w-[74px] shrink-0 pt-[3px] font-mono text-[13px] font-medium leading-snug ${
        item.kind === "libre" || item.kind === "comida"
          ? "text-program-turquoise"
          : item.kind === "break"
            ? "text-program-lilac-text"
            : "text-program-cyan"
      }`}
    >
      {item.end ? `${item.start} – ${item.end}` : `${item.start} · [confirmar]`}
    </p>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 text-program-lilac-text transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8l4 4 4-4" />
    </svg>
  );
}

function DayBand({
  day,
  items,
  open,
  onToggle,
}: {
  day: 1 | 2 | 3;
  items: ProgramaItem[];
  open: boolean;
  onToggle: () => void;
}) {
  const isInfoDay = items.every((item) => item.kind === "logistica");

  return (
    <div className="overflow-hidden rounded-[20px] border border-program-blue/60 bg-gradient-to-b from-program-navy to-program-navy-dark/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`programa-dia-${day}`}
        className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-program-cyan sm:px-6 ${
          open ? "border-b border-program-blue/50" : ""
        }`}
      >
        <span className="flex items-center gap-3">
          <Chevron open={open} />
          <span className="font-display text-[22px] tracking-[0.06em] text-program-white">
            {PROGRAMA_DIA_LABEL[day]}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {items.length > 0 && (
            <span className="rounded-full border border-program-blue/50 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-program-lilac-text">
              {items.length} {items.length === 1 ? "bloque" : "bloques"}
            </span>
          )}
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-program-lilac-text">
            Día {day}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`body-${day}`}
            id={`programa-dia-${day}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            {isInfoDay ? (
              <div className="grid gap-px bg-program-blue/40 sm:grid-cols-3">
                {items.map((item) => (
                  <div key={item.id} className="bg-program-navy/80 p-5">
                    <h4 className="m-0 text-[15px] font-semibold leading-snug text-program-turquoise">
                      {item.title}
                    </h4>
                    {item.nota && (
                      <p className="m-0 mt-2 whitespace-pre-line text-[13px] leading-relaxed text-program-lilac-text">
                        {item.nota}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ol className="m-0 list-none divide-y divide-program-blue/40 p-0">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={`px-5 py-4 sm:px-6 ${
                      item.kind === "libre"
                        ? "opacity-70"
                        : item.kind === "evento"
                          ? "bg-program-orange/[0.06]"
                          : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Timestamp item={item} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h4 className="m-0 text-[15px] font-semibold leading-snug text-program-white">
                            {item.title}
                          </h4>
                          {item.end && item.kind !== "break" && (
                            <span
                              className={`rounded-full border px-2.5 py-[2px] font-mono text-[11px] uppercase tracking-[0.08em] ${KIND_ACCENT[item.kind]}`}
                            >
                              {item.kind}
                            </span>
                          )}
                        </div>
                        {item.nota && (
                          <p className="m-0 mt-1 whitespace-pre-line text-[13px] leading-relaxed text-program-lilac-text">
                            {item.nota}
                          </p>
                        )}
                        {item.speakers && item.speakers.length > 0 && (
                          <ul className="m-0 mt-1.5 list-none space-y-0.5 p-0">
                            {item.speakers.map((s) => (
                              <li
                                key={s}
                                className="text-[13px] text-program-lilac-text"
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {item.salon && (
                        <p className="m-0 hidden shrink-0 font-mono text-[12px] text-program-lilac-text/80 md:block md:text-right">
                          {item.salon}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SALAS_EVENTO =
  "Salas: Plenaria · Agave, Piso 1 · Flex room, Piso 1 · Foyer Plenaria";

export function Programa({ items }: { items: ProgramaItem[] }) {
  const [modo, setModo] = useState<ProgramaModo>(PROGRAMA_MODO_FORANEOS);
  const [openDays, setOpenDays] = useState<Partial<Record<1 | 2 | 3, boolean>>>(
    {},
  );
  const isForaneos = modo === PROGRAMA_MODO_FORANEOS;

  // Lunes 12 es exclusivo de FORÁNEOS (llegada/traslados). En la pestaña
  // LOCALES solo se muestran días con items (Martes y Miércoles).
  const visibleItems = isForaneos
    ? items
    : items.filter((item) => item.modo !== PROGRAMA_MODO_FORANEOS);

  const itemsByDay = (day: 1 | 2 | 3) =>
    visibleItems.filter((item) => item.day === day);

  const daysShown = DAY_ORDER.filter((day) => itemsByDay(day).length > 0);

  const toggleDay = (day: 1 | 2 | 3) =>
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));

  const selectModo = (next: ProgramaModo) => {
    if (next !== modo) {
      setModo(next);
      setOpenDays({});
    }
  };

  return (
    <Section id="programa" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(680px 420px at 12% 0%, rgba(18,189,242,0.16), transparent 60%), radial-gradient(760px 520px at 88% 16%, rgba(141,83,252,0.22), transparent 62%), linear-gradient(180deg, #011049 0%, #00104F 100%)",
        }}
      />
      <Container className="relative max-w-[1080px]">
        <div className="mx-auto mb-[36px] max-w-[54ch] text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-program-cyan">
            Programa
          </p>
          <h2 className="m-0 font-display text-[clamp(38px,7vw,72px)] leading-[0.95] text-program-white">
            3er Simposio
            <br />
            Dermocosmético 2026
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-program-lilac-text">
            Del lunes 12 al miércoles 14 de octubre · {PROGRAMA_VENUE}
            <br />
            <span className="text-program-lilac-text/70">
              Libertad 1823, Col. Americana, 44100 Guadalajara, Jal.
            </span>
          </p>
        </div>

        <div className="mb-[36px] flex justify-center">
          <div
            role="tablist"
            aria-label="Modalidad del programa"
            className="flex w-fit items-center gap-1 rounded-full border border-program-blue bg-program-navy-dark p-1.5"
          >
            {MODOS.map((m) => {
              const active = m.value === modo;
              return (
                <button
                  key={m.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="programa-modo-panel"
                  onClick={() => selectModo(m.value)}
                  className="relative rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-program-cyan sm:px-7"
                >
                  {active && (
                    <motion.span
                      layoutId="programa-modo-pill"
                      transition={{ type: "spring", bounce: 0.22, duration: 0.55 }}
                      className="absolute inset-0 rounded-full bg-program-white"
                    />
                  )}
                  <span
                    className={`relative z-10 uppercase tracking-[0.14em] transition-colors duration-200 ${
                      active ? "text-program-navy" : "text-program-lilac hover:text-program-white"
                    }`}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={modo}
            id="programa-modo-panel"
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="space-y-5"
          >
            <div className="grid gap-5">
              {daysShown.map((day) => (
                <DayBand
                  key={day}
                  day={day}
                  items={itemsByDay(day)}
                  open={Boolean(openDays[day])}
                  onToggle={() => toggleDay(day)}
                />
              ))}
            </div>

            <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-program-lilac-text/70">
              {isForaneos ? PROGRAMA_MODO_FORANEOS : PROGRAMA_MODO_LOCALES} ·{" "}
              {SALAS_EVENTO}
            </p>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-program-lilac-text/60">
          Programa sujeto a cambios · algunos horarios por confirmar
        </p>
      </Container>
    </Section>
  );
}