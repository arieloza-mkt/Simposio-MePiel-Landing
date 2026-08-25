"use client";

import { GALLERY_ITEMS } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function Galeria() {
  return (
    <Section>
      <Container>
        <div className="mb-[40px] sm:mb-[56px]">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Galería de ediciones anteriores
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
            Momentos que definen al Simposio
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-[var(--radius-lg)]"
              >
                <div className="aspect-[16/9] w-full border-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_12%,transparent),color-mix(in_srgb,var(--color-fg)_6%,transparent))] grid place-items-center font-mono text-xs tracking-widest text-muted">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
