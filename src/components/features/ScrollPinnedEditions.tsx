"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Edition, Speaker, EditionsModalSettings, EventConfig } from "@/lib/content";
import { EdicionPanel } from "./EdicionPanel";
import { useInView } from "@/lib/use-in-view";
import {
  registerScrollToEdition,
  unregisterScrollToEdition,
} from "@/lib/editions-nav";

const SETTLED_EPS = 0.05;
const WHEEL_DEBOUNCE_MS = 260;

export function ScrollPinnedEditions({
  editions,
  speakers,
  eventConfig,
  viewMoreText,
  modalSettings,
}: {
  editions: Edition[];
  speakers: Speaker[];
  eventConfig?: EventConfig;
  viewMoreText?: string;
  modalSettings?: EditionsModalSettings;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ threshold: 0.3 });
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIdxRef = useRef(0);
  const snapTargetRef = useRef<number | null>(null);
  const inZoneRef = useRef(false);
  const settledAtRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper || editions.length < 2) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const idx = Math.min(
        editions.length - 1,
        Math.round(progress * (editions.length - 1)),
      );
      activeIdxRef.current = idx;
      setActiveIndex(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [editions.length]);

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const target = Math.round(
        wrapper.getBoundingClientRect().top +
          window.scrollY +
          idx * window.innerHeight,
      );
      inZoneRef.current = true;
      snapTargetRef.current = target;
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [],
  );

  useEffect(() => {
    registerScrollToEdition(goTo);
    return () => unregisterScrollToEdition();
  }, [goTo]);

  const onWheel = (e: React.WheelEvent) => {
    const dy = Math.round(e.deltaY);
    if (dy === 0 || editions.length < 2) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const innerHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const docTop = Math.round(wrapper.getBoundingClientRect().top + scrollY);
    const docBottom = docTop + wrapper.offsetHeight;

    // La sección "bloquea" el scroll solo cuando ya llega calzada arriba;
    // el acercamiento y la salida se hacen con scroll nativo.
    const inZone =
      scrollY >= docTop &&
      scrollY < docBottom + innerHeight * 0.25;
    if (!inZone) {
      inZoneRef.current = false;
      return;
    }

    // Re-entrada: re-armar snapTarget desde cero para no bloquear con targets viejos.
    if (!inZoneRef.current) {
      snapTargetRef.current = null;
      settledAtRef.current = 0;
    }
    inZoneRef.current = true;

    // Gate: mientras el smooth scroll a snapTarget esté en vuelo, seguir
    // re-lanzando scrollTo (Chrome cancela el smooth scroll al hacer
    // preventDefault del gesto de rueda que lo inició).
    const target = snapTargetRef.current;
    if (target != null && Math.abs(scrollY - target) > innerHeight * SETTLED_EPS) {
      e.preventDefault();
      window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }
    if (target != null) {
      // Recién llegamos al objetivo: registrar el momento para frenar la inercia.
      settledAtRef.current = performance.now();
      snapTargetRef.current = null;
    }

    // Frenar la inercia/trackpad justo después de estabilizar un snap,
    // para que un solo gesto no avance dos slides.
    if (performance.now() - settledAtRef.current < WHEEL_DEBOUNCE_MS) {
      e.preventDefault();
      return;
    }

    const current = activeIdxRef.current;
    const delta = Math.sign(dy);
    const next = current + delta;
    if (next < 0 || next >= editions.length) {
      // Borde: soltar para que la página scrollee normal (siempre que sea
      // posible, aunque el cursor siga dentro del wrapper).
      inZoneRef.current = false;
      return;
    }

    e.preventDefault();
    const goal = docTop + next * innerHeight;
    snapTargetRef.current = goal;
    window.scrollTo({ top: goal, behavior: "smooth" });
  };

  return (
    <div
      ref={wrapperRef}
      id="ediciones"
      className="relative overflow-x-clip"
      style={{ height: `${Math.max(editions.length, 1) * 100}vh` }}
      onWheel={onWheel}
    >
      <section
        ref={sectionRef}
        className="sticky top-0 h-screen overflow-hidden bg-dark"
      >
        <div className="relative h-full w-full">
          {editions.map((edition, i) => {
            const active = i === activeIndex;
            const isPrev = i === activeIndex - 1;
            const isNext = i === activeIndex + 1;
            return (
              <div
                key={edition.id}
                className="absolute inset-0 z-0"
                style={{
                  transform: active
                    ? "translateX(0)"
                    : isPrev
                      ? "translateX(-100%)"
                      : isNext
                        ? "translateX(100%)"
                        : "translateX(0)",
                  transition: "transform 600ms var(--ease-in-out)",
                  willChange: "transform",
                  pointerEvents: active ? "auto" : "none",
                  opacity: active || isPrev || isNext ? 1 : 0,
                }}
              >
                <EdicionPanel
                  edition={edition}
                  speakers={speakers}
                  eventConfig={eventConfig}
                  viewMoreText={viewMoreText}
                  modalSettings={modalSettings}
                  playing={sectionInView && active}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}