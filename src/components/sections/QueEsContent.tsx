"use client";

import type { QueEsSettings } from "@/lib/content";

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
  <>
    <circle cx="12" cy="8" r="5" />
    <path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" />
  </>,
];

export function QueEsContent({ queEs }: { queEs: QueEsSettings }) {
  return (
    <>
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
        Qué es el Simposio
      </p>
      <h2 className="m-0 max-w-[24ch] font-display text-[clamp(42px,5.8vw,72px)] font-bold leading-[1.04] tracking-tight">
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

      <div className="mt-[clamp(36px,5vw,56px)] grid grid-cols-12 gap-x-[clamp(32px,4vw,56px)] gap-y-[clamp(28px,4vw,44px)]">
        <div className="col-span-12 flex flex-col lg:col-span-7">
          <div className="m-0 max-w-[58ch] text-[17px] leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: queEs.intro }} />
          <p className="mb-0 mt-5 font-display text-lg font-semibold">
            {queEs.experienceIntro}
          </p>

          <ul className="m-0 mt-3 grid list-none gap-2.5 p-0 sm:grid-cols-2">
            {queEs.experienceItems.map((text, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-4 transition-colors duration-200 hover:border-accent/40 hover:bg-accent/[0.05]"
              >
                 <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7"
                    aria-hidden
                  >
                    {EXPERIENCE_ICONS[i % EXPERIENCE_ICONS.length]}
                  </svg>
                </span>
                <span className="pt-0.5 text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <img
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1112&auto=format&fit=crop"
            alt="Edición anterior del Simposio Dermocosmético"
            loading="lazy"
            className="aspect-[3/4] w-full rounded-[var(--radius-lg)] border border-border object-cover"
          />
        </div>
      </div>
    </>
  );
}
