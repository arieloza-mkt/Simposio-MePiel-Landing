"use client";

import { motion } from "framer-motion";
import type { QueEsSettings } from "@/lib/content";
import { ImageCarousel } from "@/components/features/ImageCarousel";

export function QueEsPreview({ queEs }: { queEs: QueEsSettings }) {
  const slides =
    queEs.images && queEs.images.length > 0
      ? queEs.images
      : queEs.imageUrl
        ? [queEs.imageUrl]
        : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-left"
    >
      {/* Encabezado de sección */}
      <div className="mb-8 flex flex-col items-start lg:items-center lg:text-center">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          {queEs.eyebrow}
        </p>
        <h2 className="m-0 max-w-[26ch] font-display text-[clamp(34px,4.8vw,62px)] font-bold leading-[1.04] tracking-tight">
          {queEs.highlight ? (
            <>
              {queEs.title.split(queEs.highlight)[0]}
              <span className="text-accent">{queEs.highlight}</span>
              {queEs.title.split(queEs.highlight)[1]}
            </>
          ) : (
            queEs.title
          )}
        </h2>
      </div>

      <div className="grid grid-cols-12 items-center gap-x-[clamp(32px,5vw,72px)] gap-y-8 rounded-3xl border border-white/15 bg-white/[0.06] p-[clamp(24px,4vw,56px)] backdrop-blur-sm dark:border-0 dark:bg-dark/90">
        {/* Columna izquierda: texto */}
        <div className="col-span-12 flex flex-col lg:col-span-7">
          <p className="m-0 max-w-[52ch] text-[clamp(14px,1.8vw,18px)] leading-relaxed">
            {queEs.intro}
          </p>
        </div>

        {/* Columna derecha: carousel de imágenes */}
        <div className="col-span-12 lg:col-span-5">
          {slides.length > 1 ? (
            <ImageCarousel slides={slides} alt={queEs.imageAlt} />
          ) : slides.length === 1 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={slides[0]}
              alt={queEs.imageAlt}
              loading="lazy"
              className="aspect-[3/4] w-full rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="aspect-[3/4] w-full rounded-2xl border border-dashed border-white/15 grid place-items-center text-white/30 font-mono text-xs uppercase tracking-widest">
              Imagen pendiente
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}