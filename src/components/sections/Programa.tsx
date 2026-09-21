"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PdfButton } from "@/components/programa/PdfButton";
import { ProgramaModal } from "@/components/programa/ProgramaModal";
import { KIND_ICON } from "@/components/programa/styles";
import {
  PROGRAMA_DIA_LABEL,
  PROGRAMA_ICON_BY_KIND,
  PROGRAMA_MODO_FORANEOS,
  PUBLIC_DAYS,
  getProgramaIcon,
  type ProgramaItem,
  type ProgramaItemKind,
  type ProgramaModo,
} from "@/lib/programa";

const KIND_ORDER: Record<ProgramaItemKind, number> = {
  evento: 0,
  negocios: 1,
  conferencia: 2,
  conversatorio: 3,
  taller: 4,
  break: 5,
  comida: 6,
  libre: 7,
  logistica: 8,
};

function highlights(day: 1 | 2 | 3, items: ProgramaItem[]): ProgramaItem[] {
  const pool = items.filter(
    (i) => i.day === day && (i.start || i.kind === "logistica"),
  );
  return pool
    .sort(
      (a, b) =>
        KIND_ORDER[a.kind] - KIND_ORDER[b.kind] ||
        a.start.localeCompare(b.start),
    )
    .slice(0, 3);
}

export function Programa({ items }: { items: ProgramaItem[] }) {
  const [openDay, setOpenDay] = useState<1 | 2 | 3 | null>(null);
  const [modo, setModo] = useState<ProgramaModo>(PROGRAMA_MODO_FORANEOS);

  const openModal = (day: 1 | 2 | 3) => {
    setModo(PROGRAMA_MODO_FORANEOS);
    setOpenDay(day);
  };

  return (
    <Section id="programa" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(680px 420px at 12% 0%, color-mix(in srgb, var(--color-program-cyan) 16%, transparent), transparent 60%), radial-gradient(760px 520px at 88% 16%, color-mix(in srgb, var(--color-program-purple) 22%, transparent), transparent 62%), linear-gradient(180deg, var(--color-program-navy-dark) 0%, var(--color-program-navy) 100%)",
        }}
      />

      <Container className="relative max-w-[1080px]">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-[54ch] text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-program-cyan">
            Programa
          </p>
          <h2 className="m-0 font-display text-[clamp(38px,7vw,72px)] leading-[0.95] text-program-white">
            3er Simposio
            <br />
            Dermocosmético 2026
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-program-lilac-text">
            Del lunes 12 al miércoles 14 de octubre · La Casa de los Abanicos
            <br />
            <span className="text-program-lilac-text/70">
              Libertad 1823, Col. Americana, 44100 Guadalajara, Jal.
            </span>
          </p>
        </div>

        {/* Day cards (horizontal scroll-snap) */}
        <div className="-mx-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:pb-0">
          <div className="flex gap-4 px-5 sm:px-0">
            {PUBLIC_DAYS.map((day) => {
              const count = items.filter((i) => i.day === day).length;
              const featured = highlights(day, items);
              const extra = Math.max(
                0,
                count -
                  items.filter((i) => i.day === day && i.kind === "logistica").length -
                  featured.length,
              );
              return (
                <button
                  key={day}
                  type="button"
                  aria-label={`Ver programa día ${PROGRAMA_DIA_LABEL[day]}`}
                  onClick={() => openModal(day)}
                  className="w-[80vw] max-w-[360px] snap-start rounded-3xl border border-program-blue/60 bg-gradient-to-b from-program-navy to-program-navy-dark p-5 text-left transition-colors hover:border-program-cyan/40 focus-visible:outline-2 focus-visible:outline-program-cyan sm:flex-1 sm:max-w-none sm:p-6"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2.5">
                    <span className="font-display text-[18px] tracking-[0.06em] text-program-white">
                      {PROGRAMA_DIA_LABEL[day]}
                    </span>
                    <span className="rounded-full border border-program-blue/50 px-2.5 py-[2px] font-mono text-[11px] uppercase tracking-[0.14em] text-program-lilac-text">
                      {count} {count === 1 ? "bloque" : "bloques"}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {featured.map((item) => {
                      const Icon = getProgramaIcon(
                        item.icon || PROGRAMA_ICON_BY_KIND[item.kind],
                      );
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-2.5"
                        >
                          <span
                            aria-hidden
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${KIND_ICON[item.kind]}`}
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                          </span>
                          <span className="min-w-0 text-[13px] leading-snug text-program-lilac-text line-clamp-2">
                            {item.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {extra > 0 && (
                    <p className="mt-3 font-mono text-[11px] text-program-lilac-text/70">
                      +{extra} {extra === 1 ? "más" : "más"}
                    </p>
                  )}

                  <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-program-cyan">
                    Ver día →
                  </span>
                </button>
              );
            })}

            {/* Teaser Miércoles */}
            {(() => {
              const day3Count = items.filter((i) => i.day === 3).length;
              return (
                <div
                  aria-disabled
                  className="w-[80vw] max-w-[360px] snap-start rounded-3xl border border-dashed border-program-blue/30 bg-program-navy/40 p-5 opacity-60 sm:flex-1 sm:max-w-none sm:p-6"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2.5">
                    <span className="font-display text-[18px] tracking-[0.06em] text-program-white/70">
                      {PROGRAMA_DIA_LABEL[3]}
                    </span>
                    <span className="rounded-full border border-program-blue/30 px-2.5 py-[2px] font-mono text-[11px] uppercase tracking-[0.14em] text-program-lilac-text/60">
                      {day3Count} actividades
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2.5 text-program-lilac-text/50">
                    <Lock className="h-4 w-4" />
                    <span className="text-[14px]">Próximamente</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => openModal(2)}
            className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-program-cyan to-program-purple px-8 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 sm:h-14"
          >
            Ver programa completo
          </button>
          <PdfButton className="sm:h-14" />
        </div>

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-program-lilac-text/60">
          Programa sujeto a cambios · algunos horarios por confirmar
        </p>
      </Container>

      <ProgramaModal
        open={openDay !== null}
        onClose={() => setOpenDay(null)}
        modo={modo}
        onModoChange={setModo}
      />
    </Section>
  );
}