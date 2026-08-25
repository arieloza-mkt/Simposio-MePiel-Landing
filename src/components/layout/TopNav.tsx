"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { Container } from "./Container";

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");

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

  const overDarkHero = !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-xl border-b border-border shadow-sm"
          : overDarkHero
            ? "bg-transparent"
            : "bg-surface"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between py-3.5">
          <a href="#" className="flex items-center gap-2.5">
            <img
              src="https://res.cloudinary.com/cc4tium7/image/upload/v1787612015/logo-white.svg"
              alt="Simposio Dermocosmético"
              height={56}
              className="h-12 w-auto transition-all duration-300 md:h-14"
            />
          </a>

          <div className="flex items-center gap-2">
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
          })}        </nav>
      )}
    </header>
  );
}
