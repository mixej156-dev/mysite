import { useId } from "react";
import { cn } from "@/lib/cn";

export type ProgressProps = {
  /** 0–100 */
  value: number;
  label?: string;
  /** Text on the right, e.g. "72%" or "18 of 25 days". Defaults to the percentage. */
  valueLabel?: string;
  tone?: "accent" | "success" | "warning";
  className?: string;
};

const tones = { accent: "bg-accent", success: "bg-success", warning: "bg-warning" } as const;

export function Progress({ value, label, valueLabel, tone = "accent", className }: ProgressProps) {
  const id = useId();
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || valueLabel !== "") && (
        <div className="flex items-baseline justify-between gap-4 text-small">
          {label && (
            <span id={id} className="text-muted">
              {label}
            </span>
          )}
          <span className="font-mono text-text">{valueLabel ?? `${Math.round(clamped)}%`}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-labelledby={label ? id : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-valuetext={valueLabel}
        className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-2"
      >
        <div
          className={cn("h-full rounded-pill transition-[width] duration-slow", tones[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
