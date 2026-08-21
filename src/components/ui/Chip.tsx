import { cn } from "@/lib/cn";

interface ChipProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({ children, icon, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-[7px] text-sm font-medium text-fg",
        className,
      )}
    >
      {icon && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          className="h-4 w-4 shrink-0"
        >
          {icon}
        </svg>
      )}
      {children}
    </span>
  );
}
