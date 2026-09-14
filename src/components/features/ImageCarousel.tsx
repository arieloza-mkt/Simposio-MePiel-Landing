"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/cn";

interface ImageCarouselProps {
  slides: string[];
  alt: string;
  aspectClassName?: string;
  className?: string;
  autoplayIntervalMs?: number;
}

export function ImageCarousel({
  slides,
  alt,
  aspectClassName = "aspect-[3/4]",
  className,
  autoplayIntervalMs = 4500,
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const syncInitial = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    queueMicrotask(syncInitial);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || slides.length <= 1) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      emblaApi.scrollNext();
    }, autoplayIntervalMs);
    return () => clearInterval(interval);
  }, [emblaApi, slides.length, autoplayIntervalMs]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-dark-s",
        className,
      )}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((src, i) => (
            <div
              key={i}
              className={`relative min-w-full shrink-0 ${aspectClassName}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={i === 0 ? alt : `${alt} ${i + 1}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 z-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-none bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white max-md:h-11 max-md:w-11"
        aria-label="Anterior"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 z-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-none bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white max-md:h-11 max-md:w-11"
        aria-label="Siguiente"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 z-2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className="grid h-6 w-6 place-items-center rounded-full border-none p-0 transition-colors"
            aria-label={`Foto ${i + 1}`}
            aria-current={i === selectedIndex}
          >
            <span
              aria-hidden
              className={cn(
                "block h-2 w-2 rounded-full transition-colors",
                i === selectedIndex ? "bg-accent" : "bg-white/40",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}