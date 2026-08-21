"use client";

import { LABS } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function Laboratorios() {
  return (
    <Section id="laboratorios">
      <Container>
        <div className="mb-[56px] max-w-[36ch]">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Laboratorios participantes
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
            Las marcas que lideran la categoría
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <div className="grid items-center gap-5 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] max-sm:grid-cols-2">
            {LABS.map((lab) => (
              <div
                key={lab.name}
                className="group flex h-20 items-center justify-center rounded-full border border-border bg-surface px-6 transition-all hover:border-accent hover:shadow-md"
              >
                <img
                  src={lab.image}
                  alt={lab.name}
                  className="max-h-10 max-w-[120px] object-contain opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 dark:brightness-0 dark:invert dark:opacity-80"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
