import type { MepielAlianzaSettings } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { withCloudinaryTransform } from "@/lib/image";

export function MepielAlianza({ alianza }: { alianza: MepielAlianzaSettings }) {
  const title = alianza.highlight
    ? alianza.title.split(alianza.highlight)
    : [alianza.title];

  return (
    <Section id="alianza" fullHeight className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withCloudinaryTransform("https://res.cloudinary.com/cc4tium7/image/upload/v1787608569/bg-elemnts-01.png")}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.1]"
      />
      <Container className="relative z-10">
        <div className="grid grid-cols-12 items-center gap-x-[clamp(40px,5vw,80px)] gap-y-[clamp(36px,5vw,56px)]">
          <div className="col-span-12 lg:col-span-5">
            <AnimatedSection animation="fade-right" className="h-full">
              {alianza.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={alianza.imageUrl}
                  alt={alianza.imageAlt}
                  loading="lazy"
                  className="aspect-[3/4] w-full rounded-[var(--radius-lg)] border border-border object-cover"
                />
              ) : (
                <div
                  role="img"
                  aria-label="Espacio reservado para imagen"
                  className="grid aspect-[3/4] w-full place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/40"
                >
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10 text-muted/60"
                      aria-hidden
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <p className="m-0 font-mono text-xs uppercase tracking-widest text-muted/60">
                      [Imagen pendiente]
                    </p>
                  </div>
                </div>
              )}
            </AnimatedSection>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <AnimatedSection animation="fade-up">
              <h2 className="m-0 sm:max-w-lg max-w-xl font-display text-[clamp(42px,5.5vw,72px)] font-black uppercase leading-[1.06] tracking-tight">
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
            </AnimatedSection>

            <AnimatedSection animation="fade-up" className="mt-[clamp(28px,3vw,44px)]">
              <div className="flex sm:max-w-lg max-w-lg flex-col gap-5">
                {alianza.paragraphs.map((text, i) => (
                  <div
                    key={i}
                    className="m-0 leading-relaxed text-foreground/70 text-[17px]"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </Section>
  );
}
