"use client";

import { Link } from "@/components/Link";
import { Button, buttonClasses } from "@/design-system";
import { getPool } from "@/data/pools";
import { formatDate, formatUnbonding } from "@/lib/format";
import { usePortfolio } from "@/lib/portfolio";
import { DEMO_TODAY, addDays } from "@/lib/series";
import { AnimatedNumber } from "./AnimatedNumber";
import { poolTone } from "./tones";
import { tokenAmount } from "./txMeta";

const mix = (c: string, pct: number) => `color-mix(in oklab, var(--topic-${c}) ${pct}%, var(--surface-2))`;

/**
 * The pool's coin drops onto its validator orbit, the ring ripples and a check is drawn on it. In the network's
 * colour, in the line language of the pool covers; the motion is CSS (.stake-* in globals.css). Decorative only.
 */
function StakeLanded({ poolId, validators }: { poolId: string; validators: number }) {
  const color = poolTone(poolId);
  const cx = 240;
  const cy = 104;
  const ring = 78;
  const nodes = Math.min(validators, 12);
  return (
    <svg
      viewBox="0 0 480 200"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className="block size-full"
      style={{ background: mix(color, 12) }}
    >
      <circle cx={cx} cy={cy} r={ring} stroke={mix(color, 55)} strokeWidth={1.5} fill="none" strokeDasharray="4 8" />
      {Array.from({ length: nodes }, (_, i) => {
        const a = (i / nodes) * Math.PI * 2 - Math.PI / 2;
        const x = cx + ring * Math.cos(a);
        const y = cy + ring * Math.sin(a);
        return (
          <rect
            key={i}
            className="stake-node"
            style={{ animationDelay: `${620 + i * 40}ms` }}
            x={x - 7}
            y={y - 7}
            width={14}
            height={14}
            rx={4}
            fill="var(--surface-2)"
            stroke={mix(color, 60)}
            strokeWidth={1.5}
          />
        );
      })}
      {/* Ripples from where the coin lands */}
      {[0, 1].map((i) => (
        <circle
          key={i}
          className="stake-ripple"
          style={{ animationDelay: `${520 + i * 180}ms` }}
          cx={cx}
          cy={cy}
          r={46}
          stroke={`var(--topic-${color})`}
          strokeWidth={2}
          fill="none"
        />
      ))}
      <g className="stake-drop">
        <circle cx={cx} cy={cy} r={46} fill={mix(color, 30)} />
        <circle cx={cx} cy={cy} r={36} fill="var(--surface-2)" stroke={`var(--topic-${color})`} strokeWidth={2} />
        <image href={`/logos/networks/${poolId}.svg`} x={cx - 24} y={cy - 24} width={48} height={48} />
      </g>
      <g className="stake-badge">
        <circle cx={cx + 34} cy={cy - 32} r={15} fill="var(--success)" stroke="var(--surface-2)" strokeWidth={3} />
        <path
          className="stake-check"
          d={`M${cx + 27} ${cy - 32}l5 5 9-10`}
          stroke="var(--on-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
        />
      </g>
    </svg>
  );
}

/** Shown after a stake is confirmed: the picture, the figures counting up, and what happens next. */
export function StakeSuccess({ amount, poolId, onMore }: { amount: number; poolId: string; onMore: () => void }) {
  const { state } = usePortfolio();
  const pool = getPool(poolId)!;
  const total = state.positions
    .filter((p) => p.poolId === poolId && p.status === "active")
    .reduce((sum, p) => sum + p.amount, 0);
  const token = (v: number) => tokenAmount(v, pool.ticker);

  const figures = [
    { label: "Staked now", value: amount },
    {
      label: "Est. rewards per year",
      value: amount * (pool.apy / 100),
      prefix: "≈ ",
    },
    { label: `Your total in ${pool.name}`, value: total },
  ];
  const next = [
    { when: "Today", what: "Stake active, validators assigned" },
    { when: formatDate(addDays(DEMO_TODAY, 1)), what: "First reward recorded" },
    { when: "Daily", what: "Rewards paid to your balance" },
    {
      when: "Any time",
      what: pool.unbondingDays
        ? `Unstake; funds return in ${formatUnbonding(pool.unbondingDays).toLowerCase()}`
        : "Unstake with no lock-up",
    },
  ];

  return (
    <div
      role="status"
      data-enter
      className="flex max-w-2xl flex-col overflow-hidden rounded-card border border-rule bg-surface"
    >
      <div className="aspect-[12/5] border-b border-rule">
        <StakeLanded poolId={pool.id} validators={pool.validators} />
      </div>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div data-enter>
          <h2 className="text-h3">
            {token(amount)} staked in {pool.name}
          </h2>
          <p className="mt-2 font-serif text-body text-muted">
            Your first reward is recorded on {formatDate(addDays(DEMO_TODAY, 1))} and paid out daily after that.
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3">
          {figures.map((f) => (
            <div key={f.label} data-enter className="flex flex-col gap-1 rounded-field bg-surface-2 px-4 py-3">
              <dt className="text-caption text-muted">{f.label}</dt>
              <dd className="font-mono text-body tabular-nums">
                <AnimatedNumber value={f.value} format={(v) => `${f.prefix ?? ""}${token(v)}`} />
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="mb-3 text-small font-medium">What happens next</p>
          <ol className="flex flex-col">
            {next.map((step, i) => (
              <li key={step.when} className="relative flex gap-4 pb-4 last:pb-0">
                {/* Dot and the line down to the next step */}
                <span aria-hidden className="relative flex w-3 shrink-0 justify-center pt-1.5">
                  <span
                    className={
                      i === 0 ? "size-2.5 rounded-pill bg-success" : "size-2.5 rounded-pill border-2 border-rule-strong"
                    }
                  />
                  {i < next.length - 1 && <span className="absolute top-5 bottom-[-0.25rem] w-px bg-rule" />}
                </span>
                <span className="flex flex-col text-small sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="shrink-0 font-mono text-muted sm:w-28 sm:whitespace-nowrap">{step.when}</span>
                  <span>{step.what}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div data-enter className="flex flex-wrap gap-3">
          <Link href="/dashboard/positions" className={buttonClasses()}>
            View positions
          </Link>
          <Button variant="secondary" onClick={onMore}>
            Stake more
          </Button>
        </div>
      </div>
    </div>
  );
}
