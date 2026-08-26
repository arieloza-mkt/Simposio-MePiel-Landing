"use client";

import type { Lab } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { LogoCarousel } from "@/components/features/LogoCarousel";

export function Laboratorios({
  labsList,
  eyebrow,
  title,
}: {
  labsList: Lab[];
  eyebrow: string;
  title: string;
}) {
  return (
    <Section id="laboratorios" fullHeight className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://res.cloudinary.com/cc4tium7/image/upload/v1787613326/bg-decor-2.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-auto max-w-full object-contain opacity-[0.12]"
      />
      <Container className="relative z-10">
        <div className="mb-[56px] mx-auto text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            {eyebrow}
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
            {title}
          </h2>
        </div>

        <AnimatedSection animation="fade-up">
          <LogoCarousel
            items={labsList.map((lab) => ({
              name: lab.name,
              image: lab.imageUrl,
            }))}
            label={eyebrow}
          />
        </AnimatedSection>
      </Container>
    </Section>
  );
}
