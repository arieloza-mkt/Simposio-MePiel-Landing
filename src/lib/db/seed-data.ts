import type { InferInsertModel } from "drizzle-orm";
import type {
  editions,
  faqItems,
  labs,
  scheduleItems,
  speakers,
} from "./schema";

const sp = (n: number) =>
  `00000000-0000-4000-a000-${String(n).padStart(12, "0")}`;
const ed = (n: number) =>
  `00000000-0000-4000-b000-${String(n).padStart(12, "0")}`;
const lb = (n: number) =>
  `00000000-0000-4000-c000-${String(n).padStart(12, "0")}`;
const sch = (n: number) =>
  `00000000-0000-4000-d000-${String(n).padStart(12, "0")}`;
const faq = (n: number) =>
  `00000000-0000-4000-e000-${String(n).padStart(12, "0")}`;

export const SPEAKER_SEED: (InferInsertModel<typeof speakers> & {
  id: string;
})[] = [
  { id: sp(1), name: "Margarita Trujillo", role: "Directora de Unidades de Negocio", company: "Grupo Mepiel", sortOrder: 1 },
  { id: sp(2), name: "Eliana Cardozo", role: "TD&DS BU's and Commercial Director", company: "Galderma México", sortOrder: 2 },
  { id: sp(3), name: "Andrea Figueroa", role: "Directora de Marketing y Transformación Digital", company: "NAOS", sortOrder: 3 },
  { id: sp(4), name: "Phillipe de Carvalho", role: "General Manager México y Director General de América", company: "Pierre Fabre", sortOrder: 4 },
  { id: sp(5), name: "Julián Moncada Restrepo", role: "Gerente de Zona Latinoamérica y Director México", company: "ISISPHARMA", sortOrder: 5 },
  { id: sp(6), name: "Sebastián Parisi", role: "Vicepresidente de Marketing Norteamérica", company: "Beiersdorf", sortOrder: 6 },
  { id: sp(7), name: "Mario Muñiz", role: "Sr. General Manager NOLA", company: "IQVIA", sortOrder: 7 },
  { id: sp(8), name: "Laurencia Mussol", role: "CEO Adjunta", company: "ISISPHARMA", sortOrder: 8 },
  { id: sp(9), name: "Mariagna Ortiz", role: "Directora Comercial", company: "Pierre Fabre México", sortOrder: 9 },
  { id: sp(10), name: "Salathiel Rosas", role: "Senior Digital and Community Manager", company: "ISDIN México", sortOrder: 10 },
  { id: sp(11), name: "Susana Alfaro", role: "Business Unit Head", company: "Eucerin México y Centroamérica", sortOrder: 11 },
  { id: sp(12), name: "Corrado De Gennaro", role: "CEO", company: "Galderma México", sortOrder: 12 },
  { id: sp(13), name: "Marie Di Cesare", role: "General Manager", company: "L'Oréal Dermatological Beauty México", sortOrder: 13 },
  { id: sp(14), name: "Andrés Razo", role: "Regional Managing Director", company: "NAOS Américas", sortOrder: 14 },
  { id: sp(15), name: "Joel Foradada", role: "LATAM Regional Manager", company: "PUIG", sortOrder: 15 },
];

export const EDITION_SEED: (InferInsertModel<typeof editions> & {
  id: string;
})[] = [
  {
    id: ed(1),
    logoUrl:
      "https://res.cloudinary.com/cc4tium7/image/upload/v1787610069/logo-primera-edicion.png",
    ordinal: "1ra.",
    year: 2024,
    eyebrow: "Primera edición",
    title: "El inicio de una conversación que transforma",
    description:
      "Una primera edición que reunió a expertos, líderes de la industria y profesionales de la salud para analizar el presente y futuro de la dermocosmética en México. Un espacio de intercambio y conocimiento que puso sobre la mesa las tendencias, retos y oportunidades de una categoría en constante evolución.",
    stats: [
      { value: "+1000", label: "Asistentes" },
      { value: "+15", label: "Laboratorios" },
      { value: "+30", label: "Conferencias" },
    ],
    videoId: null,
    backdropUrl:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
        alt: "Primera edición - panorama general",
      },
      {
        src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop",
        alt: "Primera edición - conferencia magistral",
      },
      {
        src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1170&auto=format&fit=crop",
        alt: "Primera edición - networking",
      },
    ],
    labs: [
      { name: "Uriage", image: "/images/uriage.png" },
      { name: "Eucerin", image: "https://placehold.co/300x160?text=Eucerin" },
      { name: "Pierre Fabre", image: "/images/pierre-fabre.png" },
      { name: "ISISPHARMA", image: "/images/isisphharma.png" },
      { name: "IFC", image: "https://placehold.co/300x160?text=IFC" },
      { name: "ISDIN", image: "/images/isdin.png" },
      { name: "IQVIA", image: "https://placehold.co/300x160?text=IQVIA" },
    ],
    speakerIds: [sp(1), sp(2), sp(3), sp(4), sp(5), sp(6)],
    sortOrder: 1,
  },
  {
    id: ed(2),
    logoUrl:
      "https://res.cloudinary.com/cc4tium7/image/upload/v1787610069/logo-segunda-edicion.png",
    ordinal: "2da.",
    year: 2025,
    eyebrow: "Segunda edición",
    title: "Consolidando una comunidad que impulsa la categoría",
    description:
      "Una segunda edición que llevó la conversación más allá, conectando a expertos y profesionales para compartir nuevas perspectivas, estrategias y oportunidades de crecimiento. Un encuentro que fortaleció la colaboración entre la industria y el punto de venta, consolidando al Simposio como un espacio clave para impulsar la dermocosmética en México.",
    stats: [
      { value: "+3500", label: "Asistentes" },
      { value: "+40", label: "Laboratorios" },
      { value: "+50", label: "Conferencias" },
    ],
    videoId: null,
    backdropUrl:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
        alt: "Segunda edición - panorama general",
      },
      {
        src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop",
        alt: "Segunda edición - stands de laboratorios",
      },
      {
        src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1170&auto=format&fit=crop",
        alt: "Segunda edición - panel de expertos",
      },
    ],
    labs: [
      { name: "ISDIN", image: "/images/isdin.png" },
      { name: "Cantabria Labs", image: "/images/cantabrialabs.png" },
      { name: "Galderma", image: "/images/galderma.png" },
      { name: "Pierre Fabre", image: "/images/pierre-fabre.png" },
      { name: "BDF", image: "https://placehold.co/300x160?text=BDF" },
      { name: "NAOS", image: "/images/naos.png" },
      { name: "Uriage", image: "/images/uriage.png" },
      { name: "ISISPHARMA", image: "/images/isisphharma.png" },
      { name: "L'Oréal Dermatological Beauty", image: "/images/loreal.png" },
      { name: "Megalabs", image: "/images/megalabs.png" },
      { name: "IQVIA", image: "https://placehold.co/300x160?text=IQVIA" },
    ],
    speakerIds: [sp(7), sp(8), sp(2), sp(9), sp(10), sp(11), sp(1), sp(12), sp(4), sp(13), sp(5), sp(14), sp(15)],
    sortOrder: 2,
  },
  {
    id: ed(3),
    logoUrl:
      "https://res.cloudinary.com/cc4tium7/image/upload/v1787610069/logo-segunda-edicion.png",
    ordinal: "3ra.",
    year: 2026,
    eyebrow: "Tercera edición",
    title: "En octubre, nos volvemos a encontrar",
    description:
      "La tercera edición del Simposio Dermocosmético llegará con la esencia que ya nos caracteriza, pero con nuevas experiencias para conectar, aprender y vivir la categoría de una forma diferente.\nHabrá más ponencias, espacios de convivencia y encuentros con los laboratorios participantes… y tenemos algo más preparado para esta edición que todavía no podemos revelar.\nNuevas experiencias. La misma misión: seguir impulsando juntos la dermocosmética en México.",
    stats: [
      { value: "+5000", label: "Asistentes" },
      { value: "+60", label: "Laboratorios" },
      { value: "+80", label: "Conferencias" },
    ],
    videoId: "SShlS6r6ZRg",
    backdropUrl:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
    images: [
      {
        src: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
        alt: "Tercera edición - próximamente",
      },
      {
        src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop",
        alt: "Tercera edición - lineup de speakers",
      },
      {
        src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1170&auto=format&fit=crop",
        alt: "Tercera edición - recinto del evento",
      },
    ],
    labs: [],
    speakerIds: [],
    sortOrder: 3,
  },
];

export const LAB_SEED: (InferInsertModel<typeof labs> & { id: string })[] =
  [
    { id: lb(1), name: "ISDIN", imageUrl: "/images/isdin.png", sortOrder: 1 },
    { id: lb(2), name: "Cantabria Labs", imageUrl: "/images/cantabrialabs.png", sortOrder: 2 },
    { id: lb(3), name: "Galderma", imageUrl: "/images/galderma.png", sortOrder: 3 },
    { id: lb(4), name: "L'Oréal Dermatological Beauty", imageUrl: "/images/loreal.png", sortOrder: 4 },
    { id: lb(5), name: "Pierre Fabre", imageUrl: "/images/pierre-fabre.png", sortOrder: 5 },
    { id: lb(6), name: "NAOS", imageUrl: "/images/naos.png", sortOrder: 6 },
    { id: lb(7), name: "Uriage", imageUrl: "/images/uriage.png", sortOrder: 7 },
    { id: lb(8), name: "ISISPHARMA", imageUrl: "/images/isisphharma.png", sortOrder: 8 },
    { id: lb(9), name: "Megalabs", imageUrl: "/images/megalabs.png", sortOrder: 9 },
    { id: lb(10), name: "Eucerin", imageUrl: "https://placehold.co/300x160?text=Eucerin", sortOrder: 10 },
    { id: lb(11), name: "BDF", imageUrl: "https://placehold.co/300x160?text=BDF", sortOrder: 11 },
    { id: lb(12), name: "IFC", imageUrl: "https://placehold.co/300x160?text=IFC", sortOrder: 12 },
    { id: lb(13), name: "IQVIA", imageUrl: "https://placehold.co/300x160?text=IQVIA", sortOrder: 13 },
  ];

export const SCHEDULE_SEED: (InferInsertModel<typeof scheduleItems> & {
  id: string;
})[] = [
  { id: sch(1), time: "09:00", title: "Registro y check-in", description: "Acreditación de asistentes y acceso al recinto.", tag: "Activo", sortOrder: 1 },
  { id: sch(2), time: "10:00", title: "[PENDIENTE: conferencia de apertura]", description: "Keynote de bienvenida a cargo de [PENDIENTE: nombre del ponente].", tag: "Conferencia", sortOrder: 2 },
  { id: sch(3), time: "11:00", title: "[PENDIENTE: bloque de conferencias]", tag: "Conferencia", sortOrder: 3 },
  { id: sch(4), time: "12:30", title: "Networking y descanso", description: "Coffee break y recorrido por los stands de exhibición.", tag: "Networking", sortOrder: 4 },
  { id: sch(5), time: "13:30", title: "[PENDIENTE: panel de expertos]", description: "Mesa redonda con [PENDIENTE: nombres de los panelistas].", tag: "Panel", sortOrder: 5 },
  { id: sch(6), time: "15:00", title: "[PENDIENTE: taller o actividad]", tag: "Activo", sortOrder: 6 },
  { id: sch(7), time: "17:00", title: "[PENDIENTE: cierre del evento]", tag: "Cierre", sortOrder: 7 },
];

export const FAQ_SEED: (InferInsertModel<typeof faqItems> & {
  id: string;
})[] = [
  {
    id: faq(1),
    question: "¿Quiénes pueden registrarse en el Simposio?",
    answer:
      "El Simposio está dirigido a profesionales del canal dermocosmético: dueños y compradores de farmacia independiente, gerentes de categoría, equipos de trade marketing, distribuidores, laboratorios dermocosméticos y dermatólogos prescriptores. Cada registro es validado por nuestro equipo.",
    sortOrder: 1,
  },
  {
    id: faq(2),
    question: "¿Cómo funciona el proceso de validación del registro?",
    answer:
      "Una vez que completas el formulario, nuestro equipo revisa tu perfil profesional para garantizar que el evento mantiene una audiencia cualificada. Recibirás un correo de confirmación con todos los detalles una vez aprobado tu registro.",
    sortOrder: 2,
  },
  {
    id: faq(3),
    question: "¿Tiene costo participar en el Simposio?",
    answer:
      "El Simposio Dermocosmético es un evento de registro sin costo para asistentes cualificados del canal. Si deseas participar como expositor o patrocinador, contáctanos para conocer las opciones disponibles.",
    sortOrder: 3,
  },
  {
    id: faq(4),
    question: "¿Cómo puedo participar como expositor o patrocinador?",
    answer:
      "Si eres un laboratorio o marca dermocosmética y deseas exhibir tu portafolio, contacta a nuestro equipo comercial. Ofrecemos stands, patrocinios de escenario, branding y oportunidades de networking exclusivo.",
    sortOrder: 4,
  },
  {
    id: faq(5),
    question: "¿Cuándo y dónde será la 3a edición?",
    answer:
      "[PENDIENTE: fecha exacta de la 3a edición] en [PENDIENTE: sede completa]. Te compartiremos la información detallada una vez que confirmes tu registro.",
    sortOrder: 5,
  },
];

export const SETTINGS_SEED: Record<string, unknown> = {
  site: {
    name: "Simposio Dermocosmético",
    edition: "3a Edición",
    year: 2026,
    tagline:
      "El encuentro comercial más relevante de la industria dermocosmética en México",
    description:
      "En mepiel distribuidores especializados creemos que una gran relación con nuestros médicos va más allá de ofrecer productos. Buscamos construir alianzas duraderas que generen valor para tu práctica, tus pacientes y tu crecimiento profesional.",
  },
  seo: {
    title: "Simposio Dermocosmético - 3a Edición - Registro Abierto",
    siteName: "Simposio Dermocosmético",
    keywords:
      "simposio, dermocosmética, farmacia, laboratorios, registro, evento, México, industria farmacéutica",
    description:
      "El encuentro comercial más relevante de la industria dermocosmética en México. Farmacias, laboratorios, distribuidores y especialistas conectan para impulsar la categoría.",
  },
  hero: {
    headline:
      "Una alianza que impulsa tu práctica. Una experiencia que reconoce tu confianza.",
    metrics: [
      { value: "+1500", label: "Asistentes\nacumulados" },
      { value: "+50", label: "Laboratorios\nparticipantes" },
      { value: "+400", label: "Horas de\ncontenido" },
      { value: "3", label: "Ediciones\nrealizadas" },
    ],
    videoId: "https://1t0z4lon9s.ucarecd.net/c60a2707-2c0f-44b6-a84e-14ed5b88e0d7/RECAPDOSEDICIONES.mp4",
  },
  transmision: {
    title: "Transmisión en vivo",
    description:
      "Acompáñanos en vivo o revive las sesiones del Simposio desde cualquier lugar.",
    videoId: "55q-1jpgnGc",
    isLive: true,
    backdropUrl:
      "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=1170&auto=format&fit=crop",
  },
  benefits: [
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
  ],
  attendeeTypes: [
    { label: "Farmacia independiente", icon: "building" },
    { label: "Laboratorios y marcas", icon: "grid" },
    { label: "Trade Marketing", icon: "user" },
    { label: "Dermatólogos y KOLs", icon: "clock" },
    { label: "Distribuidores", icon: "box" },
  ],
  tracks: [
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
  ],
  labFeatures: [
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
        "Sesiones de matching one-a-one con compradores de farmacia, distribuidores y dermatólogos prescriptores en un ambiente de confianza.",
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
  ],
  queEs: {
    eyebrow: "Qué es el Simposio",
    title: "Más que un evento, una experiencia para conectar y crecer",
    highlight: "conectar y crecer",
    intro:
      "El Simposio Dermocosmético reúne a especialistas, líderes de opinión y profesionales de la industria en un espacio diseñado para compartir conocimiento, descubrir nuevas tendencias y generar conexiones de valor.",
    experienceIntro: "Durante esta experiencia podrás disfrutar de:",
    experienceItems: [
      "Conferencias magistrales con líderes de la industria",
      "Sesiones de networking one-a-one",
      "Stands de exhibición de laboratorios",
      "Demos de punto de venta",
      "Una experiencia exclusiva diseñada para reconocer y fortalecer la relación con nuestros mejores aliados.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1112&auto=format&fit=crop",
    imageAlt: "Edición anterior del Simposio Dermocosmético",
  },
  mepielAlianza: {
    eyebrow: "Mepiel · Distribuidores Especializados",
    title: "Crecemos juntos para llevar la dermocosmética a otro nivel",
    highlight: "juntos",
    paragraphs: [
      "En mepiel distribuidores especializados creemos que una gran relación con nuestros médicos va más allá de ofrecer productos. Buscamos construir alianzas duraderas que generen valor para tu práctica, tus pacientes y tu crecimiento profesional.",
      "Por eso, nuestros clientes y aliados estratégicos tienen la oportunidad de acceder a experiencias exclusivas de capacitación, actualización y conexión profesional.",
      "Entre estas oportunidades se encuentra una invitación al Simposio Dermocosmético 2025, un encuentro creado para profesionales que buscan mantenerse a la vanguardia de la industria.",
    ],
    imageUrl: "",
    imageAlt: "Mepiel distribuidores especializados",
  },
  ctaCierre: {
    description:
      "No te quedes fuera de la conversación que está definiendo el futuro del canal dermocosmético. Regístrate ahora y forma parte de la 3a Edición.",
  },
  eventConfig: {
    startsAt: "2026-10-15T09:00:00-06:00",
    endsAt: "2026-10-15T18:00:00-06:00",
    timezone: "America/Mexico_City",
    dateLabel: "[PENDIENTE: fecha exacta] · Octubre 2026",
    venueLabel: "[PENDIENTE: sede], Ciudad de México",
  },
  logoSpin: {
    logoUrl:
      "https://res.cloudinary.com/cc4tium7/image/upload/v1787606525/Logo.png",
  },
  editionsModal: {
    speakersTitle: "Ponentes de la edición",
    speakersDescription:
      "Especialistas y líderes que compartieron su experiencia en escenario.",
    labsTitle: "Laboratorios participantes",
    labsDescription:
      "Las marcas que exhibieron su portafolio en el recinto.",
  },
  editionsPanel: {
    viewMoreText: "Ver más",
  },
  labsSection: {
    eyebrow: "Laboratorios participantes",
    title: "Las marcas que lideran la categoría",
  },
  expositoresSection: {
    eyebrow: "Expositores y speakers",
    title: "Líderes de la industria compartiendo su experiencia",
  },
  registroSection: {
    eyebrow: "Registro",
    title: "Asegura tu lugar en la 3a edición",
    description:
      "Completa el formulario y nuestro equipo revisará tu registro. Te confirmaremos tu asistencia por correo electrónico una vez validado tu perfil profesional.",
    validationText:
      "El Simposio es un evento B2B con aforo limitado. Cada registro es revisado por nuestro equipo para garantizar una audiencia cualificada de profesionales del canal dermocosmético.",
    dudasLabel: "¿Tienes dudas?",
    dudasLinkText: "Consulta nuestras preguntas frecuentes",
    submitButtonText: "Enviar mi registro",
  },
  footer: {
    description:
      "El encuentro comercial más relevante de la industria dermocosmética en México.",
    copyright: "© 2026 Simposio Dermocosmético. Todos los derechos reservados.",
    logoUrl:
      "https://res.cloudinary.com/cc4tium7/image/upload/v1787612015/logo-white.svg",
    privacyLinkText: "Aviso de privacidad",
    privacyLinkUrl: "#",
    eventLinks: [
      { label: "Acerca del Simposio", href: "#acerca" },
      { label: "Ediciones anteriores", href: "#ediciones" },
      { label: "Ejes temáticos", href: "#ejes-tematicos" },
      { label: "Preguntas frecuentes", href: "#faq" },
    ],
    participateLinks: [
      { label: "Registro de asistentes", href: "#registro" },
      { label: "Ser expositor", href: "#para-labs" },
      { label: "Patrocinadores", href: "#para-labs" },
    ],
    contactLinks: [
      { label: "contacto@simposiodermocosmetico.com", href: "mailto:contacto@simposiodermocosmetico.com" },
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
};
