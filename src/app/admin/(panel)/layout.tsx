import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { ThemeSwitcher } from "@/components/admin/ThemeSwitcher";

export const metadata: Metadata = {
  title: "Panel · Simposio Dermocosmético",
};

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-8">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="mb-6 flex items-center justify-between gap-3 lg:block">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/cc4tium7/image/upload/v1787612014/logo-color-white.svg"
                alt="Simposio Dermocosmético"
                className="mb-2 h-8 w-auto opacity-90"
              />
              <p className="font-display text-sm font-semibold tracking-tight text-muted">
                Panel admin
              </p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:bg-fg/5 hover:text-fg lg:hidden"
            >
              Ver sitio
            </Link>
          </div>

          <AdminNav />

          <div className="mt-6 hidden lg:block">
            <ThemeSwitcher />
          </div>

          <div className="mt-4 hidden flex-col gap-2 lg:flex">
            <Link
              href="/"
              className="rounded-lg border border-border px-3 py-2 text-center text-xs text-muted transition hover:bg-fg/5 hover:text-fg"
            >
              Ver sitio público
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted transition hover:bg-error/10 hover:text-error"
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          <div className="mt-5 lg:hidden">
            <ThemeSwitcher />
          </div>

          <form action={logout} className="mt-3 lg:hidden">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted transition hover:bg-error/10 hover:text-error"
            >
              Cerrar sesión
            </button>
          </form>
        </aside>

        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
