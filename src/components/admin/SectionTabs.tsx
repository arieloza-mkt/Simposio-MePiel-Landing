"use client";

import { useState, type ReactNode } from "react";

export interface TabDef {
  key: string;
  label: string;
}

export function SectionTabs({
  tabs,
  children,
}: {
  tabs: TabDef[];
  children: (activeKey: string) => ReactNode;
}) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");

  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface/40 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              active === tab.key
                ? "bg-accent text-dark"
                : "text-muted hover:bg-fg/5 hover:text-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{children(active)}</div>
    </div>
  );
}
