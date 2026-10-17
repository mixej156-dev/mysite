"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/design-system";
import { transition } from "@/design-system/motion";
import { cn } from "@/lib/cn";
import { formatNumber, formatToken } from "@/lib/format";
import { payoutAt } from "@/lib/payouts";

const VISIBLE = 7;
const INTERVAL_MS = 2600;

/** Index of the newest row on first render; rows count down from here. */
const START = 40;

/**
 * Demo feed of reward payouts. A new row arrives every few seconds; paused on hover/focus,
 * while the tab is hidden, and entirely static with reduced motion.
 */
export function PayoutLedger({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [newest, setNewest] = useState(START);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setNewest((n) => n + 1);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  // Rows present on first paint (newest === START) don't animate in; only rows that arrive later do.
  const rows = Array.from({ length: VISIBLE }, (_, i) => payoutAt(newest - i));

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("overflow-hidden rounded-card border border-rule bg-surface", className)}
    >
      <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4">
        <div>
          <p className="text-small font-medium">Reward payouts</p>
          <p className="font-mono text-caption text-muted">Epoch {formatNumber(rows[0].epoch)}</p>
        </div>
      <Badge tone="accent" dot>
        Recent
      </Badge>
    </div>
    <div className="relative">
      <ol aria-label="Recent reward payouts" className="flex flex-col">
          {rows.map((row) => (
            <motion.li
              key={row.id}
              layout={reduceMotion ? false : "position"}
              initial={newest > START ? { opacity: 0, y: -12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={transition.slow}
              className="grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 border-b border-rule px-5 py-3.5 font-mono text-small last:border-0 sm:grid-cols-[3.25rem_1fr_auto_6.5rem]"
            >
                <span className="text-muted">{row.ticker}</span>
                <span className="text-success">+{formatToken(row.amount, "", row.ticker === "ETH" ? 5 : 3).trim()}</span>
                <span className="text-right text-caption text-muted sm:order-last">{row.address}</span>
                <span className="hidden text-right text-caption text-muted sm:block">#{formatNumber(row.epoch)}</span>
              </motion.li>
            ))}
        </ol>
        {/* Fade the oldest row into the card */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-surface to-transparent" />
      </div>
    </div>
  );
}
