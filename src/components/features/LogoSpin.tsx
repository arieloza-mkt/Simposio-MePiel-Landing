"use client";

import { useEffect, useRef } from "react";

const LOGO_URL =
  "https://res.cloudinary.com/cc4tium7/image/upload/v1787606525/Logo.png";

// Navy profundo de inicio → fondo real de la sección siguiente (#0B1426)
const NAVY = [8, 16, 32];
const NEXT_BG = [11, 20, 38];

const TOTAL_ROTATION_DEG = 1440; // 4 vueltas, giro continuo
const LOGO_FADE_END = 0.45; // el logo se desvanece por completo a este % del progreso
const SCALE_BUFFER = 1.15; // margen extra para cubrir bien las esquinas

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function LogoSpin() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pin = pinRef.current;
    const circle = circleRef.current;
    const logo = logoRef.current;
    if (!wrapper || !pin || !circle || !logo) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let ticking = false;
    let rafId = 0;
    let maxScale = 6;

    const computeMaxScale = () => {
      const diagonal = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2,
      );
      const baseDiameter = circle.offsetWidth || 1;
      maxScale = (diagonal / baseDiameter) * SCALE_BUFFER;
    };

    const update = () => {
      ticking = false;
      const rect = wrapper.getBoundingClientRect();
      const scrollableDistance = wrapper.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      let progress = -rect.top / scrollableDistance;
      progress = Math.min(Math.max(progress, 0), 1);

      const rotation = progress * TOTAL_ROTATION_DEG;
      const scale = 1 + progress * (maxScale - 1);
      circle.style.transform = `rotate(${rotation}deg) scale(${scale})`;

      let logoFade = progress / LOGO_FADE_END;
      logoFade = Math.min(Math.max(logoFade, 0), 1);
      logo.style.opacity = String(1 - logoFade);

      const r = lerp(NAVY[0], NEXT_BG[0], progress);
      const g = lerp(NAVY[1], NEXT_BG[1], progress);
      const b = lerp(NAVY[2], NEXT_BG[2], progress);
      pin.style.background = `rgb(${r.toFixed(1)}, ${g.toFixed(1)}, ${b.toFixed(1)})`;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    const onResize = () => {
      computeMaxScale();
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    computeMaxScale();
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ticking) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="relative h-[260vh] select-none"
    >
      <div
        ref={pinRef}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ background: `rgb(${NAVY.join(",")})` }}
      >
        <div
          ref={circleRef}
          className="flex h-[min(56vmin,470px)] w-[min(56vmin,470px)] items-center justify-center rounded-full bg-white will-change-transform"
          style={{
            boxShadow: "0 0 40px 14px rgba(255, 255, 255, 0.32)",
            transformOrigin: "50% 50%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoRef}
            src={LOGO_URL}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            className="block w-[62%]"
          />
        </div>
      </div>
    </div>
  );
}
