"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { fieldLabel } from "./field";

export type SliderProps = {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Human-readable value, shown next to the label and announced by screen readers */
  valueText?: string;
  /** Hide the label row (when a visible field next to it already names the value) */
  hideLabel?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Slider({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  valueText,
  hideLabel = false,
  disabled,
  className,
}: SliderProps) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-3", disabled && "opacity-45", className)}>
      <div className={cn("flex items-baseline justify-between gap-4", hideLabel && "sr-only")}>
        <span id={id} className={fieldLabel}>
          {label}
        </span>
        {valueText && <span className="font-mono text-small text-muted">{valueText}</span>}
      </div>
      <RadixSlider.Root
        value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="relative flex h-5 w-full touch-none items-center select-none"
      >
        <RadixSlider.Track className="relative h-1.5 grow overflow-hidden rounded-pill bg-surface-2">
          <RadixSlider.Range className="absolute h-full rounded-pill bg-accent" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          aria-labelledby={id}
          aria-valuetext={valueText}
          className={cn(
            "block size-5 rounded-pill border-2 border-accent bg-surface shadow-float",
            "transition-transform duration-fast hover:scale-110 focus-visible:ring-4 focus-visible:ring-accent-text/30",
            "disabled:cursor-not-allowed",
          )}
        />
      </RadixSlider.Root>
    </div>
  );
}
