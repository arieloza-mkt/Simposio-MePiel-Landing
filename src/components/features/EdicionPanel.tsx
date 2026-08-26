"use client";

import { useState } from "react";
import type { Edition, Speaker, EditionsModalSettings } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PhotoCarousel } from "./PhotoCarousel";
import { EditionDetailModal } from "./EditionDetailModal";

interface EdicionPanelProps {
  edition: Edition;
  speakers: Speaker[];
  viewMoreText?: string;
  modalSettings?: EditionsModalSettings;
}

export function EdicionPanel({ edition, speakers, viewMoreText = "Ver más", modalSettings }: EdicionPanelProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center py-[clamp(48px,8vw,96px)]">
      {edition.backdropUrl ? (
        <>
          <img
            src={edition.backdropUrl}
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.32]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-dark/55"
            aria-hidden
          />
        </>
      ) : null}
      <Container className="relative w-full">
        <div className="items-center gap-[clamp(32px,5vw,72px)] grid grid-cols-2 max-md:grid-cols-1 max-md:gap-[40px]">
          <div>
            {edition.logoUrl ? (
              <img
                src={edition.logoUrl}
                alt={`${edition.eyebrow} — ${edition.title}`}
                loading="lazy"
                className="max-h-[clamp(72px,10vw,120px)] w-auto max-w-full object-contain object-left"
              />
            ) : (
              <>
                <div className="font-display text-[clamp(56px,8vw,88px)] font-bold leading-[0.95] tracking-tight text-accent">
                  {edition.ordinal}
                </div>
                <div className="mt-2 font-display text-[clamp(24px,3vw,32px)] font-bold text-white">
                  {edition.title}
                </div>
              </>
            )}
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
            <button
              onClick={() => setDetailOpen(true)}
              className="group mt-[clamp(24px,3vw,40px)] inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-accent hover:text-accent active:translate-y-px"
            >
              {viewMoreText}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform duration-150 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {edition.videoId ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-lg)] border border-white/8 bg-black shadow-2xl shadow-black/40">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${edition.videoId}?rel=0`}
                title={`Video de la ${edition.ordinal} edición`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
              />
            </div>
          ) : (
            <PhotoCarousel
              images={edition.images}
              className="max-md:aspect-[16/10]"
            />
          )}
        </div>
      </Container>

      <EditionDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        edition={edition}
        speakers={speakers}
        modalSettings={modalSettings}
      />
    </div>
  );
}
