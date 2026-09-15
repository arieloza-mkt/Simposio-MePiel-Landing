"use client";

import { motion } from "framer-motion";
import type { QueEsSettings } from "@/lib/content";

export interface CifraItem {
  numero: string;
  etiqueta: string;
  descripcion: string;
  color: string;
}

export interface CifraFoto {
  src: string;
  alt: string;
}

export const CIFRAS_DEFAULT: CifraItem[] = [
  {
    numero: "3",
    etiqueta: "Ediciones realizadas",
    descripcion:
      "2024, 2025 y 2026, consolidando al Simposio como referencia de la categoría.",
    color: "var(--color-gc)",
  },
  {
    numero: "11+",
    etiqueta: "Laboratorios participantes",
    descripcion:
      "Marcas líderes de la industria dermocosmética presentes en cada edición.",
    color: "var(--color-gm)",
  },
  {
    numero: "XX+",
    etiqueta: "Profesionales asistentes",
    descripcion:
      "Especialistas y líderes de opinión conectando en cada encuentro.",
    color: "var(--color-gp)",
  },
];

export const FOTOS_DEFAULT: CifraFoto[] = [
  {
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
    alt: "Panorama del recinto en una edición anterior del Simposio",
  },
  {
    src: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Conferencia magistral con líderes de la industria",
  },
  {
    src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1170&auto=format&fit=crop",
    alt: "Networking entre asistentes y laboratorios",
  },
];

export function CifrasPreview({
  queEs,
  cifras = CIFRAS_DEFAULT,
  fotos = FOTOS_DEFAULT,
}: {
  queEs: QueEsSettings;
  cifras?: CifraItem[];
  fotos?: CifraFoto[];
}) {
  const [big, ...rest] = fotos;
  const [smallA, smallB] = rest;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-left"
    >
      <div className="mb-10 flex flex-col lg:mb-12 lg:items-center lg:text-center">
        <h2 className="m-0 max-w-[24ch] font-display text-[clamp(34px,4.8vw,62px)] leading-[1.04] tracking-tight">
          {queEs.highlight ? (
            <>
              {queEs.title.split(queEs.highlight)[0]}
              <span className="text-[color:var(--color-gc)]">
                {queEs.highlight}
              </span>
              {queEs.title.split(queEs.highlight)[1]}
            </>
          ) : (
            queEs.title
          )}
        </h2>
      </div>

      <div className="grid grid-cols-12 items-center gap-[clamp(32px,5vw,72px)]">
        <div className="col-span-12 flex flex-col gap-7 lg:col-span-7">
          {cifras.map((cifra, i) => (
            <div
              key={i}
              className="border-l-[3px] pl-5"
              style={{ borderColor: cifra.color }}
            >
              <div
                className="flex items-center gap-3"
                style={{ color: cifra.color }}
              >
                <span className="font-mono text-[12px] leading-none opacity-60">
                  {i + 1}
                </span>
                <span className="font-display text-[clamp(44px,5vw,52px)] leading-none">
                  {cifra.numero}
                </span>
              </div>
              <p
                className="m-0 mt-2.5 font-body text-[12px] font-bold uppercase tracking-[0.16em]"
                style={{ color: cifra.color }}
              >
                {cifra.etiqueta}
              </p>
              <p className="m-0 mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-fg/60">
                {cifra.descripcion}
              </p>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="flex flex-col gap-[10px]">
            {big && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={big.src}
                alt={big.alt}
                loading="lazy"
                className="aspect-[16/11] w-full rounded-[10px] object-cover"
              />
            )}
            {smallA && smallB && (
              <div className="grid grid-cols-2 gap-[10px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={smallA.src}
                  alt={smallA.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-[10px] object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={smallB.src}
                  alt={smallB.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-[10px] object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}