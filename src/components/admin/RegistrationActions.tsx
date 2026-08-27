"use client";

import { useTransition } from "react";
import {
  deleteRegistration,
  regenerateRegistrationCode,
  setRegistrationStatus,
} from "@/app/actions/admin/registrations";
import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  Check,
  X,
  QrCode,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={pending}
          aria-label="Acciones"
        >
          {pending ? "…" : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={status === "aprobado"}
          onClick={() => update("aprobado")}
        >
          <Check className="text-emerald-600 dark:text-emerald-400" />
          Aprobar
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={status === "rechazado"}
          onClick={() => update("rechazado")}
        >
          <X className="text-red-500" />
          Rechazar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
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
        >
          <QrCode />
          Regenerar QR
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
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
        >
          <Trash2 />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
