import { Loader2 } from "lucide-react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill font-display font-medium " +
  "transition-[background-color,border-color,color,translate] duration-fast select-none enabled:active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:opacity-45 aria-busy:cursor-progress";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover disabled:hover:bg-accent",
  secondary: "border border-rule-strong text-text hover:border-text disabled:hover:border-rule-strong",
  ghost: "text-muted hover:bg-surface-2 hover:text-text disabled:hover:bg-transparent disabled:hover:text-muted",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-small [&_svg]:size-4",
  md: "h-10 px-5 text-small [&_svg]:size-4",
  lg: "h-12 px-6 text-body [&_svg]:size-[1.125rem]",
};

/** Button styles for non-button elements (e.g. next/link). */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading ? <Loader2 aria-hidden className="animate-spin" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}
