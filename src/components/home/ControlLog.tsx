"use client";

import { Activity, Coins, KeyRound, LogOut, Server, type LucideIcon } from "lucide-react";
import { getPool } from "@/data/pools";
import { SECURITY_CONTROLS } from "@/data/security";
import { formatDateShort, formatNumber } from "@/lib/format";
import { DEMO_TODAY, addDays } from "@/lib/series";
import { cn } from "@/lib/cn";
import { ControlsList } from "../blocks/ControlsList";
import { usePlayWhileVisible } from "../blocks/usePlayWhileVisible";
import { IconChip, type Tone } from "../dashboard/tones";

/*
 * "Accounted for at every step": the five controls, and beside them a log where each one leaves an entry in turn,
 * the way the operations side records them. The control of the newest entry is marked in the list. Plays while on
 * screen, nothing to click; with reduced motion it shows a still log. Entries are illustrative.
 */

const DOT = getPool("dot")!;
const ETH = getPool("eth")!;

type Entry = { icon: LucideIcon; tone: Tone; title: string; detail: string };
/** Two entries per control, in the order of SECURITY_CONTROLS */
const ENTRIES: Entry[][] = [
  [
    { icon: KeyRound, tone: "violet", title: "Signing request approved", detail: "2 of 3 key holders confirmed" },
    { icon: KeyRound, tone: "violet", title: "Key backup checked", detail: "Encrypted copies match, 3 locations" },
  ],
  [
    { icon: Server, tone: "teal", title: "Failover drill passed", detail: "Frankfurt to Virginia in 41 s" },
    { icon: Server, tone: "teal", title: "Client update rolled out", detail: "Test network first, then 1 in 8" },
  ],
  [
    { icon: Activity, tone: "rose", title: "Missed duty flagged", detail: "Solana, 1 slot. On-call notified" },
    { icon: Activity, tone: "rose", title: "Alert resolved", detail: "Peer count back to normal in 3 min" },
  ],
  [
    {
      icon: Coins,
      tone: "amber",
      title: `Epoch ${formatNumber(318_442)} recorded`,
      detail: `${ETH.validators} validators, ledger updated`,
    },
    { icon: Coins, tone: "amber", title: "Daily payout sent", detail: "Rewards credited to 4,210 wallets" },
  ],
  [
    {
      icon: LogOut,
      tone: "orange",
      title: "Unstake queued",
      detail: `300 ${DOT.ticker}, release ${formatDateShort(addDays(DEMO_TODAY, DOT.unbondingDays))}`,
    },
    { icon: LogOut, tone: "orange", title: "Withdrawal released", detail: `1.2 ${ETH.ticker} back in the wallet` },
  ],
];

const SHOWN = 4;
const STEP_MS = 2400;
/* A clock for the log, counted from a fixed start so the server and the browser agree */
const START = 9 * 3600 + 41 * 60 + 12;
const clock = (k: number) => {
  const s = START + k * 23;
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((v) => String(v).padStart(2, "0")).join(":");
};

export function ControlLog() {
  const { ref, tick } = usePlayWhileVisible<HTMLDivElement>(STEP_MS);
  /* Entry k belongs to control k % 5; playing starts from the first control, so its progress bar fills from the top */
  const newest = tick === null ? SHOWN : SHOWN + 1 + tick;
  const active = tick === null ? undefined : newest % SECURITY_CONTROLS.length;
  const rows = Array.from({ length: SHOWN }, (_, i) => newest - i);

  return (
    <div data-reveal className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-7">
        <ControlsList items={SECURITY_CONTROLS} active={active} stepMs={STEP_MS} />
      </div>
      <div className="min-w-0 max-lg:order-first lg:col-span-5">
        <div
          ref={ref}
          aria-hidden
          inert
          className="rounded-card border border-rule bg-surface p-4 sm:p-5 lg:sticky lg:top-24"
        >
          <p className="flex items-center justify-between text-small">
            <span className="font-medium">Control log</span>
            <span className="flex items-center gap-1.5 text-caption text-muted">
              <span className="relative flex size-2">
                {tick !== null && <span className="absolute inset-0 animate-ping rounded-pill bg-success opacity-60" />}
                <span className="relative size-2 rounded-pill bg-success" />
              </span>
              Live
            </span>
          </p>
          <ul className="mt-4 flex flex-col gap-2 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
            {rows.map((k, i) => {
              const control = k % SECURITY_CONTROLS.length;
              const entry = ENTRIES[control][Math.floor(k / SECURITY_CONTROLS.length) % 2];
              return (
                <li
                  key={k}
                  className={cn(
                    "flex items-center gap-3 rounded-field border border-rule px-3 py-2.5",
                    i === 0 && tick !== null && "alert-in",
                  )}
                >
                  <IconChip icon={entry.icon} tone={entry.tone} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-small font-medium">{entry.title}</span>
                    <span className="block truncate text-caption text-muted">
                      {SECURITY_CONTROLS[control].title}: {entry.detail}
                    </span>
                  </span>
                  <span className="self-start font-mono text-caption text-muted">{clock(k)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
