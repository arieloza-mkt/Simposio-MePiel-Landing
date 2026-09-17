"use client";

import { useEffect, useId, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { cn } from "@/lib/cn";
import { useFancybox } from "@/components/ui/Fancybox";

const AUTOPLAY_DELAY = 4500;

interface ImageCarouselProps {
  slides: string[];
  alt: string;
  aspectClassName?: string;
  className?: string;
  autoplayIntervalMs?: number;
  slidesPerView?: number;
  slidesPerViewSm?: number;
  slidesPerViewLg?: number;
  slidesPerGroup?: number;
  spaceBetween?: number;
  showDots?: boolean;
}

function NavButtons() {
  const swiper = useSwiper();
  const base =
    "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-none bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white max-md:h-11 max-md:w-11";
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

function Dots({ slides }: { slides: string[] }) {
  const swiper = useSwiper();
  const [active, setActive] = useState(() => swiper.realIndex);

  useEffect(() => {
    const sync = (s: typeof swiper) => setActive(s.realIndex);
    swiper.on("realIndexChange", sync);
    return () => {
      swiper.off("realIndexChange", sync);
    };
  }, [swiper]);

  return (
    <div className="absolute bottom-3 left-1/2 z-2 flex -translate-x-1/2 gap-1.5">
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => swiper.slideTo(i)}
          className="grid h-6 w-6 place-items-center rounded-full border-none p-0 transition-colors"
          aria-label={`Foto ${i + 1}`}
          aria-current={i === active}
        >
          <span
            aria-hidden
            className={cn(
              "block h-2 w-2 rounded-full transition-colors",
              i === active ? "bg-accent" : "bg-white/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ImageCarousel({
  slides,
  alt,
  aspectClassName = "aspect-[3/4]",
  className,
  autoplayIntervalMs = AUTOPLAY_DELAY,
  slidesPerView = 1,
  slidesPerViewSm,
  slidesPerViewLg,
  slidesPerGroup = 1,
  spaceBetween = 20,
  showDots = true,
}: ImageCarouselProps) {
  const fancyboxRef = useFancybox<HTMLDivElement>();
  const group = useId();

  if (slides.length === 0) return null;

  const breakpoints: Record<number, { slidesPerView: number }> = {};
  if (slidesPerViewSm) breakpoints[640] = { slidesPerView: slidesPerViewSm };
  if (slidesPerViewLg) breakpoints[1024] = { slidesPerView: slidesPerViewLg };

  const maxSlidesPerView = Math.max(
    slidesPerView,
    slidesPerViewSm ?? 0,
    slidesPerViewLg ?? 0,
  );
  const loopEnabled = slides.length > 1;

  return (
    <div
      ref={fancyboxRef}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)]",
        className,
      )}
    >
      <Swiper
        modules={[Autoplay]}
        loop={loopEnabled}
        loopAdditionalSlides={loopEnabled ? maxSlidesPerView : 0}
        slidesPerView={slidesPerView}
        slidesPerGroup={slidesPerGroup}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        autoplay={{
          delay: autoplayIntervalMs,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="w-full"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i} className={cn("h-auto", aspectClassName)}>
            <a
              href={src}
              data-fancybox={group}
              data-caption={i === 0 ? alt : `${alt} ${i + 1}`}
              className="absolute inset-0 block cursor-zoom-in overflow-hidden rounded-[var(--radius-lg)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={i === 0 ? alt : `${alt} ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </a>
          </SwiperSlide>
        ))}
        <AutoplayGuard />
        <NavButtons />
        {showDots && <Dots slides={slides} />}
      </Swiper>
    </div>
  );
}