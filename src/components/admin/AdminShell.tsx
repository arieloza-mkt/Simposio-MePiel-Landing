"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { AdminNav } from "./AdminNav";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/cn";
import { PanelLeft, PanelLeftClose, X, ExternalLink, LogOut } from "lucide-react";

const COLLAPSE_KEY = "admin-sidebar-collapsed";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center border-b border-white/10",
          collapsed ? "justify-center px-2" : "gap-3 px-4",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/cc4tium7/image/upload/v1787612014/logo-color-white.svg"
          alt="Simposio Dermocosmético"
          className="h-8 w-auto"
        />
        {!collapsed && (
          <span className="font-display text-sm font-semibold tracking-tight text-white/80">
            Panel admin
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AdminNav collapsed={collapsed} />
      </div>

      <div className={cn("mt-auto border-t border-white/10 p-2", collapsed && "flex flex-col items-center gap-1")}>
        {collapsed ? (
          <ThemeSwitcher collapsed />
        ) : (
          <div className="px-2 py-1">
            <ThemeSwitcher collapsed={false} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sidebar desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden bg-[#0B1426] transition-[width] duration-200 lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#0B1426] shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={cn("lg:pl-16", !collapsed && "lg:pl-64")} style={{ transition: "padding-left 200ms" }}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Abrir menú"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <button
            onClick={toggleCollapsed}
            className="hidden h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary lg:grid"
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 truncate font-display text-sm font-semibold tracking-tight">
            Simposio Dermocosmético
          </div>

          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/">
              <ExternalLink className="h-4 w-4" />
              Ver sitio
            </Link>
          </Button>

          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </form>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
