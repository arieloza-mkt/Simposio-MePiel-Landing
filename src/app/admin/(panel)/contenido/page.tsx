import { getLandingContent } from "@/lib/content";
import { ContentForm } from "@/components/admin/ContentForm";
import { LabsLogosEditor } from "@/components/admin/LabsLogosEditor";
import { Card } from "@/components/admin/ui";

export default async function AdminContenidoPage() {
  const content = await getLandingContent();

  const metricsText = content.hero.metrics
    .map((m) => `${m.value} | ${m.label}`)
    .join("\n");
  const benefitLines = (items: { icon: string; title: string; description: string }[]) =>
    items.map((b) => `${b.icon} | ${b.title} | ${b.description}`).join("\n");
  const trackLines = content.tracks
    .map((t) => `${t.num} | ${t.title} | ${t.description}`)
    .join("\n");
  const attendeeLines = content.attendeeTypes
    .map((a) => `${a.icon} | ${a.label}`)
    .join("\n");

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Contenido landing
        </h1>
        <p className="mt-1 text-sm text-muted">
          Todos los textos de la página pública. Los cambios se reflejan al
          recargar la landing.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <Card title="Sitio (identidad)" description="Nombre, edición y textos base.">
          <ContentForm
            settingKey="site"
            fields={[
              { name: "name", label: "Nombre" },
              { name: "edition", label: "Edición actual", hint: 'Ej. "Octava Edición"' },
              { name: "year", label: "Año" },
              { name: "tagline", label: "Tagline" },
              {
                name: "description",
                label: "Descripción corta",
                multiline: true,
                rows: 2,
                hint: "Se usa en el hero y en metadatos.",
              },
            ]}
            defaults={{
              name: content.site.name,
              edition: content.site.edition,
              year: String(content.site.year),
              tagline: content.site.tagline,
              description: content.site.description,
            }}
          />
        </Card>

        <Card title="Hero">
          <ContentForm
            settingKey="hero"
            fields={[
              { name: "videoId", label: "Video de fondo (ID de YouTube)" },
              {
                name: "metrics",
                label: "Métricas",
                multiline: true,
                rows: 4,
                hint: 'Una por línea: "500 | Asistentes"',
              },
            ]}
            defaults={{ videoId: content.hero.videoId, metrics: metricsText }}
          />
        </Card>

        <Card title='"Qué es el Simposio"'>
          <ContentForm
            settingKey="queEs"
            fields={[
              { name: "title", label: "Título" },
              {
                name: "highlight",
                label: "Palabra resaltada",
                hint: 'Debe estar contenida en el título, ej. "Dermocosmético"',
              },
              { name: "intro", label: "Introducción", multiline: true, rows: 3 },
              { name: "experienceIntro", label: "Intro de experiencia" },
              {
                name: "experienceItems",
                label: "Elementos de experiencia",
                multiline: true,
                rows: 5,
                hint: "Uno por línea.",
              },
            ]}
            defaults={{
              title: content.queEs.title,
              highlight: content.queEs.highlight,
              intro: content.queEs.intro,
              experienceIntro: content.queEs.experienceIntro,
              experienceItems: content.queEs.experienceItems.join("\n"),
            }}
          />
        </Card>

        <Card title="Mepiel — Alianza" description="Sección posterior al logo animado.">
          <ContentForm
            settingKey="mepielAlianza"
            fields={[
              { name: "eyebrow", label: "Antetítulo" },
              { name: "title", label: "Título" },
              {
                name: "highlight",
                label: "Palabra resaltada",
                hint: 'Debe estar contenida en el título, ej. "juntos"',
              },
              {
                name: "paragraphs",
                label: "Párrafos",
                multiline: true,
                rows: 6,
                hint: "Uno por línea.",
              },
              {
                name: "imageUrl",
                label: "URL de imagen (Cloudinary)",
                hint: "Si se deja vacío se muestra un placeholder.",
              },
            ]}
            defaults={{
              eyebrow: content.mepielAlianza.eyebrow,
              title: content.mepielAlianza.title,
              highlight: content.mepielAlianza.highlight,
              paragraphs: content.mepielAlianza.paragraphs.join("\n"),
              imageUrl: content.mepielAlianza.imageUrl,
            }}
          />
        </Card>

        <Card
          title="Por qué asistir"
          description='Formato por línea: "emoji | Título | Descripción".'
        >
          <ContentForm
            settingKey="benefits"
            fields={[
              {
                name: "items",
                label: "Beneficios",
                multiline: true,
                rows: 7,
              },
            ]}
            defaults={{ items: benefitLines(content.benefits) }}
          />
        </Card>

        <Card
          title="Perfiles de asistente"
          description='Formato por línea: "emoji | Etiqueta".'
        >
          <ContentForm
            settingKey="attendeeTypes"
            fields={[{ name: "items", label: "Perfiles", multiline: true, rows: 7 }]}
            defaults={{ items: attendeeLines }}
          />
        </Card>

        <Card
          title="Ejes temáticos"
          description='Formato por línea: "01 | Título | Descripción".'
        >
          <ContentForm
            settingKey="tracks"
            fields={[{ name: "items", label: "Ejes", multiline: true, rows: 7 }]}
            defaults={{ items: trackLines }}
          />
        </Card>

        <Card
          title="Laboratorios — features"
          description='Formato por línea: "emoji | Título | Descripción".'
        >
          <ContentForm
            settingKey="labFeatures"
            fields={[
              { name: "items", label: "Features", multiline: true, rows: 6 },
            ]}
            defaults={{ items: benefitLines(content.labFeatures) }}
          />
        </Card>

        <Card title="CTA de cierre">
          <ContentForm
            settingKey="ctaCierre"
            fields={[
              { name: "description", label: "Texto del cierre", multiline: true, rows: 3 },
            ]}
            defaults={{ description: content.ctaCierre.description }}
          />
        </Card>

        <Card
          title="Logos de laboratorios"
          description="Pega la URL de Cloudinary (u otro CDN) para cada logo. Se actualizan en la landing al guardar."
        >
          <LabsLogosEditor
            labsList={content.labsList.map((lab) => ({
              id: lab.id,
              name: lab.name,
              imageUrl: lab.imageUrl,
            }))}
          />
        </Card>
      </div>
    </>
  );
}
