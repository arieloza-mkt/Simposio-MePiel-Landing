"use client";

import type { Speaker } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SpeakerCarousel } from "@/components/features/SpeakerCarousel";

export function Expositores({
  speakers,
  eyebrow,
  title,
}: {
  speakers: Speaker[];
  eyebrow: string;
  title: string;
}) {
  return (
    <Section id="ponentes" fullHeight dark className="relative overflow-hidden justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://res.cloudinary.com/cc4tium7/image/upload/v1787613330/bg-decor-1.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.1]"
      />
      <Container className="relative z-10 min-w-0">
        <div className="mb-[56px] mx-auto text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            {eyebrow}
          </p>
          <h2 className="max-w-full font-display text-[clamp(26px,4vw,48px)] font-bold leading-[1.25] tracking-tight break-words">
            {title}
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <SpeakerCarousel speakers={speakers} />
        </AnimatedSection>
      </Container>
    </Section>
  );
}
