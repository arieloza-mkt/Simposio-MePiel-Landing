"use client";

import { useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { Speaker } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const AUTOPLAY_DELAY = 3500;

function NavButtons() {
  const swiper = useSwiper();
  const base =
    "absolute top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-dark/55 text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent max-md:h-8 max-md:w-8";
  return (
    <>
      <button
        type="button"
        onClick={() => swiper.slidePrev()}
        aria-label="Anterior"
        className={`${base} left-3`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => swiper.slideNext()}
        aria-label="Siguiente"
        className={`${base} right-3`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </>
  );
}

export function SpeakerCarousel({ speakers }: { speakers: Speaker[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (speakers.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <p className="m-0 font-mono text-xs uppercase tracking-widest text-muted">
          [PENDIENTE: ponentes por confirmar]
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="relative">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          loop={true}
          autoplay={{
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1536: { slidesPerView: 6 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full"
        >
          {speakers.map((speaker) => (
            <SwiperSlide key={speaker.id} className="h-auto py-1">
              <figure className="m-0 flex h-full w-full flex-col">
                {speaker.imageUrl ? (
                  <img
                    src={speaker.imageUrl}
                    alt={`Retrato de ${speaker.name}`}
                    loading="lazy"
                    className="mb-4 aspect-[4/5] w-full rounded-[var(--radius-lg)] border border-border object-cover"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="mb-4 grid aspect-[4/5] w-full place-items-center rounded-[var(--radius-lg)] border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_12%,transparent),color-mix(in_srgb,var(--color-fg)_6%,transparent))] font-display text-[clamp(28px,3vw,40px)] font-bold text-accent/70"
                  >
                    {initials(speaker.name)}
                  </div>
                )}
                <figcaption>
                  <div className="mb-1 text-[15px] font-semibold leading-snug">
                    {speaker.name}
                  </div>
                  {speaker.role ? (
                    <div className="text-sm leading-snug text-muted">
                      {speaker.role}
                      {speaker.company ? ` · ${speaker.company}` : ""}
                    </div>
                  ) : null}
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
        <NavButtons />
      </div>

      <div className="mt-8 flex items-center justify-center">
        <div className="flex gap-1.5">
          {speakers.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === activeIndex ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
