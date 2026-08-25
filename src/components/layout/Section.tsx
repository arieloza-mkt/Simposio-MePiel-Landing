import { cn } from "@/lib/cn";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  /** Ocupa al menos 100vh y centra el contenido verticalmente */
  fullHeight?: boolean;
}

export function Section({ children, className, id, dark, fullHeight }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        fullHeight ? "min-h-screen flex flex-col justify-center py-[clamp(48px,8vw,96px)]" : "py-[clamp(48px,8vw,96px)]",
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
