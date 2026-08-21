import { cn } from "@/lib/cn";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export function Section({ children, className, id, dark }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-[clamp(48px,8vw,96px)]",
        dark
          ? "bg-dark text-white"
          : "bg-bg text-fg",
        className,
      )}
    >
      {children}
    </section>
  );
}
