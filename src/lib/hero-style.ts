/* Tipos compartidos de los estilos del título del hero (H1 y H2). Vive en su
   propio módulo porque `Hero` es un client component: importar un valor desde
   `@/lib/content` arrastraría la capa de base de datos al bundle del cliente. */

export type HeroStyleField =
  | "FontSize"
  | "FontFamily"
  | "FontWeight"
  | "FontStyle"
  | "Color";

/* Los estilos se editan dos veces: escritorio y móvil (sufijo `Mobile`). La
   variante móvil se aplica dentro del media query `screen and (max-width:
   1000px)`; si queda vacía se usa el valor de escritorio. */
export type HeroStyleKey =
  | `h1${HeroStyleField}`
  | `h1${HeroStyleField}Mobile`
  | `h2${HeroStyleField}`
  | `h2${HeroStyleField}Mobile`;

export type HeroStyleSettings = {
  [key in HeroStyleKey]?: string;
};

export function heroStyleKey(
  level: 1 | 2,
  field: HeroStyleField,
  mobile: boolean
): HeroStyleKey {
  return `h${level}${field}${mobile ? "Mobile" : ""}`;
}
