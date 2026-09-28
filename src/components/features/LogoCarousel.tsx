"use client";

import { useEffect } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { cn } from "@/lib/cn";

interface LogoCarouselProps {
  items: { name: string; image: string }[];
  label: string;
  showNames?: boolean;
  /** Logos visibles simultáneamente (default 4). */
  perView?: number;
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

export function LogoCarousel({
  items,
  label,
  showNames = false,
  perView = 4,
}: LogoCarouselProps) {
  if (items.length === 0) return null;

  const breakpoints: Record<number, { slidesPerView: number }> = {
    480: { slidesPerView: Math.min(2, perView) },
    640: { slidesPerView: Math.min(3, perView) },
    768: { slidesPerView: Math.min(4, perView) },
    1024: { slidesPerView: Math.min(5, perView) },
  };

  return (
    <div
      className="group relative"
      role="region"
      aria-label={label}
    >
      <div className="min-w-0 overflow-hidden" style={{ width: "100%" }}>
        <Swiper
          modules={[Autoplay]}
          loop={items.length > perView}
          freeMode={true}
          slidesPerView={Math.min(2, perView)}
          slidesPerGroup={1}
          spaceBetween={24}
          breakpoints={breakpoints}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={4000}
          allowTouchMove={true}
          className="w-full"
        >
          {items.map((item) => (
            <SwiperSlide key={item.name} className="flex-shrink-0">
              <div
                className={cn(
                  "flex w-full max-w-[200px] flex-col items-center justify-center",
                  showNames ? "gap-2" : "h-12",
                )}
              >
                <div className={cn("flex items-center justify-center")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full w-auto max-w-full object-contain dark:brightness-0 dark:invert"
                    loading="lazy"
                  />
                </div>
              
              </div>
            </SwiperSlide>
          ))}
          <AutoplayGuard />
        </Swiper>
      </div>
    </div>
  );
}