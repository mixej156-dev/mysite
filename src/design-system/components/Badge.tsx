import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted",
  accent: "tint-accent text-accent-text",
  success: "tint-success text-success",
  warning: "tint-warning text-warning",
  danger: "tint-danger text-danger",
};

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
};

/** Read-only status label. For interactive filters use Tag. */
export function Badge({ tone = "neutral", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-pill px-2.5 text-caption font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-pill bg-current" />}
      {children}
    </span>
  );
}
