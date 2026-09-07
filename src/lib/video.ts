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