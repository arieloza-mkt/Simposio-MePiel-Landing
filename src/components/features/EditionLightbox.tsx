"use client";

import type { Edition } from "@/lib/content";
import { Modal } from "@/components/ui/Modal";

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
      className="max-w-2xl"
    >
      <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-accent">
        {edition.eyebrow}
      </p>
      <h3 className="m-0 mt-3 font-display text-[clamp(28px,3vw,44px)] font-bold leading-[1.05] tracking-tight text-fg">
        {edition.title}
      </h3>
      <p className="m-0 mt-5 whitespace-pre-line text-[17px] leading-relaxed text-muted">
        {edition.description}
      </p>
    </Modal>
  );
}