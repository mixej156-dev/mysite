import type { RewardEntry } from "@/lib/portfolio";
import { getPool } from "@/data/pools";
import { formatDate } from "@/lib/format";
import { AssetIcon } from "./AssetIcon";
import { tokenAmount } from "./txMeta";

/** Latest daily payouts grouped by day. */
export function RewardsFeed({ entries, days = 4 }: { entries: RewardEntry[]; days?: number }) {
  const byDate = new Map<string, RewardEntry[]>();
  for (const e of [...entries].sort((a, b) => b.date.localeCompare(a.date))) {
    if (!byDate.has(e.date)) {
      if (byDate.size === days) break;
      byDate.set(e.date, []);
    }
    byDate.get(e.date)!.push(e);
  }
  if (byDate.size === 0)
    return <p className="py-6 text-small text-muted">Rewards appear here the day after you stake.</p>;

  return (
    <ol className="flex flex-col gap-5">
      {[...byDate].map(([date, list]) => (
        <li key={date}>
          <p className="text-caption text-muted">
            <time dateTime={date}>{formatDate(date)}</time>
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {list.map((e) => (
              <li key={e.positionId} className="flex items-center justify-between gap-4 text-small">
                <span className="flex min-w-0 items-center gap-2">
                  <AssetIcon poolId={e.poolId} className="size-4" />
                  <span className="truncate">{getPool(e.poolId)?.name}</span>
                </span>
                <span className="font-mono text-success">+{tokenAmount(e.amount, e.ticker)}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
