"use client";

import { Copy, Download, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Input,
  Pagination,
  Select,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tag,
  useToast,
} from "@/design-system";
import type { TxType } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { downloadCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import { PORTFOLIO_TICKERS, shortHash, usePortfolio } from "@/lib/portfolio";
import { DEMO_TODAY } from "@/lib/series";
import { EmptyState } from "../../blocks/EmptyState";
import { PageTitle } from "../PageTitle";
import { TX_LABELS, amountTone, signedAmount } from "../txMeta";

const PAGE_SIZE = 10;
const TYPES: (TxType | "all")[] = ["all", "deposit", "withdraw", "stake", "unstake", "reward"];
const TYPE_TAGS: Record<TxType | "all", string> = {
  all: "All",
  deposit: "Deposits",
  withdraw: "Withdrawals",
  stake: "Stakes",
  unstake: "Unstakes",
  reward: "Rewards",
};

export function Transactions() {
  const { transactions } = usePortfolio();
  const { toast } = useToast();
  const [type, setType] = useState<TxType | "all">("all");
  const [asset, setAsset] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (type === "all" || t.type === type) &&
          (asset === "all" || t.ticker === asset) &&
          (status === "all" || t.status === status) &&
          (!q || t.hash.toLowerCase().includes(q) || (t.address ?? "").toLowerCase().includes(q)),
      ),
    [transactions, type, asset, status, q],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  /* Every filter change starts again from the first page */
  const reset =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setPage(1);
    };

  const clear = () => {
    setType("all");
    setAsset("all");
    setStatus("all");
    setQuery("");
    setPage(1);
  };

  const copy = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      toast({ tone: "success", title: "Hash copied", description: shortHash(hash) });
    } catch {
      toast({ tone: "error", title: "Couldn’t copy", description: "Select the hash and copy it manually." });
    }
  };

  const exportCsv = () =>
    downloadCsv(
      `transactions-${DEMO_TODAY}.csv`,
      ["date", "type", "asset", "amount", "status", "hash", "address"],
      filtered.map((t) => [t.date, t.type, t.ticker, t.amount.toFixed(8), t.status, t.hash, t.address ?? ""]),
    );

  return (
    <>
      <PageTitle
        title="Transactions"
        lead="Deposits, withdrawals, stakes, unstakes and daily reward payouts (last 90 days)."
        actions={
          <Button
            variant="secondary"
            iconLeft={<Download aria-hidden />}
            onClick={exportCsv}
            disabled={filtered.length === 0}
          >
            Export CSV
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-4">
        <div role="group" aria-label="Type" className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Tag
              key={t}
              selected={type === t}
              onClick={() => reset(setType)(t)}
              count={t === "all" ? transactions.length : transactions.filter((x) => x.type === t).length}
            >
              {TYPE_TAGS[t]}
            </Tag>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_10rem]">
          <Input
            label="Search by hash or address"
            placeholder="Search by hash or address"
            prefix={<Search aria-hidden />}
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            className="[&_label]:sr-only"
          />
          <Select
            label="Asset"
            value={asset}
            onValueChange={reset(setAsset)}
            options={[{ value: "all", label: "All assets" }, ...PORTFOLIO_TICKERS.map((t) => ({ value: t, label: t }))]}
            className="[&_label]:sr-only"
          />
          <Select
            label="Status"
            value={status}
            onValueChange={reset(setStatus)}
            options={[
              { value: "all", label: "Any status" },
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
            ]}
            className="[&_label]:sr-only"
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} transactions
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No transactions match"
          body="Try another type or asset, or clear the search."
          action={
            <Button variant="secondary" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="rounded-card border border-rule bg-surface p-5 md:p-6">
          <Table label="Transactions">
            <THead>
              <tr>
                <TH>Date</TH>
                <TH>Type</TH>
                <TH numeric>Amount</TH>
                <TH className="max-sm:hidden">Status</TH>
                <TH className="max-md:hidden">Hash</TH>
              </tr>
            </THead>
            <TBody>
              {visible.map((t) => (
                <TR key={t.id}>
                  <TD className="text-muted">
                    <time dateTime={t.date}>{formatDate(t.date.slice(0, 10))}</time>
                  </TD>
                  <TD>{TX_LABELS[t.type]}</TD>
                  <TD numeric className={cn(amountTone(t))}>
                    {signedAmount(t)}
                    {t.status === "pending" && (
                      <Badge tone="warning" className="mt-1 font-display sm:hidden">
                        Pending
                      </Badge>
                    )}
                  </TD>
                  <TD className="max-sm:hidden">
                    {t.status === "pending" ? (
                      <Badge tone="warning" dot>
                        Pending
                      </Badge>
                    ) : (
                      <Badge tone="neutral">Completed</Badge>
                    )}
                  </TD>
                  <TD className="max-md:hidden">
                    <span className="inline-flex items-center gap-1.5 font-mono text-caption text-muted">
                      {shortHash(t.hash)}
                      <button
                        type="button"
                        onClick={() => copy(t.hash)}
                        aria-label={`Copy hash ${shortHash(t.hash)}`}
                        className="grid size-7 place-items-center rounded-pill transition-colors duration-fast hover:bg-surface-2 hover:text-text"
                      >
                        <Copy aria-hidden className="size-3.5" />
                      </button>
                    </span>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-caption text-muted">
              {filtered.length.toLocaleString("en-US")} transactions. Demo hashes, not on any chain.
            </p>
            <Pagination page={current} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </div>
      )}
    </>
  );
}
