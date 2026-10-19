"use client";

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
import type { Row, Series } from "./TimeSeriesChart";

export type TimeSeriesPlotProps = {
  rows: Row[];
  series: Series[];
  single: boolean;
  formatValue: (v: number) => string;
  formatX: { tick: (x: string) => string; full: (x: string) => string };
  xTicks?: string[];
  yTicks: number[];
  yAxisWidth: number;
  endLabel: boolean;
  endLabelRoom: number;
  animate: boolean;
  drawIn: boolean;
  gradientId: string;
};

/**
 * The Recharts plot inside TimeSeriesChart. It lives in its own module so the charting library (about 350 KB)
 * loads after the page, not with it; the frame, title and controls around it render straight away.
 */
export default function TimeSeriesPlot({
  rows,
  series,
  single,
  formatValue,
  formatX,
  xTicks,
  yTicks,
  yAxisWidth,
  endLabel,
  endLabelRoom,
  animate,
  drawIn,
  gradientId,
}: TimeSeriesPlotProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        accessibilityLayer={false}
        data={rows}
        margin={{ top: 8, right: endLabel ? endLabelRoom : 12, bottom: 0, left: 0 }}
      >
        {animate && (
          <defs>
            {series.map((s) => (
              <linearGradient key={s.id} id={`${gradientId}-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={single ? 0.28 : 0.12} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
        )}
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
          width={yAxisWidth}
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
            fill={animate ? `url(#${gradientId}-${s.id})` : s.color}
            fillOpacity={animate ? 1 : single ? 0.1 : 0.04}
            dot={false}
            activeDot={{ r: 4, fill: s.color, stroke: "var(--surface)", strokeWidth: 2 }}
            isAnimationActive={drawIn}
            animationBegin={150}
            animationDuration={900}
            animationEasing="ease-out"
            label={
              endLabel
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
