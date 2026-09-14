"use client";

import { useEffect, useRef, type ReactNode } from "react";

const NAVY = [10, 19, 48];
const NEXT_BG = [255, 255, 255];

const SPIN_END = 0.5;
const TOTAL_ROTATION_DEG = 360;
const MAX_ZOOM = 3;
const PREVIEW_FADE_START = 0.55;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function LogoSpin({ logoUrl, nextPreview }: { logoUrl?: string; nextPreview?: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pin = pinRef.current;
    const circle = circleRef.current;
    const logo = logoRef.current;
    const preview = previewRef.current;
    if (!wrapper || !pin || !circle || !logo) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (preview) {
        preview.style.opacity = "1";
        preview.style.pointerEvents = "auto";
      }
      return;
    }

    let ticking = false;
    let rafId = 0;

    const update = () => {
      ticking = false;
      const rect = wrapper.getBoundingClientRect();
      const scrollableDistance = wrapper.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      let progress = -rect.top / scrollableDistance;
      progress = Math.min(Math.max(progress, 0), 1);

      // FASE 1 (0–50%): una vuelta completa
      const spinProgress = Math.min(progress / SPIN_END, 1);
      const rotation = spinProgress * TOTAL_ROTATION_DEG;

      // FASE 2 (50–100%): zoom in y fade out (sin deslizar a la derecha)
      const zoomProgress =
        progress <= SPIN_END ? 0 : (progress - SPIN_END) / (1 - SPIN_END);
      const zoom = 1 + zoomProgress * (MAX_ZOOM - 1);

      circle.style.transform = `scale(${zoom.toFixed(4)}) rotate(${rotation.toFixed(2)}deg)`;

      // Logo siempre visible dentro del círculo (el círculo controla el fade)
      logo.style.opacity = "1";

      // Círculo: se desvanece progresivamente con el zoom
      circle.style.opacity = String(1 - zoomProgress);

      // Preview de la siguiente sección: fade in desde 80%
      let previewFade =
        (progress - PREVIEW_FADE_START) / (1 - PREVIEW_FADE_START);
      previewFade = Math.min(Math.max(previewFade, 0), 1);
      if (preview) {
        preview.style.opacity = String(previewFade);
        preview.style.pointerEvents = previewFade > 0.1 ? "auto" : "none";
      }

      // Background crossfade: navy → siguiente sección (0–100%)
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

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (ticking) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      id="acerca"
      ref={wrapperRef}
      aria-hidden
      className="relative h-[200vh] select-none"
    >
      <div
        ref={pinRef}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ background: `rgb(${NAVY.join(",")})` }}
      >
        {nextPreview && (
          <div
            ref={previewRef}
            className="absolute inset-0 z-10 overflow-y-auto text-center opacity-1 pointer-events-none dark:bg-[#0a1330]"
          >
            <div className="flex min-h-full items-center justify-center px-5 py-10 pb-16 sm:px-8">
              <div className="w-full max-w-[1440px]">{nextPreview}</div>
            </div>
          </div>
        )}

        <div
          ref={circleRef}
          className="relative z-20 flex h-[min(46vmin,380px)] w-[min(46vmin,380px)] items-center justify-center rounded-full bg-white will-change-transform"
          style={{
            boxShadow: "0 0 90px 45px rgba(38, 198, 218, 0.45)",
            transformOrigin: "50% 50%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoRef}
            src={logoUrl || "https://res.cloudinary.com/cc4tium7/image/upload/v1787606525/Logo.png"}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            className="block w-[74%]"
          />
        </div>
      </div>
    </div>
  );
}
