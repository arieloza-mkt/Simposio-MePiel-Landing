import type { ProgramaItemKind } from "@/lib/programa";

// Badges compactos con colores vivos (sin rojos).
export const KIND_PILL: Record<ProgramaItemKind, string> = {
  conferencia: "border-transparent bg-program-purple text-white",
  conversatorio: "border-transparent bg-program-cyan text-program-navy",
  taller: "border-transparent bg-program-turquoise text-program-navy",
  negocios: "border-transparent bg-amber-300 text-black",
  evento: "border-transparent bg-[#ffc94d] text-black",
  break: "border-transparent bg-program-lilac text-program-navy",
  comida: "border-transparent bg-fuchsia-400 text-program-navy",
  libre: "border-dashed border-program-lilac/50 text-program-lilac-text",
  logistica: "border-transparent bg-program-blue/90 text-program-cyan",
};

// Chip de ícono translúcido según el tipo de actividad.
export const KIND_ICON: Record<ProgramaItemKind, string> = {
  conferencia: "bg-program-purple/20 text-program-purple",
  conversatorio: "bg-program-cyan/15 text-program-cyan",
  taller: "bg-program-turquoise/15 text-program-turquoise",
  negocios: "bg-amber-300/20 text-amber-300",
  evento: "bg-[#ffc94d]/20 text-[#ffc94d]",
  break: "bg-program-lilac/15 text-program-lilac",
  comida: "bg-fuchsia-400/20 text-fuchsia-400",
  libre: "bg-program-lilac/10 text-program-lilac-text",
  logistica: "bg-program-cyan/15 text-program-cyan",
};