"use client";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const EXPERIENCE_ITEMS = [
  {
    icon: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </>
    ),
    text: "Actualización profesional sobre tendencias y novedades en dermocosmética.",
  },
  {
    icon: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0014 0M12 18v3" />
      </>
    ),
    text: "Conferencias y contenidos especializados con expertos de la industria.",
  },
  {
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
      </>
    ),
    text: "Nuevas perspectivas comerciales y profesionales para fortalecer tu práctica.",
  },
  {
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </>
    ),
    text: "Espacios de networking con otros profesionales y líderes del sector.",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" />
      </>
    ),
    text: "Una experiencia exclusiva diseñada para reconocer y fortalecer la relación con nuestros mejores aliados.",
  },
] as const;

export function QueEs() {
  return (
    <Section id="acerca">
      <Container>
        <AnimatedSection animation="fade-up">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Qué es el Simposio
          </p>
          <h2 className="m-0 max-w-[24ch] font-display text-[clamp(34px,4.8vw,62px)] font-bold leading-[1.04] tracking-tight">
            Más que un evento, una experiencia para{" "}
            <span className="text-accent">conectar y crecer</span>
          </h2>
        </AnimatedSection>

        <div className="mt-[clamp(44px,6vw,80px)] grid grid-cols-12 gap-x-[clamp(40px,5vw,80px)] gap-y-[clamp(36px,5vw,56px)]">
          <div className="col-span-12 flex flex-col lg:col-span-7">
            <AnimatedSection animation="fade-up">
              <p className="m-0 max-w-[58ch] text-[19px] leading-relaxed text-muted">
                El Simposio Dermocosmético reúne a especialistas, líderes de
                opinión y profesionales de la industria en un espacio diseñado
                para compartir conocimiento, descubrir nuevas tendencias y
                generar conexiones de valor.
              </p>
              <p className="mb-0 mt-8 font-display text-lg font-semibold">
                Durante esta experiencia podrás disfrutar de:
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" className="mt-5">
              <ul className="m-0 list-none border-y border-border p-0">
                {EXPERIENCE_ITEMS.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 border-b border-border py-4 transition-colors last:border-b-0 hover:bg-accent/[0.04]"
                  >
                    <span className="w-7 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent"
                      aria-hidden
                    >
                      {item.icon}
                    </svg>
                    <span className="text-[15px] leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <AnimatedSection animation="fade-right" className="h-full">
              <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1112&auto=format&fit=crop"
                alt="Edición anterior del Simposio Dermocosmético"
                loading="lazy"
                className="aspect-[3/4] w-full rounded-[var(--radius-lg)] border border-border object-cover"
              />
            </AnimatedSection>
          </div>
        </div>

        <div
          className="mt-[clamp(48px,7vw,88px)] h-px w-full bg-gradient-to-r from-gc via-gm to-gp opacity-35"
          aria-hidden
        />
      </Container>
    </Section>
  );
}
