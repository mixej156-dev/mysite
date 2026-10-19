import type { Tx } from "@/data/portfolio";
import { Badge } from "@/design-system";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { IconChip } from "./tones";
import { TX_ICONS, TX_LABELS, TX_TONES, amountTone, signedAmount } from "./txMeta";

/** Compact list of account activity: icon, what happened, when, amount. */
export function ActivityList({ items, empty = "No activity yet." }: { items: Tx[]; empty?: string }) {
  if (items.length === 0) return <p className="py-6 text-small text-muted">{empty}</p>;
  return (
    <ul className="flex flex-col">
      {items.map((tx) => {
        return (
          <li key={tx.id} className="flex items-center gap-3 border-b border-rule py-3 last:border-0">
            <IconChip icon={TX_ICONS[tx.type]} tone={TX_TONES[tx.type]} />
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
