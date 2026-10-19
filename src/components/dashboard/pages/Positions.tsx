"use client";

import { useMemo, useState } from "react";
import { Link } from "@/components/Link";
import { Button, Modal, Progress, Tag, Toggle, buttonClasses, useToast } from "@/design-system";
import { getPool } from "@/data/pools";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { priceOf, usePortfolio } from "@/lib/portfolio";
import { earnedByPosition } from "@/lib/portfolioStats";
import { DEMO_TODAY, addDays, daysBetween } from "@/lib/series";
import { EmptyState } from "../../blocks/EmptyState";
import { PageTitle } from "../PageTitle";
import { StakePositionsTable, StatusBadge } from "../StakePositionsTable";
import { tokenAmount } from "../txMeta";

type Filter = "all" | "active" | "unbonding";

export function Positions() {
  const { state, rewards, unstake, setAutoRestake } = usePortfolio();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [working, setWorking] = useState(false);

  const earned = useMemo(() => earnedByPosition(rewards), [rewards]);
  const rows = state.positions.map((p) => ({ ...p, earned: earned.get(p.id) ?? 0 }));
  const visible = rows.filter((r) => filter === "all" || r.status === filter);
  const selected = rows.find((r) => r.id === selectedId);
  const pool = selected && getPool(selected.poolId);

  const close = () => {
    if (working) return;
    setSelectedId(null);
    setConfirming(false);
  };

  const doUnstake = async () => {
    if (!selected) return;
    setWorking(true);
    const result = await unstake(selected.id);
    setWorking(false);
    setConfirming(false);
    toast(
      result.ok
        ? { tone: "success", title: "Unstake requested", description: result.message }
        : { tone: "error", title: "Couldn’t unstake", description: result.error },
    );
    if (result.ok && pool?.unbondingDays === 0) setSelectedId(null);
  };

  const counts: Record<Filter, number> = {
    all: rows.length,
    active: rows.filter((r) => r.status === "active").length,
    unbonding: rows.filter((r) => r.status === "unbonding").length,
  };

  return (
    <>
      <PageTitle
        title="Positions"
        lead="Each stake you’ve made, what it has earned, and its withdrawal status."
        actions={
          <Link href="/dashboard/stake" className={buttonClasses()}>
            New stake
          </Link>
        }
      />

      <div role="group" aria-label="Status" data-enter className="mb-6 flex flex-wrap gap-2">
        {(["all", "active", "unbonding"] as const).map((f) => (
          <Tag key={f} selected={filter === f} onClick={() => setFilter(f)} count={counts[f]}>
            {f === "all" ? "All" : f === "active" ? "Earning" : "Unbonding"}
          </Tag>
        ))}
      </div>

      <div data-enter className="md:rounded-card md:border md:border-rule md:bg-surface md:p-6">
        {visible.length === 0 ? (
          <EmptyState
            art={rows.length === 0 ? "positions" : "search"}
            title={rows.length === 0 ? "No positions yet" : "Nothing here"}
            body={
              rows.length === 0
                ? "Stake from your wallet balance and rewards start the next day."
                : "No positions match this filter."
            }
            action={
              rows.length === 0 ? (
                <Link href="/dashboard/stake" className={buttonClasses()}>
                  Start staking
                </Link>
              ) : (
                <Button variant="secondary" onClick={() => setFilter("all")}>
                  Show all
                </Button>
              )
            }
          />
        ) : (
          <StakePositionsTable rows={visible} sortable onSelect={setSelectedId} />
        )}
      </div>
      <p className="mt-3 text-caption text-muted">Select a pool name to see details, change auto-restake or unstake.</p>

      <Modal
        open={Boolean(selected)}
        onOpenChange={(o) => !o && close()}
        title={pool ? `${pool.name} position` : "Position"}
        description={
          confirming ? "Check the unbonding period before you confirm." : "Position details and unstake options."
        }
        footer={
          selected && pool ? (
            confirming ? (
              <>
                <Button variant="ghost" onClick={() => setConfirming(false)} disabled={working}>
                  Keep staking
                </Button>
                <Button onClick={doUnstake} loading={working}>
                  {working ? "Unstaking" : "Confirm unstake"}
                </Button>
              </>
            ) : selected.status === "active" ? (
              <>
                <Button variant="ghost" onClick={close}>
                  Close
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(true)}>
                  Unstake
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={close}>
                Close
              </Button>
            )
          ) : null
        }
      >
        {selected && pool && !confirming && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-h3">{tokenAmount(selected.amount, pool.ticker)}</p>
              <StatusBadge position={selected} />
            </div>
            <dl className="flex flex-col divide-y divide-rule rounded-field border border-rule text-small">
              {[
                ["Value", formatCurrency(selected.amount * priceOf(pool.ticker))],
                ["Estimated APY", formatPercent(pool.apy)],
                ["Rewards earned", `+${tokenAmount(selected.earned, pool.ticker)}`],
                ["Staked since", formatDate(selected.startedAt)],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted">{term}</dt>
                  <dd className="font-mono">{value}</dd>
                </div>
              ))}
            </dl>
            {selected.status === "unbonding" && selected.unbondingSince && selected.unlockAt ? (
              <Progress
                label={`Unlocks ${formatDate(selected.unlockAt)}`}
                value={
                  (daysBetween(selected.unbondingSince, DEMO_TODAY) /
                    Math.max(1, daysBetween(selected.unbondingSince, selected.unlockAt))) *
                  100
                }
                valueLabel={`${daysBetween(DEMO_TODAY, selected.unlockAt)} days left`}
                tone="warning"
              />
            ) : (
              <Toggle
                label="Auto-restake rewards"
                description="Add each daily payout to this position instead of the wallet."
                checked={selected.autoRestake}
                onCheckedChange={(on) => {
                  setAutoRestake(selected.id, on);
                  toast({ tone: "info", title: on ? "Auto-restake on" : "Auto-restake off" });
                }}
              />
            )}
          </div>
        )}
        {selected && pool && confirming && (
          <div className="flex flex-col gap-3 font-serif text-body text-muted">
            <p>
              Unstake {tokenAmount(selected.amount, pool.ticker)} from {pool.name}?
            </p>
            <p>
              {pool.unbondingDays === 0
                ? "There is no lock-up on this network: funds return to your wallet straight away."
                : `Rewards stop today. Funds unlock on ${formatDate(addDays(DEMO_TODAY, pool.unbondingDays))}, after the ${pool.unbondingDays}-day unbonding period, and can’t be moved until then.`}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
