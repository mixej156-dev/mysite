"use client";

import { ArrowDownUp, Clock } from "lucide-react";
import { useState } from "react";
import { Input, Select, TBody, TD, TH, THead, TR, Table, Tabs, TabsList, TabsTrigger, Tag } from "@/design-system";
import {
  ASSETS,
  CONVERSION_FEE,
  SLIPPAGE_OPTIONS,
  getAsset,
  getNetwork,
  networkFee,
  type Asset,
  type FeeSpeed,
  type Network,
} from "@/data/networks";
import { CHANGE_24H, USD_PRICES } from "@/data/prices";
import { cn } from "@/lib/cn";
import { formatCurrency, formatNumber } from "@/lib/format";

const assetOptions = ASSETS.map((a) => ({ value: a.ticker, label: a.ticker }));
const SPEEDS: { id: FeeSpeed; label: string }[] = [
  { id: "slow", label: "Slow" },
  { id: "standard", label: "Standard" },
  { id: "fast", label: "Fast" },
];
const PRESETS_USD = [100, 1_000, 10_000];

function digitsFor(ticker: string, value: number) {
  if (getAsset(ticker).kind !== "crypto") return 2;
  return value >= 1000 ? 2 : value >= 1 ? 4 : 6;
}

function fmt(value: number, ticker: string) {
  return `${formatNumber(value, digitsFor(ticker, value))} ${ticker}`;
}

function minutesLabel(minutes: number) {
  return minutes < 1 ? "under a minute" : `about ${Math.round(minutes)} min`;
}

function networkOptions(asset: Asset) {
  if (asset.kind === "fiat") return [{ value: "bank", label: "Bank transfer" }];
  return asset.networks.map((id) => ({ value: id, label: getNetwork(id).name }));
}

/** Everything the summary needs for one conversion. Pure, so the comparison table can reuse it. */
function quote(args: {
  amount: number;
  from: Asset;
  to: Asset;
  fromNetwork: Network | null;
  toNetwork: Network | null;
  speed: FeeSpeed;
  slippage: number;
}) {
  const { amount, from, to, fromNetwork, toNetwork, speed, slippage } = args;
  const rate = USD_PRICES[from.ticker] / USD_PRICES[to.ticker];
  const sameAsset = from.ticker === to.ticker;
  const gross = amount * rate;
  const conversionFee = sameAsset ? 0 : gross * CONVERSION_FEE;
  const feeNative = toNetwork ? networkFee(toNetwork, to.ticker, speed) : 0;
  const feeInTo = toNetwork ? (feeNative * USD_PRICES[toNetwork.nativeTicker]) / USD_PRICES[to.ticker] : 0;
  const receive = Math.max(0, gross - conversionFee - feeInTo);
  const minReceived = sameAsset ? receive : receive * (1 - slippage);
  const minutes = (fromNetwork?.finalityMinutes ?? 0) + (toNetwork?.inclusionMinutes[speed] ?? 0);
  return { rate, sameAsset, gross, conversionFee, feeNative, feeInTo, receive, minReceived, minutes };
}

export function Converter() {
  const [amountText, setAmountText] = useState("1");
  const [fromTicker, setFromTicker] = useState("ETH");
  const [toTicker, setToTicker] = useState("USDC");
  const [fromNet, setFromNet] = useState("ethereum");
  const [toNet, setToNet] = useState("ethereum");
  const [speed, setSpeed] = useState<FeeSpeed>("standard");
  const [slippage, setSlippage] = useState<number>(0.005);

  const from = getAsset(fromTicker);
  const to = getAsset(toTicker);
  const fromNetwork = from.kind === "fiat" ? null : getNetwork(fromNet);
  const toNetwork = to.kind === "fiat" ? null : getNetwork(toNet);

  const amount = Number(amountText.replace(/,/g, ""));
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const q = quote({ amount: valid ? amount : 0, from, to, fromNetwork, toNetwork, speed, slippage });
  const sameRoute = q.sameAsset && (from.kind === "fiat" || fromNet === toNet);
  const tooSmall = valid && !sameRoute && q.receive === 0;

  const pickFrom = (ticker: string) => {
    setFromTicker(ticker);
    setFromNet(getAsset(ticker).networks[0] ?? "bank");
  };
  const pickTo = (ticker: string) => {
    setToTicker(ticker);
    setToNet(getAsset(ticker).networks[0] ?? "bank");
  };
  const swap = () => {
    setFromTicker(toTicker);
    setToTicker(fromTicker);
    setFromNet(toNet);
    setToNet(fromNet);
    if (valid) setAmountText(String(Number(q.receive.toFixed(digitsFor(toTicker, q.receive)))));
  };

  const error =
    amountText.trim() !== "" && !valid
      ? "Enter a number greater than 0."
      : tooSmall
        ? "This amount doesn’t cover the fees."
        : undefined;

  const rows: { label: string; value: string; hint?: string }[] = [
    { label: "Rate", value: `1 ${from.ticker} = ${fmt(q.rate, to.ticker)}` },
    {
      label: q.sameAsset ? "Conversion fee" : `Conversion fee (${CONVERSION_FEE * 100}%)`,
      value: q.sameAsset ? "None" : fmt(q.conversionFee, to.ticker),
    },
    {
      label: toNetwork ? `Network fee (${toNetwork.name})` : "Bank transfer fee",
      value: toNetwork ? fmt(q.feeNative, toNetwork.nativeTicker) : "None",
      hint: toNetwork ? `≈ ${formatCurrency(q.feeNative * USD_PRICES[toNetwork.nativeTicker])}` : undefined,
    },
    {
      label: q.sameAsset ? "Minimum received" : `Minimum received (${slippage * 100}% slippage)`,
      value: fmt(q.minReceived, to.ticker),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 min-w-0 rounded-card border border-rule bg-surface p-5 md:p-8 lg:col-span-7">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4 text-small font-medium text-muted">You send</legend>
            <Input
              label="Amount"
              inputMode="decimal"
              numeric
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              error={error}
              hint={valid && !error ? `≈ ${formatCurrency(amount * USD_PRICES[from.ticker])}` : undefined}
            />
            <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
              <Select label="Asset" value={from.ticker} onValueChange={pickFrom} options={assetOptions} />
              <Select
                label="From network"
                value={from.kind === "fiat" ? "bank" : fromNet}
                onValueChange={setFromNet}
                options={networkOptions(from)}
                disabled={from.networks.length <= 1}
              />
            </div>
            <div role="group" aria-label="Quick amounts" className="flex flex-wrap gap-2">
              {PRESETS_USD.map((usd) => (
                <Tag
                  key={usd}
                  onClick={() =>
                    setAmountText(String(Number((usd / USD_PRICES[from.ticker]).toFixed(digitsFor(from.ticker, 1)))))
                  }
                >
                  ${formatNumber(usd)}
                </Tag>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-rule" />
            <button
              type="button"
              onClick={swap}
              aria-label={`Swap: convert ${to.ticker} to ${from.ticker}`}
              className="grid size-11 place-items-center rounded-field border border-rule text-muted transition-colors duration-fast hover:border-rule-strong hover:text-text"
            >
              <ArrowDownUp aria-hidden className="size-5" />
            </button>
            <span aria-hidden className="h-px flex-1 bg-rule" />
          </div>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4 text-small font-medium text-muted">You receive</legend>
            <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
              <Select label="Asset" value={to.ticker} onValueChange={pickTo} options={assetOptions} />
              <Select
                label="To network"
                value={to.kind === "fiat" ? "bank" : toNet}
                onValueChange={setToNet}
                options={networkOptions(to)}
                disabled={to.networks.length <= 1}
              />
            </div>
          </fieldset>

          <div className="grid gap-5 border-t border-rule pt-6 sm:grid-cols-2">
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
                  {SLIPPAGE_OPTIONS.map((s) => (
                    <TabsTrigger key={s} value={String(s)} disabled={q.sameAsset}>
                      {s * 100}%
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        <section
          aria-label="Conversion summary"
          className="flex min-w-0 flex-col rounded-card border border-rule bg-surface p-5 md:p-8 lg:col-span-5"
        >
          <p className="text-small text-muted">You receive</p>
          <output aria-live="polite" className="mt-2 block font-mono text-h2 break-all">
            {valid && !sameRoute && !tooSmall ? fmt(q.receive, to.ticker) : "—"}
          </output>
          <p className="mt-1 text-small text-muted">
            {valid && !sameRoute && !tooSmall
              ? `≈ ${formatCurrency(q.receive * USD_PRICES[to.ticker])}`
              : sameRoute
                ? "Choose a different asset or network."
                : "Enter an amount to see a quote."}
          </p>

          <dl className="mt-8 flex flex-col divide-y divide-rule border-y border-rule text-small">
            {rows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-muted">{r.label}</dt>
                <dd className="text-right font-mono">
                  {r.value}
                  {r.hint && <span className="block text-caption text-muted">{r.hint}</span>}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 flex items-start gap-2 text-small">
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
            <span>
              Estimated arrival:{" "}
              <span className="font-medium">{to.kind === "fiat" ? "1–2 business days" : minutesLabel(q.minutes)}</span>
              {fromNetwork && (
                <span className="block text-caption text-muted">
                  Includes {minutesLabel(fromNetwork.finalityMinutes)} for your {fromNetwork.name} deposit to confirm.
                </span>
              )}
            </span>
          </p>
          <p className="mt-auto pt-8 text-caption text-muted">
            Reference rates, not a quote. Network fees go to the network, not to us, and change with network load.
          </p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <NetworkComparison
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
        <RatesTable base={from.ticker} />
      </div>
    </div>
  );
}

/** Fee and timing per delivery network, or per speed when the asset lives on one network. */
function NetworkComparison({
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
              const r = quote({ amount, from, to, fromNetwork, toNetwork: item.network, speed: item.s, slippage });
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
                      ≈ {formatCurrency(r.feeNative * USD_PRICES[item.network.nativeTicker])}
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

/** Reference price of one unit of `base` in every other asset, with the 24-hour move. */
function RatesTable({ base }: { base: string }) {
  const others = ASSETS.filter((a) => a.ticker !== base);
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
          const value = USD_PRICES[base] / USD_PRICES[a.ticker];
          const change = CHANGE_24H[base] - CHANGE_24H[a.ticker];
          return (
            <li key={a.ticker} className="flex items-baseline justify-between gap-4 py-2.5">
              <span>
                <span className="font-medium">{a.ticker}</span>
                <span className="ml-2 text-caption text-muted">{a.name}</span>
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
