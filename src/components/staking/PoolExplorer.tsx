"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@/components/Link";
import {
  Badge,
  Button,
  Input,
  Select,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tabs,
  TabsList,
  TabsTrigger,
  Tag,
  type SortDirection,
} from "@/design-system";
import type { Pool } from "@/data/pools";
import { formatCompactCurrency, formatPercent, formatUnbonding } from "@/lib/format";
import { EmptyState } from "../blocks/EmptyState";
import { PoolCard } from "../blocks/PoolCard";

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "none", label: "No lock-up", test: (p: Pool) => p.unbondingDays === 0 },
  { id: "short", label: "Up to 7 days", test: (p: Pool) => p.unbondingDays > 0 && p.unbondingDays <= 7 },
  { id: "long", label: "Longer unbonding", test: (p: Pool) => p.unbondingDays > 7 },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const SORTS = {
  "apy-desc": { label: "Highest APY", key: "apy", dir: "desc" },
  "apy-asc": { label: "Lowest APY", key: "apy", dir: "asc" },
  "unbonding-asc": { label: "Shortest withdrawal", key: "unbondingDays", dir: "asc" },
  "min-asc": { label: "Lowest minimum", key: "minStake", dir: "asc" },
  "tvl-desc": { label: "Most staked", key: "tvl", dir: "desc" },
  "name-asc": { label: "Name", key: "name", dir: "asc" },
} as const;

type SortId = keyof typeof SORTS;
type SortKey = (typeof SORTS)[SortId]["key"];

function compare(a: Pool, b: Pool, key: SortKey) {
  return key === "name" ? a.name.localeCompare(b.name) : a[key] - b[key];
}

export function PoolExplorer({ pools }: { pools: Pool[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [sort, setSort] = useState<SortId>("apy-desc");
  const [view, setView] = useState<"cards" | "table">("cards");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const { key, dir } = SORTS[sort];
    const test = FILTERS.find((f) => f.id === filter)?.test ?? (() => true);
    return pools
      .filter((p) => test(p))
      .filter((p) => !q || [p.name, p.ticker, p.network].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => (dir === "asc" ? compare(a, b, key) : compare(b, a, key)));
  }, [pools, query, filter, sort]);

  const reset = () => {
    setQuery("");
    setFilter("all");
  };

  /* Table headers sort the same state as the Select */
  const headerSort = (key: SortKey): SortDirection => (SORTS[sort].key === key ? SORTS[sort].dir : null);
  const toggleHeader = (key: SortKey) => {
    const match = (Object.keys(SORTS) as SortId[]).filter((id) => SORTS[id].key === key);
    const next = match.find((id) => id !== sort) ?? match[0];
    setSort(next);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            label="Search pools"
            placeholder="Asset or network"
            prefix={<Search aria-hidden />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="md:w-64 [&_label]:sr-only"
          />
          <div role="group" aria-label="Withdrawal period" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Tag
                key={f.id}
                selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                count={pools.filter((p) => f.test(p)).length}
              >
                {f.label}
              </Tag>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <Select
            label="Sort by"
            value={sort}
            onValueChange={(v) => setSort(v as SortId)}
            options={(Object.keys(SORTS) as SortId[]).map((id) => ({ value: id, label: SORTS[id].label }))}
            className="w-52 [&_label]:sr-only"
          />
          <Tabs variant="segmented" value={view} onValueChange={(v) => setView(v as "cards" | "table")}>
            <TabsList aria-label="View">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <p className="text-small text-muted" aria-live="polite">
        {visible.length === 1 ? "1 pool" : `${visible.length} pools`}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          art="search"
          title="No pools match"
          body="Try another asset name, or clear the search and filters."
          action={
            <Button variant="secondary" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : view === "cards" ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((pool) => (
            <li key={pool.id}>
              <PoolCard pool={pool} />
            </li>
          ))}
        </ul>
      ) : (
        <Table label="Staking pools">
          <THead>
            <tr>
              <TH sort={headerSort("name")} onSort={() => toggleHeader("name")}>
                Pool
              </TH>
              <TH numeric sort={headerSort("apy")} onSort={() => toggleHeader("apy")}>
                Est. APY
              </TH>
              <TH numeric sort={headerSort("unbondingDays")} onSort={() => toggleHeader("unbondingDays")}>
                Withdrawal
              </TH>
              <TH numeric sort={headerSort("minStake")} onSort={() => toggleHeader("minStake")}>
                Minimum
              </TH>
              <TH numeric sort={headerSort("tvl")} onSort={() => toggleHeader("tvl")}>
                Staked
              </TH>
              <TH>
                <span className="sr-only">Actions</span>
              </TH>
            </tr>
          </THead>
          <TBody>
            {visible.map((pool) => (
              <TR key={pool.id}>
                <TD>
                  <span className="font-medium">{pool.name}</span>
                  <span className="ml-2 text-muted">{pool.ticker}</span>
                  {pool.unbondingDays === 0 && (
                    <Badge tone="success" className="ml-3">
                      No lock-up
                    </Badge>
                  )}
                </TD>
                <TD numeric>{formatPercent(pool.apy)}</TD>
                <TD numeric>{formatUnbonding(pool.unbondingDays)}</TD>
                <TD numeric>
                  {pool.minStake} {pool.ticker}
                </TD>
                <TD numeric>{formatCompactCurrency(pool.tvl)}</TD>
                <TD className="text-right">
                  <Link
                    href={`/staking/${pool.id}`}
                    aria-label={`${pool.name} pool details`}
                    className="rounded-sm text-small font-medium text-accent-text hover:underline"
                  >
                    Details
                  </Link>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
