"use client";

import { ATTENDEE_TYPES } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const CHIP_ICONS: Record<string, React.ReactNode> = {
  building: <><path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6" /></>,
  grid: <><path d="M9 3h6v6H9zM3 9h6v6H3zM15 9h6v6h-6zM9 15h6v6H9z" /></>,
  user: <><circle cx="12" cy="7" r="4" /><path d="M5.5 21c0-3.5 3-6.5 6.5-6.5s6.5 3 6.5 6.5" /></>,
  clock: <><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 6v6l4 2" /></>,
  box: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></>,
};

export function QueEs() {
  return (
    <Section id="acerca">
      <Container>
        <div className="items-center gap-[clamp(40px,6vw,80px)] grid grid-cols-2 max-md:grid-cols-1">
          <AnimatedSection animation="fade-left">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
              Qué es el Simposio
            </p>
            <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
              El punto de encuentro comercial de la categoría dermocosmética
            </h2>
            <p className="mt-5 max-w-[60ch] text-[19px] leading-relaxed text-muted">
              El Simposio Dermocosmético reúne a los actores clave del canal farmacéutico y dermocosmético: dueños y compradores de farmacia, gerentes de categoría, equipos de trade marketing, distribuidores, laboratorios y dermatólogos prescriptores.
            </p>
            <p className="mt-3 max-w-[60ch] text-[19px] leading-relaxed text-muted">
              En una jornada intensiva de networking, conocimiento y demos de punto de venta, los asistentes acceden a inteligencia de categoría, tendencias de shopper y oportunidades comerciales que no encuentran en ningún otro foro del sector.
            </p>

            <div className="mt-8">
              <p className="mb-3 font-mono text-[14px] font-semibold uppercase tracking-widest text-muted">
                ¿Quiénes asisten?
              </p>
              <div className="flex flex-wrap gap-3">
                {ATTENDEE_TYPES.map((t) => (
                  <span
                    key={t.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-[7px] text-sm font-medium text-fg"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4 shrink-0">
                      {CHIP_ICONS[t.icon]}
                    </svg>
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-right">
            <div className="aspect-[16/9] w-full rounded-[var(--radius-lg)] border border-border bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))] grid place-items-center font-mono text-xs tracking-widest text-muted">
              [Foto evento - 16:9]
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <div className="aspect-square rounded-[var(--radius-lg)] border border-border bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))] grid place-items-center font-mono text-xs tracking-widest text-muted">
                [Foto 1]
              </div>
              <div className="aspect-square rounded-[var(--radius-lg)] border border-border bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))] grid place-items-center font-mono text-xs tracking-widest text-muted">
                [Foto 2]
              </div>
            </div>
          </AnimatedSection>
        </div>
      </Container>
    </Section>
  );
}
