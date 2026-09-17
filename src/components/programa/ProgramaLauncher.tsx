"use client";

import { useEffect, useState } from "react";
import { ProgramaModal } from "./ProgramaModal";
import { PROGRAMA_MODO_FORANEOS, type ProgramaModo } from "@/lib/programa";

export function ProgramaLauncher() {
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<ProgramaModo>(PROGRAMA_MODO_FORANEOS);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.('a[href="#programa"]') as HTMLAnchorElement | null;
      if (!link) return;
      e.preventDefault();
      setModo(PROGRAMA_MODO_FORANEOS);
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <ProgramaModal
      open={open}
      onClose={() => setOpen(false)}
      modo={modo}
      onModoChange={setModo}
    />
  );
}