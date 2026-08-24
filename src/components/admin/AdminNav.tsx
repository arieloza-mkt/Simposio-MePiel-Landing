"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/registros", label: "Registros" },
  { href: "/admin/asistencia", label: "Asistencia" },
  { href: "/admin/transmision", label: "Transmisión" },
  { href: "/admin/ponentes", label: "Ponentes" },
  { href: "/admin/cronograma", label: "Cronograma" },
  { href: "/admin/ediciones", label: "Ediciones" },
  { href: "/admin/contenido", label: "Contenido landing" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel de administración">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-muted hover:bg-fg/5 hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
