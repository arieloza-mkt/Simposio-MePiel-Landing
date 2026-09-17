"use client";

import type { Edition } from "@/lib/content";
import { Modal } from "@/components/ui/Modal";
import { PhotoCarousel } from "./PhotoCarousel";

export function EditionLightbox({
  open,
  onClose,
  edition,
}: {
  open: boolean;
  onClose: () => void;
  edition: Edition;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      label={`${edition.ordinal} edición — ${edition.year}`}
      className="h-[min(560px,calc(100dvh-3rem))] max-w-[min(1100px,96vw)] sm:h-[min(600px,calc(100dvh-4rem))]"
      bodyClassName="min-h-0 flex-1 overflow-y-auto overscroll-contain p-0 md:overflow-hidden"
    >
      <div className="grid grid-cols-1 md:h-full md:grid-cols-2">
        <div className="flex flex-col gap-5 p-6 pb-8 sm:p-10 md:min-h-0 md:overflow-y-auto">
          <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-accent">
            {edition.eyebrow}
          </p>
          <h3 className="m-0 font-display text-[clamp(28px,3vw,44px)] font-bold leading-[1.05] tracking-tight text-fg">
            {edition.title}
          </h3>
          <p className="m-0 whitespace-pre-line text-[17px] leading-relaxed text-muted">
            {edition.description}
          </p>
        </div>

        <div className="h-[45vh] md:h-full">
          {edition.images.length > 0 ? (
            <PhotoCarousel images={edition.images} fill autoplayMs={4500} />
          ) : (
            <div className="grid h-full place-items-center border-dashed border-border bg-bg font-mono text-xs uppercase tracking-widest text-muted md:border-l">
              [Sin imágenes de esta edición]
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}