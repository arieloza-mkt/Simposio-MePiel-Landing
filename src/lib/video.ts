const YOUTUBE_ID_RE =
  /(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{6,20})/;

export function getYoutubeId(value: string): string | null {
  const match = value.match(YOUTUBE_ID_RE);
  if (match) return match[1];
  if (/^(?:youtube\.com|youtu\.be)$/i.test(value)) return null;
  if (/^[\w-]{6,20}$/.test(value)) return value;
  return null;
}

export function isYoutubeUrl(value: string): boolean {
  return /youtube\.com|youtu\.be/i.test(value);
}

/* Un slide es video solo si es de YouTube: el carrusel no sabe reproducir
   archivos .mp4 en la galería, los trataría como imagen rota. */
export function isVideoSlide(src: string): boolean {
  return getYoutubeId(src) !== null;
}

/* Regla del carrusel de ediciones: los videos van siempre al inicio, las
   fotos después. El orden relativo dentro de cada grupo se conserva (el sort
   de JS es estable). */
export function sortVideosFirst<T extends { src: string }>(
  slides: readonly T[],
): T[] {
  return [...slides].sort(
    (a, b) => Number(isVideoSlide(b.src)) - Number(isVideoSlide(a.src)),
  );
}
