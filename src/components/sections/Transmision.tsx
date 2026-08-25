"use client";

import { useState } from "react";
import type {
  EventConfig,
  ScheduleItem,
  TransmisionSettings,
} from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CronogramaModal } from "@/components/features/CronogramaModal";

function LiveBadge({ isLive }: { isLive: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-dark-s px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-white/70">
      {isLive ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
          En vivo ahora
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-accent" />
          Disponible el día del evento
        </>
      )}
    </span>
  );
}

const DARK_BUTTON =
  "inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 ease-[var(--ease-out-expo)] hover:border-accent hover:text-accent";

export function Transmision({
  transmision,
  schedule,
  eventConfig,
}: {
  transmision: TransmisionSettings;
  schedule: ScheduleItem[];
  eventConfig: EventConfig;
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const hasStream = Boolean(transmision.videoId) && transmision.isLive;

  return (
    <Section id="transmision" dark className="relative overflow-hidden">
      {transmision.backdropUrl ? (
        <>
          <img
            src={transmision.backdropUrl}
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover blur-md brightness-[0.4]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-dark/55"
            aria-hidden
          />
        </>
      ) : null}

      <Container className="relative">
        <div className="mx-auto mb-[48px] max-w-[52ch] text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            Transmisión en vivo
          </p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.1] tracking-tight text-white">
            {transmision.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[56ch] text-[19px] leading-relaxed text-white/55">
            {transmision.description}
          </p>
        </div>

        <AnimatedSection animation="fade-up" className="mx-auto max-w-[880px]">
          <div className="mb-4 flex justify-center">
            <LiveBadge isLive={transmision.isLive} />
          </div>

          {hasStream ? (
            <div className="relative aspect-video overflow-hidden rounded-[var(--radius-lg)] border border-white/8 bg-black shadow-2xl shadow-black/50">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${transmision.videoId}?rel=0`}
                title="Transmisión en vivo del Simposio Dermocosmético"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="grid aspect-video place-items-center rounded-[var(--radius-lg)] border border-white/8 bg-dark-s/75">
              <div className="flex flex-col items-center gap-5 px-6 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-1 h-6 w-6"
                    aria-hidden
                  >
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
                <div>
                  <p className="m-0 font-display text-lg font-semibold text-white">
                    La transmisión iniciará el día del evento
                  </p>
                  <p className="m-0 mt-1.5 font-mono text-xs uppercase tracking-widest text-white/40">
                    YouTube Live
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {hasStream ? (
              <a
                href={`https://www.youtube.com/watch?v=${transmision.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={DARK_BUTTON}
              >
                Ver en YouTube
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setScheduleOpen(true)}
              className={DARK_BUTTON}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                className="h-4 w-4"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 11h18" />
              </svg>
              Ver cronograma
            </button>
          </div>
        </AnimatedSection>
      </Container>

      <CronogramaModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        items={schedule}
        eventConfig={eventConfig}
      />
    </Section>
  );
}
