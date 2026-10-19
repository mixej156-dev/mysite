"use client";

import { CalendarDays, Coins, Download, History, Layers, PieChart, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@/components/Link";
import { Button, Pagination, Select, TBody, TD, TH, THead, TR, Table, buttonClasses } from "@/design-system";
import { getPool } from "@/data/pools";
import { cn } from "@/lib/cn";
import { downloadCsv } from "@/lib/csv";
import { formatCurrency, formatDate, formatDateShort } from "@/lib/format";
import { priceOf, usePortfolio } from "@/lib/portfolio";
import { rewardsUsd } from "@/lib/portfolioStats";
import { DEMO_TODAY, addDays } from "@/lib/series";
import { EmptyState } from "../../blocks/EmptyState";
import { TimeSeriesChart } from "../../charts/TimeSeriesChart";
import { AnimatedNumber } from "../AnimatedNumber";
import { AssetIcon } from "../AssetIcon";
import { PageTitle } from "../PageTitle";
import { Panel } from "../Panel";
import { StatStrip } from "../StatStrip";
import { TONE_FILL, poolTone, type Tone } from "../tones";
import { tokenAmount } from "../txMeta";

const PAGE_SIZE = 10;
const DAYS = 365;

export function Rewards() {
  const { state, rewards } = usePortfolio();
  const [poolFilter, setPoolFilter] = useState("all");
  const [page, setPage] = useState(1);

  /* Daily totals in USD for the last year, up to yesterday: today's payout hasn't happened yet */
  const daily = useMemo(() => {
    const totals = new Map<string, number>();
    for (const r of rewards) totals.set(r.date, (totals.get(r.date) ?? 0) + r.amount * priceOf(r.ticker));
    const start = addDays(DEMO_TODAY, -DAYS);
    return Array.from({ length: DAYS }, (_, i) => {
      const date = addDays(start, i);
      return { date, value: Math.round((totals.get(date) ?? 0) * 100) / 100 };
    });
  }, [rewards]);

  const byPool = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rewards) map.set(r.poolId, (map.get(r.poolId) ?? 0) + r.amount);
    return [...map]
      .map(([poolId, amount]) => {
        const pool = getPool(poolId)!;
        return { pool, amount, usd: amount * priceOf(pool.ticker) };
      })
      .sort((a, b) => b.usd - a.usd);
  }, [rewards]);
  const totalUsd = byPool.reduce((s, x) => s + x.usd, 0);

  const history = useMemo(
    () =>
      [...rewards]
        .filter((r) => poolFilter === "all" || r.poolId === poolFilter)
        .sort((a, b) => b.date.localeCompare(a.date) || a.poolId.localeCompare(b.poolId)),
    [rewards, poolFilter],
  );
  const pageCount = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const visible = history.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () =>
    downloadCsv(
      `rewards-${DEMO_TODAY}.csv`,
      ["date", "pool", "asset", "amount", "usd_value"],
      history.map((r) => [
        r.date,
        getPool(r.poolId)?.name ?? r.poolId,
        r.ticker,
        r.amount.toFixed(8),
        (r.amount * priceOf(r.ticker)).toFixed(2),
      ]),
    );

  if (rewards.length === 0) {
    return (
      <>
        <PageTitle title="Rewards" />
        <EmptyState
          art="rewards"
          title="No rewards yet"
          body="Rewards are recorded the day after you stake and paid out daily."
          action={
            <Link href="/dashboard/stake" className={buttonClasses()}>
              Start staking
            </Link>
          }
        />
      </>
    );
  }

  const stats: { label: string; value: number; format: (v: number) => string; icon: LucideIcon; tone: Tone }[] = [
    { label: "Last 30 days", value: rewardsUsd(rewards, 30), format: formatCurrency, icon: Coins, tone: "amber" },
    { label: "Last 12 months", value: totalUsd, format: formatCurrency, icon: CalendarDays, tone: "green" },
    {
      label: "Earning positions",
      value: state.positions.filter((p) => p.status === "active").length,
      format: (v) => String(Math.round(v)),
      icon: Layers,
      tone: "blue",
    },
  ];

  return (
    <>
      <PageTitle
        title="Rewards"
        lead="Recorded every epoch and paid out daily, after the platform fee. USD values use reference prices."
        actions={
          <Button variant="secondary" iconLeft={<Download aria-hidden />} onClick={exportCsv}>
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        <StatStrip stats={stats} />

        <div className="grid gap-6 xl:grid-cols-3">
          <TimeSeriesChart
            title="Daily rewards, USD"
            series={[{ id: "rewards", label: "Rewards", color: "var(--series-3)", points: daily }]}
            valueFormat="usd"
            defaultPeriod={90}
            note="Sum of all positions per day at reference prices."
            animate
            className="xl:col-span-2"
          />
          <Panel title="By pool, last 12 months" icon={PieChart} tone="teal">
            <ul className="flex flex-col gap-4">
              {byPool.map(({ pool, amount, usd }) => (
                <li key={pool.id}>
                  <div className="flex items-center justify-between gap-4 text-small">
                    <span className="flex min-w-0 items-center gap-2 font-medium">
                      <AssetIcon poolId={pool.id} />
                      <span className="truncate">{pool.name}</span>
                    </span>
                    <span className="font-mono">
                      <AnimatedNumber value={usd} format={formatCurrency} />
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-surface-2">
                    <div
                      className={cn("h-full origin-left animate-grow-x rounded-pill", TONE_FILL[poolTone(pool.id)])}
                      style={{ width: `${(usd / totalUsd) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-caption text-muted">+{tokenAmount(amount, pool.ticker)}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="History"
          icon={History}
          tone="violet"
          action={
            <Select
              label="Pool"
              value={poolFilter}
              onValueChange={(v) => {
                setPoolFilter(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All pools" },
                ...byPool.map(({ pool }) => ({ value: pool.id, label: pool.name })),
              ]}
              className="w-44 [&_label]:sr-only"
            />
          }
        >
          <Table label="Reward history">
            <THead>
              <tr>
                <TH>Date</TH>
                <TH>Pool</TH>
                <TH numeric>Amount</TH>
                <TH numeric className="max-sm:hidden">
                  Value
                </TH>
              </tr>
            </THead>
            <TBody>
              {visible.map((r) => (
                <TR key={`${r.positionId}-${r.date}`}>
                  <TD className="text-muted">
                    <span className="sm:hidden">{formatDateShort(r.date)}</span>
                    <span className="max-sm:hidden">{formatDate(r.date)}</span>
                  </TD>
                  <TD>
                    <span className="flex items-center gap-2">
                      <AssetIcon poolId={r.poolId} className="size-4" />
                      {getPool(r.poolId)?.name}
                    </span>
                  </TD>
                  <TD numeric className="text-success">
                    +{tokenAmount(r.amount, r.ticker)}
                  </TD>
                  <TD numeric className="max-sm:hidden">
                    {formatCurrency(r.amount * priceOf(r.ticker))}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-caption text-muted">{history.length.toLocaleString("en-US")} payouts</p>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </Panel>
      </div>
    </>
  );
}
