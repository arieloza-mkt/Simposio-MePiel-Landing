"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { Edition, Speaker, EditionsModalSettings, EventConfig } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PhotoCarousel } from "./PhotoCarousel";
import { EditionDetailModal } from "./EditionDetailModal";
import { TemarioModal } from "./TemarioModal";
import { EditionLightbox } from "./EditionLightbox";
import { getYoutubeId } from "@/lib/video";
import { withCloudinaryTransform } from "@/lib/image";

interface EdicionPanelProps {
  edition: Edition;
  speakers: Speaker[];
  eventConfig?: EventConfig;
  viewMoreText?: string;
  modalSettings?: EditionsModalSettings;
}

const TERCERA_EDICION_STATS = [
  { value: "8", label: "Conferencias" },
  { value: "13", label: "Laboratorios" },
  { value: "1", label: "Workshop" },
];

const COUNTDOWN_UNITS = [
  { key: "d", label: "Días" },
  { key: "h", label: "Horas" },
  { key: "m", label: "Min" },
  { key: "s", label: "Seg" },
] as const;

export function EdicionPanel({
  edition,
  speakers,
  eventConfig,
  viewMoreText = "Ver detalles",
  modalSettings,
}: EdicionPanelProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [temarioOpen, setTemarioOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;

    const measure = () => {
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slides = edition.images;
  const videoYoutubeId = edition.videoId ? getYoutubeId(edition.videoId) : null;
  const isThirdEdition = edition.ordinal.startsWith("3");

  const [countdown, setCountdown] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  } | null>(null);

  useEffect(() => {
    const compute = () => {
      if (!eventConfig?.startsAt) {
        setCountdown(null);
        return;
      }
      const target = new Date(eventConfig.startsAt).getTime();
      if (Number.isNaN(target)) {
        setCountdown(null);
        return;
      }
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    compute();
    const timer = window.setInterval(compute, 1000);
    return () => window.clearInterval(timer);
  }, [eventConfig?.startsAt]);

  return (
    <div className="absolute inset-0 flex items-center max-md:overflow-y-auto max-md:items-center py-[clamp(48px,8vw,96px)]">
      {edition.videoId ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {videoYoutubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoYoutubeId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                title={`Video de fondo — ${edition.eyebrow} ${edition.ordinal}`}
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[max(56.25vw,100%)] w-[max(100%,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0 brightness-[0.42]"
              />
            ) : (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="pointer-events-none absolute inset-0 h-full w-full object-cover brightness-[0.42]"
              >
                <source src={edition.videoId} type="video/mp4" />
              </video>
            )}
          </div>
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
        <div className="flex h-full flex-col items-center gap-[40px] lg:flex-row lg:items-stretch lg:gap-[clamp(32px,5vw,72px)]">
          <div className="flex w-full flex-col lg:h-full lg:flex-1 lg:justify-center">
            {edition.logoUrl ? (
              <img
                src={withCloudinaryTransform(edition.logoUrl, "fit")}
                alt={`${edition.eyebrow} — ${edition.title}`}
                loading="lazy"
                className="max-h-[clamp(56px,9vw,120px)] w-auto max-w-full object-contain object-left md:max-h-[clamp(72px,10vw,120px)]"
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
            <p
              ref={descriptionRef}
              className={`mt-6 mb-0 whitespace-pre-line text-[17px] leading-relaxed text-white/55 ${
                isThirdEdition ? "" : "line-clamp-4"
              }`}
            >
              {edition.description}
            </p>
            {overflows && !isThirdEdition ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-haspopup="dialog"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-white"
              >
                Leer más
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            ) : null}
            {!isThirdEdition && edition.stats.length > 0 && (
              <div className="mt-[clamp(24px,4vw,56px)] flex items-center justify-center gap-2 sm:gap-6 md:flex-wrap md:gap-[clamp(24px,4vw,48px)]">
                {edition.stats.map((s) => (
                  <div key={s.label} className="min-w-0 flex flex-1 flex-col items-center text-center md:flex-none">
                    <div className="font-display text-[clamp(22px,6.5vw,34px)] font-bold leading-none text-accent md:text-[clamp(64px,8vw,96px)]">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-white/70 leading-tight sm:text-[11px] md:mt-1.5 md:text-[clamp(10px,1.2vw,12px)]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-[clamp(24px,3vw,40px)] flex flex-wrap items-center gap-3">
              {edition.temario.length > 0 && (
                <button
                  onClick={() => setTemarioOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold whitespace-nowrap text-dark transition-all hover:opacity-90 active:translate-y-px max-md:flex-1"
                >
                  Ver temario
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
                </button>
              )}
              {!isThirdEdition && (
                <button
                  onClick={() => setDetailOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-3 text-sm font-medium whitespace-nowrap text-white transition-all hover:border-accent hover:text-accent active:translate-y-px max-md:flex-1"
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
              {isThirdEdition && (
                <a
                  href="#programa"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold whitespace-nowrap text-dark transition-all hover:opacity-90 active:translate-y-px max-md:flex-1"
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

          <div className="min-w-0 flex w-full flex-col gap-[clamp(20px,3vw,32px)] lg:h-full lg:flex-1 lg:justify-center">
            {isThirdEdition ? (
              <>
                <div className="text-center">
                  <h2 className="m-0 font-display text-[clamp(38px,5vw,64px)] leading-[0.95] tracking-[0.02em] text-white">
                    Nos vemos pronto!
                  </h2>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-[clamp(20px,3vw,40px)] py-[clamp(20px,3vw,32px)] backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-[clamp(8px,1.5vw,16px)] sm:gap-[clamp(16px,3vw,32px)]">
                    {countdown ? (
                      COUNTDOWN_UNITS.map((u, i) => (
                        <Fragment key={u.key}>
                          {i > 0 && (
                            <div className="pt-0 font-display text-[clamp(18px,2.5vw,32px)] font-bold leading-none text-accent/60">
                              :
                            </div>
                          )}
                          <div className="flex min-w-0 flex-col items-center text-center">
                            <div className="font-display text-[clamp(30px,4.5vw,60px)] font-bold leading-none text-accent tabular-nums">
                              {String(countdown[u.key]).padStart(2, "0")}
                            </div>
                            <div className="mt-1 text-[10px] uppercase tracking-wide text-white/70 leading-tight sm:text-[11px] md:text-[clamp(10px,1.2vw,12px)]">
                              {u.label}
                            </div>
                          </div>
                        </Fragment>
                      ))
                    ) : (
                      <div className="font-display text-[clamp(30px,4.5vw,60px)] font-bold leading-none text-accent">
                        –
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-[clamp(16px,2.5vw,28px)]">
                  <h3 className="m-0 text-center font-display text-[clamp(28px,3.8vw,44px)] leading-tight tracking-[0.02em] text-white">
                    Lo que nos espera
                  </h3>
                  <div className="flex items-center justify-center gap-2 sm:gap-6 md:flex-wrap md:gap-[clamp(24px,4vw,48px)]">
                    {TERCERA_EDICION_STATS.map((s) => (
                      <div key={s.label} className="min-w-0 flex flex-1 flex-col items-center text-center md:flex-none">
                        <div className="font-display text-[clamp(22px,6.5vw,34px)] font-bold leading-none text-accent md:text-[clamp(48px,6vw,72px)]">
                          {s.value}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wide text-white/70 leading-tight sm:text-[11px] md:mt-1.5 md:text-[clamp(10px,1.2vw,12px)]">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : slides.length > 0 ? (
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
      <EditionLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        edition={edition}
      />
      <TemarioModal
        open={temarioOpen}
        onClose={() => setTemarioOpen(false)}
        edition={edition}
      />
    </div>
  );
}