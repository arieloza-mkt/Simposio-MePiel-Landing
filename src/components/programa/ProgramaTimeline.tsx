"use client";

import {
  PROGRAMA_DIA_LABEL,
  PROGRAMA_ICON_BY_KIND,
  PROGRAMA_MODOS,
  PUBLIC_DAYS,
  getProgramaIcon,
  PROGRAMA_MODO_FORANEOS,
  type ProgramaItem,
  type ProgramaModo,
} from "@/lib/programa";
import { KIND_ICON, KIND_PILL } from "./styles";

function LogisticaCard({ item }: { item: ProgramaItem }) {
  return (
    <div className="rounded-2xl border border-program-cyan/20 bg-program-cyan/[0.06] p-4 transition-colors hover:border-program-cyan/30">
      {[
        getProgramaIcon(item.icon || PROGRAMA_ICON_BY_KIND[item.kind]),
      ].map((Icon) => (
        <span
          key="icon"
          className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-program-cyan/20 text-program-cyan"
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
      ))}
      <h4 className="m-0 text-[15px] font-semibold leading-snug text-program-white">
        {item.title}
      </h4>
      {item.nota && (
        <p className="m-0 mt-2 whitespace-pre-line text-[13px] leading-relaxed text-program-lilac-text">
          {item.nota}
        </p>
      )}
    </div>
  );
}

function LogisticaChip({ item }: { item: ProgramaItem }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-program-cyan/15 bg-program-cyan/[0.06] px-3 py-2.5 transition-colors hover:border-program-cyan/25">
      {[
        getProgramaIcon(item.icon || PROGRAMA_ICON_BY_KIND[item.kind]),
      ].map((Icon) => (
        <span
          key="icon"
          className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-program-cyan/20 text-program-cyan"
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>
      ))}
      <div>
        <h4 className="m-0 text-[14px] font-semibold leading-snug text-program-white">
          {item.title}
        </h4>
        {item.nota && (
          <p className="m-0 mt-1 text-[12px] leading-relaxed text-program-lilac-text">
            {item.nota}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProgramaTimeline({
  items,
  modo,
  onModoChange,
}: {
  items: ProgramaItem[];
  modo: ProgramaModo;
  onModoChange: (m: ProgramaModo) => void;
}) {
  const isForaneos = modo === PROGRAMA_MODO_FORANEOS;

  // Un solo programa: en LOCALES se ocultan los ítems de transporte.
  const visibleItems = isForaneos
    ? items
    : items.filter((item) => item.modo !== PROGRAMA_MODO_FORANEOS);

  const itemsByDay = (day: 1 | 2 | 3) =>
    visibleItems.filter((item) => item.day === day);

  const daysShown = PUBLIC_DAYS.filter((day) => itemsByDay(day).length > 0);

  return (
    <div className="relative">
      {/* Tabs */}
      <div className="mb-6 flex justify-center">
        <div
          role="tablist"
          aria-label="Modalidad del programa"
          className="flex w-fit items-center gap-1 rounded-full border border-program-blue bg-program-navy-dark p-1.5"
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
                className="relative rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-program-cyan sm:px-7"
              >
                {active && (
                  <span className="absolute inset-0 rounded-full bg-program-white" />
                )}
                <span
                  className={`relative z-10 uppercase tracking-[0.14em] transition-colors duration-200 ${
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
      </div>

      {/* Day chips */}
      <nav aria-label="Saltar al día" className="mb-8 flex flex-wrap justify-center gap-2">
        {daysShown.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() =>
              document
                .getElementById(`programa-dia-${day}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="rounded-full border border-program-blue/50 bg-program-navy-dark/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-program-lilac-text transition-colors hover:border-program-cyan/50 hover:text-program-white"
          >
            {PROGRAMA_DIA_LABEL[day]}
          </button>
        ))}
      </nav>

      {/* Day sections */}
      <div className="space-y-10">
        {daysShown.map((day) => {
          const dayItems = itemsByDay(day);
          const logistica = dayItems.filter((i) => i.kind === "logistica");
          const timed = dayItems.filter((i) => i.kind !== "logistica");

          return (
            <section key={day} id={`programa-dia-${day}`} className="scroll-mt-28">
              {/* Day header */}
              <div className="relative mb-5 overflow-hidden rounded-3xl border border-program-blue/60 bg-gradient-to-br from-program-blue/40 via-program-navy to-program-navy-dark p-6 sm:p-8">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-4 bottom-0 font-display text-[100px] leading-none text-program-blue/20 sm:-right-6 sm:text-[120px]"
                >
                  {day}
                </span>
                <h3 className="relative z-10 font-display text-[clamp(24px,5vw,36px)] tracking-[0.06em] text-program-white">
                  {PROGRAMA_DIA_LABEL[day]}
                </h3>
                <p className="relative z-10 mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-program-lilac-text">
                  {dayItems.length}{" "}
                  {dayItems.length === 1 ? "bloque" : "bloques"}
                  {isForaneos && logistica.length > 0
                    ? ` · ${logistica.length} logistics`
                    : ""}
                </p>
              </div>

              {/* Llegada exclusiva (Lunes / solo logística) */}
              {logistica.length > 0 && timed.length === 0 && (
                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                  {logistica.map((item) => (
                    <LogisticaCard key={item.id} item={item} />
                  ))}
                </div>
              )}

              {/* Timeline + chips mix (Martes) */}
              {timed.length > 0 && (
                <ol className="relative mb-4 before:absolute before:left-[60px] before:top-2 before:bottom-2 before:w-[2px] before:rounded-full before:bg-gradient-to-b before:from-program-cyan/60 before:via-program-purple/40 before:to-transparent sm:before:left-[80px]">
                  {logistica.length > 0 && (
                    <li className="relative mb-4 flex gap-3 sm:gap-4">
                      <div className="w-14 shrink-0 sm:w-[72px]" />
                      <div className="min-w-0 flex-1 -mt-2 space-y-2">
                        {logistica.map((item) => (
                          <LogisticaChip key={item.id} item={item} />
                        ))}
                      </div>
                    </li>
                  )}

                  {timed.map((item) => (
                    <li
                      key={item.id}
                      className="group relative mb-4 flex gap-3 rounded-2xl py-1 transition-colors hover:bg-white/[0.02] sm:gap-4"
                    >
                      <div className="w-14 shrink-0 pt-[3px] text-right sm:w-[72px]">
                        {item.start && (
                          <span className="block font-mono text-[13px] font-semibold leading-none tabular-nums text-program-cyan">
                            {item.start}
                          </span>
                        )}
                        {item.end && (
                          <span className="mt-1 block font-mono text-[11px] leading-none tabular-nums text-program-lilac-text/70">
                            {item.end}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 py-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {[
                            getProgramaIcon(
                              item.icon || PROGRAMA_ICON_BY_KIND[item.kind],
                            ),
                          ].map((Icon) => (
                            <span
                              key="icon"
                              aria-hidden
                              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${KIND_ICON[item.kind]}`}
                            >
                              <Icon className="h-4 w-4" strokeWidth={2} />
                            </span>
                          ))}

                          <h4 className="m-0 text-[15px] font-semibold leading-snug text-program-white transition-colors duration-200 group-hover:text-white">
                            {item.title}
                          </h4>

                          <span
                            className={`rounded-full border px-2.5 py-[2px] font-mono text-[10px] uppercase tracking-[0.08em] transition-transform duration-200 group-hover:scale-105 ${KIND_PILL[item.kind]}`}
                          >
                            {item.kind}
                          </span>
                        </div>

                        {item.nota && (
                          <p className="m-0 mt-1 whitespace-pre-line text-[13px] leading-relaxed text-program-lilac-text">
                            {item.nota}
                          </p>
                        )}

                        {item.speakers && item.speakers.length > 0 && (
                          <ul className="m-0 mt-1.5 list-none space-y-0.5 p-0 text-[13px] text-program-lilac-text">
                            {item.speakers.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {item.salon && (
                        <p className="m-0 hidden shrink-0 font-mono text-[12px] text-program-lilac-text/80 md:block md:text-right">
                          {item.salon}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              )}

              {/* Empty state note for day1 when LOCALES (not reachable because daysShown filters) */}
            </section>
          );
        })}
      </div>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-program-lilac-text/60">
        Programa sujeto a cambios · algunos horarios por confirmar
      </p>
    </div>
  );
}