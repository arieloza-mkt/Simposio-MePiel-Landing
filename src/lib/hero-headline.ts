/* El título del hero pasó de un único campo `headline` con HTML de TipTap a
   dos campos de texto plano: `h1` y `h2`. Este helper convierte el valor
   guardado con la forma anterior para no perder el contenido ya escrito.

   Solo se usa en el servidor (loader y migración de la fila `hero`): el hero
   es la primera página que se renderiza, así que no puede arrastrar un
   parser de HTML completo al bundle. Con un árbol de nodos de aquí abajo
   basta para quitar etiquetas y separar bloques. */

export interface HeroHeadline {
  h1: string;
  h2: string;
}

interface Node {
  tag: string;
  text: string;
  children: Node[];
}

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const BLOCK_TAGS = new Set([
  "p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "li", "ul", "ol",
  "blockquote", "section", "article", "br", "pre", "table", "tr",
]);

const HEADING_TAGS = new Set(["h1", "h2", "h3"]);

const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*?)?(\/?)>/g;

/* Solo las entidades que aparecen en contenido real: las de HTML básico y
   el rango Latin-1 (acentos y ñ). TipTap guarda Unicode literal, así que esto
   es una red de seguridad; lo que no esté en la tabla se deja tal cual. */
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  laquo: "«",
  raquo: "»",
  aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú",
  Aacute: "Á", Eacute: "É", Iacute: "Í", Oacute: "Ó", Uacute: "Ú",
  ntilde: "ñ", Ntilde: "Ñ", uuml: "ü", Uuml: "Ü",
  iquest: "¿", iexcl: "¡", deg: "°", middot: "·",
  copy: "©", reg: "®", trade: "™", euro: "€",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#[0-9]+|#[xX][0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (whole, body: string) => {
    if (body[0] !== "#") return ENTITIES[body.toLowerCase()] ?? whole;
    const code =
      body[1] === "x" || body[1] === "X"
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
    return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : whole;
  });
}

/* Árbol de nodos a partir de un fragmento de HTML. Las etiquetas sin cierre
   (<br>, <img>) no crean nodos padre y los cierres huérfanos se ignoran: el
   valor guardado puede venir de un editor y no siempre es HTML válido. */
function parseHtml(html: string): Node[] {
  const roots: Node[] = [];
  const stack: Node[] = [];
  let cursor = 0;

  const add = (node: Node) => {
    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(node);
    else roots.push(node);
  };

  TAG_RE.lastIndex = 0;
  for (let match = TAG_RE.exec(html); match; match = TAG_RE.exec(html)) {
    const between = html.slice(cursor, match.index);
    if (between.trim()) {
      add({ tag: "#text", text: decodeEntities(between), children: [] });
    }
    cursor = TAG_RE.lastIndex;

    const [, closing, rawTag, , selfClosing] = match;
    const tag = rawTag.toLowerCase();

    if (VOID_TAGS.has(tag) || selfClosing) {
      add({ tag, text: " ", children: [] });
      continue;
    }
    if (closing) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const node: Node = { tag, text: "", children: [] };
    add(node);
    stack.push(node);
  }

  const tail = html.slice(cursor);
  if (tail.trim()) {
    add({ tag: "#text", text: decodeEntities(tail), children: [] });
  }
  return roots;
}

const collapse = (value: string) => value.replace(/\s+/g, " ").trim();

/* Solo se separan los hijos de bloque (y el texto suelto); los hijos en línea
   (<strong>, <em>) se pegan para no partir palabras. */
function textOf(node: Node): string {
  let out = node.text;
  for (const child of node.children) {
    if (child.tag === "#text" || BLOCK_TAGS.has(child.tag)) out += " ";
    out += textOf(child);
  }
  return out;
}

function collectHeadings(nodes: Node[], found: Node[] = []): Node[] {
  for (const node of nodes) {
    if (HEADING_TAGS.has(node.tag)) found.push(node);
    else collectHeadings(node.children, found);
  }
  return found;
}

export function splitLegacyHeadline(raw: unknown): HeroHeadline {
  if (typeof raw !== "string" || raw.trim() === "") return { h1: "", h2: "" };

  const nodes = parseHtml(raw);

  // Caso habitual: el editor ya había guardado encabezados. Ojo: el
  // sanitizador de la versión anterior no permitía <h1>, así que pueden
  // haber quedado dos <h2>; el primero es el H1 y el segundo el H2.
  const headings = collectHeadings(nodes)
    .map((node) => collapse(textOf(node)))
    .filter(Boolean);
  if (headings.length > 0) {
    return { h1: headings[0], h2: headings[1] ?? "" };
  }

  // Varios bloques de primer nivel: el primero es el h1, el resto el h2.
  const blocks = nodes.map((node) => collapse(textOf(node))).filter(Boolean);
  if (blocks.length >= 2) {
    return { h1: blocks[0], h2: blocks.slice(1).join(" ") };
  }

  // Texto plano: se parte por la primera frase.
  const plain = collapse(blocks.join(" "));
  const sentences = plain.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  if (sentences) {
    return { h1: collapse(sentences[1]), h2: collapse(sentences[2]) };
  }
  return { h1: plain, h2: "" };
}
