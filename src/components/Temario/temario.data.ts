export interface TemarioSpeaker {
  name: string;
  position: string;
  company: string;
  topic: string;
  image?: string;
}

export const TEMARIO_SPEAKERS: TemarioSpeaker[] = [
  {
    name: "Mario Muñiz",
    position: "Sr. General Manager NOLA",
    company: "IQVIA",
    topic: "¿Es el mercado Dermocosmético mexicano una oportunidad de negocio?",
  },
  {
    name: "Laurencia Mussol",
    position: "CEO Adjunta",
    company: "ISISPHARMA",
    topic: "Drivers de la categoría dermocosmética",
  },
  {
    name: "Eliana Cardozo",
    position: "TD&DS BU's and Commercial Director",
    company: "Galderma México",
    topic: "Marketing de la categoría",
  },
  {
    name: "Mariagna Ortiz",
    position: "Director Comercial",
    company: "Pierre Fabre México",
    topic: "Estrategia Digital",
  },
  {
    name: "Salathiel Rosas",
    position: "Senior Digital and Community Manager",
    company: "ISDIN México",
    topic: "Herramientas tecnológicas para tu negocio IA",
  },
  {
    name: "Susana Alfaro",
    position: "Business Unit Head",
    company: "Eucerin México y Centro América",
    topic: "Tendencias",
  },
  {
    name: "Margarita Trujillo",
    position: "Director Unidades de Negocio",
    company: "Grupo Mepiel",
    topic: "Estrategia comercial",
  },
];