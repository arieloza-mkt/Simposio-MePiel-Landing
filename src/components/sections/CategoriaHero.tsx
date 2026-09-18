import { Container } from "@/components/layout/Container";

export function CategoriaHero() {
  return (
    <section className="flex min-h-[380px] items-center overflow-hidden bg-[linear-gradient(115deg,#0a1350,#0d1a63_60%,#0a1350)] py-[clamp(48px,6vw,80px)] text-white">
      <Container className="relative z-10">
        <div className="flex flex-col-reverse items-center justify-between gap-[clamp(32px,5vw,72px)] md:flex-row">
          <div className="max-w-[720px] text-center md:text-left">
            <p className="mb-[18px] font-mono text-xs! font-bold uppercase tracking-[0.35em] text-white/80">
              Impulsando
            </p>
            <h2 className="m-0 font-display text-[clamp(38px,6.2vw,72px)] font-bold uppercase leading-[1.02] tracking-tight">
              <span className="block bg-[linear-gradient(90deg,#3ee9e6,#6fb8ff)] bg-clip-text text-transparent">
                La categoría
              </span>
              <span className="block bg-[linear-gradient(90deg,#6a5cf0,#8b7bf0)] bg-clip-text text-transparent">
                Dermocosmética
              </span>
            </h2>
            <p className="mt-[6px] font-mono text-[clamp(16px,1.8vw,26px)]! font-bold uppercase tracking-[0.25em] text-[#cfd6ff]">
              En México
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/cc4tium7/image/upload/v1787612015/logo-white.svg"
              alt="Simposio Dermocosmético"
              loading="lazy"
              decoding="async"
              className="h-auto w-[clamp(220px,32vw,420px)]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}