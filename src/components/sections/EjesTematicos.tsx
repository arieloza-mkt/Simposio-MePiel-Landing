"use client";

import { TRACKS } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function EjesTematicos() {
  return (
    <Section id="ejes-tematicos">
      <Container>
        <div className="mb-[56px] max-w-[42ch]">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Ejes temáticos
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
            Contenido especializado para cada rol del canal
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-2 gap-[24px] max-md:grid-cols-1 lg:grid-cols-3 lg:gap-[32px]">
            {TRACKS.map((t) => (
              <div
                key={t.num}
                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-7"
              >
                <span className="font-display text-[clamp(28px,3vw,36px)] font-bold leading-none tracking-tight text-accent">
                  {t.num}
                </span>
                <h3 className="m-0 text-[17px] font-semibold leading-snug">
                  {t.title}
                </h3>
                <p className="m-0 text-[14px] leading-relaxed text-muted">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
