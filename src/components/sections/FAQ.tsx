"use client";

import { FAQ_ITEMS } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Accordion } from "@/components/ui/Accordion";

export function FAQ() {
  return (
    <Section id="faq">
      <Container className="max-w-[800px]">
        <div className="mx-auto mb-[56px] max-w-[36ch] text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
            Todo lo que necesitas saber
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <Accordion
            items={FAQ_ITEMS.map((item) => ({
              question: item.question,
              answer: item.answer,
            }))}
          />
        </AnimatedSection>
      </Container>
    </Section>
  );
}
