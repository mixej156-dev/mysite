"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/Link";
import { Badge, Button, Select, TBody, TD, THead, TR, Table } from "@/design-system";
import { pools, type Pool } from "@/data/pools";
import { formatCompactCurrency, formatPercent, formatUnbonding } from "@/lib/format";
import { apyHistory } from "@/lib/series";
import { TimeSeriesChart } from "../charts/TimeSeriesChart";

const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)"] as const;
const MAX = 3;

/* A slot keeps its colour for its whole life, so removing a pool never repaints the others */
type Slot = { key: number; poolId: string; color: (typeof COLORS)[number] };

type Row = {
  label: string;
  value: (p: Pool) => string;
  /** Which value is best, if "best" means something for this row */
  best?: (list: Pool[]) => string | undefined;
  mono?: boolean;
};

const ROWS: Row[] = [
  {
    label: "Estimated APY",
    value: (p) => formatPercent(p.apy),
    best: (list) => [...list].sort((a, b) => b.apy - a.apy)[0]?.id,
    mono: true,
  },
  {
    label: "Withdrawal",
    value: (p) => formatUnbonding(p.unbondingDays),
    best: (list) => [...list].sort((a, b) => a.unbondingDays - b.unbondingDays)[0]?.id,
    mono: true,
  },
  {
    label: "Platform fee",
    value: (p) => `${p.feePercent}% of rewards`,
    best: (list) => [...list].sort((a, b) => a.feePercent - b.feePercent)[0]?.id,
    mono: true,
  },
  { label: "Minimum stake", value: (p) => `${p.minStake} ${p.ticker}`, mono: true },
  { label: "Staked in pool", value: (p) => formatCompactCurrency(p.tvl), mono: true },
  { label: "Validators", value: (p) => String(p.validators), mono: true },
  { label: "Payouts", value: (p) => p.payout },
  { label: "Network", value: (p) => p.network },
];

export function PoolCompare() {
  const [slots, setSlots] = useState<Slot[]>([
    { key: 1, poolId: "eth", color: COLORS[0] },
    { key: 2, poolId: "sol", color: COLORS[1] },
  ]);

  const selected = slots.map((s) => pools.find((p) => p.id === s.poolId)!);

  const add = () => {
    const free = pools.find((p) => !slots.some((s) => s.poolId === p.id));
    const color = COLORS.find((c) => !slots.some((s) => s.color === c));
    if (!free || !color) return;
    setSlots((current) => [...current, { key: Math.max(...current.map((s) => s.key)) + 1, poolId: free.id, color }]);
  };

  const remove = (key: number) => setSlots((current) => current.filter((s) => s.key !== key));
  const change = (key: number, poolId: string) =>
    setSlots((current) => current.map((s) => (s.key === key ? { ...s, poolId } : s)));

  const series = slots.map((slot) => {
    const pool = pools.find((p) => p.id === slot.poolId)!;
    return { id: pool.id, label: pool.name, color: slot.color, points: apyHistory(pool) };
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-card border border-rule bg-surface p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {slots.map((slot, i) => (
            <div key={slot.key} className="flex items-end gap-2">
              <span
                aria-hidden
                className="mb-[1.3rem] h-0.5 w-4 shrink-0 rounded-pill"
                style={{ backgroundColor: slot.color }}
              />
              <Select
                label={`Pool ${i + 1}`}
                value={slot.poolId}
                onValueChange={(id) => change(slot.key, id)}
                options={pools.map((p) => ({
                  value: p.id,
                  label: p.name,
                  disabled: p.id !== slot.poolId && slots.some((s) => s.poolId === p.id),
                }))}
                className="min-w-0 flex-1"
              />
              {slots.length > 2 && (
                <button
                  type="button"
                  onClick={() => remove(slot.key)}
                  aria-label={`Remove ${pools.find((p) => p.id === slot.poolId)?.name}`}
                  className="grid size-11 shrink-0 place-items-center rounded-field text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-text"
                >
                  <X aria-hidden className="size-4" />
                </button>
              )}
            </div>
          ))}
          {slots.length < MAX && (
            <div className="flex items-end">
              <Button variant="secondary" iconLeft={<Plus aria-hidden />} onClick={add} className="h-11">
                Add pool
              </Button>
            </div>
          )}
        </div>
        <p className="text-caption text-muted">Compare up to three pools. Each pool keeps its colour in the chart.</p>
      </div>

      <Table label="Pool comparison">
        <caption className="sr-only">Terms of the selected pools. “Best” marks the most favourable value.</caption>
        <THead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 h-11 w-48 bg-bg pr-4 shadow-[inset_-1px_0_0_var(--rule)] md:shadow-none text-left font-normal text-muted">
              <span className="sr-only">Term</span>
            </th>
            {selected.map((p, i) => (
              <th key={p.id} scope="col" className="h-11 px-3 text-left font-medium whitespace-nowrap last:pr-0">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="h-0.5 w-4 rounded-pill" style={{ backgroundColor: slots[i].color }} />
                  {p.name}
                </span>
              </th>
            ))}
          </tr>
        </THead>
        <TBody>
          {ROWS.map((row) => {
            const bestId = row.best?.(selected);
            return (
              <TR key={row.label}>
                <th scope="row" className="sticky left-0 z-10 h-14 bg-bg pr-4 shadow-[inset_-1px_0_0_var(--rule)] md:shadow-none text-left font-normal whitespace-nowrap text-muted">
                  {row.label}
                </th>
                {selected.map((p) => (
                  <TD key={p.id} className={row.mono ? "font-mono" : undefined}>
                    {row.value(p)}
                    {bestId === p.id && (
                      <Badge tone="accent" className="ml-2 font-display">
                        Best
                      </Badge>
                    )}
                  </TD>
                ))}
              </TR>
            );
          })}
          <tr>
            <td className="sticky left-0 z-10 bg-bg shadow-[inset_-1px_0_0_var(--rule)] md:shadow-none" />
            {selected.map((p) => (
              <TD key={p.id} className="pt-4">
                <Link
                  href={`/staking/${p.id}`}
                  className="rounded-sm text-small font-medium text-accent-text hover:underline"
                >
                  View {p.name} pool
                </Link>
              </TD>
            ))}
          </tr>
        </TBody>
      </Table>

      <TimeSeriesChart
        title="Estimated APY"
        series={series}
        valueFormat="percent"
        note="Daily estimate after fees. Past yield doesn’t predict future yield."
      />
    </div>
  );
}
