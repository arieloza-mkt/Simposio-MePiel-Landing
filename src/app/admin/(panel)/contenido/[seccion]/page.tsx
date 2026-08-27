import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLandingContent } from "@/lib/content";
import {
  CONTENT_SECTIONS,
  getContentSectionMeta,
} from "@/lib/content-sections";
import { ContenidoSectionEditor } from "@/components/admin/ContenidoEditor";
import { Button } from "@/components/shadcn/button";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return CONTENT_SECTIONS.map((s) => ({ seccion: s.slug }));
}

export default async function AdminContenidoSeccionPage({
  params,
}: {
  params: Promise<{ seccion: string }>;
}) {
  const { seccion } = await params;
  const meta = getContentSectionMeta(seccion);
  if (!meta) notFound();

  const content = await getLandingContent();

  return (
    <>
      <header className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2 text-muted-foreground">
          <Link href="/admin/contenido">
            <ArrowLeft className="h-4 w-4" />
            Contenido landing
          </Link>
        </Button>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{meta.description}</p>
      </header>

      <ContenidoSectionEditor
        slug={seccion}
        content={{
          seo: content.seo,
          site: content.site,
          hero: content.hero,
          queEs: content.queEs,
          mepielAlianza: content.mepielAlianza,
          logoSpin: content.logoSpin,
          editionsModal: content.editionsModal,
          editionsPanel: content.editionsPanel,
          labsSection: content.labsSection,
          expositoresSection: content.expositoresSection,
          registroSection: content.registroSection,
          footer: content.footer,
          labsList: content.labsList,
        }}
      />
    </>
  );
}
