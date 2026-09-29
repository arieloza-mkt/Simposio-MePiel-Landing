"use client";

import { useEffect } from "react";
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
    "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-dark/55 text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent max-md:h-11 max-md:w-11";
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

function AutoplayGuard() {
  const swiper = useSwiper();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp = () => {
      if (swiper.autoplay) {
        if (mq.matches || document.hidden) swiper.autoplay.stop();
        else swiper.autoplay.start();
      }
    };
    mq.addEventListener?.("change", clamp);
    document.addEventListener("visibilitychange", clamp);
    clamp();
    return () => {
      mq.removeEventListener?.("change", clamp);
      document.removeEventListener("visibilitychange", clamp);
    };
  }, [swiper]);

  return null;
}

export function SpeakerCarousel({
  speakers,
  perView,
}: {
  speakers: Speaker[];
  perView?: number;
}) {

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
          slidesPerView={perView ?? 1}
          spaceBetween={16}
          loop={true}
          autoplay={{
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={
            perView
              ? undefined
              : {
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }
          }
          className="w-full"
        >
          {speakers.map((speaker) => (
            <SwiperSlide key={speaker.id} className="h-auto py-1">
              <figure className="group m-0 flex h-full w-full flex-col transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1.5">
                {speaker.imageUrl ? (
                  <img
                    src={speaker.imageUrl}
                    alt={`Retrato de ${speaker.name}`}
                    loading="lazy"
                    className="mb-4 aspect-[4/5] w-full rounded-[var(--radius-lg)] border border-border object-cover transition-colors duration-300 group-hover:border-accent/50"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="mb-4 grid aspect-[4/5] w-full place-items-center rounded-[var(--radius-lg)] border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_12%,transparent),color-mix(in_srgb,var(--color-fg)_6%,transparent))] font-display text-[clamp(28px,3vw,40px)] font-bold text-accent/70 transition-colors duration-300 group-hover:border-accent/50"
                  >
                    {initials(speaker.name)}
                  </div>
                )}
                <figcaption>
                  <div className="mb-1 text-[15px] font-semibold leading-snug transition-colors duration-300 group-hover:text-accent">
                    {speaker.name}
                  </div>
                     {speaker.role ? (
                    <div className="text-sm leading-snug text-muted">
                      {speaker.role}
                    </div>
                  ) : null}
                  {speaker.company ? (
                    <div className="mb-1 text-sm leading-snug text-muted">
                      {speaker.company}
                    </div>
                  ) : null}
               
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
          <AutoplayGuard />
          <NavButtons />
        </Swiper>
      </div>
    </div>
  );
}
