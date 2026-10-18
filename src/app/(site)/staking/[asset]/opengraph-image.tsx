import { getPool, pools } from "@/data/pools";
import { formatPercent } from "@/lib/format";
import { OG_SIZE, renderOgCard } from "../../../_og/card";

export const alt = "LONAR ECO. staking pool";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return pools.map((pool) => ({ asset: pool.id }));
}

export default async function Image({ params }: { params: Promise<{ asset: string }> }) {
  const pool = getPool((await params).asset) ?? pools[0];
  return renderOgCard({
    eyebrow: "Staking pool",
    title: `${pool.name} staking`,
    subtitle: `Stake ${pool.ticker} on ${pool.network}. Rewards recorded per epoch and paid out daily.`,
    figures: [
      { value: formatPercent(pool.apy), label: "Est. APY after fees" },
      { value: pool.unbondingDays === 0 ? "None" : `${pool.unbondingDays} days`, label: "Unbonding period" },
      { value: `${pool.minStake} ${pool.ticker}`, label: "Minimum stake" },
    ],
  });
}
