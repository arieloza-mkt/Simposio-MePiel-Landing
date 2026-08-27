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
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/asistentes", label: "Asistentes", icon: Users },
  { href: "/admin/ponentes", label: "Ponentes", icon: Mic2 },
  { href: "/admin/cronograma", label: "Cronograma", icon: Calendar },
  { href: "/admin/ediciones", label: "Ediciones", icon: BookOpen },
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
];

export function AdminNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel de administración">
      <ul className="flex flex-col gap-1">
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
                title={link.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/90 text-primary-foreground"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  collapsed && "justify-center px-0",
                )}
              >
                <Icon
                  className="h-[18px] w-[18px] shrink-0"
                  strokeWidth={1.8}
                />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
