"use client";

import { useState } from "react";
import { TBody, TD, TH, THead, TR, Table, Tabs, TabsList, TabsTrigger } from "@/design-system";
import { networkFees, type FeeAction, type FeeSpeed } from "@/data/gas";
import { USD_PRICES } from "@/data/prices";
import { formatNumber } from "@/lib/format";

const ACTIONS: { id: FeeAction; label: string }[] = [
  { id: "stake", label: "Stake" },
  { id: "unstake", label: "Unstake" },
  { id: "claim", label: "Claim rewards" },
];

function feeDigits(value: number) {
  return value < 0.0001 ? 6 : value < 0.01 ? 5 : 3;
}

function usd(value: number) {
  return value < 0.01 ? "< $0.01" : `≈ $${value.toFixed(2)}`;
}

export function GasEstimate() {
  const [speed, setSpeed] = useState<FeeSpeed>("standard");

  return (
    <div className="flex flex-col gap-6">
      <Tabs variant="segmented" value={speed} onValueChange={(v) => setSpeed(v as FeeSpeed)}>
        <TabsList aria-label="Confirmation speed">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="fast">Fast</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Phones: one card per network */}
      <ul className="grid gap-3 md:hidden">
        {networkFees.map((n) => (
          <li key={n.poolId} className="rounded-card border border-rule bg-surface p-4">
            <p className="font-medium">{n.network}</p>
            <dl className="mt-3 flex flex-col divide-y divide-rule text-small">
              {ACTIONS.map((a) => {
                const fee = n.fees[speed][a.id];
                return (
                  <div key={a.id} className="flex items-baseline justify-between gap-4 py-2">
                    <dt className="text-muted">{a.label}</dt>
                    <dd className="text-right font-mono">
                      {formatNumber(fee, feeDigits(fee))} {n.ticker}
                      <span className="ml-2 text-caption text-muted">{usd(fee * USD_PRICES[n.ticker])}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>
      <div className="max-md:hidden">
        <Table label="Network fees by action">
          <THead>
            <tr>
              <TH>Network</TH>
              {ACTIONS.map((a) => (
                <TH key={a.id} numeric>
                  {a.label}
                </TH>
              ))}
            </tr>
          </THead>
          <TBody>
            {networkFees.map((n) => (
              <TR key={n.poolId}>
                <TD className="font-medium">{n.network}</TD>
                {ACTIONS.map((a) => {
                  const fee = n.fees[speed][a.id];
                  return (
                    <TD key={a.id} numeric>
                      <span className="block">
                        {formatNumber(fee, feeDigits(fee))} {n.ticker}
                      </span>
                      <span className="block text-caption text-muted">{usd(fee * USD_PRICES[n.ticker])}</span>
                    </TD>
                  );
                })}
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
      <p className="text-caption text-muted">
        Network fees go to the network, not to us. Demo figures; real fees change with network load.
      </p>
    </div>
  );
}
