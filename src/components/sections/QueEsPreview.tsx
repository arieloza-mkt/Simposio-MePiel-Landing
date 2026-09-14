"use client";

import { motion } from "framer-motion";
import type { QueEsSettings } from "@/lib/content";

const listVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const EXPERIENCE_ICONS = [
  <>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </>,
  <>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0014 0M12 18v3" />
  </>,
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
  </>,
  <>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </>,
];

export function QueEsPreview({ queEs }: { queEs: QueEsSettings }) {
  return (
    <div className="grid grid-cols-12 items-center gap-x-[clamp(32px,5vw,72px)] gap-y-8 rounded-3xl border border-white/15 bg-white/[0.06] p-[clamp(24px,4vw,56px)] backdrop-blur-sm dark:border-0 dark:bg-dark/90 text-left">
      {/* Columna izquierda: texto + íconos */}
      <div className="col-span-12 flex flex-col lg:col-span-7">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          {queEs.eyebrow}
        </p>
        <h2 className="m-0 font-display text-[clamp(22px,4vw,44px)] font-bold leading-[1.1] tracking-tight">
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

        <p className="m-0 mt-5 max-w-[52ch] text-[clamp(14px,1.8vw,18px)] leading-relaxed">
          {queEs.intro}
        </p>

        <p className="mb-0 mt-5 font-display text-base font-semibold">
          {queEs.experienceIntro}
        </p>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariant}
          className="m-0 mt-4 grid list-none gap-3 p-0 sm:grid-cols-2"
        >
          {queEs.experienceItems.map((text, i) => (
            <motion.li
              key={i}
              variants={itemVariant}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-transform duration-200 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  {EXPERIENCE_ICONS[i % EXPERIENCE_ICONS.length]}
                </svg>
              </span>
              <span className="pt-0.5 text-sm leading-snug">
                {text}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Columna derecha: imagen */}
      <div className="col-span-12 lg:col-span-5">
        {queEs.imageUrl ? (
          <img
            src={queEs.imageUrl}
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
  );
}
