export type ContentZone = "principal" | "secciones" | "extras";

export interface ContentSectionMeta {
  slug: string;
  title: string;
  description: string;
  zone: ContentZone;
}

export const CONTENT_SECTIONS: ContentSectionMeta[] = [
  {
    slug: "seo",
    title: "SEO",
    description: "Título de página, meta description y keywords.",
    zone: "principal",
  },
  {
    slug: "sitio",
    title: "Sitio",
    description: "Nombre del evento, edición actual, año y tagline.",
    zone: "principal",
  },
  {
    slug: "hero",
    title: "Hero",
    description: "Título principal, video de fondo y métricas.",
    zone: "principal",
  },
  {
    slug: "alianza",
    title: "Alianza",
    description: "Título, párrafos e imagen de la alianza con Mepiel.",
    zone: "secciones",
  },
  {
    slug: "queEs",
    title: "Acerca de",
    description: "Qué es el simposio: introducción, experiencia e imagen.",
    zone: "secciones",
  },
  {
    slug: "ediciones",
    title: "Ediciones",
    description: "Textos del modal de detalle y del botón «Ver más».",
    zone: "secciones",
  },
  {
    slug: "logoSpin",
    title: "Logo Spinner",
    description: "Logo del indicador de carga.",
    zone: "secciones",
  },
  {
    slug: "labsSection",
    title: "Laboratorios",
    description: "Antetítulo y título de la sección de laboratorios.",
    zone: "secciones",
  },
  {
    slug: "expositores",
    title: "Ponentes",
    description: "Antetítulo y título de la sección de ponentes.",
    zone: "secciones",
  },
  {
    slug: "registro",
    title: "Registro",
    description: "Formulario de registro de asistentes.",
    zone: "secciones",
  },
  {
    slug: "footer",
    title: "Footer",
    description: "Texto, links y logo del pie de página.",
    zone: "extras",
  },
  {
    slug: "labsList",
    title: "Lista Labs",
    description: "Logotipos de los laboratorios patrocinadores.",
    zone: "extras",
  },
];

export const CONTENT_ZONES: { key: ContentZone; title: string }[] = [
  { key: "principal", title: "Principal" },
  { key: "secciones", title: "Secciones" },
  { key: "extras", title: "Extras" },
];

export function getContentSectionMeta(slug: string) {
  return CONTENT_SECTIONS.find((s) => s.slug === slug);
}
