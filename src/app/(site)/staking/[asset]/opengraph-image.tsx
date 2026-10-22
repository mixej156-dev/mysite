import { getPool, getPools } from "@/lib/api/catalog";
import { formatPercent } from "@/lib/format";
import { OG_SIZE, renderOgCard } from "../../../_og/card";

export const alt = "LONAR ECO. staking pool";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getPools()).map((pool) => ({ asset: pool.id }));
}

export default async function Image({ params }: { params: Promise<{ asset: string }> }) {
  const pool = (await getPool((await params).asset)) ?? (await getPools())[0];
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
