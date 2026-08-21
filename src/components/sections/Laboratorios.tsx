"use client";

import { LABS } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { LogoCarousel } from "@/components/features/LogoCarousel";

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
          <LogoCarousel items={[...LABS]} label="Laboratorios participantes" />
        </AnimatedSection>
      </Container>
    </Section>
  );
}
