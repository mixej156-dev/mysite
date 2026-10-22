"use client";

import { Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { Badge, Button, Checkbox, Input, Modal, Slider, buttonClasses, useToast } from "@/design-system";
import { getPool, pools } from "@/data/pools";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDate, formatPercent, formatUnbonding } from "@/lib/format";
import { useFocusFirstError } from "@/lib/forms";
import { priceOf, usePortfolio } from "@/lib/portfolio";
import { DEMO_TODAY, addDays } from "@/lib/series";
import { AssetIcon } from "../AssetIcon";
import { PageTitle } from "../PageTitle";
import { StakeSuccess } from "../StakeSuccess";
import { tokenAmount } from "../txMeta";

/** Numbered card heading; the number sits in a brand-tinted circle */
function StepHeading({ n, children }: { n: number; children: string }) {
  return (
    <p aria-hidden className="mb-4 flex items-center gap-2.5 text-body font-medium">
      <span className="grid size-7 place-items-center rounded-pill tint-accent font-mono text-small text-accent-text">
        {n}
      </span>
      {children}
    </p>
  );
}

export function StakeFlow() {
  const params = useSearchParams();
  const { state, stake } = usePortfolio();
  const { toast } = useToast();

  const [poolId, setPoolId] = useState(() => getPool(params.get("pool") ?? "")?.id ?? "eth");
  /* ?amount= comes from the rewards calculator */
  const [amountText, setAmountText] = useState(() => {
    const preset = Number(params.get("amount"));
    return Number.isFinite(preset) && preset > 0 ? String(preset) : "";
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; consent?: string }>({});
  const [attempt, setAttempt] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ amount: number; poolId: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

  const pool = getPool(poolId) ?? pools[0];
  const balance = state.wallet[pool.ticker] ?? 0;
  const amount = Number(amountText.replace(/,/g, ""));
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const yearly = valid ? amount * (pool.apy / 100) : 0;
  const price = priceOf(pool.ticker);

  const choosePool = (id: string) => {
    setPoolId(id);
    setAmountText("");
    setErrors({});
  };

  const review = (e: FormEvent) => {
    e.preventDefault();
    const found = {
      amount: !valid
        ? "Enter an amount."
        : amount < pool.minStake
          ? `The minimum for this pool is ${pool.minStake} ${pool.ticker}.`
          : amount > balance
            ? `You have ${tokenAmount(balance, pool.ticker)} available.`
            : undefined,
      consent: consent ? undefined : "Confirm you’ve read the risks to continue.",
    };
    setErrors(found);
    if (found.amount || found.consent) {
      setAttempt((a) => a + 1);
      return;
    }
    setReviewing(true);
  };

  const confirm = async () => {
    setSubmitting(true);
    const result = await stake(pool.id, amount);
    setSubmitting(false);
    setReviewing(false);
    if (!result.ok) {
      toast({ tone: "error", title: "Stake not created", description: result.error });
      return;
    }
    toast({ tone: "success", title: "Stake confirmed", description: result.message });
    setDone({ amount, poolId: pool.id });
    setAmountText("");
    setConsent(false);
  };

  if (done) {
    return (
      <>
        <PageTitle title="Stake" />
        <StakeSuccess amount={done.amount} poolId={done.poolId} onMore={() => setDone(null)} />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Stake" lead="Choose a pool and an amount. Every term is shown before you confirm." />
      <form
        ref={formRef}
        onSubmit={review}
        noValidate
        aria-label="New stake"
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <div className="flex min-w-0 flex-col gap-6">
          <fieldset data-enter className="rounded-card border border-rule bg-surface p-5 md:p-6">
            <legend className="sr-only">Pool</legend>
            <StepHeading n={1}>Pool</StepHeading>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {pools.map((p) => {
                const selected = p.id === poolId;
                return (
                  <label
                    key={p.id}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-3 rounded-field border p-4 transition-colors duration-fast",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-text",
                      selected ? "border-accent bg-accent/5" : "border-rule hover:border-rule-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name="pool"
                      value={p.id}
                      checked={selected}
                      onChange={() => choosePool(p.id)}
                      className="sr-only"
                    />
                    <span className="flex items-start justify-between gap-2">
                      <span className="flex min-w-0 items-start gap-2.5 max-sm:flex-col max-sm:gap-2">
                        <AssetIcon poolId={p.id} className="mt-0.5 size-6" />
                        <span className="min-w-0">
                          <span className="block text-small font-medium">{p.name}</span>
                          <span className="block text-caption text-muted">
                            {tokenAmount(state.wallet[p.ticker] ?? 0, p.ticker)} available
                          </span>
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-pill border",
                          selected ? "border-accent" : "border-rule-strong",
                        )}
                      >
                        {selected && <span className="size-2 rounded-pill bg-accent" />}
                      </span>
                    </span>
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-h4">{formatPercent(p.apy)}</span>
                      <span className="text-caption text-muted">{formatUnbonding(p.unbondingDays)}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div data-enter className="rounded-card border border-rule bg-surface p-5 md:p-6">
            <StepHeading n={2}>Amount</StepHeading>
            {balance === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-field bg-surface-2 p-4 text-small">
                <p className="flex items-start gap-2">
                  <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
                  You don’t have any {pool.ticker} in your wallet yet. Deposit some first, then come back to stake it.
                </p>
                <Link href={`/dashboard/wallet?deposit=${pool.ticker}`} className={buttonClasses({ size: "sm" })}>
                  Deposit {pool.ticker}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Input
                  label="Amount to stake"
                  inputMode="decimal"
                  numeric
                  value={amountText}
                  onChange={(e) => {
                    setAmountText(e.target.value);
                    if (errors.amount) setErrors((x) => ({ ...x, amount: undefined }));
                  }}
                  error={errors.amount}
                  hint={`Minimum ${pool.minStake} ${pool.ticker}. Available ${tokenAmount(balance, pool.ticker)}.`}
                  suffix={
                    <span className="flex items-center gap-2">
                      {pool.ticker}
                      <button
                        type="button"
                        onClick={() => setAmountText(String(balance))}
                        className="rounded-sm px-1.5 py-0.5 text-caption font-medium text-accent-text hover:bg-surface-2"
                      >
                        Max
                      </button>
                    </span>
                  }
                />
                <Slider
                  label="Adjust amount"
                  hideLabel
                  value={Math.min(valid ? amount : 0, balance)}
                  onValueChange={(v) => setAmountText(String(Number(v.toFixed(pool.ticker === "ETH" ? 4 : 2))))}
                  min={0}
                  max={balance}
                  step={balance / 200}
                  valueText={`${tokenAmount(valid ? amount : 0, pool.ticker)}`}
                />
              </div>
            )}
          </div>
        </div>

        <aside
          aria-label="Stake summary"
          data-enter
          className="flex flex-col gap-5 self-start rounded-card border border-rule bg-surface p-5 md:p-6 xl:sticky xl:top-24"
        >
          <p className="text-body font-medium">Summary</p>
          <dl className="flex flex-col gap-3 text-small">
            {[
              ["Pool", pool.name],
              ["Amount", valid ? tokenAmount(amount, pool.ticker) : "—"],
              ["Value", valid ? `≈ ${formatCurrency(amount * price)}` : "—"],
              ["Estimated APY", formatPercent(pool.apy)],
              ["Est. rewards per year", valid ? `≈ ${tokenAmount(yearly, pool.ticker)}` : "—"],
              ["Platform fee", `${pool.feePercent}% of rewards`],
              ["First reward", formatDate(addDays(DEMO_TODAY, 1))],
              ["To withdraw", formatUnbonding(pool.unbondingDays)],
            ].map(([term, value]) => (
              <div key={term} className="flex justify-between gap-4">
                <dt className="text-muted">{term}</dt>
                <dd className="text-right font-mono">{value}</dd>
              </div>
            ))}
          </dl>
          <Checkbox
            label={
              <>
                I’ve read the{" "}
                <Link href="/legal/risk-disclosure" className="text-accent-text underline underline-offset-2">
                  risk disclosure
                </Link>{" "}
                and understand the APY isn’t guaranteed
              </>
            }
            checked={consent}
            onCheckedChange={(v) => {
              setConsent(v === true);
              if (v === true) setErrors((x) => ({ ...x, consent: undefined }));
            }}
            error={errors.consent}
          />
          <Button type="submit" size="lg" disabled={balance === 0}>
            Review stake
          </Button>
        </aside>
      </form>

      <Modal
        open={reviewing}
        onOpenChange={(o) => !submitting && setReviewing(o)}
        title="Confirm stake"
        description={`You can unstake at any time. Funds return after about ${formatUnbonding(pool.unbondingDays).toLowerCase()}.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReviewing(false)} disabled={submitting}>
              Back
            </Button>
            <Button onClick={confirm} loading={submitting}>
              {submitting ? "Confirming" : `Stake ${pool.ticker}`}
            </Button>
          </>
        }
      >
        <dl className="flex flex-col divide-y divide-rule rounded-field border border-rule text-small">
          {[
            ["Pool", pool.name],
            ["Amount", tokenAmount(amount || 0, pool.ticker)],
            ["Estimated APY", formatPercent(pool.apy)],
            ["Platform fee", `${pool.feePercent}% of rewards`],
          ].map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-muted">{term}</dt>
              <dd className="font-mono">{value}</dd>
            </div>
          ))}
        </dl>
        {pool.unbondingDays === 0 && (
          <Badge tone="success" className="mt-4">
            No lock-up
          </Badge>
        )}
      </Modal>
    </>
  );
}
