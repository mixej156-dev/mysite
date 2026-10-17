"use client";

import { useState } from "react";
import { Badge, TBody, TD, TH, THead, TR, Table, type SortDirection } from "@/design-system";
import type { Position } from "@/data/portfolio";
import { getPool } from "@/data/pools";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { priceOf } from "@/lib/portfolio";
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
      {/* Phones: one card per position */}
      <ul aria-label={label} className="flex flex-col gap-3 md:hidden">
        {sorted.map((r) => {
          const pool = getPool(r.poolId);
          if (!pool) return null;
          return (
            <li key={r.id} className="rounded-field border border-rule p-4">
              <div className="flex items-center justify-between gap-3">
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
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
                <div>
                  <dt className="text-caption text-muted">Staked</dt>
                  <dd className="font-mono">{tokenAmount(r.amount, pool.ticker)}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted">Value</dt>
                  <dd className="font-mono">{formatCurrency(value(r))}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted">Rewards earned</dt>
                  <dd className="font-mono text-success">+{tokenAmount(r.earned, pool.ticker)}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted">Est. APY</dt>
                  <dd className="font-mono">{formatPercent(pool.apy)}</dd>
                </div>
              </dl>
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
