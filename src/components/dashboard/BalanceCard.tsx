import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { AnimatedNumber } from "./AnimatedNumber";
import { TONE_FILL, type Tone } from "./tones";

export type BalanceCardProps = {
  total: number;
  /** Change over the period, in USD */
  change: number;
  periodLabel: string;
  /** `inTotal` items add up to the total and fill the composition bar, in this order */
  breakdown: { label: string; value: number; note?: string; tone?: Tone; inTotal?: boolean }[];
  /** Quick actions under the figure on phones and tablets, where the top bar has no room for them */
  actions?: ReactNode;
};

/** Hero figure for the dashboard: total value, change, and what it is made of. */
export function BalanceCard({ total, change, periodLabel, breakdown, actions }: BalanceCardProps) {
  const up = change >= 0;
  const pct = total - change !== 0 ? (change / (total - change)) * 100 : 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const parts = breakdown.filter((b) => b.inTotal && b.value > 0);

  return (
    <section
      aria-labelledby="balance-title"
      data-enter
      data-tour="balance"
      className="relative isolate overflow-hidden rounded-card border border-rule bg-surface short:flex"
    >
      {/* Soft brand glow in the corner, decorative */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 -z-10 size-96 rounded-pill bg-accent opacity-10 blur-3xl dark:opacity-[0.12]"
      />
      <div className="flex flex-col gap-2 p-5 sm:gap-3 sm:p-6 md:p-8 short:shrink-0 short:justify-center short:py-5 short:pr-12">
        <h2 id="balance-title" className="text-small text-muted">
          Total balance
        </h2>
        <p className="text-h1 font-semibold tracking-tight sm:text-display short:text-h1">
          <AnimatedNumber value={total} format={formatCurrency} />
        </p>
        <p
          className={cn(
            "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-small",
            up ? "text-success" : "text-danger",
          )}
        >
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-pill px-2 py-0.5",
              up ? "tint-success" : "tint-danger",
            )}
          >
            <Arrow aria-hidden className="size-4" />
            <span className="font-mono">
              {up ? "+" : "−"}
              {formatCurrency(Math.abs(change))} ({up ? "+" : "−"}
              {Math.abs(pct).toFixed(2)}%)
            </span>
          </span>
          <span className="text-muted">{periodLabel}</span>
        </p>
        {parts.length > 1 && (
          <div aria-hidden className="mt-2 flex h-1.5 w-full max-w-md gap-0.5 sm:mt-3 short:mt-2">
            {parts.map((p) => (
              <span
                key={p.label}
                className={cn("h-full origin-left animate-grow-x rounded-pill", TONE_FILL[p.tone ?? "blue"])}
                style={{ width: `${(p.value / total) * 100}%` }}
              />
            ))}
          </div>
        )}
        {actions && <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden">{actions}</div>}
      </div>
      {/* Short screens: the breakdown sits beside the total instead of below it */}
      <dl className="grid grid-cols-3 border-t border-rule short:flex-1 short:border-t-0 short:border-l">
        {breakdown.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              "min-w-0 px-3 py-3.5 sm:p-5 md:px-8 short:flex short:flex-col short:justify-center short:py-4",
              i > 0 && "border-l border-rule",
            )}
          >
            <dt className="flex items-center gap-1.5 text-caption text-muted sm:gap-2 sm:text-small">
              {item.tone && <span aria-hidden className={cn("size-2 shrink-0 rounded-pill", TONE_FILL[item.tone])} />}
              <span className="truncate">{item.label}</span>
            </dt>
            <dd className="mt-1 font-mono text-body sm:text-h4">
              <AnimatedNumber value={item.value} format={formatCurrency} />
            </dd>
            {item.note && <dd className="mt-0.5 text-caption text-muted max-sm:hidden">{item.note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
