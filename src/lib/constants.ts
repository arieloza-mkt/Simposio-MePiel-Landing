export const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Acerca de", href: "#acerca" },
  // { label: "Expositores", href: "#ponentes" },
  { label: "Laboratorios", href: "#laboratorios" },
  { label: "Ediciones", href: "#ediciones" },
] as const;

export const PROFILE_OPTIONS = [
  { value: "", label: "Selecciona tu perfil" },
  { value: "farmacia", label: "Farmacia independiente (dueño/comprador)" },
  { value: "laboratorio", label: "Laboratorio / Marca dermocosmética" },
  { value: "trade", label: "Trade Marketing / Marketing comercial" },
  { value: "dermatologo", label: "Dermatólogo / KOL" },
  { value: "distribuidor", label: "Distribuidor" },
] as const;

export const GALLERY_ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  label: `[Foto galería ${i + 1}]`,
}));
