import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/8 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-widest text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
