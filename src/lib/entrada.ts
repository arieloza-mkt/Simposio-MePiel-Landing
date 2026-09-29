import { and, eq } from "drizzle-orm";
import QRCode from "qrcode";
import { headers } from "next/headers";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { checkins, registrations, siteSettings } from "@/lib/db/schema";
import { SETTINGS_SEED } from "@/lib/db/seed-data";

export async function buildEntradaUrl(code: string): Promise<string> {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/entrada/${code}`;
}

export async function generateEntradaQr(code: string): Promise<string> {
  const url = await buildEntradaUrl(code);
  return QRCode.toDataURL(url, {
    width: 512,
    margin: 1,
    color: { dark: "#0a0a0a", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}

interface EventWindow {
  startsAt: Date;
  endsAt: Date;
  dateLabel: string;
}

async function getEventWindow(): Promise<EventWindow> {
  const fallback = SETTINGS_SEED.eventConfig as {
    startsAt: string;
    endsAt: string;
    dateLabel: string;
  };
  /* El valor guardado en DB puede venir sin endsAt (es opcional en el admin),
     pero el seed siempre lo trae y se usa como red de seguridad. */
  type StoredEventConfig = {
    startsAt: string;
    endsAt?: string | null;
    dateLabel?: string;
  };
  try {
    const db = await getDbReady();
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "eventConfig"))
      .limit(1);
    const raw = (row?.value ?? fallback) as StoredEventConfig;
    const startsAt = new Date(raw.startsAt);
    /* endsAt es opcional en el admin (solo el countdown lo necesita), pero
       new Date(null) es epoch 1970 y cerraría la ventana de escaneo para
       siempre. Si falta, se usa el seed. */
    const endsAt = raw.endsAt ? new Date(raw.endsAt) : new Date(fallback.endsAt);
    return {
      startsAt,
      endsAt: Number.isNaN(endsAt.getTime()) ? new Date(fallback.endsAt) : endsAt,
      dateLabel: raw.dateLabel ?? fallback.dateLabel,
    };
  } catch {
    return {
      startsAt: new Date(fallback.startsAt),
      endsAt: new Date(fallback.endsAt),
      dateLabel: fallback.dateLabel,
    };
  }
}

export type EntradaState =
  | { kind: "no_encontrado" }
  | { kind: "bloqueado"; nombre: string }
  | {
      kind: "fuera_de_ventana";
      cuando: "antes" | "despues";
      dateLabel: string;
      nombre: string;
      status: "pendiente" | "aprobado" | "rechazado";
    }
  | {
      kind: "confirmado";
      yaRegistrado: boolean;
      nombre: string;
      email: string;
      empresa: string;
      perfil: string;
      status: "pendiente" | "aprobado" | "rechazado";
      folio: string;
      checkinAt: Date;
    };

/**
 * Resuelve un código de acceso escaneado: valida ventana del evento,
 * bloquea rechazados y marca la entrada (idempotente).
 * Aprobados y pendientes pueden entrar; rechazados no.
 */
export async function resolveEntrada(
  code: string,
): Promise<EntradaState> {
  await ensureDb();
  const db = await getDbReady();

  const [registration] = await db
    .select()
    .from(registrations)
    .where(eq(registrations.accessCode, code))
    .limit(1);

  if (!registration) {
    return { kind: "no_encontrado" };
  }

  if (registration.status === "rechazado") {
    return { kind: "bloqueado", nombre: registration.nombre };
  }

  const window = await getEventWindow();
  const now = new Date();
  if (now < window.startsAt || now > window.endsAt) {
    return {
      kind: "fuera_de_ventana",
      cuando: now < window.startsAt ? "antes" : "despues",
      dateLabel: window.dateLabel,
      nombre: registration.nombre,
      status: registration.status,
    };
  }

  const [existing] = await db
    .select({ checkedInAt: checkins.checkedInAt })
    .from(checkins)
    .where(
      and(
        eq(checkins.registrationId, registration.id),
        eq(checkins.kind, "asistente"),
      ),
    )
    .limit(1);

  if (existing) {
    return {
      kind: "confirmado",
      yaRegistrado: true,
      nombre: registration.nombre,
      email: registration.email,
      empresa: registration.empresa,
      perfil: registration.perfil,
      status: registration.status,
      folio: registration.id,
      checkinAt: existing.checkedInAt,
    };
  }

  const [created] = await db
    .insert(checkins)
    .values({ kind: "asistente", registrationId: registration.id })
    .returning({ checkedInAt: checkins.checkedInAt });

  return {
    kind: "confirmado",
    yaRegistrado: false,
    nombre: registration.nombre,
    email: registration.email,
    empresa: registration.empresa,
    perfil: registration.perfil,
    status: registration.status,
    folio: registration.id,
    checkinAt: created.checkedInAt,
  };
}
