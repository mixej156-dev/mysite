"use client";

import { useMemo, useState } from "react";
import { Input, Select, Slider, Toggle } from "@/design-system";
import { pools } from "@/data/pools";
import { USD_PRICES } from "@/data/prices";
import { RING_YEARS, feeOnRewards, monthlyBalances } from "@/lib/compound";
import { formatCurrency, formatPercent, formatToken } from "@/lib/format";
import { TimeSeriesChart } from "../charts/TimeSeriesChart";
import { CalculatorRings } from "./CalculatorRings";

/** Slider ceiling per asset: roughly $250k worth, rounded to a clean number. */
function amountCeiling(ticker: string) {
  const raw = 250_000 / USD_PRICES[ticker];
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  return Math.round(raw / magnitude) * magnitude;
}

function digits(value: number) {
  return Math.abs(value) >= 1000 ? 2 : 4;
}

function monthsLabel(months: number) {
  if (months % 12 === 0) return months === 12 ? "1 year" : `${months / 12} years`;
  return months === 1 ? "1 month" : `${months} months`;
}

export function RewardsCalculator() {
  const [poolId, setPoolId] = useState("eth");
  const [amountText, setAmountText] = useState("10");
  const [months, setMonths] = useState(24);
  const [restake, setRestake] = useState(true);

  const pool = pools.find((p) => p.id === poolId) ?? pools[0];
  const ceiling = amountCeiling(pool.ticker);
  const amount = Number(amountText.replace(/,/g, ""));
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const belowMinimum = valid && amount < pool.minStake;
  const principal = valid ? amount : 0;

  const withRestake = useMemo(() => monthlyBalances(principal, pool.apy, months, true), [principal, pool.apy, months]);
  const withoutRestake = useMemo(
    () => monthlyBalances(principal, pool.apy, months, false),
    [principal, pool.apy, months],
  );
  const chosen = restake ? withRestake : withoutRestake;
  const final = chosen[chosen.length - 1];
  const rewards = final - principal;
  const fee = feeOnRewards(rewards, pool.feePercent);
  const price = USD_PRICES[pool.ticker];
  /* One precision for every figure in the result, set by the largest (final balance) */
  const fmt = (n: number) => formatToken(n, "", digits(final)).trim();

  /* Rings: one per whole year, capped at RING_YEARS */
  const yearly = Array.from({ length: Math.min(RING_YEARS, Math.floor(months / 12)) + 1 }, (_, y) => chosen[y * 12]);

  const error =
    amountText.trim() !== "" && !valid
      ? "Enter a number greater than 0."
      : belowMinimum
        ? `The minimum stake for this pool is ${pool.minStake} ${pool.ticker}.`
        : undefined;

  const summary = [
    { label: "Final balance", value: `${fmt(final)} ${pool.ticker}`, usd: final * price },
    { label: "Rewards, after fee", value: `+${fmt(rewards)} ${pool.ticker}`, usd: rewards * price, positive: true },
    { label: `Platform fee (${pool.feePercent}% of rewards)`, value: `${fmt(fee)} ${pool.ticker}`, usd: fee * price },
  ];

  const series = [
    {
      id: "restake",
      label: "Rewards restaked",
      color: "var(--series-1)",
      points: withRestake.map((value, m) => ({ date: String(m), value })),
    },
    {
      id: "simple",
      label: "Rewards withdrawn",
      color: "var(--series-2)",
      points: withoutRestake.map((value, m) => ({ date: String(m), value })),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Inputs */}
      <div className="flex flex-col gap-7 self-start rounded-card border border-rule bg-surface p-6 md:p-8 lg:sticky lg:top-24">
        <Select
          label="Pool"
          value={poolId}
          onValueChange={(id) => {
            setPoolId(id);
            const next = pools.find((p) => p.id === id);
            if (next && valid && amount > amountCeiling(next.ticker)) setAmountText(String(amountCeiling(next.ticker)));
          }}
          options={pools.map((p) => ({ value: p.id, label: `${p.name} (${formatPercent(p.apy)} APY)` }))}
        />
        <div className="flex flex-col gap-3">
          <Input
            label="Amount"
            inputMode="decimal"
            numeric
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            suffix={pool.ticker}
            error={error}
            hint={
              valid
                ? `≈ ${formatCurrency(amount * price)} at a reference price`
                : `Minimum ${pool.minStake} ${pool.ticker}`
            }
          />
          <Slider
            label="Adjust amount"
            hideLabel
            value={Math.min(valid ? amount : 0, ceiling)}
            onValueChange={(v) => setAmountText(String(v))}
            min={0}
            max={ceiling}
            step={ceiling / 1000}
            valueText={`${fmt(principal)} ${pool.ticker}`}
          />
        </div>
        <Slider
          label="Period"
          value={months}
          onValueChange={setMonths}
          min={1}
          max={60}
          valueText={monthsLabel(months)}
        />
        <Toggle
          label="Restake rewards"
          description="Add each payout to the stake so it earns too. Off: rewards are paid out and not compounded."
          checked={restake}
          onCheckedChange={setRestake}
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-6">
        <dl className="grid overflow-hidden rounded-card border border-rule bg-surface sm:grid-cols-3">
          {summary.map((item, i) => (
            <div key={item.label} className={i > 0 ? "border-t border-rule p-5 sm:border-t-0 sm:border-l" : "p-5"}>
              <dt className="text-small text-muted">{item.label}</dt>
              <dd className={`mt-1 font-mono text-h4 ${item.positive ? "text-success" : ""}`}>
                {valid ? item.value : "—"}
              </dd>
              <dd className="mt-0.5 font-mono text-caption text-muted">
                {valid ? `≈ ${formatCurrency(item.usd)}` : ""}
              </dd>
            </div>
          ))}
        </dl>

        <TimeSeriesChart
          title={`Projected balance, ${pool.ticker}`}
          series={series}
          valueFormat="amount"
          xFormat="month"
          periods={[]}
          note="Assumes today’s estimated APY for the whole period. Projection, not a forecast or a guarantee."
        />

        <div className="grid items-center gap-6 rounded-card border border-rule bg-surface p-6 md:grid-cols-2 md:p-8">
          <div>
            <h2 className="text-h3">Year by year</h2>
            <p className="mt-2 text-body text-muted">
              Each ring is one full year of rewards, drawn on the same scale for every pool, so higher yields show as
              wider rings.
            </p>
            {months < 12 && <p className="mt-3 text-small text-muted">Choose 12 months or more to see rings.</p>}
          </div>
          <CalculatorRings
            yearly={yearly}
            periodLabel={monthsLabel(months)}
            final={final}
            rewards={rewards}
            ticker={pool.ticker}
            format={fmt}
            valid={valid}
          />
        </div>

        <div className="rounded-card border border-rule p-6 md:p-8">
          <h2 className="text-h4">Assumptions</h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-body text-muted">
            <li>The APY stays at today’s estimate of {formatPercent(pool.apy)}; in practice it changes daily.</li>
            <li>The {pool.feePercent}% platform fee is already deducted from that APY.</li>
            <li>No slashing, no price change, and no network fees are included.</li>
            <li>
              USD values use a fixed reference price of {formatCurrency(price)} per {pool.ticker}.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
