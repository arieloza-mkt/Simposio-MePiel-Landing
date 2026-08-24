import { desc, type SQL } from "drizzle-orm";
import { getDbReady } from "@/lib/db/client";
import { ensureDb } from "@/lib/db/init";
import { registrations } from "@/lib/db/schema";
import { PROFILE_OPTIONS } from "@/lib/constants";

function csvEscape(value: string | null | undefined): string {
  const str = value ?? "";
  return `"${str.replaceAll('"', '""')}"`;
}

export async function GET() {
  await ensureDb();
  const db = await getDbReady();

  const filters: SQL[] = [];
  const rows = await db
    .select()
    .from(registrations)
    .where(filters.length ? filters[0] : undefined)
    .orderBy(desc(registrations.createdAt));

  const header = [
    "folio",
    "nombre",
    "email",
    "telefono",
    "empresa",
    "perfil",
    "estado",
    "fecha_registro",
  ];

  const lines = [header.join(",")];
  for (const row of rows) {
    const profile =
      PROFILE_OPTIONS.find((o) => o.value === row.perfil)?.label ?? row.perfil;
    lines.push(
      [
        row.id,
        csvEscape(row.nombre),
        row.email,
        csvEscape(row.telefono),
        csvEscape(row.empresa),
        csvEscape(profile),
        row.status,
        row.createdAt.toISOString(),
      ].join(","),
    );
  }

  const csv = "\uFEFF" + lines.join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registros-simposio-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
