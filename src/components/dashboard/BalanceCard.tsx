import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

export type BalanceCardProps = {
  total: number;
  /** Change over the period, in USD */
  change: number;
  periodLabel: string;
  breakdown: { label: string; value: number; note?: string }[];
  /** Quick actions under the figure on phones and tablets, where the top bar has no room for them */
  actions?: ReactNode;
};

/** Hero figure for the dashboard: total value, change, and what it is made of. */
export function BalanceCard({ total, change, periodLabel, breakdown, actions }: BalanceCardProps) {
  const up = change >= 0;
  const pct = total - change !== 0 ? (change / (total - change)) * 100 : 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;

  return (
    <section aria-labelledby="balance-title" className="rounded-card border border-rule bg-surface short:flex">
      <div className="flex flex-col gap-2 p-5 sm:gap-3 sm:p-6 md:p-8 short:shrink-0 short:justify-center short:py-5 short:pr-12">
        <h2 id="balance-title" className="text-small text-muted">
          Total balance
        </h2>
        <p className="text-h1 font-semibold tracking-tight sm:text-display short:text-h1">{formatCurrency(total)}</p>
        <p className={cn("flex items-center gap-1.5 text-small", up ? "text-success" : "text-danger")}>
          <Arrow aria-hidden className="size-4" />
          <span className="font-mono">
            {up ? "+" : "−"}
            {formatCurrency(Math.abs(change))} ({up ? "+" : "−"}
            {Math.abs(pct).toFixed(2)}%)
          </span>
          <span className="text-muted">{periodLabel}</span>
        </p>
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
            <dt className="text-caption text-muted sm:text-small">{item.label}</dt>
            <dd className="mt-1 font-mono text-body sm:text-h4">{formatCurrency(item.value)}</dd>
            {item.note && <dd className="mt-0.5 text-caption text-muted max-sm:hidden">{item.note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
