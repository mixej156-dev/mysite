"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MetricFormat } from "@/data/metrics";
import { duration } from "@/design-system/motion";
import { cn } from "@/lib/cn";
import { formatCompactCurrency, formatNumber } from "@/lib/format";
import { useInViewOnce } from "./useInViewOnce";

export function formatMetric(value: number, format: MetricFormat): string {
  if (format === "currency-compact") return formatCompactCurrency(value);
  if (format === "percent") return `${value.toFixed(2)}%`;
  return formatNumber(value);
}

const COUNT_MS = duration.slow * 1000 * 3;

/**
 * Counts up once when scrolled into view. Renders the final value on the server,
 * and when it is already visible on load, so nothing flickers.
 */
export function useCountUp<T extends Element = HTMLDivElement>(target: number) {
  const reduceMotion = useReducedMotion();
  const { ref, inView, startedVisible } = useInViewOnce<T>();
  const [value, setValue] = useState(target);

  // Below the fold: hold at zero until it scrolls in
  const armed = startedVisible === false && !reduceMotion;

  useEffect(() => {
    if (!armed || !inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - (1 - t) ** 4;
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, inView, target]);

  return { ref, value: armed && !inView ? 0 : value };
}

export type StatCardProps = {
  label: string;
  value: number;
  format: MetricFormat;
  caption?: string;
  className?: string;
};

export function StatCard({ label, value, format, caption, className }: StatCardProps) {
  const { ref, value: shown } = useCountUp(value);

  return (
    <div ref={ref} className={cn("flex flex-col gap-3", className)}>
      <p className="text-small text-muted">{label}</p>
      {/* Screen readers get the final figure; the animated one is decorative */}
      <p className="font-mono text-h2 tracking-tight" aria-hidden>
        {formatMetric(shown, format)}
      </p>
      <p className="sr-only">{formatMetric(value, format)}</p>
      {caption && <p className="text-caption text-muted">{caption}</p>}
    </div>
  );
}
