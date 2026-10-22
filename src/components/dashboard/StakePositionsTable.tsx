"use client";

import { useState } from "react";
import { Badge, TBody, TD, TH, THead, TR, Table, type SortDirection } from "@/design-system";
import type { Position } from "@/data/portfolio";
import { getPool } from "@/data/pools";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { priceOf } from "@/lib/portfolio";
import { AssetIcon } from "./AssetIcon";
import { tokenAmount } from "./txMeta";

export type PositionRow = Position & { earned: number };

type SortKey = "value" | "apy" | "earned" | "startedAt";

export function StatusBadge({ position }: { position: Position }) {
  return position.status === "active" ? (
    <Badge tone="success" dot>
      Earning
    </Badge>
  ) : (
    <Badge tone="warning" dot>
      Unbonding
    </Badge>
  );
}

/**
 * Positions with value and lifetime rewards. `onSelect` turns the pool name into a button that opens details;
 * `sortable` adds column sorting.
 */
export function StakePositionsTable({
  rows,
  onSelect,
  sortable = false,
  compact = false,
  label = "Staking positions",
}: {
  rows: PositionRow[];
  onSelect?: (id: string) => void;
  sortable?: boolean;
  /** Drop APY and start date, for narrow panels */
  compact?: boolean;
  label?: string;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: Exclude<SortDirection, null> }>({ key: "value", dir: "desc" });

  const value = (r: PositionRow) => r.amount * priceOf(getPool(r.poolId)?.ticker ?? "");
  const metric: Record<SortKey, (r: PositionRow) => number | string> = {
    value,
    apy: (r) => getPool(r.poolId)?.apy ?? 0,
    earned: (r) => r.earned * priceOf(getPool(r.poolId)?.ticker ?? ""),
    startedAt: (r) => r.startedAt,
  };
  const sorted = sortable
    ? [...rows].sort((a, b) => {
        const x = metric[sort.key](a);
        const y = metric[sort.key](b);
        const cmp = typeof x === "string" ? x.localeCompare(String(y)) : x - Number(y);
        return sort.dir === "asc" ? cmp : -cmp;
      })
    : rows;

  const th = (key: SortKey, text: string, numeric = true) =>
    sortable ? (
      <TH
        numeric={numeric}
        sort={sort.key === key ? sort.dir : null}
        onSort={() => setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }))}
      >
        {text}
      </TH>
    ) : (
      <TH numeric={numeric}>{text}</TH>
    );

  return (
    <>
      {/* Phones: one dense row per position, figures on the right */}
      <ul aria-label={label} className="flex flex-col md:hidden">
        {sorted.map((r) => {
          const pool = getPool(r.poolId);
          if (!pool) return null;
          return (
            <li
              key={r.id}
              className="flex items-start justify-between gap-3 border-b border-rule py-3 first:pt-0 last:border-0 last:pb-0"
            >
              <div className="flex min-w-0 gap-3">
                <AssetIcon poolId={pool.id} className="mt-0.5 size-6" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {onSelect ? (
                      <button
                        type="button"
                        onClick={() => onSelect(r.id)}
                        className="rounded-sm text-left font-medium hover:text-accent-text hover:underline"
                      >
                        {pool.name}
                      </button>
                    ) : (
                      <span className="font-medium">{pool.name}</span>
                    )}
                    <StatusBadge position={r} />
                  </div>
                  <p className="mt-1 text-caption text-muted tabular-nums">
                    <span className="sr-only">Staked </span>
                    {tokenAmount(r.amount, pool.ticker)} at {formatPercent(pool.apy)} est. APY
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-small">
                  <span className="sr-only">Value </span>
                  {formatCurrency(value(r))}
                </p>
                <p className="mt-1 font-mono text-caption text-success">
                  <span className="sr-only">Rewards earned </span>+{tokenAmount(r.earned, pool.ticker)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="max-md:hidden">
        <Table label={label}>
          <THead>
            <tr>
              <TH>Pool</TH>
              <TH numeric>Staked</TH>
              {th("value", "Value")}
              {!compact && th("apy", "Est. APY")}
              {th("earned", "Rewards earned")}
              <TH>Status</TH>
              {!compact && th("startedAt", "Since", false)}
            </tr>
          </THead>
          <TBody>
            {sorted.map((r) => {
              const pool = getPool(r.poolId);
              if (!pool) return null;
              return (
                <TR key={r.id}>
                  <TD className="font-medium">
                    <span className="flex items-center gap-2.5">
                      <AssetIcon poolId={pool.id} />
                      {onSelect ? (
                        <button
                          type="button"
                          onClick={() => onSelect(r.id)}
                          className="rounded-sm text-left hover:text-accent-text hover:underline"
                        >
                          {pool.name}
                        </button>
                      ) : (
                        pool.name
                      )}
                    </span>
                  </TD>
                  <TD numeric>{tokenAmount(r.amount, pool.ticker)}</TD>
                  <TD numeric>{formatCurrency(value(r))}</TD>
                  {!compact && <TD numeric>{formatPercent(pool.apy)}</TD>}
                  <TD numeric className="text-success">
                    +{tokenAmount(r.earned, pool.ticker)}
                  </TD>
                  <TD>
                    <StatusBadge position={r} />
                  </TD>
                  {!compact && <TD className="text-muted">{formatDate(r.startedAt)}</TD>}
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>
    </>
  );
}
