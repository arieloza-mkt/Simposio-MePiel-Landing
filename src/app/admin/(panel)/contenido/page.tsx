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
        site={content.site}
        hero={content.hero}
        queEs={content.queEs}
        mepielAlianza={content.mepielAlianza}
        benefits={content.benefits}
        attendeeTypes={content.attendeeTypes}
        tracks={content.tracks}
        labFeatures={content.labFeatures}
        ctaCierre={content.ctaCierre}
        labsList={content.labsList}
      />
    </>
  );
}
