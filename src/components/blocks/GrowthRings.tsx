"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { duration, ease } from "@/design-system/motion";

const SIZE = 400;
const CENTER = SIZE / 2;
/** Radius of the principal disc */
const R0 = 84;
/** Radius available for reward rings */
const SPAN = 108;

export type GrowthRingsProps = {
  /** Balance at year 0 (principal), year 1 … year N */
  balances: number[];
  /** Most rings that can ever be drawn, so removed years collapse instead of vanishing */
  maxYears: number;
  /**
   * Reward-to-principal ratio that fills the full span. Fixed across pools so rings stay comparable:
   * a higher-yield pool draws wider rings. Square-root scaling keeps low yields legible.
   */
  scaleRatio: number;
  /** Centre label */
  children?: ReactNode;
};

/** Year rings: each band is the rewards earned that year, around a disc for the principal. */
export function GrowthRings({ balances, maxYears, scaleRatio, children }: GrowthRingsProps) {
  const reduceMotion = useReducedMotion();
  const principal = balances[0] ?? 0;
  const years = balances.length - 1;

  const radiusFor = (year: number) => {
    if (principal <= 0 || year > years) return R0;
    const ratio = (balances[year] - principal) / principal;
    return R0 + SPAN * Math.sqrt(Math.min(1, ratio / scaleRatio));
  };

  const transition = reduceMotion ? { duration: 0 } : { duration: duration.slow * 1.5, ease };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="size-full overflow-visible">
        {/* Scale reference: the largest projection any pool can reach */}
        <circle cx={CENTER} cy={CENTER} r={R0 + SPAN} fill="none" stroke="var(--rule-strong)" strokeDasharray="2 6" />
        {Array.from({ length: maxYears }, (_, i) => maxYears - i).map((year) => (
          <motion.circle
            key={year}
            cx={CENTER}
            cy={CENTER}
            initial={false}
            animate={{ r: radiusFor(year) }}
            transition={transition}
            fill={`color-mix(in oklab, var(--accent) ${30 + (year / maxYears) * 55}%, var(--bg))`}
            stroke="var(--bg)"
            strokeWidth={2}
          />
        ))}
        <circle cx={CENTER} cy={CENTER} r={R0} fill="var(--surface-2)" stroke="var(--bg)" strokeWidth={2} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
