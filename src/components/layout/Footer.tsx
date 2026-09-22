import type { FooterSettings } from "@/lib/content";
import { Container } from "./Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-3 font-mono text-[13px] font-semibold uppercase tracking-widest text-white">
        {title}
      </p>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="relative w-fit text-[14px] text-white/55 transition-colors hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 after:ease-[var(--ease-out-expo)] hover:after:w-full"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function Footer({ settings }: { settings: FooterSettings }) {
  return (
    <footer className="relative overflow-hidden bg-dark py-[clamp(40px,6vw,56px)] text-[13px] text-muted">
      <div
        aria-hidden
        className="animate-gradient-flow pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,var(--color-gc),var(--color-gm),var(--color-gp),transparent)]"
      />
       <Container className="relative z-10">
        <div className="flex flex-row items-center justify-between gap-[clamp(16px,3vw,56px)]" id="footer-top">
          <div className="max-w-[720px] text-center md:text-left">
            <p className="mb-[18px] font-mono text-xs font-bold uppercase tracking-[0.35em] text-white/80">
              Impulsando
            </p>
            <h2 className="m-0 font-display text-[clamp(28px,4.5vw,72px)] font-bold uppercase leading-[1.02] tracking-tight">
              <span className="block bg-[linear-gradient(90deg,#3ee9e6,#6fb8ff)] bg-clip-text text-transparent">
                La categoría
              </span>
              <span className="block bg-[linear-gradient(90deg,#6a5cf0,#8b7bf0)] bg-clip-text text-transparent">
                Dermocosmética
              </span>
            </h2>
            <p className="mt-[6px] font-mono text-[clamp(13px,1.4vw,26px)] font-bold uppercase tracking-[0.25em] text-[#cfd6ff]">
              En México
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/cc4tium7/image/upload/v1787612015/logo-white.svg"
              alt="Simposio Dermocosmético"
              loading="lazy"
              decoding="async"
              className="h-auto w-[clamp(140px,26vw,420px)]"
            />
          </div>
        </div>
      </Container>
      <br />
      <hr />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/cc4tium7/image/upload/v1787613333/bg-footer-decor.svg')",
          backgroundRepeat: "repeat",
        }}
      />
<Container className="relative z-10">
        <AnimatedSection animation="fade-up">
          <div className="mb-[40px] flex flex-col gap-[40px] text-[14px] md:gap-[56px]">
        

        <div className="flex flex-col gap-[40px] sm:flex-row sm:flex-wrap md:gap-[56px]">
          <FooterColumn title="Evento" links={settings.eventLinks} className="w-full sm:flex-1" />
          <FooterColumn title="Ediciones Anteriores" links={settings.participateLinks} className="w-full sm:flex-1" />
          <FooterColumn title="Contacto" links={settings.contactLinks} className="w-full sm:flex-1" />
        </div>
      </div>
        </AnimatedSection>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/8 pt-8">
          <span className="text-[13px] text-white/35">
            {settings.copyright}
          </span>
          <a href={settings.privacyLinkUrl} className="text-[13px] text-white/35 transition-colors hover:text-white">
            {settings.privacyLinkText}
          </a>
        </div>
      </Container>
    </footer>
  );
}
