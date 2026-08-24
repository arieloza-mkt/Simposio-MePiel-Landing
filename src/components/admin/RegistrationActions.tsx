"use client";

import { useTransition } from "react";
import {
  deleteRegistration,
  regenerateRegistrationCode,
  setRegistrationStatus,
} from "@/app/actions/admin/registrations";

export function RegistrationActions({
  id,
  status,
}: {
  id: string;
  status: "pendiente" | "aprobado" | "rechazado";
}) {
  const [pending, startTransition] = useTransition();

  const update = (next: typeof status) => {
    if (next === status) return;
    startTransition(async () => {
      await setRegistrationStatus(id, next);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        disabled={pending || status === "aprobado"}
        onClick={() => update("aprobado")}
        className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/20 disabled:opacity-40"
      >
        Aprobar
      </button>
      <button
        type="button"
        disabled={pending || status === "rechazado"}
        onClick={() => update("rechazado")}
        className="rounded-md border border-red-400/30 bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-300 transition hover:bg-red-400/20 disabled:opacity-40"
      >
        Rechazar
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            confirm(
              "Se generará un código nuevo y el QR anterior dejará de funcionar. ¿Continuar?",
            )
          ) {
            startTransition(async () => {
              await regenerateRegistrationCode(id);
            });
          }
        }}
        className="rounded-md px-2 py-1 text-xs text-muted transition hover:bg-fg/10 hover:text-fg disabled:opacity-40"
      >
        Regenerar QR
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            confirm(
              "¿Eliminar este registro definitivamente? Esta acción no se puede deshacer.",
            )
          ) {
            startTransition(async () => {
              await deleteRegistration(id);
            });
          }
        }}
        className="rounded-md px-2 py-1 text-xs text-muted transition hover:bg-fg/10 hover:text-fg disabled:opacity-40"
      >
        Eliminar
      </button>
    </div>
  );
}
