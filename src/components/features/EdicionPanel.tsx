"use client";

import { EDITIONS } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { PhotoCarousel } from "./PhotoCarousel";

interface EdicionPanelProps {
  edition: (typeof EDITIONS)[number];
}

export function EdicionPanel({ edition }: EdicionPanelProps) {
  return (
    <div className="absolute inset-0 flex items-center py-[clamp(48px,8vw,96px)]">
      <Container className="w-full">
        <div className="items-center gap-[clamp(32px,5vw,72px)] grid grid-cols-2 max-md:grid-cols-1 max-md:gap-[40px]">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
              {edition.eyebrow}
            </p>
            <div className="font-display text-[clamp(56px,8vw,88px)] font-bold leading-[0.95] tracking-tight text-accent">
              {edition.ordinal}
            </div>
            <div className="mt-2 font-display text-[clamp(24px,3vw,32px)] font-bold text-white">
              {edition.title}
            </div>
            <p className="mt-6 mb-0 text-[17px] leading-relaxed text-white/55">
              {edition.description}
            </p>
            <div className="mt-[clamp(32px,4vw,56px)] grid grid-cols-3 gap-5 max-sm:gap-3">
              {edition.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[clamp(24px,3vw,32px)] font-bold leading-none text-accent">
                    {s.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/55 leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {edition.video ? (
            <div className="relative grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-[var(--radius-lg)] border border-white/8 bg-dark-s">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(46,197,232,.10), transparent 60%)",
                }}
                aria-hidden
              />
              <div className="relative text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-accent/50 bg-accent/12 text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-1 h-6 w-6"
                    aria-hidden
                  >
                    <path d="M8 5.14v13.72L19 12 8 5.14z" />
                  </svg>
                </div>
                <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-white/55">
                  Video de la edición próximamente
                </p>
              </div>
            </div>
          ) : (
            <PhotoCarousel
              images={edition.images}
              className="max-md:aspect-[16/10]"
            />
          )}
        </div>
      </Container>
    </div>
  );
}
