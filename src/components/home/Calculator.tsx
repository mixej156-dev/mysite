"use client";

import { Link } from "@/components/Link";
import { useMemo, useState } from "react";
import { Card, Input, Select, Tabs, TabsList, TabsTrigger } from "@/design-system";
import { pools } from "@/data/pools";
import { projectBalances } from "@/lib/compound";
import { formatPercent, formatToken } from "@/lib/format";
import { GrowthRings } from "../blocks/GrowthRings";
import { Section, SectionHeader } from "../blocks/Section";

const PERIODS = [1, 3, 5] as const;
const MAX_YEARS = 5;
/** Ring scale: the highest-yield pool over the longest period fills the full span */
const SCALE_RATIO = (1 + Math.max(...pools.map((p) => p.apy)) / 100) ** MAX_YEARS - 1;

const TOOLS = [
  { label: "Compare pools", href: "/tools/compare", body: "Terms and yield side by side" },
  { label: "Converter", href: "/tools#converter", body: "Between supported assets" },
  { label: "Gas estimate", href: "/tools#gas", body: "Typical fees to stake and unstake" },
];

function amountDigits(ticker: string) {
  return ticker === "ETH" ? 4 : 2;
}

export function Calculator() {
  const [poolId, setPoolId] = useState("eth");
  const [amountText, setAmountText] = useState("10");
  const [years, setYears] = useState<(typeof PERIODS)[number]>(5);

  const pool = pools.find((p) => p.id === poolId) ?? pools[0];
  const amount = Number(amountText.replace(/,/g, ""));
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const belowMinimum = valid && amount < pool.minStake;

  const balances = useMemo(() => projectBalances(valid ? amount : 0, pool.apy, years), [valid, amount, pool.apy, years]);
  const digits = amountDigits(pool.ticker);
  const fmt = (n: number) => formatToken(n, "", digits).trim();
  const final = balances[balances.length - 1];

  const error = amountText.trim() !== "" && !valid ? "Enter a number greater than 0." : belowMinimum
    ? `The minimum stake for this pool is ${pool.minStake} ${pool.ticker}.`
    : undefined;

  return (
    <Section labelledBy="calc-title">
      <SectionHeader
        id="calc-title"
        title="See what a stake could earn"
        lead="Pick a pool, an amount and a period. The projection assumes today’s estimated APY holds and rewards are restaked."
      />
      <Card padding="none" className="grid overflow-hidden lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-6 border-b border-rule p-6 md:p-8 lg:border-r lg:border-b-0">
          <Select
            label="Pool"
            value={poolId}
            onValueChange={setPoolId}
            options={pools.map((p) => ({ value: p.id, label: `${p.name} (${formatPercent(p.apy)} APY)` }))}
          />
          <Input
            label="Amount"
            inputMode="decimal"
            numeric
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            suffix={pool.ticker}
            error={error}
            hint={`Minimum ${pool.minStake} ${pool.ticker}`}
          />
          <div className="flex flex-col gap-1.5">
            <p id="calc-period" className="text-small font-medium">
              Period
            </p>
            <Tabs
              variant="segmented"
              value={String(years)}
              onValueChange={(v) => setYears(Number(v) as (typeof PERIODS)[number])}
            >
              <TabsList aria-labelledby="calc-period">
                {PERIODS.map((p) => (
                  <TabsTrigger key={p} value={String(p)}>
                    {p} {p === 1 ? "year" : "years"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <table className="mt-2 w-full text-small">
            <caption className="sr-only">Projected balance by year</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((b, year) => (
                <tr key={year} className="border-t border-rule">
                  <th scope="row" className="py-2.5 text-left font-normal text-muted">
                    {year === 0 ? "Today" : `Year ${year}`}
                  </th>
                  <td className="py-2.5 text-right font-mono">{valid ? `${fmt(b)} ${pool.ticker}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
          <GrowthRings balances={balances} maxYears={MAX_YEARS} scaleRatio={SCALE_RATIO}>
            <div className="flex max-w-[9rem] flex-col items-center gap-1" aria-live="polite">
              {valid ? (
                <>
                  <p className="text-caption text-muted">After {years === 1 ? "1 year" : `${years} years`}</p>
                  <p className="font-mono text-body leading-tight sm:text-h4">{fmt(final)}</p>
                  <p className="font-mono text-caption text-success">
                    +{fmt(final - balances[0])} {pool.ticker}
                  </p>
                </>
              ) : (
                <p className="text-caption text-muted">Enter an amount to see a projection</p>
              )}
            </div>
          </GrowthRings>
          <p className="text-center text-caption text-muted">
            Each ring is one year of rewards. Projection, not a forecast or a guarantee.
          </p>
        </div>
      </Card>

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Card variant="outline" interactive padding="sm" className="flex flex-col gap-1">
              <Link href={tool.href} className="stretched-link text-small font-medium">
                {tool.label}
              </Link>
              <p className="text-small text-muted">{tool.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
