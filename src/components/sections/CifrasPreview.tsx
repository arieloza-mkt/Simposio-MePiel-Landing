"use client";

import { motion } from "framer-motion";
import type { QueEsSettings, Speaker } from "@/lib/content";
import { SpeakerCarousel } from "@/components/features/SpeakerCarousel";

export interface CifraFoto {
  src: string;
  alt: string;
}

export const FOTOS_DEFAULT: CifraFoto[] = [
  {
    src: "https://res.cloudinary.com/cc4tium7/image/upload/v1789682779/principal.jpg",
    alt: "Panorama del recinto en una edición anterior del Simposio",
  },
];

export function CifrasPreview({
  queEs,
  speakers = [],
  fotos = FOTOS_DEFAULT,
}: {
  queEs: QueEsSettings;
  speakers?: Speaker[];
  fotos?: CifraFoto[];
}) {
  const big = fotos[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-left"
    >
      <div className="grid grid-cols-12 items-center gap-[clamp(32px,5vw,72px)]">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="m-0 max-w-[24ch] font-display text-[clamp(42px,5.8vw,72px)] leading-[1.04] tracking-tight">
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
          <p className="m-0 mt-5 max-w-[58ch] text-[clamp(17px,2vw,21px)] leading-relaxed text-fg/80">
            {queEs.intro}
          </p>
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
            {/* <h3 className="m-0 mt-2 font-display text-[clamp(20px,2.4vw,28px)] tracking-tight">
              Expositores
            </h3> */}
            <SpeakerCarousel speakers={speakers} perView={2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
