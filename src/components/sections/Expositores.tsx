"use client";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SpeakerCarousel } from "@/components/features/SpeakerCarousel";

export function Expositores() {
  return (
    <Section>
      <Container>
        <div className="mb-[56px] max-w-[36ch]">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Expositores y speakers
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
            Líderes de la industria compartiendo su experiencia
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <SpeakerCarousel />
        </AnimatedSection>
      </Container>
    </Section>
  );
}
