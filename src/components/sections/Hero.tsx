"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SITE, METRICS, HERO_VIDEO_ID } from "@/lib/constants";
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

  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const backdropY = useTransform(scrollY, [0, 900], [0, 240]);

  return (
    <section className="relative overflow-hidden bg-dark px-8 pt-[clamp(120px,18vw,180px)] pb-[clamp(56px,10vw,120px)] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          style={reducedMotion ? undefined : { y: backdropY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_VIDEO_ID}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
              title="Video de fondo del Simposio Dermocosmético"
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 brightness-[0.55]"
            />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/45 to-dark" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 50% 40%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 50% 40%, black 40%, transparent 100%)",
          }}
          aria-hidden
        />
      </div>

      <HeroRibbon />

      <Container className="relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroChildren}
          className="max-w-[720px] text-left"
        >
          <motion.p
            variants={heroChild}
            className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-accent"
          >
            {SITE.edition} - [PENDIENTE: fecha exacta] - [PENDIENTE: sede]
          </motion.p>
          <motion.h1
            variants={heroChild}
            className="mb-5 font-display text-[clamp(44px,6vw,76px)] font-bold leading-[1.04] tracking-tight text-white"
          >
            Una alianza que impulsa tu práctica. Una experiencia que reconoce tu
            confianza.
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mb-8 max-w-[52ch] text-[19px] leading-relaxed text-white/55"
          >
            {SITE.description}
          </motion.p>
          <motion.div
            variants={heroChild}
            className="flex flex-col gap-3 sm:flex-row sm:gap-3"
          >
            <Button
              variant="primary"
              className="w-full justify-center sm:w-auto"
              onClick={() => scrollTo("#registro")}
            >
              Registrarme
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-center sm:w-auto"
              onClick={() => scrollTo("#acerca")}
            >
              Conoce más
            </Button>
          </motion.div>
        </motion.div>

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
      <path
        d="M-100,120 C200,40 500,280 800,160 S1200,320 1540,80"
        stroke="url(#rg1)"
        strokeWidth={120}
        fill="none"
        opacity={0.6}
      />
      <path
        d="M-100,380 C300,260 600,520 900,360 S1300,480 1540,300"
        stroke="url(#rg2)"
        strokeWidth={80}
        fill="none"
        opacity={0.5}
      />
      <path
        d="M-100,500 C250,420 550,600 850,480 S1250,560 1540,440"
        stroke="url(#rg1)"
        strokeWidth={40}
        fill="none"
        opacity={0.3}
      />
    </svg>
  );
}
