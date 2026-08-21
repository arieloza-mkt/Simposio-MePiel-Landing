"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { LABS } from "@/lib/constants";

export function SpeakerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {LABS.map((lab) => (
            <div
              key={lab.name}
              className="min-w-0 shrink-0 basis-1/4 px-3 text-center max-lg:basis-1/2 max-sm:basis-full"
            >
              <div className="mb-3 grid aspect-square w-full place-items-center rounded-full border border-border bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))] p-8">
                <img
                  src={lab.image}
                  alt={lab.name}
                  className="max-h-full max-w-full object-contain dark:brightness-0 dark:invert"
                  loading="lazy"
                />
              </div>
              <div className="text-[15px] font-semibold mb-0.5">{lab.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={selectedIndex === 0}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-fg transition-colors hover:border-accent hover:bg-accent/12 disabled:pointer-events-none disabled:opacity-35"
          aria-label="Anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2 w-2 rounded-full border-none p-0 transition-colors ${
                i === selectedIndex ? "bg-accent" : "bg-border"
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={selectedIndex === scrollSnaps.length - 1}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-fg transition-colors hover:border-accent hover:bg-accent/12 disabled:pointer-events-none disabled:opacity-35"
          aria-label="Siguiente"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
