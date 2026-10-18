import { Link } from "@/components/Link";
import { Badge, Card } from "@/design-system";
import type { Pool } from "@/data/pools";
import { formatPercent, formatUnbonding } from "@/lib/format";

export function PoolCard({ pool }: { pool: Pool }) {
  const flexible = pool.unbondingDays === 0;

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
        <p className="mt-1 font-mono text-h1 tracking-tight">{formatPercent(pool.apy)}</p>
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
