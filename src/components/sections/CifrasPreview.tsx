"use client";

import { motion } from "framer-motion";
import type { Lab, QueEsSettings, Speaker } from "@/lib/content";
import { SpeakerCarousel } from "@/components/features/SpeakerCarousel";
import { LogoCarousel } from "@/components/features/LogoCarousel";

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
  labsList = [],
  labsTitle = "",
}: {
  queEs: QueEsSettings;
  speakers?: Speaker[];
  fotos?: CifraFoto[];
  labsList?: Lab[];
  labsTitle?: string;
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
      <div className="flex flex-col items-center gap-[clamp(32px,5vw,72px)] lg:flex-row lg:items-center">
        <div className="w-full lg:w-[58.333%] lg:flex-none mt-[8rem]">
          <h2 className="m-0 max-w-[24ch] font-display text-[clamp(42px,5.8vw,72px)] leading-[1.04] tracking-tight max-sm:text-[clamp(32px,9vw,42px)]">
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
          <p className="m-0 mt-5 max-w-[58ch] text-[clamp(17px,2vw,21px)] leading-relaxed text-fg/80 max-sm:text-[15px]">
            {queEs.intro}
          </p>
          {labsList.length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="m-0 mb-5 font-display text-[clamp(18px,2.2vw,26px)] font-bold uppercase tracking-[0.3em] text-muted">
                {labsTitle}
              </h3>
              <LogoCarousel
                items={labsList.map((lab) => ({ name: lab.name, image: lab.imageUrl }))}
                label={labsTitle}
                showNames
                perView={5}
              />
            </div>
          )}
        </div>

        <div className="w-full lg:w-[41.667%] lg:flex-none">
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
            <div className="mt-4 flex items-center gap-3">
              <h3 className="m-0 font-display text-[clamp(26px,3vw,38px)] font-bold leading-tight tracking-tight text-fg">
                Ponentes
              </h3>
              <span className="h-px flex-1 bg-gradient-to-r from-fg/20 to-transparent" aria-hidden />
            </div>
            <SpeakerCarousel speakers={speakers} perView={2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
