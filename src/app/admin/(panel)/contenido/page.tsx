import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CONTENT_SECTIONS, CONTENT_ZONES } from "@/lib/content-sections";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/shadcn/card";

export default function AdminContenidoPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Contenido landing
        </h1>
        <p className="mt-1 text-sm text-muted">
          Elige una sección para editar sus textos e imágenes. Los cambios se
          reflejan al recargar la landing.
        </p>
      </header>

      <div className="flex flex-col gap-9">
        {CONTENT_ZONES.map((zone) => {
          const items = CONTENT_SECTIONS.filter((s) => s.zone === zone.key);
          if (items.length === 0) return null;

          return (
            <section key={zone.key}>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-muted">
                {zone.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {items.map((section) => (
                  <li key={section.slug}>
                    <Link href={`/admin/contenido/${section.slug}`} className="block">
                      <Card className="transition-colors hover:bg-secondary/60">
                        <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
                          <div>
                            <CardTitle className="text-base">{section.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {section.description}
                            </CardDescription>
                          </div>
                          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
