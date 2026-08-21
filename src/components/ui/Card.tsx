import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function Card({ children, className, dark }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border p-7",
        dark
          ? "border-white/8 bg-dark-s"
          : "border-border bg-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}
