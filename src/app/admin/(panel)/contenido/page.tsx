import { getLandingContent } from "@/lib/content";
import { ContenidoEditor } from "@/components/admin/ContenidoEditor";

export default async function AdminContenidoPage() {
  const content = await getLandingContent();

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Contenido landing
        </h1>
        <p className="mt-1 text-sm text-muted">
          Edita el contenido de cada sección de la página pública. Los cambios
          se reflejan al recargar la landing.
        </p>
      </header>

      <ContenidoEditor
        seo={content.seo}
        site={content.site}
        hero={content.hero}
        queEs={content.queEs}
        mepielAlianza={content.mepielAlianza}
        logoSpin={content.logoSpin}
        editionsModal={content.editionsModal}
        editionsPanel={content.editionsPanel}
        labsSection={content.labsSection}
        expositoresSection={content.expositoresSection}
        registroSection={content.registroSection}
        footer={content.footer}
        labsList={content.labsList}
      />
    </>
  );
}
