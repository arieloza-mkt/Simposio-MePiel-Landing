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
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
          : "border-accent/40 bg-accent text-dark hover:brightness-110"
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
          ? "border-accent/40 bg-accent/20 text-accent"
          : "border-border bg-surface/50 text-muted hover:bg-fg/10 hover:text-fg"
      }`}
    >
      {pending ? "…" : checkedIn ? "✓ En backstage" : "Entrada expo"}
    </button>
  );
}
