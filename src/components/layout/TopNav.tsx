"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { useTheme } from "@/lib/theme-provider";
import { scrollToEdition } from "@/lib/editions-nav";
import { Container } from "./Container";

export function TopNav({ editions }: { editions?: { ordinal: string }[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const { mode, setMode, resolve } = useTheme();
  const resolved = resolve();

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

  const goToEdition = (index: number) => {
    setMobileOpen(false);
    scrollToEdition(index);
  };

  const overDarkHero = !scrolled && resolved === "dark";

  const toggleTheme = () => {
    setMode(resolved === "dark" ? "light" : "dark");
  };

  const isDark = resolved === "dark";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-[padding] duration-500 ease-[var(--ease-out-expo)] ${
          scrolled ? "px-[6%] pt-2 lg:px-[10%]" : "px-0 pt-0"
        }`}
      >
        <div
          className={`w-full transition-[border-radius,border-color,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
            scrolled
              ? "rounded-2xl border border-border bg-surface/60 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl backdrop-saturate-150"
              : overDarkHero
                ? "rounded-none border-0 bg-transparent shadow-none"
                : "rounded-none border-0 bg-surface shadow-none"
          }`}
        >
          <Container>
            <div className={`flex items-center justify-between transition-[padding] duration-500 ease-[var(--ease-out-expo)] ${
              scrolled ? "px-8 py-3" : "px-6 py-4 sm:px-8"
            }`}>
          <a href="#" className="flex items-center gap-2.5">
            <img
              src={isDark
                ? "https://res.cloudinary.com/cc4tium7/image/upload/v1787612015/logo-white.svg"
                : "https://res.cloudinary.com/cc4tium7/image/upload/v1787681794/logo-color.svg"}
              alt="Simposio Dermocosmético"
              height={96}
              className="h-20 w-auto transition-all duration-300 md:h-24"
            />
          </a>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1.5 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeHref === link.href;
              if (link.href === "#ediciones") {
                return (
                  <div key={link.href} className="group relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(link.href);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex items-center gap-1 rounded-full px-4 py-2 text-base transition-all duration-300 ${
                        isActive
                          ? "bg-accent/15 font-medium text-accent"
                          : overDarkHero
                            ? "text-white/70 hover:bg-white/10 hover:text-white"
                            : "text-fg hover:bg-accent/10 hover:text-accent"
                      }`}
                    >
                      {link.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" aria-hidden>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="min-w-[190px] overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-xl shadow-black/20">
                        {editions && editions.length > 0 ? (
                          editions.map((edition, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => goToEdition(index)}
                              className="block w-full rounded-lg px-3 py-2 text-left text-base transition-colors hover:bg-accent/10 hover:text-accent"
                            >
                              {edition.ordinal} edición
                            </button>
                          ))
                        ) : (
                          <span className="block px-3 py-2 text-sm text-muted">
                            Sin ediciones
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-full px-4 py-2 text-base transition-all duration-300 ${
                    isActive
                      ? "bg-accent/15 font-medium text-accent"
                      : `${
                          overDarkHero
                            ? "text-white/70 hover:bg-white/10 hover:text-white"
                            : "text-fg hover:bg-accent/10 hover:text-accent"
                        }`
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

            <button
              onClick={toggleTheme}
              className={`grid h-9 w-9 place-items-center rounded-full border transition-colors max-md:h-11 max-md:w-11 ${
                overDarkHero
                  ? "border-white/15 text-white/70 hover:border-accent hover:text-accent"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
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
          </div>
            </div>
          </Container>
        </div>
      </div>

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
          {editions && editions.length > 0 && (
            <div>
              <p className="mb-1 mt-3 block border-t border-border px-0 pt-3 font-mono text-xs uppercase tracking-widest text-muted">
                Ediciones
              </p>
              {editions.map((edition, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToEdition(index)}
                  className="block w-full border-b border-border py-3 text-left text-base transition-colors last:border-b-0 hover:text-accent"
                >
                  {edition.ordinal} edición
                </button>
              ))}
            </div>
          )}        </nav>
      )}
    </header>
  );
}
