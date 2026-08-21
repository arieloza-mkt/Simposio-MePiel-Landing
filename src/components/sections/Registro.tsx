"use client";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { RegistrationForm } from "@/components/features/RegistrationForm";

export function Registro() {
  return (
    <Section id="registro">
      <Container>
        <div className="items-center gap-[clamp(40px,6vw,80px)] grid grid-cols-2 max-md:grid-cols-1">
          <AnimatedSection animation="fade-left">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
              Registro
            </p>
            <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight">
              Asegura tu lugar en la 3a edición
            </h2>
            <p className="mt-5 max-w-[60ch] text-[19px] leading-relaxed text-muted">
              Completa el formulario y nuestro equipo revisará tu registro. Te
              confirmaremos tu asistencia por correo electrónico una vez validado
              tu perfil profesional.
            </p>
            <div className="mt-8 rounded-[var(--radius-lg)] border border-accent bg-accent/12 p-5">
              <p className="m-0 text-[14px]">
                <strong>Proceso de validación:</strong> El Simposio es un evento
                B2B con aforo limitado. Cada registro es revisado por nuestro
                equipo para garantizar una audiencia cualificada de profesionales
                del canal dermocosmético.
              </p>
            </div>
            <div className="mt-8">
              <p className="mb-3 font-mono text-[14px] font-semibold uppercase tracking-widest text-muted">
                ¿Tienes dudas?
              </p>
              <a
                href="#faq"
                className="inline-flex items-center gap-2 border-none bg-transparent px-2 py-0 text-fg transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Consulta nuestras preguntas frecuentes
                <span className="transition-transform duration-150 hover:translate-x-0.5" aria-hidden>
                  →
                </span>
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-right">
            <RegistrationForm />
          </AnimatedSection>
        </div>
      </Container>
    </Section>
  );
}
