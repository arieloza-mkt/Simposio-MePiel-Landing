"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface LogoCarouselProps {
  items: { name: string; image: string }[];
  label: string;
}

export function LogoCarousel({ items, label }: LogoCarouselProps) {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 2000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [autoplay],
  );

  const scrollPrev = useCallback(() => {
    autoplay.stop();
    emblaApi?.scrollPrev();
  }, [emblaApi, autoplay]);

  const scrollNext = useCallback(() => {
    autoplay.stop();
    emblaApi?.scrollNext();
  }, [emblaApi, autoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const onPointerDown = () => autoplay.stop();
    emblaApi.on("pointerDown", onPointerDown);
    return () => {
      emblaApi.off("pointerDown", onPointerDown);
    };
  }, [emblaApi, autoplay]);

  return (
    <div
      className="group relative flex items-center gap-4 max-sm:gap-2"
      role="region"
      aria-label={label}
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.play()}
    >
      {/* Arrow left */}
      <button
        onClick={scrollPrev}
        aria-label="Anterior"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent sm:h-10 sm:w-10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Carousel — 5 logos visibles */}
      <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex items-center">
          {items.map((item) => (
            <div
              key={item.name}
className="min-w-0 shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 px-3"
              >
                <div className="flex h-12 w-full max-w-[200px] items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full w-auto max-w-full object-contain dark:brightness-0 dark:invert"
                    loading="lazy"
                  />
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow right */}
      <button
        onClick={scrollNext}
        aria-label="Siguiente"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent sm:h-10 sm:w-10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
