"use client";

import { useCountUp } from "./StatCard";

/**
 * A figure that counts up once when it scrolls into view (as the metrics on the home page). Server components pass
 * the format as data, since functions can't cross to the client. Screen readers get the final figure.
 */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const { ref, value: shown } = useCountUp<HTMLSpanElement>(value);
  const format = (v: number) => `${v.toFixed(decimals)}${suffix}`;
  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
