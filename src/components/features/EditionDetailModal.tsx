"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Edition, Speaker } from "@/lib/content";
import { Modal } from "@/components/ui/Modal";
import { LogoCarousel } from "./LogoCarousel";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function useEmblaDots() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    const raf = requestAnimationFrame(sync);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", sync);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi, onSelect]);

  return { emblaRef, emblaApi, selectedIndex, scrollSnaps };
}

function SpeakersCarousel({ speakers }: { speakers: Speaker[] }) {
  const { emblaRef, emblaApi, selectedIndex, scrollSnaps } = useEmblaDots();

  return (
    <div role="region" aria-label="Ponentes de la edición">
      <div className="relative">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={selectedIndex === 0}
          className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-dark/55 text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-0 max-md:h-8 max-md:w-8"
          aria-label="Ponente anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={selectedIndex === scrollSnaps.length - 1}
          className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-dark/55 text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-0 max-md:h-8 max-md:w-8"
          aria-label="Ponente siguiente"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="min-w-0 shrink-0 basis-full px-2.5 max-sm:basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <figure className="m-0 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
                {speaker.imageUrl ? (
                  <img
                    src={speaker.imageUrl}
                    alt={`Retrato de ${speaker.name}`}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="grid aspect-[4/5] w-full place-items-center bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))] font-display text-[clamp(28px,3vw,40px)] font-bold text-accent/70"
                  >
                    {initials(speaker.name)}
                  </div>
                )}
                <figcaption className="p-4">
                  <div className="text-[15px] font-semibold text-fg">
                    {speaker.name}
                  </div>
                  {speaker.role ? (
                    <div className="mt-0.5 text-sm text-muted">
                      {speaker.role}
                    </div>
                  ) : null}
                  {speaker.company ? (
                    <div className="font-mono text-xs uppercase tracking-widest text-accent">
                      {speaker.company}
                    </div>
                  ) : null}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center">
        <div className="flex gap-1.5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 w-2 rounded-full border-none p-0 transition-colors ${
                i === selectedIndex ? "bg-accent" : "bg-border"
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface EditionDetailModalProps {
  open: boolean;
  onClose: () => void;
  edition: Edition;
  speakers: Speaker[];
}

export function EditionDetailModal({
  open,
  onClose,
  edition,
  speakers,
}: EditionDetailModalProps) {
  const editionSpeakers = edition.speakerIds
    .map((id) => speakers.find((speaker) => speaker.id === id))
    .filter((speaker): speaker is Speaker => Boolean(speaker));

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={`Detalles de la ${edition.ordinal} edición`}
      className="max-w-3xl"
    >
      <h3 className="m-0 font-display text-xl font-bold tracking-tight text-fg">
        Ponentes de la edición
      </h3>
      <p className="mb-5 mt-1 text-sm text-muted">
        Especialistas y líderes que compartieron su experiencia en escenario.
      </p>
      {editionSpeakers.length > 0 ? (
        <SpeakersCarousel speakers={editionSpeakers} />
      ) : (
        <div className="grid h-28 place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-bg font-mono text-xs uppercase tracking-widest text-muted">
          [PENDIENTE: ponentes de esta edición]
        </div>
      )}

      <hr className="my-7 border-t border-border" />

      <h3 className="m-0 font-display text-xl font-bold tracking-tight text-fg">
        Laboratorios participantes
      </h3>
      <p className="mb-4 mt-1 text-sm text-muted">
        Las marcas que exhibieron su portafolio en el recinto.
      </p>
      {edition.labs.length > 0 ? (
        <LogoCarousel items={edition.labs} label="Laboratorios participantes" />
      ) : (
        <div className="grid h-28 place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-bg font-mono text-xs uppercase tracking-widest text-muted">
          [PENDIENTE: logos de laboratorios de esta edición]
        </div>
      )}
    </Modal>
  );
}
