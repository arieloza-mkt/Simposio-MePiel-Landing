import { eq } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { siteSettings } from "@/lib/db/schema";
import { Card } from "@/components/admin/ui";
import { EventScheduleForm } from "@/components/admin/EventScheduleForm";

const SEED_FALLBACK = {
  startsAt: "2026-10-15T09:00:00-06:00",
  endsAt: "2026-10-15T18:00:00-06:00",
};

/* El countdown de la 3ra edición se calcula desde eventConfig.startsAt, un
   ajuste global. No había ninguna pantalla para editarlo: solo se podía
   cambiar editando el seed y redesplegando. La transmisión en vivo ya no se
   usa, así que no se expone aquí. */
export default async function AdminEventoPage() {
  await ensureDb();
  const db = await getDbReady();
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "eventConfig"))
    .limit(1);

  const eventConfig = (row?.value ?? {}) as {
    startsAt?: string;
    endsAt?: string | null;
  };

  const startsAt = eventConfig.startsAt ?? SEED_FALLBACK.startsAt;
  const endsAt = eventConfig.endsAt ?? SEED_FALLBACK.endsAt;

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Evento
        </h1>
        <p className="mt-1 text-sm text-muted">
          Fecha del simposio. La fecha de inicio alimenta el countdown que se
          muestra en la tercera edición.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        <Card
          title="Fechas del evento"
          description="El countdown de la edición 3 cuenta hacia «Inicio del evento»."
        >
          <EventScheduleForm
            initialStartsAt={startsAt}
            initialEndsAt={endsAt ?? ""}
          />
        </Card>
      </div>
    </>
  );
}
