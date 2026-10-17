"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";

export type CheckboxProps = {
  label?: string;
  description?: string;
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  name?: string;
  className?: string;
};

export function Checkbox({ label, description, className, disabled, ...props }: CheckboxProps) {
  const id = useId();

  return (
    <div className={cn("flex items-start gap-3", disabled && "opacity-45", className)}>
      <RadixCheckbox.Root
        id={id}
        disabled={disabled}
        aria-describedby={description ? `${id}-description` : undefined}
        className={cn(
          "group mt-0.5 grid size-[1.125rem] shrink-0 place-items-center rounded-sm border border-rule-strong bg-surface",
          "transition-colors duration-fast hover:border-text disabled:cursor-not-allowed",
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
      {(label || description) && (
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
        </div>
      )}
    </div>
  );
}
