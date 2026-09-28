import { JSDOM } from "jsdom";

/* El título del hero pasó de un único campo `headline` con HTML de TipTap a
   dos campos de texto plano: `h1` y `h2`. Este helper convierte el valor
   guardado con la forma anterior para no perder el contenido ya escrito.

   Solo se usa en el servidor (loader y migración de la fila `hero`). */

export interface HeroHeadline {
  h1: string;
  h2: string;
}

const collapse = (value: string) => value.replace(/\s+/g, " ").trim();

export function splitLegacyHeadline(raw: unknown): HeroHeadline {
  if (typeof raw !== "string" || raw.trim() === "") return { h1: "", h2: "" };

  const { document } = new JSDOM(`<body>${raw}</body>`).window;
  const text = (el: Element | null) => collapse(el?.textContent ?? "");

  // Caso habitual: el editor ya había guardado encabezados. Ojo: el
  // sanitizador de la versión anterior no permitía <h1>, así que pueden
  // haber quedado dos <h2>; el primero es el H1 y el segundo el H2.
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
    .map((el) => text(el))
    .filter(Boolean);
  if (headings.length > 0) {
    return { h1: headings[0], h2: headings[1] ?? "" };
  }

  // Varios bloques de primer nivel: el primero es el h1, el resto el h2.
  const blocks = Array.from(document.body.children)
    .map((el) => text(el))
    .filter(Boolean);
  if (blocks.length >= 2) {
    return { h1: blocks[0], h2: blocks.slice(1).join(" ") };
  }

  // Texto plano: se parte por la primera frase.
  const plain = text(document.body);
  const sentences = plain.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  if (sentences) {
    return { h1: collapse(sentences[1]), h2: collapse(sentences[2]) };
  }
  return { h1: plain, h2: "" };
}
