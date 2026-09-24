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
      const elTop = (el as HTMLElement).offsetTop;
      // #acerca es el wrapper h-[200vh] del LogoSpin: hay que recorrer
      // la sección completa hasta el fin de la revelación (progreso 1),
      // donde el hueco ya cubre la pantalla y CifrasPreview queda visible.
      const top =
        href === "#acerca" ? elTop + window.innerHeight : elTop - 60;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const backdropY = useTransform(scrollY, [0, 900], [0, 240]);
  const heroVideoId = hero.videoId;
  const heroYoutubeId = heroVideoId ? getYoutubeId(heroVideoId) : null;

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden bg-dark pt-[clamp(100px,16vw,160px)] pb-[clamp(48px,7vw,80px)] text-white max-sm:min-h-[70svh]"
    >
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
                className="absolute top-1/2 left-1/2 h-full min-h-full w-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover brightness-[0.6]"
              >
                <source src={heroVideoId} type="video/mp4" />
              </video>
            ) : heroYoutubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${heroYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroYoutubeId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                title="Video de fondo del Simposio Dermocosmético"
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 brightness-[0.6]"
              />
) : null}
          </div>
          <div className="absolute inset-0" aria-hidden>
            <div className="animate-aurora absolute -left-[22%] -top-[18%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(46,197,232,0.28),transparent_62%)] blur-3xl mix-blend-screen" />
            <div
              style={{ animationDelay: "-9s" }}
              className="animate-aurora absolute -right-[18%] -top-[8%] h-[64vmax] w-[64vmax] rounded-full bg-[radial-gradient(circle,rgba(230,57,155,0.2),transparent_62%)] blur-3xl mix-blend-screen"
            />
            <div
              style={{ animationDelay: "-17s" }}
              className="animate-aurora absolute -bottom-[30%] left-[22%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(123,63,228,0.18),transparent_62%)] blur-3xl mix-blend-screen"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/30 to-dark/80" />
        </motion.div>
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
            className="mb-5 font-display text-[clamp(48px,7vw,88px)] font-bold leading-[1.04] tracking-tight text-white max-sm:text-[clamp(32px,9vw,42px)]"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mb-8 max-w-[52ch] text-[19px] leading-relaxed text-white/55 max-sm:text-[16px]"
          >
            {site.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-10"
          >
            <button
              onClick={() => scrollTo("#acerca")}
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold tracking-wide text-white/80 transition hover:border-accent hover:text-accent active:translate-y-px focus-visible:outline-2 focus-visible:outline-accent"
            >
              Ver más
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
