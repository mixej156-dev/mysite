import { ArrowDownLeft, ArrowUpRight, Coins, Layers, LogOut } from "lucide-react";
import type { Tx, TxType } from "@/data/portfolio";
import { Badge } from "@/design-system";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { TX_LABELS, amountTone, signedAmount } from "./txMeta";

const ICONS: Record<TxType, typeof Coins> = {
  deposit: ArrowDownLeft,
  withdraw: ArrowUpRight,
  stake: Layers,
  unstake: LogOut,
  reward: Coins,
};

/** Compact list of account activity: icon, what happened, when, amount. */
export function ActivityList({ items, empty = "No activity yet." }: { items: Tx[]; empty?: string }) {
  if (items.length === 0) return <p className="py-6 text-small text-muted">{empty}</p>;
  return (
    <ul className="flex flex-col">
      {items.map((tx) => {
        const Icon = ICONS[tx.type];
        return (
          <li key={tx.id} className="flex items-center gap-3 border-b border-rule py-3 last:border-0">
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-pill bg-surface-2 text-muted">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-small font-medium">
                {TX_LABELS[tx.type]} {tx.ticker}
              </p>
              <p className="text-caption text-muted">
                <time dateTime={tx.date}>{formatDate(tx.date.slice(0, 10))}</time>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn("font-mono text-small whitespace-nowrap", amountTone(tx))}>{signedAmount(tx)}</span>
              {tx.status === "pending" && <Badge tone="warning">Pending</Badge>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
