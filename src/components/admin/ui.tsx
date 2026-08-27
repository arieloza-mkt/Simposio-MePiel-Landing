import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shadcn/card";
import { Button as ShadcnButton } from "@/components/shadcn/button";
import { Input as ShadcnInput } from "@/components/shadcn/input";
import { Badge as ShadcnBadge } from "@/components/shadcn/badge";

export function Card({
  title,
  description,
  children,
  actions,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <ShadcnCard>
      {(title || actions) && (
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {actions}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </ShadcnCard>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

const inputClass = "h-9 w-full";

export function TextInput(props: React.ComponentProps<"input">) {
  const { className = "", ...rest } = props;
  return <ShadcnInput {...rest} className={cn(inputClass, className)} />;
}

export function TextArea(props: React.ComponentProps<"textarea">) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={cn("h-auto min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)} />;
}

export function Select(props: React.ComponentProps<"select">) {
  const { className = "", ...rest } = props;
  return (
    <select
      {...rest}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "danger" | "subtle";
}) {
  const variantMap = {
    primary: "default",
    ghost: "ghost",
    danger: "destructive",
    subtle: "secondary",
  } as const;
  return (
    <ShadcnButton variant={variantMap[variant]} className={className} {...rest} />
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: ReactNode;
}) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : children}
    </Button>
  );
}

const badgeTones = {
  pendiente: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  aprobado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  rechazado: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  neutral: "bg-secondary text-muted-foreground border-transparent",
  accent: "bg-primary/10 text-primary border-transparent",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof badgeTones;
  children: ReactNode;
}) {
  return (
    <ShadcnBadge
      variant="outline"
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        badgeTones[tone],
      )}
    >
      {children}
    </ShadcnBadge>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
