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

  const titleLines = alianza.titleLines?.length
    ? alianza.titleLines
    : null;

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
             <h2 className="m-0 max-w-[24ch]  text-[clamp(32px,5vw,64px)] font-bold leading-[1.04] tracking-tight">
              Crecemos juntos <br />
para llevar la <span className="text-gm font-display font-3xl">Dermocosmética</span>   <br />
a otro nivel
             </h2>
            
           

          </div>
        </AnimatedSection>

        {/* Texto a la izquierda + galería a la derecha */}
        <div className="grid grid-cols-12 items-center gap-x-[clamp(40px,5vw,80px)] gap-y-10">
          <div className="col-span-12 lg:col-span-4">
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

          <div className="col-span-12 lg:col-span-8">
            <AnimatedSection animation="fade-left">
              <div className="relative">
                {slides.length > 0 ? (
                  <ImageCarousel
                    slides={slides}
                    alt={alianza.imageAlt}
                    aspectClassName="aspect-[3/4] sm:aspect-[4/3] lg:aspect-[380/450]"
                    slidesPerView={1}
                    slidesPerViewSm={2}
                    slidesPerViewLg={3}
                    slidesPerGroup={1}
                    spaceBetween={20}
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
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </Section>
  );
}