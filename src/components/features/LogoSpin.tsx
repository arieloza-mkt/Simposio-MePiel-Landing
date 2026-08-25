"use client";

import { useEffect, useRef } from "react";

const LOGO_URL =
  "https://res.cloudinary.com/cc4tium7/image/upload/v1787606525/Logo.png";

// Navy profundo de inicio → fondo real de la sección siguiente (#0B1426)
const NAVY = [8, 16, 32];
const NEXT_BG = [11, 20, 38];

const TOTAL_ROTATION_DEG = 1440; // 4 vueltas, giro continuo
const LOGO_FADE_END = 0.5; // el logo se desvanece por completo a este % del progreso
const SCALE_BUFFER = 1.15; // margen extra para cubrir bien las esquinas
// El círculo blanco se funde al fondo de la sección siguiente al final,
// para que la pantalla nunca quede "en blanco" antes de liberar el pin.
const MERGE_START = 0.68;
// Overlay de la siguiente sección aparece desde este % del progreso.
const PREVIEW_FADE_START = 0.62;
const PREVIEW_FADE_END = 0.82;

interface NextPreview {
  title: string;
  highlight: string;
  intro: string;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function LogoSpin({ nextPreview }: { nextPreview?: NextPreview }) {
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

      const mergeT = Math.min(Math.max((progress - MERGE_START) / (1 - MERGE_START), 0), 1);
      const cr = Math.round(lerp(255, NEXT_BG[0], mergeT));
      const cg = Math.round(lerp(255, NEXT_BG[1], mergeT));
      const cb = Math.round(lerp(255, NEXT_BG[2], mergeT));
      circle.style.backgroundColor = `rgb(${cr}, ${cg}, ${cb})`;
      circle.style.boxShadow = `0 0 40px ${(14 * (1 - mergeT)).toFixed(1)}px rgba(255, 255, 255, ${(
        0.32 * (1 - mergeT)
      ).toFixed(3)})`;

      if (preview) {
        const previewT = Math.min(Math.max((progress - PREVIEW_FADE_START) / (PREVIEW_FADE_END - PREVIEW_FADE_START), 0), 1);
        preview.style.opacity = String(previewT);
        preview.style.pointerEvents = previewT > 0.1 ? "auto" : "none";
      }
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
      className="relative h-[170vh] select-none"
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

        {nextPreview && (
          <div
            ref={previewRef}
            className="absolute inset-0 z-[2] flex items-center justify-center opacity-0"
            style={{ pointerEvents: "none" }}
          >
            <div className="max-w-[480px] px-8 text-center">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.08em] text-accent">
                Qué es el Simposio
              </p>
              <h2 className="m-0 font-display text-[clamp(28px,4vw,44px)] font-bold leading-[1.1] tracking-tight text-white">
                {nextPreview.highlight ? (
                  <>
                    {nextPreview.title.split(nextPreview.highlight)[0]}
                    <span className="text-accent">{nextPreview.highlight}</span>
                    {nextPreview.title.split(nextPreview.highlight)[1]}
                  </>
                ) : (
                  nextPreview.title
                )}
              </h2>
              <p className="mx-auto mt-4 max-w-[42ch] text-[15px] leading-relaxed text-white/55">
                {nextPreview.intro}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
