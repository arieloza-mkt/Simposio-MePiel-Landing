import type { FooterSettings } from "@/lib/content";
import { Container } from "./Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
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
          <div className="mb-[40px] grid gap-[40px] text-[14px] sm:grid-cols-2 md:grid-cols-4 md:gap-[56px]">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="mb-5 flex items-center gap-2.5">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Simposio Dermocosmético"
                height={44}
                className="h-11 w-auto"
                loading="lazy"
              />
            )}
          </div>
          <p className="max-w-[32ch] text-[14px] leading-relaxed text-white/55">
            {settings.description}
          </p>
        </div>

        <FooterColumn title="Evento" links={settings.eventLinks} />
        <FooterColumn title="Participa" links={settings.participateLinks} />
        <FooterColumn title="Contacto" links={settings.contactLinks} />
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
