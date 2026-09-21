"use client";

import { motion, type Variants } from "framer-motion";
import { TEMARIO_SPEAKERS, type TemarioSpeaker } from "./temario.data";

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Temario() {
  return (
    <section
      id="temario"
      className="relative bg-bg text-fg"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        {/* Encabezado */}
        <div className="mx-auto max-w-[900px] text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="m-0 font-display text-[clamp(14px,1.6vw,18px)] font-bold uppercase tracking-[0.45em] text-accent"
          >
            TEMARIO
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="m-0 mt-4 font-display text-[clamp(38px,6vw,72px)] font-bold leading-[1.02] tracking-tight text-fg max-sm:text-[clamp(30px,8vw,40px)]"
          >
            Conoce a nuestros ponentes
            <br className="hidden sm:block" />
            y los temas que abordarán
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="m-0 mt-5 text-[clamp(15px,1.6vw,18px)] leading-relaxed text-muted"
          >
            Especialistas de la industria que comparten los datos, estrategias y
            tendencias que definieren el presente y el futuro de la dermocosmética.
          </motion.p>
        </div>

        {/* Tarjetas horizontales */}
        <ol className="mt-[clamp(48px,8vw,96px)] m-0 list-none p-0 flex flex-col">
          {TEMARIO_SPEAKERS.map((speaker, i) => (
            <TemarioCard key={speaker.name} speaker={speaker} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TemarioCard({
  speaker,
  index,
}: {
  speaker: TemarioSpeaker;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -60px 0px" }}
      variants={cardVariant}
      transition={{ duration: 0.65, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group border-b border-border first:border-t"
    >
      <div className="grid items-center gap-x-6 gap-y-3 py-[clamp(28px,5vw,52px)] md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* Número */}
        <div className="flex items-center gap-4 md:gap-6">
          <span
            className="font-display text-[clamp(28px,4vw,56px)] font-bold leading-none text-accent transition-colors duration-300 group-hover:text-[var(--color-gm)]"
            aria-hidden
          >
            {num}
          </span>
          {speaker.image ? (
            <img
              src={speaker.image}
              alt={speaker.name}
              loading="lazy"
              className="hidden h-14 w-14 shrink-0 rounded-full border border-border object-cover sm:block"
            />
          ) : (
            <span
              aria-hidden
              className="hidden h-14 w-14 shrink-0 rounded-full border border-border bg-surface sm:block"
            />
          )}
        </div>

        {/* Nombre / puesto / empresa */}
        <div className="min-w-0">
          <h3 className="m-0 font-display text-[clamp(20px,2.4vw,30px)] font-bold leading-snug tracking-tight text-fg">
            {speaker.name}
          </h3>
          <p className="mt-1.5 text-[clamp(13px,1.4vw,15px)] leading-snug text-muted">
            {speaker.position}
          </p>
          <p className="mt-0.5 text-[clamp(13px,1.4vw,15px)] font-medium text-accent">
            {speaker.company}
          </p>
        </div>

        {/* Tema */}
        <div className="min-w-0">
          <p className="m-0 text-[clamp(16px,1.8vw,20px)] font-medium leading-snug text-fg/90 transition-colors duration-300 group-hover:text-accent">
            {speaker.topic}
          </p>
        </div>
      </div>
    </motion.li>
  );
}