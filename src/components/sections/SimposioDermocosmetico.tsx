"use client";

import type { MepielAlianzaSettings } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ImageCarousel } from "@/components/features/ImageCarousel";

export function SimposioDermocosmetico({
  alianza,
}: {
  alianza: MepielAlianzaSettings;
}) {
  const title = alianza.highlight
    ? alianza.title.split(alianza.highlight)
    : [alianza.title];

  const slides =
    alianza.images && alianza.images.length > 0
      ? alianza.images
      : alianza.imageUrl
        ? [alianza.imageUrl]
        : [];

  const scrollToNext = () => {
    const el = document.querySelector("#acerca");
    if (el) {
      window.scrollTo({
        top: (el as HTMLElement).offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section
      id="alianza"
      className="relative overflow-hidden"
    >
      {/* Formas orgánicas decorativas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-aurora absolute -top-[22%] left-[6%] h-[68vmax] w-[68vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gc)_16%,transparent),transparent_62%)] blur-3xl" />
        <div
          style={{ animationDelay: "-9s" }}
          className="animate-aurora absolute -top-[10%] right-[2%] h-[62vmax] w-[62vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gm)_13%,transparent),transparent_62%)] blur-3xl"
        />
        <div
          style={{ animationDelay: "-17s" }}
          className="animate-aurora absolute -bottom-[34%] left-[24%] h-[58vmax] w-[58vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gp)_12%,transparent),transparent_62%)] blur-3xl"
        />
      </div>

      <Container className="relative z-10">
        {/* Título principal centrado */}
        <AnimatedSection animation="fade-up">
          <div className="mb-[clamp(48px,6vw,88px)] flex flex-col items-center text-center">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {alianza.eyebrow}
            </p>
            <h2 className="m-0 max-w-[22ch] font-display text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.02] tracking-tight">
              {alianza.highlight && title.length > 1 ? (
                <>
                  {title[0]}
                  <span className="text-accent">{alianza.highlight}</span>
                  {title[1]}
                </>
              ) : (
                alianza.title
              )}
            </h2>
          </div>
        </AnimatedSection>

        {/* Texto a la izquierda + galería a la derecha */}
        <div className="grid grid-cols-12 items-center gap-x-[clamp(40px,5vw,80px)] gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <AnimatedSection animation="fade-right">
              <div className="flex flex-col gap-6">
                {alianza.paragraphs.map((text, i) => (
                  <p
                    key={i}
                    className={`m-0 leading-relaxed ${
                      i === 0
                        ? "text-[clamp(17px,2vw,20px)]"
                        : "text-muted"
                    }`}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <AnimatedSection animation="fade-left">
              <div className="relative">
                {slides.length > 0 ? (
                  <ImageCarousel
                    slides={slides}
                    alt={alianza.imageAlt}
                    aspectClassName="aspect-[3/4] md:aspect-[4/3] lg:aspect-[4/3]"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label="Espacio reservado para imágenes"
                    className="grid aspect-[4/3] w-full place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/60"
                  >
                    <p className="m-0 font-mono text-xs uppercase tracking-widest text-muted/60">
                      [Imágenes pendientes]
                    </p>
                  </div>
                )}

                {/* Botón de navegación sobre la galería */}
                <button
                  type="button"
                  onClick={scrollToNext}
                  aria-label="Ir a la siguiente sección"
                  className="absolute -right-3 -top-5 z-3 grid h-14 w-14 place-items-center rounded-full border-none bg-accent text-white shadow-xl shadow-accent/30 transition-transform duration-300 hover:scale-105 hover:shadow-accent/50 active:translate-y-px max-md:h-12 max-md:w-12"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden
                  >
                    <path d="M12 4v16M5 13l7 7 7-7" />
                  </svg>
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </Section>
  );
}