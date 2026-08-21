"use client";

import { useState } from "react";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className={`border-b border-border ${isOpen ? "open" : ""}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-5 border-none bg-transparent py-5 text-left text-base font-medium text-fg transition-colors hover:text-accent"
      >
        {question}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-[var(--ease-out-expo)] ${
          isOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="max-w-[60ch] pb-5 text-[15px] leading-relaxed text-muted">
          {answer}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { question: string; answer: string }[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="border-t border-border">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          question={item.question}
          answer={item.answer}
          isOpen={i === openIndex}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}
