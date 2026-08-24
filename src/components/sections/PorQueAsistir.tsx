"use client";

import type { Benefit } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const ICONS: Record<string, React.ReactNode> = {
  search: <><path d="M21 21H3a1 1 0 01-1-1V4a1 1 0 011-1h18a1 1 0 011 1v16a1 1 0 01-1 1z" /><path d="M7 8h4v4H7z" /><path d="M13 8h4M13 12h4M7 16h10" /></>,
  users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
  activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
  layers: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></>,
};

export function PorQueAsistir({ benefits }: { benefits: Benefit[] }) {
  return (
    <Section>
      <Container>
        <div className="mb-[56px] max-w-[36ch]">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            ¿Por qué asistir?
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
            Razones concretas para tu negocio
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex flex-col gap-3">
                <div className="h-40 rounded-[var(--radius-lg)] bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))]" />
                <div className="grid h-12 w-12 place-items-center rounded-[var(--radius)] bg-accent/12 text-accent">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
                    {ICONS[b.icon]}
                  </svg>
                </div>
                <h3 className="text-base font-semibold">{b.title}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-muted">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
