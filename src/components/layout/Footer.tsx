import { Container } from "./Container";

const EVENT_LINKS = [
  { label: "Acerca del Simposio", href: "#acerca" },
  { label: "Ediciones anteriores", href: "#ediciones" },
  { label: "Ejes temáticos", href: "#ejes-tematicos" },
  { label: "Preguntas frecuentes", href: "#faq" },
];

const PARTICIPATE_LINKS = [
  { label: "Registro de asistentes", href: "#registro" },
  { label: "Ser expositor", href: "#para-labs" },
  { label: "Patrocinadores", href: "#para-labs" },
];

const CONTACT_LINKS = [
  { label: "contacto@simposiodermocosmetico.com", href: "mailto:contacto@simposiodermocosmetico.com" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-dark py-[clamp(40px,6vw,56px)] text-[13px] text-muted">
      <Container>
        <div className="mb-[40px] grid gap-[40px] text-[14px] sm:grid-cols-2 md:grid-cols-4 md:gap-[56px]">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="mb-5 flex items-center gap-2.5">
              <img
                src="/logo-vertical-no-edit-1.png"
                alt="Simposio Dermocosmético"
                height={44}
                className="h-11 w-auto brightness-0 invert"
                loading="lazy"
              />
            </div>
            <p className="max-w-[32ch] text-[14px] leading-relaxed text-white/55">
              El encuentro comercial más relevante de la industria dermocosmética en México.
            </p>
          </div>

          <FooterColumn title="Evento" links={EVENT_LINKS} />
          <FooterColumn title="Participa" links={PARTICIPATE_LINKS} />
          <FooterColumn title="Contacto" links={CONTACT_LINKS} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/8 pt-8">
          <span className="text-[13px] text-white/35">
            © 2026 Simposio Dermocosmético. Todos los derechos reservados.
          </span>
          <a href="#" className="text-[13px] text-white/35 transition-colors hover:text-white">
            Aviso de privacidad
          </a>
        </div>
      </Container>
    </footer>
  );
}

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
            className="text-[14px] text-white/55 transition-colors hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
