"use client";

import { ArrowDownUp } from "lucide-react";
import { useState } from "react";
import { Input, Select } from "@/design-system";
import { CONVERTIBLE, USD_PRICES } from "@/data/prices";
import { formatNumber } from "@/lib/format";

const options = CONVERTIBLE.map((t) => ({ value: t, label: t }));

function digitsFor(ticker: string, value: number) {
  if (ticker === "USD") return 2;
  return value >= 1000 ? 2 : value >= 1 ? 4 : 6;
}

export function Converter() {
  const [from, setFrom] = useState("ETH");
  const [to, setTo] = useState("USD");
  const [amountText, setAmountText] = useState("1");

  const amount = Number(amountText.replace(/,/g, ""));
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount >= 0;
  const rate = USD_PRICES[from] / USD_PRICES[to];
  const result = valid ? amount * rate : 0;

  const swap = () => {
    setFrom(to);
    setTo(from);
    if (valid) setAmountText(String(Number(result.toFixed(digitsFor(to, result)))));
  };

  return (
    <div className="rounded-card border border-rule bg-surface p-5 md:p-8">
      <div className="grid items-end gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-3">
          <Input
            label="Amount"
            inputMode="decimal"
            numeric
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            error={amountText.trim() !== "" && !valid ? "Enter a number, 0 or more." : undefined}
          />
          <Select label="From" value={from} onValueChange={setFrom} options={options} />
        </div>
        <button
          type="button"
          onClick={swap}
          aria-label={`Swap: convert ${to} to ${from}`}
          className="mx-auto grid size-11 place-items-center rounded-pill border border-rule text-muted transition-colors duration-fast hover:border-rule-strong hover:text-text md:mb-0"
        >
          <ArrowDownUp aria-hidden className="size-5 md:rotate-90" />
        </button>
        <div className="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-small font-medium">Result</p>
            <output
              aria-live="polite"
              className="flex h-11 items-center rounded-field border border-rule bg-surface-2 px-3.5 font-mono text-body"
            >
              {valid ? formatNumber(result, digitsFor(to, result)) : "—"}
            </output>
          </div>
          <Select label="To" value={to} onValueChange={setTo} options={options} />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule pt-4 text-small text-muted">
        <p className="font-mono">
          1 {from} = {formatNumber(rate, digitsFor(to, rate))} {to}
        </p>
        <p className="text-caption">Demo rates, not a quote.</p>
      </div>
    </div>
  );
}
