"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RegistrationForm } from "@/components/features/RegistrationForm";
import { useTheme } from "@/lib/theme-provider";

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const pos = window.scrollY + 96;
      let current = "";
      for (const link of NAV_LINKS) {
        const el = document.querySelector(link.href) as HTMLElement | null;
        if (el && el.offsetTop <= pos) current = link.href;
      }
      setActiveHref(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({
        top: (el as HTMLElement).offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  const overDarkHero = !scrolled && theme === "dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-xl border-b border-border shadow-sm"
          : overDarkHero
            ? "bg-transparent"
            : "bg-white"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between py-3.5">
          <a href="#" className="flex items-center gap-2.5">
            <img
              src="/logo-vertical-no-edit-1.png"
              alt="Simposio Dermocosmético"
              height={56}
              className={`h-12 w-auto transition-all duration-300 md:h-14 ${
                overDarkHero ? "brightness-0 invert" : ""
              }`}
            />
          </a>

          <nav className="hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative py-1 text-sm transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300 after:ease-[var(--ease-out-expo)] after:content-[''] ${
                    isActive
                      ? "text-accent after:scale-x-100"
                      : `after:scale-x-0 hover:text-accent hover:after:scale-x-100 ${
                          overDarkHero ? "text-white/70" : "text-fg"
                        }`
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                overDarkHero
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-border text-fg hover:bg-border/50"
              }`}
              aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-[18px] w-[18px]">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            <button
              className={`grid h-11 w-11 place-items-center rounded-full border-none bg-transparent md:hidden transition-colors ${
                overDarkHero ? "text-white" : "text-fg"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
              aria-expanded={mobileOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6">
                {mobileOpen ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="6" y1="18" x2="18" y2="6" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>

            <Button
              variant="primary"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => setRegisterOpen(true)}
            >
              Registrarme
            </Button>
          </div>
        </div>
      </Container>

      {mobileOpen && (
        <nav className="border-b border-border bg-surface px-8 py-4 md:hidden">
          {NAV_LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                aria-current={isActive ? "true" : undefined}
                className={`block border-b border-border py-3 text-base last:border-b-0 transition-colors hover:text-accent ${
                  isActive ? "font-semibold text-accent" : "text-fg"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="mt-4">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                setMobileOpen(false);
                setRegisterOpen(true);
              }}
            >
              Registrarme
            </Button>
          </div>
        </nav>
      )}

      <Modal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        label="Formulario de registro"
        className="max-w-2xl"
      >
        <RegistrationForm />
      </Modal>
    </header>
  );
}
