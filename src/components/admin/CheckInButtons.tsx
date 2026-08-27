"use client";

import { useTransition } from "react";
import {
  toggleRegistrationCheckIn,
  toggleSpeakerCheckIn,
} from "@/app/actions/admin/checkins";

export function RegistrationCheckInButton({
  registrationId,
  checkedIn,
}: {
  registrationId: string;
  checkedIn: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleRegistrationCheckIn(registrationId);
        })
      }
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
        checkedIn
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {pending ? "…" : checkedIn ? "✓ Ingresó — deshacer" : "Registrar entrada"}
    </button>
  );
}

export function SpeakerCheckInButton({
  speakerId,
  checkedIn,
}: {
  speakerId: string;
  checkedIn: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleSpeakerCheckIn(speakerId);
        })
      }
      className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition disabled:opacity-50 ${
        checkedIn
          ? "bg-primary/15 text-primary border-primary/40"
          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {pending ? "…" : checkedIn ? "✓ En backstage" : "Entrada expo"}
    </button>
  );
}
