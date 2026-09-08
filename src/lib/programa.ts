export type ProgramaItemKind =
  | "conferencia"
  | "conversatorio"
  | "taller"
  | "negocios"
  | "break"
  | "comida"
  | "libre"
  | "evento"
  | "logistica";

export type ProgramaItem = {
  id: string;
  day: 1 | 2 | 3;
  start: string;
  end: string;
  title: string;
  speakers?: string[];
  salon?: string;
  nota?: string;
  kind: ProgramaItemKind;
  // Solo si el item aplica a una modalidad; vacío = ambas.
  modo?: ProgramaModo;
  // [PENDIENTE CONFIRMAR] campos cuyo valor se leyó parcialmente del póster
  confirm?: string;
};

export const PROGRAMA_MODO_FORANEOS = "FORÁNEOS";
export const PROGRAMA_MODO_LOCALES = "LOCALES";
export type ProgramaModo = typeof PROGRAMA_MODO_FORANEOS | typeof PROGRAMA_MODO_LOCALES;

// 1 = Lunes 12 (llegada) · 2 = Martes 13 · 3 = Miércoles 14
export const PROGRAMA_DIA_LABEL: Record<1 | 2 | 3, string> = {
  1: "LUNES 12",
  2: "MARTES 13",
  3: "MIÉRCOLES 14",
};

export const PROGRAMA_VENUE = "La Casa de los Abanicos";
export const PROGRAMA_VENUE_DIRECCION =
  "Libertad 1823, Col. Americana, 44100 Guadalajara, Jal.";

export const PROGRAMA_KINDS: { value: ProgramaItemKind; label: string }[] = [
  { value: "conferencia", label: "Conferencia" },
  { value: "conversatorio", label: "Conversatorio" },
  { value: "taller", label: "Taller" },
  { value: "negocios", label: "Rueda de negocios" },
  { value: "break", label: "Break / Coffee" },
  { value: "comida", label: "Comida" },
  { value: "libre", label: "Libre" },
  { value: "evento", label: "Evento especial" },
  { value: "logistica", label: "Logística / Llegada" },
];

// ---------------------------------------------------------------
// DATOS EXTRAÍDOS DE LOS PÓSTERS DE REFERENCIA:
//   /home/aridev/Documentos/Simposio/Programa - Foraneos.png
//   /home/aridev/Documentos/Simposio/Progrma Local.png
// Ambos comparten la misma agenda (columna izq = Martes 13,
// columna der = Miércoles 14); la versión FORÁNEOS añade la
// logística de viaje (aeropuerto, hotel, traslados), que se
// reparte en el día de llegada (Lunes 12) y el cierre del Martes 13.
// Cualquier valor incierto queda marcado con [PENDIENTE CONFIRMAR].
// ---------------------------------------------------------------

// Día 1 · Lunes 12 (día de llegada). EXCLUSIVO modalidad FORÁNEOS
// (modo = "FORÁNEOS"); no se muestra en la pestaña LOCALES.
// Sin actividades de agenda; solo logística derivada del bloque
// "Llegada" del póster FORÁNEOS.
const DIA_LUNES: ProgramaItem[] = [
  {
    id: "lun-llegada",
    day: 1,
    start: "",
    end: "",
    title: "Llegada al aeropuerto de Guadalajara",
    nota: "Se contará con traslados en horarios específicos durante todo el día.\nLos detalles serán compartidos aproximándose su vuelo.",
    kind: "logistica",
    modo: PROGRAMA_MODO_FORANEOS,
    // [PENDIENTE CONFIRMAR] el póster no incluye un bloque "LUNES 12";
    // este día se construyó a partir de la logística de llegada FORÁNEOS.
    confirm: "Día de llegada; confirmar actividades del lunes 12",
  },
  {
    id: "lun-traslado",
    day: 1,
    start: "",
    end: "",
    title: "Traslado al hotel",
    nota: "Punto de encuentro: salida de vuelos nacionales.\n*Pueden optar por llegar al hotel por su cuenta.",
    kind: "logistica",
    modo: PROGRAMA_MODO_FORANEOS,
    confirm: "Día de llegada; confirmar actividades del lunes 12",
  },
  {
    id: "lun-hotel",
    day: 1,
    start: "",
    end: "",
    title: "Hotel: Hilton Midtown Guadalajara",
    nota: "Av. Adolfo López Mateos Nte. 2405-300, Italia Providencia, 44648 Guadalajara, Jal.\nDesayuno buffet en el restaurante Harth (6:00-9:00 AM).* Solo para huéspedes del hotel.\nCheck-out en hotel: debe realizarse a más tardar [hora pendiente de confirmar].",
    kind: "logistica",
    modo: PROGRAMA_MODO_FORANEOS,
    // [PENDIENTE CONFIRMAR] la hora límite de check-out no se leyó en el póster
    confirm: "Hora límite de check-out por confirmar",
  },
];

// Día 2 · Martes 13. Los horarios y textos corresponden a la
// columna izquierda (FORÁNEOS) / columna A (LOCALES) de los pósters.
// El cierre del día (regreso al aeropuerto) es exclusivo FORÁNEOS.
const DIA_MARTES: ProgramaItem[] = [
  {
    id: "mar-traslado-evento",
    day: 2,
    start: "",
    end: "",
    title: "Traslado del hotel al evento",
    nota: "Si requieres traslado a \"La Casa de los Abanicos\", el transporte saldrá del hotel \"Hilton Midtown\".\nPunto de encuentro: recepción, piso 1.\n*Pueden optar por llegar al evento por su cuenta.",
    kind: "logistica",
    modo: PROGRAMA_MODO_FORANEOS,
    // [PENDIENTE CONFIRMAR] el póster muestra "07:15 p. m." y "08:30 AM";
    // se presume que el traslado matutino corresponde al día del evento.
    confirm: "La hora de salida aparece como '07:15 pm'; verificar si es AM",
  },
  {
    id: "mar-bienvenida",
    day: 2,
    start: "09:00",
    end: "09:15",
    title: "Bienvenida e introducción del simposio",
    salon: "Plenaria",
    kind: "conferencia",
  },
  {
    id: "mar-mercado",
    day: 2,
    start: "09:15",
    end: "10:00",
    title: "¿Qué está pasando en el mercado dermocosmético mexicano? Enfoque holístico",
    speakers: ["Mario Muñiz · Sr. General Manager North Latam IQVA"],
    salon: "Plenaria",
    kind: "conferencia",
  },
  {
    id: "mar-consumidores",
    day: 2,
    start: "10:00",
    end: "10:40",
    title: "Tipos de consumidores dermocosméticos en el mercado actual · visión global",
    speakers: ["Sebastián Philippe · Regional Director Uriage Americas - UK-Germany"],
    salon: "Plenaria",
    kind: "conferencia",
  },
  {
    id: "mar-tendencias",
    day: 2,
    start: "10:40",
    end: "11:10",
    title: "Conversatorio: Tendencias de la categoría dermocosmética",
    speakers: [
      "Corrado De Gennaro · CEO México y Director Galderma Latinoamérica",
      "Phillipe De Carvalho · General Manager México y Director General de América Pierre Fabre",
      "Alexandra Schwoob · General Manager LBD México",
    ],
    salon: "Plenaria",
    kind: "conversatorio",
  },
  {
    id: "mar-break-1",
    day: 2,
    start: "11:10",
    end: "11:40",
    title: "Muestra comercial · Coffee break",
    salon: "Plenaria",
    kind: "break",
  },
  {
    id: "mar-ia-first",
    day: 2,
    start: "11:40",
    end: "12:20",
    title: "Conversatorio: IA FIRST",
    // [PENDIENTE CONFIRMAR] hora de fin leída como "12:20" en el póster
    confirm: "Hora de fin del Conversatorio IA FIRST",
    speakers: [
      "Mario Muñiz · Sr. General Manager North Latam IQVA",
      "Salathiel Rosas · Senior Digital and Community Manager ISDIN México",
      "Yesenia Obregón Pérez · Associate Director, Client Services",
    ],
    salon: "Plenaria",
    kind: "conversatorio",
  },
  {
    id: "mar-walk-talks",
    day: 2,
    start: "12:20",
    end: "14:40",
    title: "Walk and Talks",
    nota: "Marketing de Categoría · Taller Estrategia Ecommerce · Herramientas de IA",
    salon: "Plenaria / Agave, Piso 1 / Flex room, Piso 1",
    kind: "taller",
  },
  {
    id: "mar-comida",
    day: 2,
    start: "14:40",
    end: "15:40",
    title: "Comida",
    kind: "comida",
  },
  {
    id: "mar-mercado-paralelo",
    day: 2,
    start: "15:40",
    end: "16:10",
    title: "Mercado paralelo: implicaciones legales",
    // [PENDIENTE CONFIRMAR] horario entre "Comida" (02:40) y "La paradoja de la recompra" (04:10)
    confirm: "Horario estimado entre 15:40 y 16:10; no se leyó completo",
    speakers: [
      "Ignacio Salgado · Director de talento y legal Cantabria México",
      "Brenda Galindo · Directora de regulatorio y calidad Cantabria México",
    ],
    salon: "Plenaria",
    kind: "conferencia",
  },
  {
    id: "mar-paradoja",
    day: 2,
    start: "16:10",
    end: "16:55",
    title: "La paradoja de la recompra",
    // [PENDIENTE CONFIRMAR] el póster muestra "04:10" y no se alcanzó a leer la hora de fin
    confirm: "Hora de fin leída como '04:??'; se asume 16:55 hasta el coffee break",
    speakers: ["Francisco Luna Juárez · Regional Medical Manager Latam BDF"],
    salon: "Plenaria",
    kind: "conferencia",
  },
  {
    id: "mar-break-2",
    day: 2,
    start: "16:55",
    end: "17:25",
    title: "Muestra comercial · Coffee break",
    salon: "Plenaria",
    kind: "break",
  },
  {
    id: "mar-cierre",
    day: 2,
    start: "17:25",
    end: "17:40",
    title: "Cierre día 2",
    salon: "Plenaria",
    kind: "evento",
  },
  {
    id: "mar-libre",
    day: 2,
    start: "17:40",
    end: "19:00",
    title: "Libre",
    kind: "libre",
  },
  {
    id: "mar-celebracion",
    day: 2,
    start: "19:00",
    end: "19:30",
    title: "Pick up · Celebración 30 años mepiel distribuidores",
    nota: "Entrada del Hotel Hilton Midtown Guadalajara · 19:30 Celebración en La Casa de los Abanicos\nDress code: Formal Black & White.",
    // [PENDIENTE CONFIRMAR] el póster muestra "07:00 PM" pickup y "07:30 PM - 12:00" celebración
    confirm: "Rango de la celebración leído como '07:30 PM-12:00'",
    kind: "evento",
  },
  // Cierre del día Martes 13 · solo FORÁNEOS: traslados de regreso.
  {
    id: "mar-regreso",
    day: 2,
    start: "",
    end: "",
    title: "Regreso · Aeropuerto de Guadalajara",
    nota: "Se contará con traslados en horarios específicos durante el día.\nLos detalles serán compartidos aproximándose su vuelo.\nPunto de encuentro: recepción, piso 1.\nAeropuerto de Guadalajara · Carr. Guadalajara-Chapala Km 17.5, 45659 Jal.",
    kind: "logistica",
    modo: PROGRAMA_MODO_FORANEOS,
  },
];

// Día 3 · Miércoles 14. Columna derecha de ambos pósters.
// [PENDIENTE CONFIRMAR] los rangos de hora del día 3 solo se leyeron
// parcialmente ("09:00 AM-1...", "11:00 AM-12:...", "12:00 PM-0...").
const DIA_MIERCOLES: ProgramaItem[] = [
  {
    id: "mie-lanzamiento",
    day: 3,
    start: "09:00",
    end: "",
    title: "Lanzamiento PROBIOMS (exclusivo médicos)",
    salon: "(por confirmar)",
    kind: "evento",
    confirm: "Hora de fin sin leer en el póster",
  },
  {
    id: "mie-rueda",
    day: 3,
    start: "09:00",
    end: "",
    title: "Rueda de negocios",
    salon: "Plenaria",
    kind: "negocios",
    confirm: "Hora de fin sin leer en el póster",
  },
  {
    id: "mie-workshop",
    day: 3,
    start: "11:00",
    end: "12:00",
    title: "Workshop: La ruta para una clínica exitosa 2.0",
    salon: "(por confirmar)",
    kind: "taller",
    confirm: "Rango leído como '11:00 AM-12:...'",
  },
  {
    id: "mie-brunch",
    day: 3,
    start: "12:00",
    end: "13:00",
    title: "Brunch y Networking: Constructores de la categoría dermocosmética en México",
    nota: "Cierre de simposio",
    salon: "Foyer · Plenaria",
    kind: "evento",
    confirm: "Hora de fin sin leer en el póster ('12:00 PM-0...')",
  },
];

export const PROGRAMA_BY_DAY: Record<1 | 2 | 3, ProgramaItem[]> = {
  1: DIA_LUNES,
  2: DIA_MARTES,
  3: DIA_MIERCOLES,
};