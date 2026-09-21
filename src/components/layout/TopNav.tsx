"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { useTheme } from "@/lib/theme-provider";
import { scrollToEdition } from "@/lib/editions-nav";
import { Container } from "./Container";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";

export function TopNav({ editions }: { editions?: { ordinal: string }[] }) {
  const [fullMenuOpen, setFullMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const [edicionesOpen, setEdicionesOpen] = useState(false);
  const { mode, setMode, resolve } = useTheme();
  const resolved = resolve();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setFullMenuOpen(false);
    setEdicionesOpen(false);
    hamburgerRef.current?.focus();
  }, []);

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullMenuOpen) {
        closeMenu();
      }
    };
    if (fullMenuOpen) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [fullMenuOpen, closeMenu]);

  const scrollTo = (href: string) => {
    closeMenu();
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({
        top: (el as HTMLElement).offsetTop - 50,
        behavior: "smooth",
      });
    }
  };

  const goToEdition = (index: number) => {
    closeMenu();
    scrollToEdition(index);
  };

  const isDark = resolved === "dark";
  const overDarkHero = !scrolled;
  const overDark = overDarkHero || isDark || fullMenuOpen;

  const toggleTheme = () => {
    setMode(resolved === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`relative z-50 transition-[padding] duration-500 ease-[var(--ease-out-expo)] ${
          scrolled ? "px-[6%] lg:px-[10%]" : "px-0 pt-0"
        }`}
      >
<div
          className={`w-full transition-[border-radius,border-color,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
            fullMenuOpen
              ? "rounded-none border-0 bg-transparent shadow-none"
              : scrolled
                ? "rounded-b-xl md:rounded-xl border border-border bg-surface/90 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md backdrop-saturate-150 dark:border-white/10 dark:bg-dark/90 dark:shadow-none"
                : overDarkHero
                  ? "rounded-none border-0 bg-transparent shadow-none"
                  : "rounded-none border-0 bg-surface shadow-none"
          }`}
        >
          <Container>
            <div className={`flex items-center justify-between transition-[padding] duration-500 ease-[var(--ease-out-expo)] ${
              scrolled ? "px-6 py-1.5" : "px-4 py-2 sm:px-6"
            }`}>
          <a href="#" className="flex items-center gap-2.5">
            <img
              src={overDark
                ? "https://res.cloudinary.com/cc4tium7/image/upload/v1787612015/logo-white.svg"
                : "https://res.cloudinary.com/cc4tium7/image/upload/v1787681794/logo-color.svg"}
              alt="Simposio Dermocosmético"
              height={72}
              className="h-12 w-auto transition-all duration-300 md:h-14"
            />
          </a>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
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
                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-accent/15 font-medium text-accent"
                          : overDark
                            ? "text-white/70 hover:bg-white/10 hover:text-white"
                            : "text-fg hover:bg-accent/10 hover:text-accent"
                      }`}
                    >
                      {link.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" aria-hidden>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-1.5 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="min-w-[190px] overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-xl shadow-black/20">
                        {editions && editions.length > 0 ? (
                          editions.map((edition, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => goToEdition(index)}
                              className="block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent/10 hover:text-accent"
                            >
                              {edition.ordinal} edición
                            </button>
                          ))
                        ) : (
                          <span className="block px-3 py-1.5 text-sm text-muted">
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
                  className={`rounded-full px-3 py-1.5 text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-accent/15 font-medium text-accent"
                      : `${
                          overDark
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
              className={`grid h-7 w-7 place-items-center rounded-full border transition-colors max-md:h-9 max-md:w-9 ${
                overDark
                  ? "border-white/15 text-white/70 hover:border-accent hover:text-accent"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px]">
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px]">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            <button
              ref={hamburgerRef}
              className={`grid h-10 w-10 place-items-center rounded-full border-none bg-transparent md:hidden transition-colors ${
                overDark ? "text-white" : "text-fg"
              }`}
              onClick={() => {
                setEdicionesOpen(false);
                setFullMenuOpen(!fullMenuOpen);
              }}
              aria-label="Menú"
              aria-expanded={fullMenuOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6">
                {fullMenuOpen ? (
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

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-dark text-white transition-[transform,visibility] duration-[400ms] ease-[var(--ease-out-expo)] md:hidden",
          fullMenuOpen ? "visible translate-y-0" : "invisible -translate-y-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!fullMenuOpen}
      >
        <div className="flex min-h-full flex-col items-center justify-center gap-3 px-8 py-24">
          {NAV_LINKS.map((link) => {
            const isActive = activeHref === link.href;
            if (link.href === "#ediciones") {
              return (
                <div key={link.href} className="w-full max-w-[340px]">
                  <button
                    type="button"
                    onClick={() => setEdicionesOpen((v) => !v)}
                    aria-expanded={edicionesOpen}
                    className="flex w-full items-center justify-center gap-3 py-3 font-display text-[clamp(30px,8.5vw,48px)] uppercase text-white transition-colors hover:text-accent"
                  >
                    {link.label}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-5 w-5 transition-transform duration-300 ${
                        edicionesOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-expo)]",
                      edicionesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col items-center gap-1 border-t border-white/10 pt-4">
                        {editions && editions.length > 0 ? (
                          editions.map((edition, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                onClick={() => goToEdition(index)}
                                className="px-4 py-2 font-display text-[clamp(30px,8.5vw,48px)] uppercase text-white/70 transition-colors hover:text-accent"
                              >
                                {edition.ordinal} edición
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 font-display text-[clamp(30px,8.5vw,48px)] uppercase text-white/40">Sin ediciones</li>
                        )}
                      </ul>
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
                className="py-3 font-display text-[clamp(30px,8.5vw,48px)] uppercase text-white transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
