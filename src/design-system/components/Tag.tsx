"use client";

import { X } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type TagProps = Omit<ComponentPropsWithRef<"button">, "onClick"> & {
  selected?: boolean;
  onClick?: () => void;
  /** Shows a remove control; the tag then acts as a removable chip. */
  onRemove?: () => void;
  count?: number;
};

const base =
  "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-pill border text-small font-medium transition-colors duration-fast";

/** Interactive filter chip. */
export function Tag({ selected = false, onClick, onRemove, count, disabled, className, children, ...props }: TagProps) {
  const stateStyles = selected
    ? "border-text bg-text text-bg"
    : "border-rule text-muted hover:border-rule-strong hover:text-text";

  if (onRemove) {
    return (
      <span className={cn(base, "border-rule bg-surface-2 pr-1 pl-3 text-text", disabled && "opacity-45", className)}>
        {children}
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${typeof children === "string" ? children : "filter"}`}
          className="grid size-6 place-items-center rounded-pill text-muted transition-colors duration-fast hover:bg-surface hover:text-text"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, "px-3.5 disabled:cursor-not-allowed disabled:opacity-45", stateStyles, className)}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span className={cn("font-mono text-caption", selected ? "text-bg/70" : "text-muted")}>{count}</span>
      )}
    </button>
  );
}
