"use client";

import { motion } from "framer-motion";
import { SITE, METRICS } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const heroChildren = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({
        top: (el as HTMLElement).offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-dark px-8 pt-[clamp(120px,18vw,180px)] pb-[clamp(56px,10vw,120px)] text-white">
      <HeroRibbon />

      <Container>
        <div className="items-center gap-[clamp(32px,5vw,72px)] max-md:gap-[56px] grid grid-cols-2 max-md:grid-cols-1">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroChildren}
            className="text-left"
          >
            <motion.p variants={heroChild} className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
              {SITE.edition} - [PENDIENTE: fecha exacta] - [PENDIENTE: sede]
            </motion.p>
            <motion.h1 variants={heroChild} className="mb-5 font-display text-[clamp(44px,6vw,76px)] font-bold leading-[1.04] tracking-tight text-white">
              El encuentro comercial más relevante de la industria dermocosmética en México
            </motion.h1>
            <motion.p variants={heroChild} className="mb-8 max-w-[52ch] text-[19px] leading-relaxed text-white/55">
              {SITE.description}
            </motion.p>
            <motion.div variants={heroChild} className="flex flex-col gap-3 sm:flex-row sm:gap-3">
              <Button variant="primary" className="w-full justify-center sm:w-auto" onClick={() => scrollTo("#registro")}>
                Registrarme
              </Button>
              <Button variant="secondary" className="w-full justify-center sm:w-auto" onClick={() => scrollTo("#acerca")}>
                Conoce más
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative"
          >
            <div className="pointer-events-none absolute inset-[-20%] z-[-1] rounded-full bg-[radial-gradient(circle,rgba(46,197,232,.12)_0%,rgba(230,57,155,.06)_40%,transparent_70%)]" />
            <div className="aspect-[4/3] w-full rounded-[var(--radius-lg)] bg-[linear-gradient(135deg,rgba(46,197,232,.12),rgba(26,26,30,.06))] border border-white/8 grid place-items-center font-mono text-xs tracking-widest text-white/35">
              <img src="https://placehold.co/600x400?text=Coloca+Imagen" alt="" />
            </div>
          </motion.div>
        </div>

        <div className="mt-[clamp(48px,6vw,72px)] grid grid-cols-4 gap-[32px] border-t border-white/8 pt-[clamp(32px,4vw,48px)] text-center max-sm:grid-cols-2 max-sm:gap-5">
          {METRICS.map((m) => (
            <div key={m.label}>
              <div className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-none tracking-tight text-accent tabular-nums">
                {m.value}
              </div>
              <div className="mt-1 font-mono text-[13px] uppercase tracking-widest text-white/55 whitespace-pre-line">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function HeroRibbon() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2EC5E8" stopOpacity={0.18} />
          <stop offset="50%" stopColor="#E6399B" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#7B3FE4" stopOpacity={0.16} />
        </linearGradient>
        <linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B3FE4" stopOpacity={0.1} />
          <stop offset="40%" stopColor="#E6399B" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#2EC5E8" stopOpacity={0.14} />
        </linearGradient>
      </defs>
      <path d="M-100,120 C200,40 500,280 800,160 S1200,320 1540,80" stroke="url(#rg1)" strokeWidth={120} fill="none" opacity={0.6} />
      <path d="M-100,380 C300,260 600,520 900,360 S1300,480 1540,300" stroke="url(#rg2)" strokeWidth={80} fill="none" opacity={0.5} />
      <path d="M-100,500 C250,420 550,600 850,480 S1250,560 1540,440" stroke="url(#rg1)" strokeWidth={40} fill="none" opacity={0.3} />
    </svg>
  );
}
