import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { speakers } from "@/lib/db/schema";
import {
  NewSpeakerForm,
  SpeakerEditor,
} from "@/components/admin/SpeakerEditor";
import { EmptyState } from "@/components/admin/ui";

export default async function AdminPonentesPage() {
  await ensureDb();
  const db = await getDbReady();
  const rows = await db.select().from(speakers).orderBy(speakers.sortOrder);

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Ponentes
          </h1>
          <p className="mt-1 text-sm text-muted">
            Aparecen en el carrusel de la landing y en los detalles de cada
            edición.
          </p>
        </div>
        <NewSpeakerForm />
      </header>

      {rows.length === 0 ? (
        <EmptyState message="No hay ponentes todavía." />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((speaker) => (
            <SpeakerEditor
              key={speaker.id}
              checkedIn={Boolean(speaker.checkedInAt)}
              speaker={{
                id: speaker.id,
                name: speaker.name,
                role: speaker.role,
                company: speaker.company,
                imageUrl: speaker.imageUrl,
                bio: speaker.bio,
                linkedinUrl: speaker.linkedinUrl,
                websiteUrl: speaker.websiteUrl,
                sortOrder: speaker.sortOrder,
              }}
            />
          ))}
        </ul>
      )}
    </>
  );
}
