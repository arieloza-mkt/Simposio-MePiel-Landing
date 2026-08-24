import type { ReactNode } from "react";

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
    <section className="rounded-2xl border border-border bg-surface/30 p-6">
      {(title || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-display text-lg font-semibold text-fg">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
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
        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted/80">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/15";

export function TextInput(props: React.ComponentProps<"input">) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${inputClass} ${className}`} />;
}

export function TextArea(props: React.ComponentProps<"textarea">) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`${inputClass} min-h-[90px] ${className}`} />;
}

export function Select(props: React.ComponentProps<"select">) {
  const { className = "", ...rest } = props;
  return <select {...rest} className={`${inputClass} ${className}`} />;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "danger" | "subtle";
}) {
  const variants = {
    primary: "bg-accent text-dark hover:brightness-110",
    ghost: "border border-border text-fg hover:bg-fg/5",
    danger: "bg-error/15 text-error hover:bg-error/25",
    subtle: "bg-surface/70 text-fg hover:bg-fg/10",
  };
  return (
    <button
      {...rest}
      className={`${buttonBase} ${variants[variant]} ${className}`}
    />
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
  pendiente: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  aprobado: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  rechazado: "bg-red-400/10 text-red-300 border-red-400/20",
  neutral: "bg-fg/5 text-muted border-border",
  accent: "bg-accent/10 text-accent border-accent/20",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof badgeTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
      {message}
    </p>
  );
}
