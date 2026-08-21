export const SITE = {
  name: "Simposio Dermocosmético",
  edition: "3a Edición",
  year: 2026,
  tagline:
    "El encuentro comercial más relevante de la industria dermocosmética en México",
  description:
    "En mepiel distribuidores especializados creemos que una gran relación con nuestros médicos va más allá de ofrecer productos. Buscamos construir alianzas duraderas que generen valor para tu práctica, tus pacientes y tu crecimiento profesional. ",
} as const;

export const METRICS = [
  { value: "+1500", label: "Asistentes\nacumulados" },
  { value: "+50", label: "Laboratorios\nparticipantes" },
  { value: "+400", label: "Horas de\ncontenido" },
  { value: "3", label: "Ediciones\nrealizadas" },
] as const;

export const ATTENDEE_TYPES = [
  { label: "Farmacia independiente", icon: "building" },
  { label: "Laboratorios y marcas", icon: "grid" },
  { label: "Trade Marketing", icon: "user" },
  { label: "Dermatólogos y KOLs", icon: "clock" },
  { label: "Distribuidores", icon: "box" },
] as const;

export const BENEFITS = [
  {
    title: "Inteligencia de categoría",
    description:
      "Accede a datos de share of shelf, rotación de anaquel y benchmarks de categoría dermocosmética que no consigues en otro foro.",
    icon: "search",
  },
  {
    title: "Networking de canal",
    description:
      "Conecta directamente con compradores de farmacia, distribuidores clave y tomadores de decisión del canal en un espacio exclusivo.",
    icon: "users",
  },
  {
    title: "Tendencias de shopper",
    description:
      "Descubre los drivers de compra que están redefiniendo el punto de venta farmaceutico: omnicanalidad, shopper journey y activación en PDV.",
    icon: "activity",
  },
  {
    title: "Oportunidades comerciales",
    description:
      "Nuevas alianzas de distribución, acuerdos de planograma y oportunidades de co-patrocinio que se cierran en el evento.",
    icon: "layers",
  },
] as const;

export const EDITIONS = [
  {
    ordinal: "1ra.",
    year: 2024,
    title: "El inicio de una conversación que transforma ",
    eyebrow: "Primera edición",
    description:
      "Una primera edición que reunió a expertos, líderes de la industria y profesionales de la salud para analizar el presente y futuro de la dermocosmética en México. Un espacio de intercambio y conocimiento que puso sobre la mesa las tendencias, retos y oportunidades de una categoría en constante evolución.",
    stats: [
      { value: "+1000", label: "Asistentes" },
      { value: "+15", label: "Laboratorios" },
      { value: "+30", label: "Conferencias" },
    ],
    video: "" as string,
    labs: [
      { name: "Uriage", image: "/images/uriage.png" },
      { name: "Eucerin", image: "https://placehold.co/300x160?text=Eucerin" },
      { name: "Pierre Fabre", image: "/images/pierre-fabre.png" },
      { name: "ISISPHARMA", image: "/images/isisphharma.png" },
      { name: "IFC", image: "https://placehold.co/300x160?text=IFC" },
      { name: "ISDIN", image: "/images/isdin.png" },
      { name: "IQVIA", image: "https://placehold.co/300x160?text=IQVIA" },
    ] as { name: string; image: string }[],
    speakerIds: [1, 2, 3, 4, 5, 6],
    backdrop:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Primera edición - panorama general",
      },
      {
        src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Primera edición - conferencia magistral",
      },
      {
        src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Primera edición - networking",
      },
    ],
  },
  {
    ordinal: "2da.",
    year: 2025,
    title: "Consolidando una comunidad que impulsa la categoría ",
    eyebrow: "Segunda edición",
    description:
      "Una segunda edición que llevó la conversación más allá, conectando a expertos y profesionales para compartir nuevas perspectivas, estrategias y oportunidades de crecimiento. Un encuentro que fortaleció la colaboración entre la industria y el punto de venta, consolidando al Simposio como un espacio clave para impulsar la dermocosmética en México.",
    stats: [
      { value: "+3500", label: "Asistentes" },
      { value: "+40", label: "Laboratorios" },
      { value: "+50", label: "Conferencias" },
    ],
    video: "" as string,
    labs: [
      { name: "ISDIN", image: "/images/isdin.png" },
      { name: "Cantabria Labs", image: "/images/cantabrialabs.png" },
      { name: "Galderma", image: "/images/galderma.png" },
      { name: "Pierre Fabre", image: "/images/pierre-fabre.png" },
      { name: "BDF", image: "https://placehold.co/300x160?text=BDF" },
      { name: "NAOS", image: "/images/naos.png" },
      { name: "Uriage", image: "/images/uriage.png" },
      { name: "ISISPHARMA", image: "/images/isisphharma.png" },
      {
        name: "L'Oréal Dermatological Beauty",
        image: "/images/loreal.png",
      },
      { name: "Megalabs", image: "/images/megalabs.png" },
      { name: "IQVIA", image: "https://placehold.co/300x160?text=IQVIA" },
    ] as { name: string; image: string }[],
    speakerIds: [7, 8, 2, 9, 10, 11, 1, 12, 4, 13, 5, 14, 15],
    backdrop:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Segunda edición - panorama general",
      },
      {
        src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Segunda edición - stands de laboratorios",
      },
      {
        src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Segunda edición - panel de expertos",
      },
    ],
  },
  {
    ordinal: "3ra.",
    year: 2026,
    title: "En octubre, nos volvemos a encontrar",
    eyebrow: "Tercera edición",
    description: `La tercera edición del Simposio Dermocosmético llegará con la esencia que ya nos caracteriza, pero con nuevas experiencias para conectar, aprender y vivir la categoría de una forma diferente. 
    Habrá más ponencias, espacios de convivencia y encuentros con los laboratorios participantes… y tenemos algo más preparado para esta edición que todavía no podemos revelar.  
    Nuevas experiencias. La misma misión: seguir impulsando juntos la dermocosmética en México.`,
    stats: [
      { value: "+5000", label: "Asistentes" },
      { value: "+60", label: "Laboratorios" },
      { value: "+80", label: "Conferencias" },
    ],
    video: "SShlS6r6ZRg",
    labs: [] as { name: string; image: string }[],
    speakerIds: [] as number[],
    backdrop:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
    images: [
      { src: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Tercera edición - proximamente" },
      {
        src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Tercera edición - lineup de speakers",
      },
      {
        src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Tercera edición - recinto del evento",
      },
    ],
  },
] as const;

export const TRACKS = [
  {
    num: "01",
    title: "Categoría y Anaquel",
    description:
      "Estrategias de mix de producto, planograma y optimización de share of shelf para la categoría dermocosmética.",
  },
  {
    num: "02",
    title: "Marketing Dermocosmético",
    description:
      "Branding, posicionamiento y comunicación de marca en un entorno donde la prescripción clínica y el consumer packaging coexisten.",
  },
  {
    num: "03",
    title: "Innovación en Punto de Venta",
    description:
      "Experiencias de compra, activación digital en farmacia y tendencias de retail que están transformando el PDV.",
  },
  {
    num: "04",
    title: "Mercado Farmacéutico Independiente",
    description:
      "Desafíos y oportunidades del canal farmacia independiente: márgenes, rotación, fidelización y competencia con cadena.",
  },
  {
    num: "05",
    title: "Data y Shopper Insights",
    description:
      "Investigación de mercado, análisis de compra y herramientas de toma de decisión basada en datos del shopper de dermocosméticos.",
  },
  {
    num: "06",
    title: "Regulatorio y Formulación",
    description:
      "Marco regulatorio, compliance y tendencias en formulación que afectan la comercialización de productos dermocosméticos.",
  },
] as const;

export type ScheduleTag =
  | "Conferencia"
  | "Panel"
  | "Networking"
  | "Activo"
  | "Cierre";

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  tag: ScheduleTag;
}

export const SCHEDULE: ScheduleItem[] = [
  {
    time: "09:00",
    title: "Registro y check-in",
    description: "Acreditación de asistentes y acceso al recinto.",
    tag: "Activo",
  },
  {
    time: "10:00",
    title: "[PENDIENTE: conferencia de apertura]",
    description:
      "Keynote de bienvenida a cargo de [PENDIENTE: nombre del ponente].",
    tag: "Conferencia",
  },
  {
    time: "11:00",
    title: "[PENDIENTE: bloque de conferencias]",
    tag: "Conferencia",
  },
  {
    time: "12:30",
    title: "Networking y descanso",
    description: "Coffee break y recorrido por los stands de exhibición.",
    tag: "Networking",
  },
  {
    time: "13:30",
    title: "[PENDIENTE: panel de expertos]",
    description: "Mesa redonda con [PENDIENTE: nombres de los panelistas].",
    tag: "Panel",
  },
  {
    time: "15:00",
    title: "[PENDIENTE: taller o actividad]",
    tag: "Activo",
  },
  {
    time: "17:00",
    title: "[PENDIENTE: cierre del evento]",
    tag: "Cierre",
  },
];

export const LABS: { name: string; image: string }[] = [
  { name: "ISDIN", image: "/images/isdin.png" },
  { name: "Cantabria Labs", image: "/images/cantabrialabs.png" },
  { name: "Galderma", image: "/images/galderma.png" },
  { name: "L'Oréal Dermatological Beauty", image: "/images/loreal.png" },
  { name: "Pierre Fabre", image: "/images/pierre-fabre.png" },
  { name: "NAOS", image: "/images/naos.png" },
  { name: "Uriage", image: "/images/uriage.png" },
  { name: "ISISPHARMA", image: "/images/isisphharma.png" },
  { name: "Megalabs", image: "/images/megalabs.png" },
  // Pendiente reemplazar por logos oficiales en /public/images/
  { name: "Eucerin", image: "https://placehold.co/300x160?text=Eucerin" },
  { name: "BDF", image: "https://placehold.co/300x160?text=BDF" },
  { name: "IFC", image: "https://placehold.co/300x160?text=IFC" },
  { name: "IQVIA", image: "https://placehold.co/300x160?text=IQVIA" },
];

export const HERO_VIDEO_ID = "BOG_CbEDhag";

export const LIVESTREAM = {
  videoId: "55q-1jpgnGc",
  isLive: true,
  backdrop:
    "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop",
} as const;

export const LAB_FEATURES = [
  {
    title: "Stand de exhibición",
    description:
      "Presenta tu portafolio, demos de producto y activaciones de marca ante una audiencia cualificada de compradores y tomadores de decisión.",
    icon: "layout",
  },
  {
    title: "Keynote y talleres",
    description:
      "Posiciona a tus líderes como expertos de la categoría mediante conferencias magistrales, mesas redondas y talleres prácticos.",
    icon: "layers",
  },
  {
    title: "Networking exclusivo",
    description:
      "Sesiones de matching one-a-one con compradores de farmacia, distribuidores y dermágos prescriptores en un ambiente de confianza.",
    icon: "users",
  },
  {
    title: "Visibilidad de marca",
    description:
      "Logo en materiales del evento, menciones en redes sociales, inclusión en directorio digital y cobertura mediática del sector.",
    icon: "activity",
  },
  {
    title: "Inteligencia de mercado",
    description:
      "Accede a reportes exclusivos de tendencias de categoría, comportamiento del shopper y benchmarks del canal dermocosmético.",
    icon: "search",
  },
  {
    title: "Alianzas estratégicas",
    description:
      "Genera alianzas de co-patrocinio, distribución y planograma con farmacias independientes y distribuidores de alto volumen.",
    icon: "layers",
  },
] as const;

export interface Speaker {
  id: number;
  name: string;
  role?: string;
  company?: string;
  image?: string;
}

/**
 * Agrega o quita ponentes aquí. Se muestran en el carrusel del home y,
 * si se referencian por id en EDITIONS[].speakerIds, en el modal de cada edición.
 */
export const SPEAKERS: Speaker[] = [
  {
    id: 1,
    name: "Margarita Trujillo",
    role: "Directora de Unidades de Negocio",
    company: "Grupo Mepiel",
  },
  {
    id: 2,
    name: "Eliana Cardozo",
    role: "TD&DS BU's and Commercial Director",
    company: "Galderma México",
  },
  {
    id: 3,
    name: "Andrea Figueroa",
    role: "Directora de Marketing y Transformación Digital",
    company: "NAOS",
  },
  {
    id: 4,
    name: "Phillipe de Carvalho",
    role: "General Manager México y Director General de América",
    company: "Pierre Fabre",
  },
  {
    id: 5,
    name: "Julián Moncada Restrepo",
    role: "Gerente de Zona Latinoamérica y Director México",
    company: "ISISPHARMA",
  },
  {
    id: 6,
    name: "Sebastián Parisi",
    role: "Vicepresidente de Marketing Norteamérica",
    company: "Beiersdorf",
  },
  {
    id: 7,
    name: "Mario Muñiz",
    role: "Sr. General Manager NOLA",
    company: "IQVIA",
  },
  {
    id: 8,
    name: "Laurencia Mussol",
    role: "CEO Adjunta",
    company: "ISISPHARMA",
  },
  {
    id: 9,
    name: "Mariagna Ortiz",
    role: "Directora Comercial",
    company: "Pierre Fabre México",
  },
  {
    id: 10,
    name: "Salathiel Rosas",
    role: "Senior Digital and Community Manager",
    company: "ISDIN México",
  },
  {
    id: 11,
    name: "Susana Alfaro",
    role: "Business Unit Head",
    company: "Eucerin México y Centroamérica",
  },
  {
    id: 12,
    name: "Corrado De Gennaro",
    role: "CEO",
    company: "Galderma México",
  },
  {
    id: 13,
    name: "Marie Di Cesare",
    role: "General Manager",
    company: "L'Oréal Dermatological Beauty México",
  },
  {
    id: 14,
    name: "Andrés Razo",
    role: "Regional Managing Director",
    company: "NAOS Américas",
  },
  {
    id: 15,
    name: "Joel Foradada",
    role: "LATAM Regional Manager",
    company: "PUIG",
  },
];

export const GALLERY_ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  label: `[Foto galería ${i + 1}]`,
}));

export const FAQ_ITEMS = [
  {
    question: "¿Quiénes pueden registrarse en el Simposio?",
    answer:
      "El Simposio está dirigido a profesionales del canal dermocosmético: dueños y compradores de farmacia independiente, gerentes de categoría, equipos de trade marketing, distribuidores, laboratorios dermocosméticos y dermatólogos prescriptores. Cada registro es validado por nuestro equipo.",
  },
  {
    question: "¿Cómo funciona el proceso de validación del registro?",
    answer:
      "Una vez que completas el formulario, nuestro equipo revisa tu perfil profesional para garantizar que el evento mantiene una audiencia cualificada. Recibirás un correo de confirmación con todos los detalles una vez aprobado tu registro.",
  },
  {
    question: "¿Tiene costo participar en el Simposio?",
    answer:
      "El Simposio Dermocosmético es un evento de registro sin costo para asistentes cualificados del canal. Si deseas participar como expositor o patrocinador, contáctanos para conocer las opciones disponibles.",
  },
  {
    question: "¿Cómo puedo participar como expositor o patrocinador?",
    answer:
      "Si eres un laboratorio o marca dermocosmética y deseas exhibir tu portafolio, contacta a nuestro equipo comercial. Ofrecemos stands, patrocinios de escenario, branding y oportunidades de networking exclusivo.",
  },
  {
    question: "¿Cuándo y dónde será la 3a edición?",
    answer:
      "[PENDIENTE: fecha exacta de la 3a edición] en [PENDIENTE: sede completa]. Te compartiremos la información detallada una vez que confirmes tu registro.",
  },
] as const;

export const NAV_LINKS = [
  { label: "Acerca de", href: "#acerca" },
  { label: "Ediciones", href: "#ediciones" },
  { label: "Transmisión en Vivo", href: "#transmision" },
] as const;

export const PROFILE_OPTIONS = [
  { value: "", label: "Selecciona tu perfil" },
  { value: "farmacia", label: "Farmacia independiente (dueño/comprador)" },
  { value: "laboratorio", label: "Laboratorio / Marca dermocosmética" },
  { value: "trade", label: "Trade Marketing / Marketing comercial" },
  { value: "dermatologo", label: "Dermatólogo / KOL" },
  { value: "distribuidor", label: "Distribuidor" },
] as const;
