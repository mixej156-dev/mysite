"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CheckboxProps = {
  label?: ReactNode;
  description?: string;
  /** Shown under the label; marks the checkbox invalid */
  error?: string;
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  name?: string;
  className?: string;
};

export function Checkbox({ label, description, error, className, disabled, ...props }: CheckboxProps) {
  const id = useId();

  return (
    <div className={cn("flex items-start gap-3", disabled && "opacity-45", className)}>
      <RadixCheckbox.Root
        id={id}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        className={cn(
          "group mt-0.5 grid size-[1.125rem] shrink-0 place-items-center rounded-sm border bg-surface",
          "transition-colors duration-fast hover:border-text disabled:cursor-not-allowed",
          error ? "border-danger" : "border-rule-strong",
          "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
          "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent",
        )}
        {...props}
      >
        <RadixCheckbox.Indicator className="text-on-accent">
          <Check aria-hidden strokeWidth={3} className="size-3 group-data-[state=indeterminate]:hidden" />
          <Minus aria-hidden strokeWidth={3} className="hidden size-3 group-data-[state=indeterminate]:block" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {(label || description || error) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label htmlFor={id} className="text-small font-medium text-text">
              {label}
            </label>
          )}
          {description && (
            <p id={`${id}-description`} className="text-small text-muted">
              {description}
            </p>
          )}
          {error && (
            <p id={`${id}-error`} className="text-small text-danger">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
