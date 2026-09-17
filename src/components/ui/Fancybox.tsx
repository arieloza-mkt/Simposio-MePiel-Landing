"use client";

import { useEffect, useRef } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import { es_ES } from "@fancyapps/ui/dist/fancybox/l10n/es_ES.js";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export function useFancybox<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    NativeFancybox.bind(container, "[data-fancybox]", {
      theme: "dark",
      l10n: es_ES,
    });

    return () => {
      NativeFancybox.unbind(container);
    };
  }, []);

  return ref;
}
