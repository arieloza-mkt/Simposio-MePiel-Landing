"use client";

import { useEffect, useRef, type ReactNode } from "react";

const NAVY = "#0a1330";
const CYAN = "#2EC5E8";

// 0–50%: giro completo · 50–90%: el logo se va a la derecha · 90–100%: abre el hueco
const SPIN_END = 0.5;
const SLIDE_END = 0.9;
// Suavizado del borde del hueco (px)
const HOLE_FEATHER = 10;
// Cuánto sobresale el hueco del disco en reposo (px)
const HOLE_RING = 0;

export function LogoSpin({ logoUrl, nextPreview }: { logoUrl?: string; nextPreview?: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const blue = blueRef.current;
    const disc = discRef.current;
    const preview = previewRef.current;
    if (!wrapper || !blue || !disc) return;

    const applyHole = (radius: number) => {
      const mask = `radial-gradient(circle at 50% 50%, transparent ${radius.toFixed(1)}px, black ${(radius + HOLE_FEATHER).toFixed(1)}px)`;
      blue.style.setProperty("mask-image", mask);
      blue.style.setProperty("-webkit-mask-image", mask);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyHole(Math.hypot(window.innerWidth, window.innerHeight));
      disc.style.opacity = "0";
      if (preview) preview.style.pointerEvents = "auto";
      return;
    }

    let ticking = false;
    let rafId = 0;

    const update = () => {
      ticking = false;
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      let progress = -rect.top / scrollable;
      progress = Math.min(Math.max(progress, 0), 1);

      const discR = disc.offsetWidth / 2;
      const maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40;

      // Fase 1: giro completo (una vuelta)
      const spin = Math.min(progress / SPIN_END, 1);

      // Fase 2: el logo se va a la derecha, por debajo del fondo azul
      const slide =
        progress <= SPIN_END
          ? 0
          : Math.min((progress - SPIN_END) / (SLIDE_END - SPIN_END), 1);
      const slideX = slide * window.innerWidth * 1.2;
      // Sigue rodando un poco mientras se aleja, para apreciar la trayectoria
      const rotation = spin * 360 + slide * 140;

      disc.style.transform = `translateX(${slideX.toFixed(1)}px) rotate(${rotation.toFixed(2)}deg)`;

      // Hueco: tapado por el disco durante el giro; crece después hasta llenar la pantalla
      const grow = progress <= SPIN_END ? 0 : (progress - SPIN_END) / (1 - SPIN_END);
      const eased =
        grow < 0.5 ? 4 * grow * grow * grow : 1 - Math.pow(-2 * grow + 2, 3) / 2;
      const radius = Math.max(discR + HOLE_RING, discR + (maxR - discR) * eased);
      applyHole(radius);

      if (preview) {
        preview.style.pointerEvents = progress > SPIN_END ? "auto" : "none";
      }
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ background: NAVY }}
      >
        {nextPreview && (
          <div
            ref={previewRef}
            className="pointer-events-none absolute inset-0 z-0 overflow-y-auto bg-bg text-center dark:bg-[#0a1330]"
          >
            <div className="flex min-h-full items-center justify-center px-5 py-10 pb-16 sm:px-8">
              <div className="w-full max-w-[1440px]">{nextPreview}</div>
            </div>
          </div>
        )}

        {/* Logo: gira y luego se va a la derecha, por debajo del fondo azul */}
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <div
            ref={discRef}
            className="flex h-[min(68vmin,600px)] w-[min(68vmin,600px)] items-center justify-center rounded-full bg-white will-change-transform"
            style={{
              boxShadow: "0 0 90px 45px rgba(38, 198, 218, 0.45)",
              transformOrigin: "50% 50%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl || "https://res.cloudinary.com/cc4tium7/image/upload/v1787606525/Logo.png"}
              alt=""
              draggable={false}
              loading="eager"
              decoding="async"
              className="block w-[74%]"
            />
          </div>
        </div>

        {/* Fondo azul con hueco circular: degradado radial cyan → navy */}
        <div
          ref={blueRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${CYAN} 0%, ${NAVY} 60%)`,
          }}
        />
      </div>
    </div>
  );
}
