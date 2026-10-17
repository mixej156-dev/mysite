import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { PoolExplorer } from "@/components/staking/PoolExplorer";
import { pools } from "@/data/pools";
import { formatCompactCurrency, formatPercent } from "@/lib/format";

export const metadata: Metadata = {
  title: "Staking pools",
  description: "Compare estimated yield, withdrawal periods and minimums across every staking pool.",
};

const averageApy = pools.reduce((sum, p) => sum + p.apy, 0) / pools.length;
const totalStaked = pools.reduce((sum, p) => sum + p.tvl, 0);

export default function StakingPage() {
  const summary = [
    { label: "Pools", value: String(pools.length) },
    { label: "Average est. APY", value: formatPercent(averageApy) },
    { label: "Total staked", value: formatCompactCurrency(totalStaked) },
  ];

  return (
    <>
      <PageHeader
        title="Staking pools"
        lead="Every pool lists its estimated yield after fees, how long withdrawals take, and the minimum to start."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staking" }]}
        aside={
          <div className="border-y border-rule">
            <dl className="grid grid-cols-3">
              {summary.map((item, i) => (
                <div key={item.label} className={i > 0 ? "border-l border-rule py-5 pl-4 sm:pl-6" : "py-5 pr-4"}>
                  <dt className="text-caption text-muted">{item.label}</dt>
                  <dd className="mt-1 font-mono text-h4 sm:text-h3">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />
      <section aria-labelledby="pools-title" className="container-page pb-24 md:pb-32">
        <h2 id="pools-title" className="sr-only">
          All pools
        </h2>
        <PoolExplorer pools={pools} />
      </section>
    </>
  );
}
