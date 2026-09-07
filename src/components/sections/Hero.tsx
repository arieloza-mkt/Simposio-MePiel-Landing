"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { HeroSettings, SiteInfo } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { getYoutubeId } from "@/lib/video";

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

export function Hero({ site, hero }: { site: SiteInfo; hero: HeroSettings }) {
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
  const heroVideoId = hero.videoId;
  const heroYoutubeId = heroVideoId ? getYoutubeId(heroVideoId) : null;

  return (
    <section id="inicio" className="relative overflow-hidden bg-dark pt-[clamp(120px,18vw,180px)] pb-[clamp(56px,10vw,120px)] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          style={reducedMotion ? undefined : { y: backdropY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 overflow-hidden">
            {heroVideoId && !heroYoutubeId ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 h-full min-h-full w-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover brightness-[0.55]"
              >
                <source src={heroVideoId} type="video/mp4" />
              </video>
            ) : heroYoutubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${heroYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroYoutubeId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                title="Video de fondo del Simposio Dermocosmético"
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 brightness-[0.55]"
              />
            ) : null}
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

      <img
        src="https://res.cloudinary.com/cc4tium7/image/upload/v1787611636/hero-bg-decor.svg"
        alt=""
        aria-hidden
        loading="eager"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-[0.05]"
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroChildren}
          className="max-w-[720px] text-left"
        >
          <motion.h1
            variants={heroChild}
            className="mb-5 font-display text-[clamp(38px,6vw,76px)] font-bold leading-[1.04] tracking-tight text-white"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mb-8 max-w-[52ch] text-[19px] leading-relaxed text-white/55"
          >
            {site.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => scrollTo("#alianza")}
            aria-label="Scroll hacia abajo"
            className="group rounded-full border border-white/15 p-3 transition-colors hover:border-accent hover:text-accent text-white/40"
          >
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </motion.svg>
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
