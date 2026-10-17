import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

export type BalanceCardProps = {
  total: number;
  /** Change over the period, in USD */
  change: number;
  periodLabel: string;
  breakdown: { label: string; value: number; note?: string }[];
};

/** Hero figure for the dashboard: total value, change, and what it is made of. */
export function BalanceCard({ total, change, periodLabel, breakdown }: BalanceCardProps) {
  const up = change >= 0;
  const pct = total - change !== 0 ? (change / (total - change)) * 100 : 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;

  return (
    <section aria-labelledby="balance-title" className="rounded-card border border-rule bg-surface">
      <div className="flex flex-col gap-3 p-6 md:p-8">
        <h2 id="balance-title" className="text-small text-muted">
          Total balance
        </h2>
        <p className="text-display font-semibold tracking-tight">{formatCurrency(total)}</p>
        <p className={cn("flex items-center gap-1.5 text-small", up ? "text-success" : "text-danger")}>
          <Arrow aria-hidden className="size-4" />
          <span className="font-mono">
            {up ? "+" : "−"}
            {formatCurrency(Math.abs(change))} ({up ? "+" : "−"}
            {Math.abs(pct).toFixed(2)}%)
          </span>
          <span className="text-muted">{periodLabel}</span>
        </p>
      </div>
      <dl className="grid border-t border-rule sm:grid-cols-3">
        {breakdown.map((item, i) => (
          <div
            key={item.label}
            className={cn("p-5 md:px-8", i > 0 && "border-t border-rule sm:border-t-0 sm:border-l")}
          >
            <dt className="text-small text-muted">{item.label}</dt>
            <dd className="mt-1 font-mono text-h4">{formatCurrency(item.value)}</dd>
            {item.note && <dd className="mt-0.5 text-caption text-muted">{item.note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
