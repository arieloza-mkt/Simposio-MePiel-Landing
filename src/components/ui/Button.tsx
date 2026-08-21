import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white border-accent hover:brightness-88 active:translate-y-px",
  secondary:
    "bg-transparent text-fg border-border hover:border-fg active:translate-y-px",
  ghost: "bg-transparent text-fg border-transparent px-2 hover:text-accent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[15px]",
  lg: "px-7 py-3.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      withArrow = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border font-medium tracking-tight transition-all duration-150 ease-[var(--ease-out-expo)]",
          "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
        {withArrow && (
          <span
            className="transition-transform duration-150 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
            aria-hidden
          >
            →
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
