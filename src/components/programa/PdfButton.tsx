"use client";

import { useTransition } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { generateProgramaPdf } from "@/app/actions/programa-pdf";
import { PROGRAMA_MODO_FORANEOS, type ProgramaModo } from "@/lib/programa";
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
  const [pending, startTransition] = useTransition();

  const download = () =>
    startTransition(async () => {
      const res = await generateProgramaPdf(modo);
      if (!res.ok) return;
      const binary = atob(res.base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

  return (
    <button
      type="button"
      onClick={download}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold transition-colors",
        compact
          ? "h-9 px-3 text-[12px] uppercase tracking-[0.14em]"
          : "h-12 px-6 text-sm",
        "border-program-blue/60 bg-program-navy text-program-lilac-text hover:border-program-cyan/50 hover:text-program-white",
        pending && "pointer-events-none opacity-60",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      {compact ? "PDF" : "Descargar programa (PDF)"}
    </button>
  );
}