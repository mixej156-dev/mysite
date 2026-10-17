import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PoolDetail, PoolDetailSkeleton } from "@/components/staking/PoolDetail";
import { getPool, pools } from "@/data/pools";
import { formatPercent } from "@/lib/format";

export function generateStaticParams() {
  return pools.map((pool) => ({ asset: pool.id }));
}

export async function generateMetadata({ params }: PageProps<"/staking/[asset]">): Promise<Metadata> {
  const pool = getPool((await params).asset);
  if (!pool) return { title: "Pool not found" };
  return {
    title: `${pool.name} staking`,
    description: `Stake ${pool.ticker} on ${pool.network}: estimated ${formatPercent(pool.apy)} APY after fees, minimum ${pool.minStake} ${pool.ticker}, daily payouts. Demo data.`,
  };
}

/* params are URL data: read them inside Suspense so navigations show the skeleton instantly */
async function PoolContent({ params }: { params: PageProps<"/staking/[asset]">["params"] }) {
  const pool = getPool((await params).asset);
  if (!pool) notFound();
  return <PoolDetail pool={pool} />;
}

export default function PoolPage({ params }: PageProps<"/staking/[asset]">) {
  return (
    <Suspense fallback={<PoolDetailSkeleton />}>
      <PoolContent params={params} />
    </Suspense>
  );
}
