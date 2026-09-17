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

export function LogoCarousel({ items, label, showNames = false }: LogoCarouselProps) {
  if (items.length === 0) return null;

  const breakpoints: Record<number, { slidesPerView: number }> = {
    640: { slidesPerView: 4 },
    768: { slidesPerView: 5 },
    1024: { slidesPerView: 6 },
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
          loop={true}
          freeMode={true}
          slidesPerView={3}
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
                <div className={cn("flex items-center justify-center", showNames ? "h-12" : "h-full")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full w-auto max-w-full object-contain dark:brightness-0 dark:invert"
                    loading="lazy"
                  />
                </div>
                {showNames && (
                  <span className="w-full truncate text-center text-xs font-medium text-muted">
                    {item.name}
                  </span>
                )}
              </div>
            </SwiperSlide>
          ))}
          <AutoplayGuard />
        </Swiper>
      </div>
    </div>
  );
}