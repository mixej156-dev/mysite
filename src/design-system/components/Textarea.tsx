"use client";

import { useId, type ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { fieldError, fieldFrameDisabled, fieldHint, fieldLabel } from "./field";

export type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  label: string;
  hint?: string;
  error?: string;
};

/** Multi-line field with the same frame, label, hint and error pattern as Input. */
export function Textarea({ label, hint, error, disabled, id, className, rows = 5, ...props }: TextareaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={fieldId} className={fieldLabel}>
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId ?? hintId}
        className={cn(
          "w-full resize-y rounded-field border bg-surface px-3.5 py-3 text-body text-text outline-none",
          "transition-colors duration-fast placeholder:text-muted/70 focus:ring-3",
          error
            ? "border-danger focus:ring-danger/25"
            : "border-rule hover:border-rule-strong focus:border-accent-text focus:ring-accent-text/25",
          disabled && fieldFrameDisabled,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className={fieldError}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className={fieldHint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
