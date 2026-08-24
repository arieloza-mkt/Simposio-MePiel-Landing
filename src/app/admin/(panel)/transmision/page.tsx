import { getLandingContent } from "@/lib/content";
import {
  EventScheduleForm,
  TransmisionForm,
} from "@/components/admin/TransmisionForm";
import { Card } from "@/components/admin/ui";

export default async function AdminTransmisionPage() {
  const content = await getLandingContent();

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Transmisión
        </h1>
        <p className="mt-1 text-sm text-muted">
          Controla el reproductor en vivo de la landing y la ventana del evento
          que activa los estados del cronograma.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <Card title="Reproductor en vivo">
          <TransmisionForm initial={content.transmision} />
        </Card>

        <Card
          title="Fechas del evento"
          description="El cronograma marca actividades como 'En curso' o pasadas según estas fechas y la hora actual."
        >
          <EventScheduleForm
            initialStartsAt={content.eventConfig.startsAt}
            initialEndsAt={content.eventConfig.endsAt}
          />
        </Card>

        {content.transmision.videoId ? (
          <Card title="Vista previa">
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${content.transmision.videoId}`}
                title="Vista previa"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-muted">
              Agrega un ID de YouTube para ver la vista previa aquí.
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
