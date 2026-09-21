"use client";

import { FileDown } from "lucide-react";
import {
  PROGRAMA_MODO_FORANEOS,
  getProgramaPdfDownloadUrl,
  type ProgramaModo,
} from "@/lib/programa";
import { cn } from "@/lib/cn";

export function PdfButton({
  modo = PROGRAMA_MODO_FORANEOS,
  compact = false,
  className,
}: {
  modo?: ProgramaModo;
  compact?: boolean;
  className?: string;
}) {
  return (
    <a
      href={getProgramaPdfDownloadUrl(modo)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold transition-colors",
        compact
          ? "h-9 px-3 text-[12px] uppercase tracking-[0.14em]"
          : "h-12 px-6 text-sm",
        "border-program-blue/60 bg-program-navy text-program-lilac-text hover:border-program-cyan/50 hover:text-program-white",
        className,
      )}
    >
      <FileDown className="h-4 w-4" />
      {compact ? "PDF" : "Descargar programa (PDF)"}
    </a>
  );
}
