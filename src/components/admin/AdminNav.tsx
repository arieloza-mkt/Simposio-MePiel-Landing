"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mic2,
  Calendar,
  BookOpen,
  FileText,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/asistentes", label: "Asistentes", icon: Users },
  { href: "/admin/ponentes", label: "Ponentes", icon: Mic2 },
  { href: "/admin/cronograma", label: "Cronograma", icon: Calendar },
  { href: "/admin/ediciones", label: "Ediciones", icon: BookOpen },
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
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
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-muted hover:bg-fg/5 hover:text-fg"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
