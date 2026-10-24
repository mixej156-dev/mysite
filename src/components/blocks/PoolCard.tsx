import { Link } from "@/components/Link";
import { Badge, Card } from "@/design-system";
import type { Pool } from "@/data/pools";
import { formatPercent, formatUnbonding } from "@/lib/format";
import { apyHistory } from "@/lib/series";
import { Sparkline } from "./Sparkline";

const TREND_DAYS = 90;

/** "Up 0.04 pts in 90 days", in percentage points of APY */
function trendLabel(values: number[]) {
  const delta = values[values.length - 1] - values[0];
  if (Math.abs(delta) < 0.005) return `Steady over ${TREND_DAYS} days`;
  return `${delta > 0 ? "Up" : "Down"} ${Math.abs(delta).toFixed(2)} pts in ${TREND_DAYS} days`;
}

export function PoolCard({ pool }: { pool: Pool }) {
  const flexible = pool.unbondingDays === 0;
  const trend = apyHistory(pool, TREND_DAYS).map((p) => p.value);

  return (
    <Card interactive padding="lg" className="flex h-full flex-col gap-6 sm:gap-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h4 font-medium">
            <Link href={`/staking/${pool.id}`} className="stretched-link">
              {pool.name}
            </Link>
          </h3>
          <p className="mt-1 text-small text-muted">{pool.ticker}</p>
        </div>
        {flexible && <Badge tone="success">No lock-up</Badge>}
      </div>
      <div className="mt-auto">
        <p className="text-caption text-muted">Estimated APY</p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <p className="font-mono text-h1 tracking-tight">{formatPercent(pool.apy)}</p>
          <Sparkline values={trend} smoothing={7} className="mb-2 h-10 w-24 shrink-0 sm:w-28" />
        </div>
        <p className="mt-1 text-caption text-muted">{trendLabel(trend)}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 border-t border-rule pt-5 text-small">
        <div>
          <dt className="text-muted">Withdrawal</dt>
          <dd className="mt-0.5 font-mono">{formatUnbonding(pool.unbondingDays)}</dd>
        </div>
        <div>
          <dt className="text-muted">Minimum</dt>
          <dd className="mt-0.5 font-mono">
            {pool.minStake} {pool.ticker}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
