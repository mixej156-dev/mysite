import type { Pool } from "@/data/pools";
import { poolTone } from "../dashboard/tones";

const SECOND: Record<string, string> = {
  blue: "teal",
  teal: "blue",
  violet: "amber",
  rose: "violet",
  orange: "amber",
  amber: "green",
};

/**
 * Cover art for a pool page, in the line language of the article covers and in the network's colour. It is drawn
 * from the pool's own terms: the coin at the centre, one node per validator on the orbit (up to 16), daily
 * rewards stacking up to the right, and one cell per day of unbonding along the bottom. Decorative only.
 */
export function PoolCover({ pool }: { pool: Pool }) {
  const color = poolTone(pool.id);
  const second = SECOND[color] ?? "blue";
  const mix = (c: string, pct: number) => `color-mix(in oklab, var(--topic-${c}) ${pct}%, var(--surface-2))`;
  const line = { stroke: mix(color, 55), strokeWidth: 1.5, fill: "none" } as const;

  const cx = 330;
  const cy = 200;
  const nodes = Math.min(pool.validators, 16);
  const ring = 170;
  /* Rewards: fourteen days, rising gently with a little day-to-day wobble, scaled by the pool's APY */
  const bars = Array.from({ length: 14 }, (_, i) => 36 + i * 6 + ((i * 7) % 5) * 4 + pool.apy * 2);
  const unbonding = Math.min(pool.unbondingDays, 28);

  return (
    <svg
      viewBox="0 0 1200 400"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className="block size-full"
      style={{ background: mix(color, 12) }}
    >
      {/* Orbit with the validators, each linked to the coin */}
      <circle cx={cx} cy={cy} r={ring} {...line} strokeDasharray="4 8" />
      <circle cx={cx} cy={cy} r={115} {...line} />
      {Array.from({ length: nodes }, (_, i) => {
        const a = (i / nodes) * Math.PI * 2 - Math.PI / 2;
        const x = cx + ring * Math.cos(a);
        const y = cy + ring * Math.sin(a);
        return (
          <g key={i}>
            <path d={`M${cx} ${cy}L${x} ${y}`} stroke={mix(color, 30)} strokeWidth={1} />
            <rect
              x={x - 9}
              y={y - 9}
              width={18}
              height={18}
              rx={5}
              fill="var(--surface-2)"
              stroke={mix(color, 60)}
              strokeWidth={1.5}
            />
            <circle cx={x} cy={y} r={2.5} fill={i % 5 === 0 ? `var(--topic-${second})` : mix(color, 60)} />
          </g>
        );
      })}
      {/* The coin */}
      <circle cx={cx} cy={cy} r={74} fill={mix(color, 30)} />
      <circle cx={cx} cy={cy} r={58} fill="var(--surface-2)" stroke={`var(--topic-${color})`} strokeWidth={2} />
      <image href={`/logos/networks/${pool.id}.svg`} x={cx - 40} y={cy - 40} width={80} height={80} />

      {/* Daily rewards building up; today's in the second hue */}
      <path d="M640 300H1110" {...line} />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={650 + i * 32}
          y={300 - h}
          width={20}
          height={h}
          rx={4}
          fill={i === bars.length - 1 ? `var(--topic-${second})` : mix(color, 20 + i * 4)}
        />
      ))}
      <path
        d={`M660 ${300 - bars[0] - 18}C820 ${250 - bars[5]} 960 ${240 - bars[10]} 1100 ${282 - bars[13] - 22}`}
        {...line}
        strokeDasharray="3 6"
        strokeLinecap="round"
      />

      {/* Unbonding: one cell per day until funds release (none for pools without a lock-up) */}
      {unbonding > 0 ? (
        Array.from({ length: unbonding }, (_, i) => (
          <rect
            key={i}
            x={650 + i * 16.5}
            y={334}
            width={12}
            height={12}
            rx={3}
            {...(i === unbonding - 1 ? { fill: `var(--topic-${second})` } : { ...line })}
          />
        ))
      ) : (
        <path d="M650 340h120" stroke={`var(--topic-${second})`} strokeWidth={3} strokeLinecap="round" />
      )}
    </svg>
  );
}
