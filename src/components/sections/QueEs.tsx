"use client";

import type { QueEsSettings } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { QueEsContent } from "./QueEsContent";

export function QueEs({ queEs }: { queEs: QueEsSettings }) {
  return (
    <Section id="acerca" fullHeight>
      <Container>
        <AnimatedSection animation="fade-up">
          <QueEsContent queEs={queEs} />
        </AnimatedSection>

        <div
          className="mt-[clamp(48px,7vw,88px)] h-px w-full bg-gradient-to-r from-gc via-gm to-gp opacity-35"
          aria-hidden
        />
      </Container>
    </Section>
  );
}
