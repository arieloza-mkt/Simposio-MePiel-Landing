import type { JSX } from "react";

const PATHS: Record<string, JSX.Element> = {
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-5 3 3 5-6" />
    </>
  ),
  flask: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" />
    </>
  ),
  podium: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    </>
  ),
  star: (
    <>
      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L4.3 9.2l5.9-.9z" />
    </>
  ),
  rocket: (
    <>
      <path d="M5 15c-1 1-1.5 4-1.5 4s3 0 4-1.5" />
      <path d="M15 5c3-2 6-2 6-2s0 3-2 6c-1.5 2.2-4 3-4 3l-3-3s.8-2.5 3-4z" />
      <circle cx="14.5" cy="9.5" r="1.5" />
    </>
  ),
  check: (
    <>
      <path d="M20 6L9 17l-5-5" />
    </>
  ),
  heart: (
    <>
      <path d="M20.8 5.6a5 5 0 00-7.1 0L12 7.4l-1.7-1.8a5 5 0 00-7.1 7.1l1.8 1.8L12 21l7-6.5 1.8-1.8a5 5 0 000-7.1z" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0014 0M12 17v4M8 21h8" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
    </>
  ),
};

export const EXPERIENCE_ICON_KEYS = Object.keys(PATHS);

export function ExperienceIcon({
  icon,
  className = "h-5 w-5",
}: {
  icon?: string | null;
  className?: string;
}) {
  if (icon && PATHS[icon]) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
      >
        {PATHS[icon]}
      </svg>
    );
  }

  if (icon && /^https?:\/\//i.test(icon)) {
    return <img src={icon} alt="" className={`${className} object-contain`} />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS.chart}
    </svg>
  );
}