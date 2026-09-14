"use server";

import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { getProgramaData } from "@/lib/programa-store";
import {
  PROGRAMA_DIA_LABEL,
  PROGRAMA_KINDS,
  PROGRAMA_MODO_FORANEOS,
  PROGRAMA_VENUE,
  PROGRAMA_VENUE_DIRECCION,
  PROGRAMA_MODOS,
  PUBLIC_DAYS,
  type ProgramaItem,
  type ProgramaModo,
} from "@/lib/programa";

const NAVY = rgb(0.043, 0.075, 0.145);
const CYAN = rgb(0.07, 0.74, 0.95);
const PURPLE = rgb(0.49, 0.39, 0.84);
const INK = rgb(0.12, 0.14, 0.2);
const MUTED = rgb(0.46, 0.49, 0.58);
const WHITE = rgb(1, 1, 1);

const margin = 40;
const pageWidth = 595.28;
const pageHeight = 841.89;

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function kindLabel(kind: ProgramaItem["kind"]): string {
  return PROGRAMA_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

export async function generateProgramaPdf(
  modo: ProgramaModo,
): Promise<
  { ok: true; base64: string; filename: string } | { ok: false; error: string }
> {
  try {
    const { items } = await getProgramaData();
    const isForaneos = modo === PROGRAMA_MODO_FORANEOS;

    // Un solo programa: en "Locales" solo se ocultan las filas de transporte.
    const visible = isForaneos
      ? items
      : items.filter((item) => item.modo !== PROGRAMA_MODO_FORANEOS);

    const dayItems = (day: 1 | 2 | 3) =>
      visible.filter((item) => item.day === day).sort((a, b) => a.start.localeCompare(b.start) || 0);

    const days = PUBLIC_DAYS.filter((day) => dayItems(day).length > 0);

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);

    const page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;
    const contentWidth = pageWidth - margin * 2;
    const contentX = margin;

    // Cabecera (primera página).
    page.drawText("PROGRAMA · 3ER SIMPOSIO DERMOCOSMÉTICO 2026", {
      x: contentX,
      y: y,
      size: 10,
      font: bold,
      color: CYAN,
    });
    y -= 22;
    page.drawText("Del lunes 12 al miércoles 14 de octubre", {
      x: contentX,
      y,
      size: 13,
      font: bold,
      color: INK,
    });
    y -= 17;
    const modoLabel = PROGRAMA_MODOS.find((m) => m.value === modo)?.label ?? modo;
    page.drawText(
      `${PROGRAMA_VENUE} · ${PROGRAMA_VENUE_DIRECCION}   ·   Modalidad: ${modoLabel}${isForaneos ? " (incluye transporte)" : ""}`,
      { x: contentX, y, size: 9, font, color: MUTED },
    );
    y -= 26;

    const drawItem = (item: ProgramaItem) => {
      const isLogistica = item.kind === "logistica";
      const titleLines = wrap(item.title, font, 10.5, contentWidth - 92);
      const metaParts = [
        kindLabel(item.kind),
        item.salon ? `Salón: ${item.salon}` : null,
        item.speakers && item.speakers.length > 0 ? item.speakers.join(" · ") : null,
      ].filter(Boolean) as string[];
      const metaLines = wrap(metaParts.join("  ·  "), font, 8.5, contentWidth - 92) as string[];
      const rowHeight =
        titleLines.length * 14 + metaLines.length * 12 + (isLogistica ? 4 : 14);

      if (y < 64) {
        const p = doc.addPage([pageWidth, pageHeight]);
        y = p.getHeight() - margin;
      }

      const baseY = y;
      if (isLogistica) {
        page.drawRectangle({
          x: contentX,
          y: baseY - rowHeight + 8,
          width: 5,
          height: rowHeight - 14,
          color: CYAN,
        });
      }

      // Hora.
      if (item.start || item.end) {
        const timeText = item.end ? `${item.start}–${item.end}` : item.start;
        page.drawText(timeText, {
          x: contentX + 14,
          y: baseY - 2,
          size: 10,
          font: bold,
          color: isLogistica ? MUTED : NAVY,
        });
      }

      // Título.
      titleLines.forEach((line, i) => {
        page.drawText(line, {
          x: contentX + 92,
          y: baseY - i * 14,
          size: 10.5,
          font: isLogistica ? font : bold,
          color: isLogistica ? MUTED : NAVY,
        });
      });

      // Metadatos.
      metaLines.forEach((line, i) => {
        page.drawText(line, {
          x: contentX + 92,
          y: baseY - titleLines.length * 14 - 4 - i * 12,
          size: 8.5,
          font,
          color: isLogistica ? MUTED : PURPLE,
        });
      });

      y = baseY - rowHeight;
    };

    for (const day of days) {
      const items = dayItems(day);
      if (items.length === 0) continue;

      if (y < 110) {
        const p = doc.addPage([pageWidth, pageHeight]);
        y = p.getHeight() - margin;
      }

      // Encabezado del día (banda navy).
      const headH = 26;
      page.drawRectangle({
        x: contentX,
        y: y - headH,
        width: contentWidth,
        height: headH,
        color: NAVY,
      });
      page.drawText(PROGRAMA_DIA_LABEL[day], {
        x: contentX + 12,
        y: y - 18,
        size: 12,
        font: bold,
        color: WHITE,
      });
      page.drawText(
        `${items.length} ${items.length === 1 ? "actividad" : "actividades"}`,
        { x: contentX + contentWidth - 12, y: y - 17, size: 9, font, color: CYAN },
      );
      y -= headH + 14;

      for (const item of items) {
        drawItem(item);
      }

      y -= 18;
    }

    // Pie de página.
    const pages = doc.getPages();
    const footerText = "Programa sujeto a cambios · algunos horarios por confirmar";
    pages.forEach((p, i) => {
      const w = p.getWidth();
      p.drawText(footerText, {
        x: margin,
        y: 30,
        size: 8,
        font,
        color: MUTED,
      });
      p.drawText(`Página ${i + 1} de ${pages.length}`, {
        x: w - margin - 60,
        y: 30,
        size: 8,
        font,
        color: MUTED,
      });
    });

    const bytes = await doc.save();
    return {
      ok: true,
      base64: Buffer.from(bytes).toString("base64"),
      filename: "programa-simposio-2026.pdf",
    };
  } catch (err) {
    console.error("generateProgramaPdf:", err);
    return { ok: false, error: "No se pudo generar el PDF." };
  }
}