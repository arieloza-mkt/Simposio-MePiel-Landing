"use client";

import { useState } from "react";
import type { Edition, Speaker, EditionsModalSettings } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PhotoCarousel } from "./PhotoCarousel";
import { EditionDetailModal } from "./EditionDetailModal";
import { getYoutubeId } from "@/lib/video";

interface EdicionPanelProps {
  edition: Edition;
  speakers: Speaker[];
  viewMoreText?: string;
  modalSettings?: EditionsModalSettings;
}

export function EdicionPanel({
  edition,
  speakers,
  viewMoreText = "Ver más",
  modalSettings,
}: EdicionPanelProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  const slides = edition.images;
  const videoYoutubeId = edition.videoId ? getYoutubeId(edition.videoId) : null;

  return (
    <div className="absolute inset-0 flex items-center max-md:overflow-y-auto max-md:items-center py-[clamp(48px,8vw,96px)]">
      {edition.videoId ? (
        <>
          {videoYoutubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoYoutubeId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
              title={`Video de fondo — ${edition.eyebrow} ${edition.ordinal}`}
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 brightness-[0.42]"
            />
          ) : (
            <video
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.42]"
            >
              <source src={edition.videoId} type="video/mp4" />
            </video>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-dark/60"
            aria-hidden
          />
        </>
      ) : edition.backdropUrl ? (
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
            <div className="mt-[clamp(32px,4vw,56px)] grid grid-cols-3 gap-4 sm:gap-5">
              {edition.stats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <div className="font-display text-[clamp(24px,3vw,32px)] font-bold leading-none text-accent">
                    {s.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/55 leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[clamp(24px,3vw,40px)] flex flex-wrap items-center gap-4">
              {!edition.ordinal.startsWith("3") && (
                <button
                  onClick={() => setDetailOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-all hover:border-accent hover:text-accent active:translate-y-px"
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
              )}
              {edition.ordinal.startsWith("3") && (
                <a
                  href="#programa"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-dark transition-all hover:opacity-90 active:translate-y-px"
                >
                  Ver programa
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="min-w-0 flex flex-col gap-[clamp(20px,3vw,32px)]">
            {slides.length > 0 ? (
              <PhotoCarousel images={slides} className="max-md:aspect-[16/10]" />
            ) : null}
          </div>
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
