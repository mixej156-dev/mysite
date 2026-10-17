"use client";

import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { fieldError, fieldFrame, fieldFrameDisabled, fieldFrameInvalid, fieldHint, fieldLabel } from "./field";

export type InputProps = Omit<ComponentPropsWithRef<"input">, "prefix"> & {
  label?: string;
  hint?: string;
  error?: string;
  /** Leading adornment: icon or unit. */
  prefix?: ReactNode;
  /** Trailing adornment: ticker, unit or action. */
  suffix?: ReactNode;
  /** Monospace tabular digits, for amounts and addresses. */
  numeric?: boolean;
};

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  numeric = false,
  disabled,
  id,
  className,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className={fieldLabel}>
          {label}
        </label>
      )}
      <div className={cn(fieldFrame, error && fieldFrameInvalid, disabled && fieldFrameDisabled)}>
        {prefix && <span className="flex shrink-0 text-muted [&_svg]:size-4">{prefix}</span>}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          className={cn(
            "h-full w-full min-w-0 bg-transparent outline-none placeholder:text-muted/70",
            numeric && "font-mono",
          )}
          {...props}
        />
        {suffix && <span className="flex shrink-0 items-center text-small text-muted">{suffix}</span>}
      </div>
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
