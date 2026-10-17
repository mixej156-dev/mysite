"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { useThemeScope } from "../theme-scope";
import { fieldError, fieldFrame, fieldFrameDisabled, fieldFrameInvalid, fieldHint, fieldLabel } from "./field";

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
};

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  label,
  hint,
  error,
  disabled,
  name,
  className,
}: SelectProps) {
  const id = useId();
  const scopedTheme = useThemeScope();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className={fieldLabel}>
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <RadixSelect.Trigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            fieldFrame,
            "justify-between text-left outline-none focus-visible:border-accent-text focus-visible:ring-3 focus-visible:ring-accent-text/25",
            "data-placeholder:text-muted",
            error && fieldFrameInvalid,
            disabled && fieldFrameDisabled,
          )}
        >
          <span className="truncate">
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon className="shrink-0 text-muted">
            <ChevronDown aria-hidden className="size-4" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            data-theme={scopedTheme}
            position="popper"
            sideOffset={6}
            className={cn(
              "z-dropdown max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden",
              "rounded-field border border-rule bg-surface p-1 text-text shadow-overlay",
              "origin-(--radix-select-content-transform-origin) data-[state=open]:animate-pop-in",
            )}
          >
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex h-9 cursor-default select-none items-center rounded-sm pr-8 pl-3 text-small outline-none",
                    "data-highlighted:bg-surface-2 data-disabled:opacity-45",
                  )}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2.5 text-accent-text">
                    <Check aria-hidden className="size-4" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error ? (
        <p id={`${id}-error`} className={fieldError}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={fieldHint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
