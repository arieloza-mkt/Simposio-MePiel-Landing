export const SITE = {
  name: "Simposio Dermocosmético",
  edition: "3a Edición",
  year: 2026,
  tagline:
    "El encuentro comercial más relevante de la industria dermocosmética en México",
  description:
    "Donde farmacias independientes, laboratorios, distribuidores y especialistas conectan para impulsar la categoría dermocosmética en punto de venta.",
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
    year: 2022,
    title: "Simposio Dermocosmético 2022",
    eyebrow: "Primera edición",
    description: "El Simposio arrancó con fuerza: más de 1000 profesionales del canal dermocosmético se reunieron por primera vez en México.",
    stats: [
      { value: "+1000", label: "Asistentes" },
      { value: "+15", label: "Laboratorios" },
      { value: "+30", label: "Conferencias" },
    ],
    video: false,
    images: [
      { src: "https://placehold.co/1920x1080?text=Edición+2024", alt: "Primera edición - panorama general" },
      { src: "https://placehold.co/1920x1080?text=Edición+2024", alt: "Primera edición - conferencia magistral" },
      { src: "https://placehold.co/1920x1080?text=Edición+2024", alt: "Primera edición - networking" },
    ],
  },
  {
    ordinal: "2da.",
    year: 2023,
    title: "Simposio Dermocosmético 2023",
    eyebrow: "Segunda edición",
    description: "La segunda edición superó todas las expectativas: más laboratorios, más contenido y una audiencia cualificada que consolidó al evento.",
    stats: [
      { value: "+3500", label: "Asistentes" },
      { value: "+40", label: "Laboratorios" },
      { value: "+50", label: "Conferencias" },
    ],
    video: false,
    images: [
      { src: "/ediciones/2023-1.jpg", alt: "Segunda edición - panorama general" },
      { src: "/ediciones/2023-2.jpg", alt: "Segunda edición - stands de laboratorios" },
      { src: "/ediciones/2023-3.jpg", alt: "Segunda edición - panel de expertos" },
    ],
  },
  {
    ordinal: "3ra.",
    year: 2026,
    title: "Simposio Dermocosmético 2026",
    eyebrow: "Tercera edición",
    description:
      "La edición más ambiciosa: más laboratorios, más contenido y más oportunidades de negocio que nunca.",
    stats: [
      { value: "+5000", label: "Asistentes" },
      { value: "+60", label: "Laboratorios" },
      { value: "+80", label: "Conferencias" },
    ],
    video: true,
    images: [
      { src: "/ediciones/2026-1.jpg", alt: "Tercera edición - proximamente" },
      { src: "/ediciones/2026-2.jpg", alt: "Tercera edición - lineup de speakers" },
      { src: "/ediciones/2026-3.jpg", alt: "Tercera edición - recinto del evento" },
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
];

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

export const SPEAKERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "[PENDIENTE: nombre]",
  role: "[PENDIENTE: puesto y empresa]",
}));

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
  { label: "El Simposio", href: "#acerca" },
  { label: "Ediciones", href: "#ediciones" },
  { label: "Expositores", href: "#laboratorios" },
  { label: "Para Laboratorios", href: "#para-labs" },
] as const;

export const PROFILE_OPTIONS = [
  { value: "", label: "Selecciona tu perfil" },
  { value: "farmacia", label: "Farmacia independiente (dueño/comprador)" },
  { value: "laboratorio", label: "Laboratorio / Marca dermocosmética" },
  { value: "trade", label: "Trade Marketing / Marketing comercial" },
  { value: "dermatologo", label: "Dermatólogo / KOL" },
  { value: "distribuidor", label: "Distribuidor" },
] as const;
