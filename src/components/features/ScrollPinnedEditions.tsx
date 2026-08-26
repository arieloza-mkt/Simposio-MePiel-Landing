"use client";

import { useEffect, useRef, useState } from "react";
import type { Edition, Speaker, EditionsModalSettings } from "@/lib/content";
import { EdicionPanel } from "./EdicionPanel";

export function ScrollPinnedEditions({
  editions,
  speakers,
  viewMoreText,
  modalSettings,
}: {
  editions: Edition[];
  speakers: Speaker[];
  viewMoreText?: string;
  modalSettings?: EditionsModalSettings;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

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
        setDirection(idx > prevIndex ? 1 : -1);
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

  return (
    <div ref={wrapperRef} id="ediciones" className="relative" style={{ height: "300vh" }}>
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
              {isActive && (
                <div className="pointer-events-auto">
                  <EdicionPanel edition={edition} speakers={speakers} viewMoreText={viewMoreText} modalSettings={modalSettings} />
                </div>
              )}
              {!isActive && (
                <EdicionPanel edition={edition} speakers={speakers} viewMoreText={viewMoreText} modalSettings={modalSettings} />
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
