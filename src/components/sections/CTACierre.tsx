"use client";

import type { CtaCierreSettings } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export function CTACierre({ ctaCierre }: { ctaCierre: CtaCierreSettings }) {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({
        top: (el as HTMLElement).offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section className="bg-dark text-center">
      <Container className="max-w-[640px] text-center">
        <AnimatedSection animation="fade-up">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Impulsando la categoría dermocosmética en México
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight text-white">
            La industria se encuentra en el Simposio
          </h2>
          <p className="mx-auto my-5 max-w-[52ch] text-[19px] leading-relaxed text-white/55">
            {ctaCierre.description}
          </p>
          <Button variant="primary" size="lg" onClick={() => scrollTo("#registro")}>
            Registrarme ahora
          </Button>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
