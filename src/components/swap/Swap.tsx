"use client";

import { ArrowDown, ArrowDownUp, Check, ChevronDown, Clock, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  Button,
  Modal,
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
  buttonClasses,
} from "@/design-system";
import { Link } from "@/components/Link";
import type { Asset, ConversionTerms, Network, Prices } from "@/lib/api/catalog";
import { cn } from "@/lib/cn";
import { formatCurrency, formatNumber } from "@/lib/format";
import { SPEEDS, assetLogo, createMarket, minutesLabel, type FeeSpeed, type Market, type Quote } from "./market";

/*
 * Swap: one asset for another, across networks, stablecoins and fiat. Reference prices only and not tied to the
 * dashboard wallet: confirming plays the submission and shows the result, nothing moves. Below the widget, the
 * same swap compared across delivery networks, and the reference rates of the asset being paid. When the asset
 * received has a staking pool, the widget and the result point on to it.
 */

/** A pool the received asset can be staked in */
export type StakeTarget = { ticker: string; poolId: string; name: string; apy: number };

const PRESETS_USD = [100, 1_000, 10_000];
const SUBMIT_MS = 1200;

type Side = "from" | "to";

export function Swap({
  terms,
  prices,
  stakeable = [],
  intro,
}: {
  terms: ConversionTerms;
  prices: Prices;
  stakeable?: StakeTarget[];
  intro?: ReactNode;
}) {
  const market = useMemo(() => createMarket(terms, prices), [terms, prices]);
  const { usd, getAsset, getNetwork, digitsFor } = market;

  const [amountText, setAmountText] = useState("1");
  const [fromTicker, setFromTicker] = useState("ETH");
  const [toTicker, setToTicker] = useState("USDC");
  const [fromNet, setFromNet] = useState("ethereum");
  const [toNet, setToNet] = useState("ethereum");
  const [speed, setSpeed] = useState<FeeSpeed>("standard");
  const [slippage, setSlippage] = useState<number>(0.005);
  const [picking, setPicking] = useState<Side | null>(null);
  const [reviewing, setReviewing] = useState(false);
  /* Bumped on every flip, so the arrow turns each time */
  const [flips, setFlips] = useState(0);

  const from = getAsset(fromTicker);
  const to = getAsset(toTicker);
  const fromNetwork = from.kind === "fiat" ? null : getNetwork(fromNet);
  const toNetwork = to.kind === "fiat" ? null : getNetwork(toNet);

  const amount = Number(amountText.replace(/,/g, ""));
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const q = market.quote({ amount: valid ? amount : 0, from, to, fromNetwork, toNetwork, speed, slippage });
  const sameRoute = q.sameAsset && (from.kind === "fiat" || fromNet === toNet);
  const tooSmall = valid && !sameRoute && q.receive === 0;
  const ready = valid && !sameRoute && !tooSmall;
  const stakeTarget = stakeable.find((t) => t.ticker === to.ticker);

  const pick = (side: Side, ticker: string) => {
    const net = getAsset(ticker).networks[0] ?? "bank";
    if (side === "from") {
      setFromTicker(ticker);
      setFromNet(net);
    } else {
      setToTicker(ticker);
      setToNet(net);
    }
    setPicking(null);
  };
  const flip = () => {
    setFromTicker(toTicker);
    setToTicker(fromTicker);
    setFromNet(toNet);
    setToNet(fromNet);
    setFlips((n) => n + 1);
    if (ready) setAmountText(String(Number(q.receive.toFixed(digitsFor(toTicker, q.receive)))));
  };

  const error =
    amountText.trim() !== "" && !valid
      ? "Enter a number greater than 0."
      : tooSmall
        ? "This amount doesn’t cover the fees."
        : sameRoute && valid
          ? "Choose a different asset or network to receive."
          : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* The widget comes first on phones and tablets; the explanation follows it */}
        {intro && <div className="min-w-0 max-lg:order-last lg:col-span-5">{intro}</div>}

        <section
          aria-label="Swap"
          className={cn(
            "min-w-0 rounded-card border border-rule bg-surface p-3 shadow-float sm:p-4",
            intro ? "lg:col-span-7" : "lg:col-span-12",
          )}
        >
          {/* You pay */}
          <div
            className={cn(
              "rounded-field bg-surface-2 p-4 transition-shadow duration-fast sm:p-5",
              "focus-within:ring-3 focus-within:ring-accent-text/25",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="swap-amount" className="text-small font-medium text-muted">
                You pay
              </label>
              <NetworkPicker market={market} asset={from} value={fromNet} onChange={setFromNet} label="Pay from" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input
                id="swap-amount"
                inputMode="decimal"
                autoComplete="off"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby="swap-amount-hint"
                className="min-w-0 flex-1 bg-transparent font-mono text-h2 tabular-nums outline-none placeholder:text-muted"
                placeholder="0"
              />
              <AssetButton asset={from} onClick={() => setPicking("from")} label="Asset to pay with" />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p id="swap-amount-hint" className={cn("text-small", error ? "text-danger" : "text-muted")}>
                {error ?? (valid ? `≈ ${formatCurrency(amount * usd[from.ticker])}` : "Enter an amount")}
              </p>
              <div role="group" aria-label="Quick amounts" className="flex flex-wrap gap-1.5">
                {PRESETS_USD.map((value) => (
                  <Tag
                    key={value}
                    onClick={() =>
                      setAmountText(String(Number((value / usd[from.ticker]).toFixed(digitsFor(from.ticker, 1)))))
                    }
                  >
                    ${formatNumber(value)}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Flip: the arrow turns half a circle on every press */}
          <div className="relative z-10 -my-3 flex justify-center">
            <button
              type="button"
              onClick={flip}
              aria-label={`Flip: pay with ${to.ticker}, receive ${from.ticker}`}
              className="grid size-11 place-items-center rounded-field border-4 border-surface bg-surface-2 text-muted transition-colors duration-fast hover:bg-rule hover:text-text"
            >
              <ArrowDownUp
                aria-hidden
                className="size-5 transition-transform duration-slow ease-brand motion-reduce:transition-none"
                style={{ transform: `rotate(${flips * 180}deg)` }}
              />
            </button>
          </div>

          {/* You receive */}
          <div className="rounded-field bg-surface-2 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-small font-medium text-muted">You receive</p>
              <NetworkPicker market={market} asset={to} value={toNet} onChange={setToNet} label="Receive on" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <output
                aria-live="polite"
                aria-label="You receive"
                className={cn("min-w-0 flex-1 truncate font-mono text-h2 tabular-nums", !ready && "text-muted")}
              >
                {ready ? formatNumber(q.receive, digitsFor(to.ticker, q.receive)) : "0"}
              </output>
              <AssetButton asset={to} onClick={() => setPicking("to")} label="Asset to receive" />
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-small">
              <p className="text-muted">
                {ready ? `≈ ${formatCurrency(q.receive * usd[to.ticker])}` : "After every fee"}
              </p>
              {stakeTarget && (
                <Link
                  href={`/staking/${stakeTarget.poolId}`}
                  className="rounded-sm font-medium text-accent-text hover:underline"
                >
                  Stake {stakeTarget.ticker} at est. {stakeTarget.apy}% APY
                </Link>
              )}
            </div>
          </div>

          <QuoteDetails
            market={market}
            q={q}
            from={from}
            to={to}
            fromNetwork={fromNetwork}
            toNetwork={toNetwork}
            slippage={slippage}
          />

          <div className="grid gap-4 px-1 pt-2 pb-4 sm:grid-cols-2 sm:px-2">
            <div className="flex flex-col gap-2">
              <p id="speed-label" className="text-small font-medium">
                Network speed
              </p>
              <Tabs variant="segmented" value={speed} onValueChange={(v) => setSpeed(v as FeeSpeed)}>
                <TabsList aria-labelledby="speed-label">
                  {SPEEDS.map((s) => (
                    <TabsTrigger key={s.id} value={s.id} disabled={!toNetwork}>
                      {s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-col gap-2">
              <p id="slippage-label" className="text-small font-medium">
                Slippage tolerance
              </p>
              <Tabs variant="segmented" value={String(slippage)} onValueChange={(v) => setSlippage(Number(v))}>
                <TabsList aria-labelledby="slippage-label">
                  {terms.slippageOptions.map((s) => (
                    <TabsTrigger key={s} value={String(s)} disabled={q.sameAsset}>
                      {s * 100}%
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Button size="lg" className="w-full" disabled={!ready} onClick={() => setReviewing(true)}>
            {ready ? "Review swap" : valid ? "Swap unavailable" : "Enter an amount"}
          </Button>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <NetworkComparison
          market={market}
          to={to}
          amount={valid ? amount : 0}
          from={from}
          fromNetwork={fromNetwork}
          speed={speed}
          slippage={slippage}
          selected={toNet}
          onSelect={setToNet}
          onSpeed={setSpeed}
        />
        <RatesTable market={market} base={from.ticker} />
      </div>

      <AssetPicker
        market={market}
        side={picking}
        current={picking === "from" ? from.ticker : to.ticker}
        onPick={(ticker) => picking && pick(picking, ticker)}
        onClose={() => setPicking(null)}
      />
      <ReviewModal
        open={reviewing}
        onOpenChange={setReviewing}
        market={market}
        q={q}
        amount={amount}
        from={from}
        to={to}
        fromNetwork={fromNetwork}
        toNetwork={toNetwork}
        slippage={slippage}
        onNewSwap={() => setAmountText("")}
        stakeTarget={stakeTarget}
      />
    </div>
  );
}

function AssetLogo({ ticker, className }: { ticker: string; className?: string }) {
  const logo = assetLogo(ticker);
  if ("src" in logo) {
    // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, decorative
    return <img src={logo.src} alt="" className={cn("shrink-0 rounded-pill", className)} />;
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-pill bg-text font-medium text-bg [font-size:0.75em]",
        className,
      )}
    >
      {logo.symbol}
    </span>
  );
}

function AssetButton({ asset, onClick, label }: { asset: Asset; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${asset.name} (${asset.ticker}). Change`}
      className="flex h-11 shrink-0 items-center gap-2 rounded-pill border border-rule bg-surface pr-3 pl-1.5 text-body font-medium transition-colors duration-fast hover:border-rule-strong"
    >
      <AssetLogo ticker={asset.ticker} className="size-8" />
      {asset.ticker}
      <ChevronDown aria-hidden className="size-4 text-muted" />
    </button>
  );
}

/** Delivery network for assets on several networks; a plain line for the rest */
function NetworkPicker({
  market,
  asset,
  value,
  onChange,
  label,
}: {
  market: Market;
  asset: Asset;
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  if (asset.networks.length <= 1) {
    return (
      <p className="text-small text-muted">
        {asset.kind === "fiat" ? "Bank transfer" : `on ${market.getNetwork(asset.networks[0]).name}`}
      </p>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-small text-muted max-sm:sr-only">{label}</span>
      <Select
        value={value}
        onValueChange={onChange}
        options={market.networkOptions(asset)}
        className="w-40 [&_button]:h-9"
      />
    </div>
  );
}

function QuoteDetails({
  market,
  q,
  from,
  to,
  fromNetwork,
  toNetwork,
  slippage,
}: {
  market: Market;
  q: Quote;
  from: Asset;
  to: Asset;
  fromNetwork: Network | null;
  toNetwork: Network | null;
  slippage: number;
}) {
  const { fmt, usd, terms } = market;
  const rows: { label: string; value: string; hint?: string }[] = [
    { label: "Rate", value: `1 ${from.ticker} = ${fmt(q.rate, to.ticker)}` },
    {
      label: q.sameAsset ? "Swap fee" : `Swap fee (${terms.fee * 100}%)`,
      value: q.sameAsset ? "None" : fmt(q.conversionFee, to.ticker),
    },
    {
      label: toNetwork ? `Network fee (${toNetwork.name})` : "Bank transfer fee",
      value: toNetwork ? fmt(q.feeNative, toNetwork.nativeTicker) : "None",
      hint: toNetwork ? `≈ ${formatCurrency(q.feeNative * usd[toNetwork.nativeTicker])}` : undefined,
    },
    {
      label: q.sameAsset ? "Minimum received" : `Minimum received (${slippage * 100}% slippage)`,
      value: fmt(q.minReceived, to.ticker),
    },
  ];
  return (
    <div className="px-1 pt-5 sm:px-2">
      <dl className="flex flex-col divide-y divide-rule text-small">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-muted">{r.label}</dt>
            <dd className="text-right font-mono">
              {r.value}
              {r.hint && <span className="block text-caption text-muted">{r.hint}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 flex items-start gap-2 border-t border-rule py-3 text-small">
        <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
        <span>
          Arrives in{" "}
          <span className="font-medium">{to.kind === "fiat" ? "1–2 business days" : minutesLabel(q.minutes)}</span>
          {fromNetwork && (
            <span className="block text-caption text-muted">
              Includes {minutesLabel(fromNetwork.finalityMinutes)} for your {fromNetwork.name} payment to confirm.
            </span>
          )}
        </span>
      </p>
    </div>
  );
}

/** Choose an asset: searchable list with logo, name and reference price */
function AssetPicker({
  market,
  side,
  current,
  onPick,
  onClose,
}: {
  market: Market;
  side: Side | null;
  current: string;
  onPick: (ticker: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const assets = market.terms.assets.filter(
    (a) => !q || a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
  );
  const groups: { title: string; kinds: Asset["kind"][] }[] = [
    { title: "Crypto", kinds: ["crypto"] },
    { title: "Stablecoins", kinds: ["stablecoin"] },
    { title: "Cash", kinds: ["fiat"] },
  ];

  return (
    <Modal
      open={side !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setQuery("");
        }
      }}
      title={side === "from" ? "Pay with" : "Receive"}
    >
      <div className="flex flex-col gap-4">
        <label className="flex h-11 items-center gap-2 rounded-field border border-rule bg-surface px-3 focus-within:border-accent">
          <Search aria-hidden className="size-4 text-muted" />
          <span className="sr-only">Search assets</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ticker"
            className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex max-h-[min(60dvh,26rem)] flex-col gap-4 overflow-y-auto">
          {groups.map((group) => {
            const items = assets.filter((a) => group.kinds.includes(a.kind));
            if (!items.length) return null;
            return (
              <div key={group.title}>
                <p className="px-2 text-caption text-muted">{group.title}</p>
                <ul className="mt-1 flex flex-col">
                  {items.map((a) => {
                    const selected = a.ticker === current;
                    return (
                      <li key={a.ticker}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            onPick(a.ticker);
                            setQuery("");
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-field px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-2",
                            selected && "bg-surface-2",
                          )}
                        >
                          <AssetLogo ticker={a.ticker} className="size-9" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{a.ticker}</span>
                            <span className="block truncate text-small text-muted">{a.name}</span>
                          </span>
                          <span className="font-mono text-small text-muted">
                            {formatCurrency(market.usd[a.ticker])}
                          </span>
                          {selected && <Check aria-hidden className="size-4 text-accent-text" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {!assets.length && <p className="px-2 py-6 text-center text-small text-muted">No asset matches “{query}”.</p>}
        </div>
      </div>
    </Modal>
  );
}

/** Review the swap, confirm, watch it go through. Nothing leaves the page. */
function ReviewModal({
  open,
  onOpenChange,
  market,
  q,
  amount,
  from,
  to,
  fromNetwork,
  toNetwork,
  slippage,
  onNewSwap,
  stakeTarget,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  market: Market;
  q: Quote;
  amount: number;
  from: Asset;
  to: Asset;
  fromNetwork: Network | null;
  toNetwork: Network | null;
  slippage: number;
  onNewSwap: () => void;
  stakeTarget?: StakeTarget;
}) {
  const [stage, setStage] = useState<"review" | "sending" | "done">("review");
  const { fmt, usd } = market;
  const where = (n: Network | null) => (n ? n.name : "Bank transfer");
  const arrival = to.kind === "fiat" ? "1–2 business days" : minutesLabel(q.minutes);

  const change = (next: boolean) => {
    onOpenChange(next);
    if (!next) window.setTimeout(() => setStage("review"), 300);
  };
  const confirm = () => {
    setStage("sending");
    window.setTimeout(() => setStage("done"), SUBMIT_MS);
  };

  const done = stage === "done";
  return (
    <Modal
      open={open}
      onOpenChange={change}
      title={done ? "Swap submitted" : "Review swap"}
      description={done ? `Expect it in ${arrival}.` : "Check the amounts before you confirm."}
      footer={
        done ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                onNewSwap();
                change(false);
              }}
            >
              New swap
            </Button>
            {/* The next step after a swap into a staking asset is to stake it */}
            {stakeTarget ? (
              <Link href={`/staking/${stakeTarget.poolId}`} className={buttonClasses()}>
                Stake {stakeTarget.ticker}
              </Link>
            ) : (
              <Button onClick={() => change(false)}>Done</Button>
            )}
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => change(false)} disabled={stage === "sending"}>
              Cancel
            </Button>
            <Button onClick={confirm} loading={stage === "sending"}>
              Confirm swap
            </Button>
          </>
        )
      }
    >
      <div className="flex flex-col gap-5">
        <ol className="flex flex-col rounded-field border border-rule">
          <li className="flex items-center gap-3 p-4">
            <AssetLogo ticker={from.ticker} className="size-9" />
            <span className="min-w-0 flex-1">
              <span className="block text-caption text-muted">You pay, {where(fromNetwork)}</span>
              <span className="block truncate font-mono text-h4">{fmt(amount, from.ticker)}</span>
            </span>
            <span className="text-small text-muted max-sm:hidden">{formatCurrency(amount * usd[from.ticker])}</span>
          </li>
          <li aria-hidden className="relative h-0 border-t border-rule">
            <span className="absolute top-1/2 left-1/2 grid size-8 -translate-1/2 place-items-center rounded-pill border border-rule bg-surface text-muted">
              {done ? <Check className="alert-in size-4 text-success" /> : <ArrowDown className="size-4" />}
            </span>
          </li>
          <li className="flex items-center gap-3 p-4">
            <AssetLogo ticker={to.ticker} className="size-9" />
            <span className="min-w-0 flex-1">
              <span className="block text-caption text-muted">You receive, {where(toNetwork)}</span>
              <span className="block truncate font-mono text-h4">{fmt(q.receive, to.ticker)}</span>
            </span>
            <span className="text-small text-muted max-sm:hidden">{formatCurrency(q.receive * usd[to.ticker])}</span>
          </li>
        </ol>
        {done ? (
          <p className="alert-in flex items-start gap-2 rounded-field tint-success p-3 text-small text-success">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
            You’ll receive at least {fmt(q.minReceived, to.ticker)}, or the swap is returned in full.
          </p>
        ) : (
          <dl className="flex flex-col divide-y divide-rule text-small">
            {[
              ["Rate", `1 ${from.ticker} = ${fmt(q.rate, to.ticker)}`],
              ["Fees", `${fmt(q.conversionFee + q.feeInTo, to.ticker)}`],
              [
                q.sameAsset ? "Minimum received" : `Minimum, ${slippage * 100}% slippage`,
                fmt(q.minReceived, to.ticker),
              ],
              ["Arrives in", arrival],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-mono">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Modal>
  );
}

/** Fee and timing per delivery network, or per speed when the asset lives on one network */
function NetworkComparison({
  market,
  to,
  from,
  amount,
  fromNetwork,
  speed,
  slippage,
  selected,
  onSelect,
  onSpeed,
}: {
  market: Market;
  to: Asset;
  from: Asset;
  amount: number;
  fromNetwork: Network | null;
  speed: FeeSpeed;
  slippage: number;
  selected: string;
  onSelect: (id: string) => void;
  onSpeed: (s: FeeSpeed) => void;
}) {
  const { getNetwork, fmt, usd } = market;
  if (to.kind === "fiat") {
    return (
      <section
        aria-labelledby="compare-title"
        className="min-w-0 rounded-card border border-rule bg-surface p-5 md:p-8 lg:col-span-7"
      >
        <h2 id="compare-title" className="text-h4 font-medium">
          Delivery
        </h2>
        <p className="mt-3 max-w-[56ch] text-body text-muted">
          {to.name} payouts go to a verified bank account in your name. Transfers arrive in one to two business days,
          with no network fee.
        </p>
      </section>
    );
  }

  const byNetwork = to.networks.length > 1;
  const items = byNetwork
    ? to.networks.map((id) => ({ key: id, label: getNetwork(id).name, network: getNetwork(id), s: speed }))
    : SPEEDS.map((s) => ({ key: s.id, label: s.label, network: getNetwork(to.networks[0]), s: s.id }));

  return (
    <section
      aria-labelledby="compare-title"
      className="min-w-0 rounded-card border border-rule bg-surface p-5 md:p-8 lg:col-span-7"
    >
      <h2 id="compare-title" className="text-h4 font-medium">
        {byNetwork ? `${to.ticker} by network` : `${getNetwork(to.networks[0]).name} fees by speed`}
      </h2>
      <p className="mt-1 text-small text-muted">
        {byNetwork ? "Same asset, different networks. Choose one to use it." : "Choose a speed to use it."}
      </p>
      <div className="mt-6">
        <Table label={byNetwork ? "Fees by network" : "Fees by speed"}>
          <THead>
            <tr>
              <TH>{byNetwork ? "Network" : "Speed"}</TH>
              <TH numeric className="max-sm:hidden">
                Network fee
              </TH>
              <TH numeric className="max-sm:hidden">
                Arrival
              </TH>
              <TH numeric>You receive</TH>
            </tr>
          </THead>
          <TBody>
            {items.map((item) => {
              const r = market.quote({
                amount,
                from,
                to,
                fromNetwork,
                toNetwork: item.network,
                speed: item.s,
                slippage,
              });
              const active = byNetwork ? item.key === selected : item.key === speed;
              return (
                <TR key={item.key} className={cn(active && "bg-surface-2")}>
                  <TD>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => (byNetwork ? onSelect(item.key) : onSpeed(item.s))}
                      className={cn(
                        "rounded-sm text-left font-medium transition-colors duration-fast hover:text-accent-text",
                        active && "text-accent-text",
                      )}
                    >
                      {item.label}
                    </button>
                    <span className="block font-mono text-caption text-muted sm:hidden">
                      Fee {fmt(r.feeNative, item.network.nativeTicker)}
                    </span>
                  </TD>
                  <TD numeric className="max-sm:hidden">
                    {fmt(r.feeNative, item.network.nativeTicker)}
                    <span className="block text-caption text-muted">
                      ≈ {formatCurrency(r.feeNative * usd[item.network.nativeTicker])}
                    </span>
                  </TD>
                  <TD numeric className="max-sm:hidden">
                    {minutesLabel(r.minutes)}
                  </TD>
                  <TD numeric>{amount > 0 ? fmt(r.receive, to.ticker) : "—"}</TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>
    </section>
  );
}

/** Reference price of one unit of `base` in every other asset, with the 24-hour move */
function RatesTable({ market, base }: { market: Market; base: string }) {
  const { usd, terms, prices, digitsFor } = market;
  const others = terms.assets.filter((a) => a.ticker !== base);
  return (
    <section
      aria-labelledby="rates-title"
      className="min-w-0 rounded-card border border-rule bg-surface p-5 md:p-8 lg:col-span-5"
    >
      <h2 id="rates-title" className="text-h4 font-medium">
        1 {base} in other assets
      </h2>
      <ul className="mt-6 flex flex-col divide-y divide-rule border-y border-rule text-small">
        {others.map((a) => {
          const value = usd[base] / usd[a.ticker];
          const change = prices.change24h[base] - prices.change24h[a.ticker];
          return (
            <li key={a.ticker} className="flex items-center justify-between gap-4 py-2.5">
              <span className="flex items-center gap-2.5">
                <AssetLogo ticker={a.ticker} className="size-6" />
                <span className="font-medium">{a.ticker}</span>
                <span className="text-caption text-muted max-sm:hidden">{a.name}</span>
              </span>
              <span className="text-right font-mono">
                {formatNumber(value, digitsFor(a.ticker, value))}
                <span
                  className={cn(
                    "ml-3 inline-block w-16 text-caption",
                    change > 0 ? "text-success" : change < 0 ? "text-danger" : "text-muted",
                  )}
                >
                  {change > 0 ? "+" : ""}
                  {(change * 100).toFixed(2)}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-caption text-muted">24-hour change of the pair.</p>
    </section>
  );
}
