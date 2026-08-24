"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
        delay: 2200,
        stopOnInteraction: false,
      }),
    [],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay],
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onPointerDown = () => autoplay.stop();
    const onPointerUp = () => autoplay.play();
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);
    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi, autoplay]);

  const togglePause = () => {
    if (!emblaApi) return;
    if (paused) {
      autoplay.play();
      setPaused(false);
    } else {
      autoplay.stop();
      setPaused(true);
    }
  };

  return (
    <div
      className="group relative"
      role="region"
      aria-label={label}
      onMouseEnter={() => {
        autoplay.stop();
        setPaused(true);
      }}
      onMouseLeave={() => {
        autoplay.play();
        setPaused(false);
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div
              key={item.name}
              className="min-w-0 shrink-0 basis-1/2 px-2.5 max-sm:basis-full sm:basis-1/3 lg:basis-1/4"
            >
              <div className="flex h-20 items-center justify-center rounded-full border border-border bg-[#fafafa] px-6 transition-all hover:border-accent hover:shadow-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-12 max-w-[130px] object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={togglePause}
        aria-label={paused ? "Reanudar carousel" : "Pausar carousel"}
        aria-pressed={paused}
        className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
      >
        {paused ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
            <rect x="7" y="5" width="3.5" height="14" rx="1" />
            <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
          </svg>
        )}
      </button>
    </div>
  );
}
