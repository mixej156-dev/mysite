"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/design-system";
import { DEMO_TODAY, type Point } from "@/lib/series";
import { cn } from "@/lib/cn";
import { formatCompactCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";

export type Series = {
  id: string;
  label: string;
  /** CSS colour from the series tokens, e.g. "var(--series-1)" */
  color: string;
  points: Point[];
};

export type TimeSeriesChartProps = {
  title: string;
  /** Same length and dates for every series */
  series: Series[];
  /** Serializable so server components can render the chart */
  valueFormat: ValueFormat;
  xFormat?: XFormat;
  /** Selectable windows in days; the last N points are shown */
  periods?: number[];
  defaultPeriod?: number;
  /** Small print under the chart, e.g. "Demo data" */
  note?: string;
  className?: string;
};

type Row = { date: string } & Record<string, number | string>;

export type ValueFormat = "percent" | "number" | "amount" | "usd";

const FORMATTERS: Record<ValueFormat, (v: number) => string> = {
  percent: (v) => formatPercent(v),
  number: (v) => formatNumber(v, 2),
  /* Token amounts: more decimals for small values */
  amount: (v) => formatNumber(v, Math.abs(v) >= 1000 ? 2 : 4),
  usd: (v) => formatCompactCurrency(v),
};

/** "date": points carry ISO dates. "month": points carry a month index ("0", "1", …). */
export type XFormat = "date" | "month";

const X_FORMATTERS: Record<XFormat, { tick: (x: string) => string; full: (x: string) => string }> = {
  date: { tick: (x) => shortDate(x), full: (x) => formatDate(x) },
  month: { tick: (x) => (x === "0" ? "Now" : `${x} mo`), full: (x) => (x === "0" ? "Today" : `Month ${x}`) },
};

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const NARROW = "(max-width: 47.99rem)";

function subscribeNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True below 768px. False during server render, so hydration matches. */
function useNarrowScreen() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
}

/** Clean axis ticks (steps of 1, 2, 2.5 or 5 × 10^n) covering the data with a little headroom. */
function niceTicks(min: number, max: number, target = 4): number[] {
  const span = max - min || Math.abs(max) || 1;
  const raw = span / target;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? 10 * magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return ticks;
}

/** True once the element has a non-zero width, so charts never measure a hidden container. */
function useHasSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [hasSize, setHasSize] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setHasSize(entry.contentRect.width > 0));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, hasSize };
}

function periodLabel(days: number) {
  return days >= 365 ? `${Math.round(days / 365)}Y` : `${days}D`;
}

/**
 * Line + light area wash per series. One y-axis, hairline solid grid, crosshair tooltip that lists every series,
 * legend for two or more series, and a table view with the same numbers.
 */
export function TimeSeriesChart({
  title,
  series,
  valueFormat,
  xFormat = "date",
  periods = [30, 90, 365],
  defaultPeriod = 90,
  note,
  className,
}: TimeSeriesChartProps) {
  const narrow = useNarrowScreen();
  const [chosenPeriod, setPeriod] = useState<number | null>(null);
  /* Long windows turn into noise at phone width, so phones start with the shortest one */
  /* No period tabs: show every point */
  const period = periods.length === 0 ? Infinity : (chosenPeriod ?? (narrow ? periods[0] : defaultPeriod));
  const [view, setView] = useState<"chart" | "table">("chart");
  const titleId = useId();
  const { ref: plotRef, hasSize } = useHasSize<HTMLDivElement>();
  const formatValue = FORMATTERS[valueFormat];
  const formatX = X_FORMATTERS[xFormat];

  const rows = useMemo<Row[]>(() => {
    const length = series[0]?.points.length ?? 0;
    const start = Math.max(0, length - period);
    return Array.from({ length: length - start }, (_, i) => {
      const row: Row = { date: series[0].points[start + i].date };
      for (const s of series) row[s.id] = s.points[start + i].value;
      return row;
    });
  }, [series, period]);

  /* Table: about a dozen evenly spaced rows, newest first */
  const tableRows = useMemo(() => {
    const step = Math.max(1, Math.ceil(rows.length / 12));
    return rows.filter((_, i) => (rows.length - 1 - i) % step === 0).reverse();
  }, [rows]);

  /* Month axis: ticks on round steps (3, 6 or 12 months) instead of wherever they fall */
  const xTicks = useMemo(() => {
    if (xFormat !== "month") return undefined;
    const last = rows.length - 1;
    const step = last <= 12 ? 3 : last <= 36 ? 6 : 12;
    const ticks = rows.map((r) => r.date).filter((x) => Number(x) % step === 0);
    return last % step === 0 ? ticks : [...ticks, String(last)];
  }, [rows, xFormat]);

  const yTicks = useMemo(() => {
    const values = rows.flatMap((r) => series.map((s) => Number(r[s.id])));
    return niceTicks(Math.min(...values), Math.max(...values));
  }, [rows, series]);

  const single = series.length === 1;
  const last = rows[rows.length - 1];
  /* Room for the end-of-line label: ~7.5px per monospace character at 12px, plus the dot and gap */
  const endLabelRoom = last && single ? formatValue(Number(last[series[0].id])).length * 7.5 + 18 : 20;

  return (
    <figure
      aria-labelledby={titleId}
      className={cn("rounded-card border border-rule bg-surface p-5 md:p-6", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <figcaption id={titleId} className="text-body font-medium">
            {title}
          </figcaption>
          {single && last && (
            <p className="mt-1 text-small text-muted">
              {formatValue(Number(last[series[0].id]))}{" "}
              {xFormat === "date" && last.date !== DEMO_TODAY ? `on ${formatX.full(String(last.date))}` : "today"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {periods.length > 1 && (
            <Tabs variant="segmented" value={String(period)} onValueChange={(v) => setPeriod(Number(v))}>
              <TabsList aria-label="Period">
                {periods.map((p) => (
                  <TabsTrigger key={p} value={String(p)}>
                    {periodLabel(p)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          <Tabs variant="segmented" value={view} onValueChange={(v) => setView(v as "chart" | "table")}>
            <TabsList aria-label="Display">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {!single && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-small text-muted" aria-label="Legend">
          {series.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 rounded-pill" style={{ backgroundColor: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}

      {view === "chart" ? (
        <div ref={plotRef} className="mt-6 h-64 md:h-72 short:mt-4 short:h-48" aria-hidden>
          {hasSize && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                accessibilityLayer={false}
                data={rows}
                margin={{ top: 8, right: single ? endLabelRoom : 20, bottom: 0, left: 0 }}
              >
                <CartesianGrid vertical={false} stroke="var(--rule)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatX.tick}
                  ticks={xTicks}
                  interval={xTicks ? 0 : "preserveEnd"}
                  tickLine={false}
                  axisLine={{ stroke: "var(--rule)" }}
                  tick={{ fill: "var(--muted)", fontSize: 12 }}
                  minTickGap={40}
                  tickMargin={8}
                />
                <YAxis
                  tickFormatter={(v: number) => formatValue(v)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 12, fontFamily: "var(--ds-font-mono)" }}
                  width={56}
                  domain={[yTicks[0], yTicks[yTicks.length - 1]]}
                  ticks={yTicks}
                />
                <Tooltip
                  content={<ChartTooltip series={series} formatValue={formatValue} formatX={formatX.full} />}
                  cursor={{ stroke: "var(--rule-strong)", strokeWidth: 1 }}
                  isAnimationActive={false}
                />
                {series.map((s) => (
                  <Area
                    key={s.id}
                    type="monotone"
                    dataKey={s.id}
                    name={s.label}
                    stroke={s.color}
                    strokeWidth={2}
                    fill={s.color}
                    fillOpacity={single ? 0.1 : 0.04}
                    dot={false}
                    activeDot={{ r: 4, fill: s.color, stroke: "var(--surface)", strokeWidth: 2 }}
                    isAnimationActive={false}
                    label={
                      single
                        ? ({ x, y, index }: { x?: number | string; y?: number | string; index?: number }) =>
                            index === rows.length - 1 ? (
                              <g key="end">
                                <circle
                                  cx={Number(x)}
                                  cy={Number(y)}
                                  r={4}
                                  fill={s.color}
                                  stroke="var(--surface)"
                                  strokeWidth={2}
                                />
                                <text
                                  x={Number(x) + 10}
                                  y={Number(y)}
                                  dy={4}
                                  fill="var(--text)"
                                  fontSize={12}
                                  fontFamily="var(--ds-font-mono)"
                                >
                                  {formatValue(Number(rows[rows.length - 1][s.id]))}
                                </text>
                              </g>
                            ) : null
                        : undefined
                    }
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        <div className="mt-6 max-h-72 overflow-y-auto">
          <table className="w-full text-small">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-surface text-muted">
              <tr className="border-b border-rule">
                <th scope="col" className="py-2 text-left font-normal">
                  {xFormat === "date" ? "Date" : "Month"}
                </th>
                {series.map((s) => (
                  <th key={s.id} scope="col" className="py-2 text-right font-normal">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.date} className="border-b border-rule last:border-0">
                  <th scope="row" className="py-2 text-left font-normal text-muted">
                    {formatX.full(row.date)}
                  </th>
                  {series.map((s) => (
                    <td key={s.id} className="py-2 text-right font-mono">
                      {formatValue(Number(row[s.id]))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Text alternative for the chart view */}
      {view === "chart" && last && (
        <p className="sr-only">
          {title}.{" "}
          {series
            .map((s) => `${s.label}: ${formatValue(Number(last[s.id]))} at ${formatX.full(String(last.date))}.`)
            .join(" ")}{" "}
          Switch to the table view for the values.
        </p>
      )}
      {note && <p className="mt-4 text-caption text-muted">{note}</p>}
    </figure>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  series,
  formatValue,
  formatX,
}: Partial<TooltipContentProps<number, string>> & {
  series: Series[];
  formatValue: (v: number) => string;
  formatX: (x: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-field border border-rule bg-surface px-3 py-2.5 text-small shadow-overlay">
      <p className="text-caption text-muted">{formatX(String(label))}</p>
      <ul className="mt-1.5 flex flex-col gap-1">
        {series.map((s) => {
          const item = payload.find((p) => p.dataKey === s.id);
          if (!item || typeof item.value !== "number") return null;
          return (
            <li key={s.id} className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-3 rounded-pill" style={{ backgroundColor: s.color }} />
              <span className="font-mono font-medium text-text">{formatValue(item.value)}</span>
              {series.length > 1 && <span className="text-muted">{s.label}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
