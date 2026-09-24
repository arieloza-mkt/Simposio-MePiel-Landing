"use client";

import { useEffect, useRef, useState } from "react";
import type { Edition, Speaker, EditionsModalSettings, EventConfig } from "@/lib/content";
import { EdicionPanel } from "./EdicionPanel";
import {
  registerScrollToEdition,
  unregisterScrollToEdition,
} from "@/lib/editions-nav";

const SETTLED_EPS = 0.05;

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
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIdxRef = useRef(0);
  const snapTargetRef = useRef<number | null>(null);
  const inZoneRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let prevIndex = 0;

    const handler = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const idx = Math.min(
        editions.length - 1,
        Math.round(progress * (editions.length - 1)),
      );
      if (idx !== prevIndex) {
        prevIndex = idx;
      }
      activeIdxRef.current = idx;
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [editions.length]);

  const goTo = (idx: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || editions.length < 2) return;
    const target = Math.round(wrapper.getBoundingClientRect().top + window.scrollY) + idx * window.innerHeight;
    inZoneRef.current = true;
    snapTargetRef.current = target;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    registerScrollToEdition(goTo);
    return () => unregisterScrollToEdition();
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || editions.length < 2) return;

    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaY;
      if (dy === 0) return;
      if (editions.length < 2) return;

      const innerHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Posición del tope del wrapper en coordenadas de documento
      // (a prueba de ancestros con positioning, a diferencia de offsetTop).
      const docTop = Math.round(wrapper.getBoundingClientRect().top + scrollY);
      const docBottom = docTop + wrapper.offsetHeight;

      // Solo interceptar cuando la sección pinned está en pantalla (o muy cerca),
      // para no secuestrar el scroll de secciones vecinas.
      const inZone =
        scrollY >= docTop - innerHeight * 0.5 &&
        scrollY < docBottom + innerHeight * 0.5;
      if (!inZone) {
        inZoneRef.current = false;
        return;
      }
      if (!inZoneRef.current) {
        // Reentrada a la zona: el objetivo pendiente (si lo hubo) ya no aplica.
        snapTargetRef.current = null;
        inZoneRef.current = true;
      }

      // No apilar snaps: esperar a que el scroll suave previo aterrice.
      const target = snapTargetRef.current;
      if (target !== null && Math.abs(scrollY - target) > innerHeight * SETTLED_EPS) {
        // Animación en curso: re-armar el scrollTo al mismo objetivo. Sin esto,
        // los preventDefault de los wheel cancelan la animación smooth y el
        // scroll queda atrapado a mitad de camino.
        e.preventDefault();
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
      snapTargetRef.current = null;

      const current = activeIdxRef.current;
      const goingDown = dy > 0;
      const next = goingDown ? current + 1 : current - 1;
      if (next < 0 || next >= editions.length) return;

      e.preventDefault();
      snapTargetRef.current = docTop + next * innerHeight;
      window.scrollTo({ top: snapTargetRef.current, behavior: "smooth" });
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [editions.length]);

  return (
    <div
      ref={wrapperRef}
      id="ediciones"
      className="relative overflow-x-clip"
      style={{ height: `${Math.max(editions.length, 1) * 100}vh` }}
    >
      <section className="sticky top-0 h-screen overflow-hidden bg-dark">
        {editions.map((edition, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          const slideOffset = isPast ? "-100%" : "100%";

          return (
            <div
              key={edition.id}
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                transform: isActive ? "translateX(0)" : `translateX(${slideOffset})`,
                transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform",
              }}
            >
              <div className={isActive ? "pointer-events-auto" : "pointer-events-none"}>
                <EdicionPanel edition={edition} speakers={speakers} eventConfig={eventConfig} viewMoreText={viewMoreText} modalSettings={modalSettings} />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}