import cleanHtml from "sanitize-html";
import type { IOptions } from "sanitize-html";

/* El contenido de las secciones llega como HTML del editor (TipTap) y se
   guarda tal cual, así que hay que limpiarlo en el servidor antes de
   persistirlo.

   Se usa `sanitize-html` y no DOMPurify a propósito: DOMPurify necesita un
   DOM, y el único que había en el servidor era `jsdom`, que exige Node
   ^22.22.2 || ^24.15.0 || >=26.0.0. Con el Node del deploy reventaba el
   módulo entero con ERR_REQUIRE_ESM y la pantalla respondía 500.
   `sanitize-html` es JS puro y trabaja con la misma lista blanca. */

/* `allowedStyles` es una allowlist por propiedad: cualquier `style` que no
   esté aquí se descarta. Sin esto, `style="background:url(javascript:...)"`
   colaría entero, porque sanitize-html no inspecciona el valor de `style`.
   Lo que produce el editor es sobre todo `text-align` (extensión TextAlign). */
const HEX = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const COLOR_FN = /^(?:rgb|rgba|hsl|hsla)\(\s*[\d\s.,%/-]+\)$/i;
const KEYWORD = /^[a-zA-Z]{3,20}$/;
const LENGTH = /^(?:\d{1,3}(?:\.\d+)?)(?:px|rem|em|%|pt|vh|vw)$/;

const color = [HEX, COLOR_FN, KEYWORD];

const ALLOWED_STYLES: IOptions["allowedStyles"] = {
  "*": {
    "text-align": [/^(?:left|center|right|justify)$/],
    color,
    "background-color": color,
    "font-size": [LENGTH],
    "font-weight": [/^(?:normal|bold|[1-9]00)$/],
    "font-style": [/^(?:normal|italic)$/],
    "text-decoration": [/^(?:none|underline|line-through)$/],
  },
};

export function sanitizeHtml(html: string): string {
  return cleanHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "a", "span", "div"],
    allowedAttributes: { "*": ["href", "target", "rel", "class", "style"] },
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}

export function sanitizeHtmlSimple(html: string): string {
  return cleanHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}
