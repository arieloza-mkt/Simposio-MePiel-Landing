import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { editions, speakers } from "@/lib/db/schema";
import { EditionEditor } from "@/components/admin/EditionEditor";
import { NewEditionForm } from "@/components/admin/NewEditionForm";
import { EmptyState } from "@/components/admin/ui";

export default async function AdminEdicionesPage() {
  await ensureDb();
  const db = await getDbReady();
  const [rows, allSpeakers] = await Promise.all([
    db.select().from(editions).orderBy(editions.sortOrder),
    db
      .select({ id: speakers.id, name: speakers.name })
      .from(speakers)
      .orderBy(speakers.sortOrder),
  ]);

  const nextOrdinal = String(rows.length + 1).padStart(2, "0");
  const suggestedYear = Math.max(...rows.map((r) => r.year), 2025) + 1;

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Ediciones
          </h1>
          <p className="mt-1 text-sm text-muted">
            Cada edición alimenta una tarjeta de la sección «Ediciones pasadas».
          </p>
        </div>
        <NewEditionForm
          nextOrdinal={nextOrdinal}
          suggestedYear={suggestedYear}
        />
      </header>

      {rows.length === 0 ? (
        <EmptyState message="No hay ediciones. Crea la primera." />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((edition) => (
            <EditionEditor
              key={edition.id}
              edition={{
                id: edition.id,
                ordinal: edition.ordinal,
                year: edition.year,
                eyebrow: edition.eyebrow,
                title: edition.title,
                description: edition.description,
                backdropUrl: edition.backdropUrl,
                logoUrl: edition.logoUrl,
                videoId: edition.videoId,
                stats: edition.stats,
                images: edition.images,
                labs: edition.labs,
                speakerIds: edition.speakerIds,
              }}
              allSpeakers={allSpeakers}
            />
          ))}
        </ul>
      )}
    </>
  );
}
