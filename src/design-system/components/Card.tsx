import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "surface" | "outline" | "inset";
export type CardPadding = "none" | "sm" | "md" | "lg";

const variants: Record<CardVariant, string> = {
  surface: "border border-rule bg-surface",
  outline: "border border-rule",
  inset: "bg-surface-2",
};

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-6 md:p-8",
};

export type CardProps = ComponentPropsWithRef<"div"> & {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Hover affordance for cards that contain a stretched link or act as a button. */
  interactive?: boolean;
};

export function Card({ variant = "surface", padding = "md", interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-card text-text",
        variants[variant],
        paddings[padding],
        interactive && "transition-colors duration-base hover:border-rule-strong focus-within:border-rule-strong",
        className,
      )}
      {...props}
    />
  );
}
