"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(options?: {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && options?.once) {
          observer.unobserve(el);
        }
      },
      {
        threshold: options?.threshold ?? 0,
        rootMargin: options?.rootMargin,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return [ref, inView] as const;
}