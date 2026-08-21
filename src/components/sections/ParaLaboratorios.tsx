"use client";

import { LAB_FEATURES } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const ICONS: Record<string, React.ReactNode> = {
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  layers: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></>,
  users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
  activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
  search: <><path d="M21 21H3a1 1 0 01-1-1V4a1 1 0 011-1h18a1 1 0 011 1v16a1 1 0 01-1 1z" /><path d="M7 8h4v4H7z" /><path d="M13 8h4M13 12h4M7 16h10" /></>,
};

export function ParaLaboratorios() {
  return (
    <Section id="para-labs" dark>
      <Container>
        <div className="mb-[56px] max-w-[42ch]">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Para laboratorios y marcas
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight text-white">
            Tu vitrina comercial ante el canal farmacéutico
          </h2>
          <p className="mt-5 max-w-[60ch] text-[19px] leading-relaxed text-white/55">
            Participa como expositor o patrocinador y conecta directamente con los compradores que definen el mix de tu categoría en punto de venta.
          </p>
        </div>

        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-3 gap-[32px] max-md:grid-cols-1">
            {LAB_FEATURES.map((f) => (
              <Card key={f.title} dark>
                <div className="flex flex-col gap-1.5">
                  <div className="mb-5 grid h-9 w-9 place-items-center rounded-[10px] border border-white/8 text-accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-[18px] w-[18px]">
                      {ICONS[f.icon]}
                    </svg>
                  </div>
                  <h3 className="m-0 text-base font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="m-0 text-[15px] leading-relaxed text-white/35">
                    {f.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <div className="mt-[56px] text-center">
          <Button variant="primary" size="lg">
            Quiero ser expositor
          </Button>
        </div>
      </Container>
    </Section>
  );
}
