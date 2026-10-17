import { ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "@/components/Link";
import { Accordion, Badge, Skeleton, buttonClasses } from "@/design-system";
import { POOL_RISKS, pools, type Pool } from "@/data/pools";
import { NETWORK_PERFORMANCE, uptimeHistory } from "@/data/validators";
import { formatCompactCurrency, formatPercent, formatUnbonding } from "@/lib/format";
import { apyHistory } from "@/lib/series";
import { PageHeader } from "../blocks/PageHeader";
import { PoolCard } from "../blocks/PoolCard";
import { Section, SectionHeader } from "../blocks/Section";
import { TimeSeriesChart } from "../charts/TimeSeriesChart";
import { StatusLegend, UptimeStrip } from "../validators/UptimeStrip";

function poolFaq(pool: Pool) {
  return [
    {
      id: "min",
      title: `What is the minimum stake for ${pool.ticker}?`,
      content: `${pool.minStake} ${pool.ticker}. There is no maximum; very large stakes may be spread across more validators.`,
    },
    {
      id: "withdraw",
      title: "How long does it take to withdraw?",
      content:
        pool.unbondingDays === 0
          ? `There is no lock-up on ${pool.network}: unstaked ${pool.ticker} is available right away.`
          : `About ${formatUnbonding(pool.unbondingDays)} on ${pool.network}. Funds earn nothing during unbonding and can’t be moved until it ends. The exact release date is shown before you confirm.`,
    },
    {
      id: "fee",
      title: "What does the platform charge?",
      content: `${pool.feePercent}% of rewards. The APY shown is already net of this fee; there is no fee on the amount you stake.`,
    },
    {
      id: "payout",
      title: "When are rewards paid?",
      content: `Rewards are recorded each epoch and paid out daily in ${pool.ticker}. You can restake them or leave them in your wallet.`,
    },
  ];
}

export function PoolDetail({ pool }: { pool: Pool }) {
  const params = [
    { label: "Withdrawal", value: formatUnbonding(pool.unbondingDays), note: "Unbonding period", mono: true },
    { label: "Minimum stake", value: `${pool.minStake} ${pool.ticker}`, mono: true },
    { label: "Platform fee", value: `${pool.feePercent}%`, note: "Of rewards", mono: true },
    { label: "Staked in pool", value: formatCompactCurrency(pool.tvl), mono: true },
    { label: "Validators", value: String(pool.validators), mono: true },
    { label: "Payouts", value: pool.payout, note: "To your wallet" },
    { label: "Reward asset", value: pool.ticker },
    { label: "Network", value: pool.network },
  ];
  const performance = NETWORK_PERFORMANCE.find((n) => n.poolId === pool.id);
  const others = pools
    .filter((p) => p.id !== pool.id)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={`${pool.name} staking`}
        lead={`Stake ${pool.ticker} on ${pool.network}. Rewards are recorded each epoch and paid out daily.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staking", href: "/staking" }, { label: pool.name }]}
        aside={
          <div className="flex flex-col gap-2 border-y border-rule py-6">
            <div className="flex items-center gap-3">
              <p className="text-small text-muted">Estimated APY</p>
              {pool.unbondingDays === 0 && <Badge tone="success">No lock-up</Badge>}
            </div>
            <p className="font-mono text-display tracking-tight">{formatPercent(pool.apy)}</p>
            <p className="text-caption text-muted">
              After the {pool.feePercent}% platform fee. Not a forecast.{" "}
              <Link href="/fees" className="rounded-sm text-accent-text underline underline-offset-2">
                Fee details
              </Link>
            </p>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href={`/dashboard/stake?pool=${pool.id}`} className={buttonClasses({ size: "lg" })}>
            Stake {pool.ticker}
          </Link>
          <Link href="/tools/calculator" className={buttonClasses({ size: "lg", variant: "secondary" })}>
            Estimate rewards
          </Link>
        </div>
      </PageHeader>

      <section aria-labelledby={`${pool.id}-params-title`} className="container-page">
        <h2 id={`${pool.id}-params-title`} className="sr-only">
          Pool terms
        </h2>
        <dl className="grid grid-cols-2 overflow-hidden rounded-card border border-rule md:grid-cols-4">
          {params.map((item, i) => (
            <div
              key={item.label}
              className={[
                "flex flex-col gap-1 p-5",
                i % 2 === 1 ? "border-l border-rule" : "",
                i % 4 !== 0 ? "md:border-l" : "md:border-l-0",
                i >= 2 ? "border-t border-rule" : "",
                i < 4 ? "md:border-t-0" : "md:border-t",
              ].join(" ")}
            >
              <dt className="text-small text-muted">{item.label}</dt>
              <dd className={item.mono ? "font-mono text-h4" : "text-h4"}>{item.value}</dd>
              {item.note && <dd className="text-caption text-muted">{item.note}</dd>}
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="APY history" className="container-page mt-8">
        <TimeSeriesChart
          title="Estimated APY"
          series={[{ id: pool.id, label: pool.name, color: "var(--series-1)", points: apyHistory(pool) }]}
          valueFormat="percent"
          note="Daily estimate after fees. Past yield doesn’t predict future yield."
        />
      </section>

      {performance && (
        <section aria-labelledby={`${pool.id}-validators-title`} className="container-page mt-8">
          <div className="grid gap-6 rounded-card border border-rule bg-surface p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center lg:gap-10">
            <div>
              <h2 id={`${pool.id}-validators-title`} className="text-h4 font-medium">
                Validator performance
              </h2>
              <dl className="mt-4 grid grid-cols-3 text-small">
                {[
                  ["Uptime, 30 days", `${performance.uptime30d.toFixed(2)}%`],
                  ["Effectiveness", `${performance.effectiveness.toFixed(1)}%`],
                  ["Slashing", String(performance.slashingEvents)],
                ].map(([label, value], i) => (
                  <div key={label} className={i > 0 ? "border-l border-rule pl-4" : "pr-4"}>
                    <dt className="text-caption text-muted">{label}</dt>
                    <dd className="mt-0.5 font-mono text-h4">{value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/validators"
                className="mt-4 inline-flex items-center gap-1 rounded-sm text-small font-medium text-accent-text hover:underline"
              >
                All networks and incidents
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <UptimeStrip days={uptimeHistory(pool.id)} label={`${pool.name} validators`} />
              <StatusLegend />
            </div>
          </div>
        </section>
      )}

      <Section labelledBy={`${pool.id}-about-pool-title`}>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 id={`${pool.id}-about-pool-title`} className="text-h2">
              About this pool
            </h2>
            <p className="mt-5 max-w-[60ch] font-serif text-lead text-muted">{pool.description}</p>
          </div>
          <div>
            <h2 className="flex items-center gap-3 text-h2">
              <ShieldAlert aria-hidden className="size-6 text-warning" />
              Risks
            </h2>
            <ul className="mt-5 flex flex-col border-t border-rule">
              {POOL_RISKS.map((risk) => (
                <li key={risk.title} className="border-b border-rule py-4">
                  <p className="font-medium">{risk.title}</p>
                  <p className="mt-1 font-serif text-body text-muted">{risk.body}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/legal/risk-disclosure"
              className="mt-5 inline-block rounded-sm text-small font-medium text-accent-text hover:underline"
            >
              Read the full risk disclosure
            </Link>
          </div>
        </div>
      </Section>

      <Section tone="inverse" labelledBy={`${pool.id}-pool-faq-title`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 id={`${pool.id}-pool-faq-title`} className="text-h2 lg:col-span-4">
            Questions about {pool.name}
          </h2>
          <Accordion items={poolFaq(pool)} defaultOpen={["withdraw"]} className="lg:col-span-8" />
        </div>
      </Section>

      <Section labelledBy={`${pool.id}-other-pools-title`}>
        <SectionHeader
          id={`${pool.id}-other-pools-title`}
          title="Other pools"
          action={
            <Link href="/staking" className={buttonClasses({ variant: "secondary" })}>
              All pools
            </Link>
          }
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {others.map((p) => (
            <li key={p.id}>
              <PoolCard pool={p} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

/** Shape of the pool header and terms while the page streams in. */
export function PoolDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading pool" className="container-page pt-12 pb-24 md:pt-16">
      <Skeleton className="h-4 w-48" />
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
          <div className="mt-3 flex gap-3">
            <Skeleton className="h-12 w-36 rounded-field" />
            <Skeleton className="h-12 w-40 rounded-field" />
          </div>
        </div>
        <Skeleton className="h-36 lg:col-span-5" />
      </div>
      <Skeleton className="mt-16 h-48 rounded-card" />
      <Skeleton className="mt-8 h-80 rounded-card" />
    </div>
  );
}
