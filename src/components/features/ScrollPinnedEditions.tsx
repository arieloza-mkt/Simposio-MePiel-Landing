"use client";

import { useEffect, useRef, useState } from "react";
import type { Edition, Speaker, EditionsModalSettings, EventConfig } from "@/lib/content";
import { EdicionPanel } from "./EdicionPanel";
import {
  registerScrollToEdition,
  unregisterScrollToEdition,
} from "@/lib/editions-nav";

const SNAP_LOCK_MS = 650;

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
  const lockUntilRef = useRef(0);

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
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [editions.length]);

  const goTo = (idx: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || editions.length < 2) return;
    const scrollable = wrapper.offsetHeight - window.innerHeight;
    const target =
      wrapper.offsetTop + (idx * scrollable) / (editions.length - 1);
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

      const rect = wrapper.getBoundingClientRect();
      const top = wrapper.offsetTop;
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;

      const currentlyCaptured =
        scrollY >= top - innerHeight * 0.5 && scrollY <= top + innerHeight * 0.5;

      const now = performance.now();
      if (now < lockUntilRef.current) {
        if (currentlyCaptured) e.preventDefault();
        return;
      }

      const clipTop = Math.round(rect.top + scrollY);
      const scrollable = wrapper.offsetHeight - innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, (scrollY - clipTop) / scrollable));
      const idx = Math.min(
        editions.length - 1,
        Math.round(progress * (editions.length - 1)),
      );
      const goingDown = dy > 0;
      const next = goingDown ? idx + 1 : idx - 1;
      if (next < 0 || next > editions.length - 1) return;

      e.preventDefault();
      lockUntilRef.current = now + SNAP_LOCK_MS;
      window.scrollTo({
        top: clipTop + (next / (editions.length - 1)) * scrollable,
        behavior: "smooth",
      });
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [editions.length]);

  return (
    <div
      ref={wrapperRef}
      id="ediciones"
      className="relative"
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
                transform: isActive ? "translateY(0)" : `translateY(${slideOffset})`,
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