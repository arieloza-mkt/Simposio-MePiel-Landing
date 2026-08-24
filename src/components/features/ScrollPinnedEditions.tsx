"use client";

import { useEffect, useRef, useState } from "react";
import type { Edition, Speaker } from "@/lib/content";
import { EdicionPanel } from "./EdicionPanel";

export function ScrollPinnedEditions({
  editions,
  speakers,
}: {
  editions: Edition[];
  speakers: Speaker[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handler = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const idx = Math.min(
        editions.length - 1,
        Math.round(progress * (editions.length - 1)),
      );
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
        {editions.map((edition, i) => (
          <div
            key={edition.id}
            data-edition-panel
            className={`absolute inset-0 transition-all duration-500 ease-[var(--ease-out-expo)] ${
              i === activeIndex
                ? "opacity-100 translate-y-0 z-10 pointer-events-auto"
                : i < activeIndex
                  ? "opacity-0 -translate-y-16 z-0 pointer-events-none"
                  : "opacity-0 translate-y-16 z-0 pointer-events-none"
            }`}
          >
            <EdicionPanel edition={edition} speakers={speakers} />
          </div>
        ))}

       
      </section>
    </div>
  );
}
