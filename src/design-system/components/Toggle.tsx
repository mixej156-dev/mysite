"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import { useId } from "react";
import { cn } from "@/lib/cn";

export type ToggleProps = {
  label: string;
  description?: string;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
};

export function Toggle({ label, description, hideLabel = false, disabled, className, ...props }: ToggleProps) {
  const id = useId();

  return (
    <div className={cn("flex items-start justify-between gap-4", disabled && "opacity-45", className)}>
      <div className={cn("flex flex-col gap-0.5", hideLabel && "sr-only")}>
        <label htmlFor={id} className="text-small font-medium text-text">
          {label}
        </label>
        {description && (
          <p id={`${id}-description`} className="text-small text-muted">
            {description}
          </p>
        )}
      </div>
      <RadixSwitch.Root
        id={id}
        disabled={disabled}
        aria-describedby={description ? `${id}-description` : undefined}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 items-center rounded-pill border border-rule-strong bg-surface-2 p-0.5",
          "transition-colors duration-base disabled:cursor-not-allowed",
          "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        )}
        {...props}
      >
        <RadixSwitch.Thumb
          className={cn(
            "block size-[1.125rem] rounded-pill bg-text transition-transform duration-base",
            "data-[state=checked]:translate-x-4 data-[state=checked]:bg-on-accent",
          )}
        />
      </RadixSwitch.Root>
    </div>
  );
}
