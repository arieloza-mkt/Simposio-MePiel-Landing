"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { SPEAKERS } from "@/lib/constants";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

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

  if (SPEAKERS.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <p className="m-0 font-mono text-xs uppercase tracking-widest text-muted">
          [PENDIENTE: ponentes por confirmar]
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {SPEAKERS.map((speaker) => (
            <div
              key={speaker.id}
              className="min-w-0 shrink-0 basis-full px-3 max-md:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <figure className="m-0">
                {speaker.image ? (
                  <img
                    src={speaker.image}
                    alt={`Retrato de ${speaker.name}`}
                    loading="lazy"
                    className="mb-4 aspect-[4/5] w-full rounded-[var(--radius-lg)] border border-border object-cover"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="mb-4 grid aspect-[4/5] w-full place-items-center rounded-[var(--radius-lg)] border border-border bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))] font-display text-[clamp(28px,3vw,40px)] font-bold text-accent/70"
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
