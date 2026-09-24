"use client";

import type { MepielAlianzaSettings } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ImageCarousel } from "@/components/features/ImageCarousel";
import { withCloudinaryTransform } from "@/lib/image";

export function SimposioDermocosmetico({
  alianza,
}: {
  alianza: MepielAlianzaSettings;
}) {
  const slides =
    alianza.images && alianza.images.length > 0
      ? alianza.images
      : alianza.imageUrl
        ? [alianza.imageUrl]
        : [];

  return (
    <Section
      id="alianza"
      className="relative overflow-hidden"
    >
      <img
        src={withCloudinaryTransform("https://res.cloudinary.com/cc4tium7/image/upload/v1789679969/alianza_back.png")}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
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
             <h2 className="m-0 max-w-[24ch]  text-[clamp(42px,6vw,78px)] font-black leading-[1.04] tracking-tight uppercase text-[#004496] dark:text-white max-sm:text-[clamp(34px,9vw,44px)]">
              Crecemos juntos <br />
<span className="font-bold lowercase text-6xl max-md:text-5xl max-sm:text-3xl">para llevar la</span> <span className="text-gm font-display text-8xl max-md:text-6xl max-sm:text-5xl">Dermocosmética</span>   <br />
<span className="font-light lowercase text-6xl max-md:text-5xl max-sm:text-3xl">a otro nivel</span>
             </h2>
            
           

          </div>
        </AnimatedSection>

        {/* Texto a la izquierda + galería a la derecha */}
        <div className="flex flex-col items-center gap-y-10 lg:flex-row lg:items-center lg:gap-x-[clamp(40px,5vw,80px)]">
          <div className="w-full lg:flex-[5] max-sm:text-center">
            <AnimatedSection animation="fade-right">
              <div className="flex flex-col gap-6 max-sm:items-center">
                {alianza.paragraphs.map((text, i) => (
                  <div
                    key={i}
                    className="m-0 leading-relaxed text-foreground/70 text-[17px] max-sm:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="w-full lg:flex-[9] lg:min-w-0">
            <AnimatedSection animation="fade-left">
              <div className="relative">
                {slides.length > 0 ? (
                  <ImageCarousel
                    slides={slides}
                    alt={alianza.imageAlt}
                    aspectClassName="max-sm:aspect-[4/5] aspect-[3/4] sm:aspect-[4/3] lg:aspect-[380/450]"
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