"use client";

import { useCallback, useEffect, useId, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getYoutubeId } from "@/lib/video";
import { useFancybox } from "@/components/ui/Fancybox";

interface PhotoSlide {
  src: string;
  alt: string;
}

interface PhotoCarouselProps {
  images: readonly PhotoSlide[];
  className?: string;
  fill?: boolean;
  autoplayMs?: number;
  paused?: boolean;
}

export function PhotoCarousel({
  images,
  className,
  fill,
  autoplayMs = 5000,
  paused = false,
}: PhotoCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fancyboxRef = useFancybox<HTMLDivElement>();
  const group = useId();
  const youtubeIds = images.map((slide) => getYoutubeId(slide.src));

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
    if (mq.matches) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      if (paused) return;
      const current = emblaApi.selectedScrollSnap();
      if (images.length <= 1) return;
      // Pausa el autoplay mientras se muestra un video para poder verlo.
      if (current < youtubeIds.length && youtubeIds[current]) return;
      emblaApi.scrollNext();
    }, autoplayMs);
    return () => clearInterval(interval);
  }, [emblaApi, images, youtubeIds, autoplayMs, paused]);

  return (
    <div ref={fancyboxRef} className={`relative overflow-hidden bg-dark-s max-md:mx-auto max-md:w-[80%] ${fill ? "h-full" : "rounded-[var(--radius-lg)]"} ${className ?? ""}`}>
      <div className={`overflow-hidden ${fill ? "h-full" : ""}`} ref={emblaRef}>
        <div className="flex h-full">
          {images.map((slide, i) => (
            <div
              key={i}
              className={`min-w-full shrink-0 relative ${fill ? "h-full" : "aspect-[16/10]"}`}
            >
              {youtubeIds[i] ? (
                <>
                  {i === selectedIndex && !paused ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeIds[i]}?autoplay=1&mute=1&rel=0&playsinline=1&loop=1&playlist=${youtubeIds[i]}`}
                      title={slide.alt || `Video ${i + 1}`}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`https://i.ytimg.com/vi/${youtubeIds[i]}/hqdefault.jpg`}
                      alt={slide.alt || `Video ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/90 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden>
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                    Video
                  </span>
                </>
              ) : (
                <a
                  href={slide.src}
                  data-fancybox={group}
                  data-caption={slide.alt}
                  className="absolute inset-0 block cursor-zoom-in"
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="h-full w-full object-cover"
                  />
                </a>
              )}
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
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className="grid h-8 w-8 place-items-center rounded-full border-none p-0 transition-colors"
            aria-label={`Foto ${i + 1}`}
            aria-current={i === selectedIndex}
          >
            <span
              aria-hidden
              className={`block h-2 w-2 rounded-full transition-colors ${
                i === selectedIndex ? "bg-accent" : "bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
