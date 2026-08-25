"use client";

import { Plus, X, GripVertical } from "lucide-react";

export interface FieldArrayItem {
  id: string;
}

export function FieldArray<T extends FieldArrayItem>({
  items,
  onChange,
  renderItem,
  addLabel = "Agregar",
  emptyLabel = "Sin elementos aún",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, onChange: (item: T) => void) => React.ReactNode;
  addLabel?: string;
  emptyLabel?: string;
}) {
  const update = (index: number, item: T) => {
    const next = [...items];
    next[index] = item;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted">
          {emptyLabel}
        </p>
      )}

      {items.map((item, i) => (
        <div
          key={item.id}
          className="group relative rounded-xl border border-border bg-surface/30 p-4 transition hover:border-border"
        >
          <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => moveUp(i)}
              className="block rounded p-0.5 text-muted hover:text-fg disabled:opacity-30"
              disabled={i === 0}
            >
              <GripVertical className="h-3.5 w-3.5 rotate-[-90deg]" />
            </button>
            <button
              type="button"
              onClick={() => moveDown(i)}
              className="block rounded p-0.5 text-muted hover:text-fg disabled:opacity-30"
              disabled={i === items.length - 1}
            >
              <GripVertical className="h-3.5 w-3.5 rotate-90" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute right-2 top-2 rounded-md p-1 text-muted opacity-0 transition hover:bg-error/10 hover:text-error group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="pl-5">
            {renderItem(item, i, (updated) => update(i, updated))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          const newItem = {
            id: crypto.randomUUID(),
          } as T;
          onChange([...items, newItem]);
        }}
        className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted transition hover:border-accent/40 hover:text-accent"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}
