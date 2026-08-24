"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { checkins, speakers } from "@/lib/db/schema";

const uuid = z.string().uuid();

export async function toggleRegistrationCheckIn(
  registrationId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!uuid.safeParse(registrationId).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();

  const existing = await db
    .select({ id: checkins.id })
    .from(checkins)
    .where(
      and(
        eq(checkins.registrationId, registrationId),
        eq(checkins.kind, "asistente"),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db.delete(checkins).where(eq(checkins.id, existing[0].id));
  } else {
    await db.insert(checkins).values({
      kind: "asistente",
      registrationId,
    });
  }

  revalidatePath("/admin/asistencia");
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleSpeakerCheckIn(
  speakerId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!uuid.safeParse(speakerId).success) {
    return { ok: false, error: "Id inválido." };
  }

  await ensureDb();
  const db = await getDbReady();

  const [speaker] = await db
    .select({ checkedInAt: speakers.checkedInAt })
    .from(speakers)
    .where(eq(speakers.id, speakerId))
    .limit(1);

  if (!speaker) {
    return { ok: false, error: "Ponente no encontrado." };
  }

  await db
    .update(speakers)
    .set({ checkedInAt: speaker.checkedInAt ? null : new Date() })
    .where(eq(speakers.id, speakerId));

  revalidatePath("/admin/ponentes");
  revalidatePath("/admin");
  return { ok: true };
}
