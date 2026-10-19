import { Check } from "lucide-react";
import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { pools } from "@/data/pools";

const mix = (color: string, pct: number) => `color-mix(in oklab, var(--topic-${color}) ${pct}%, var(--bg))`;
const line = { stroke: "var(--rule-strong)", strokeWidth: 1.5, fill: "none" } as const;

/* Centre of the orbits and where each network sits on them: ring radius, angle in degrees */
const CX = 300;
const CY = 210;
const PLACES = [
  { r: 110, a: -150 },
  { r: 170, a: -60 },
  { r: 110, a: -10 },
  { r: 170, a: 25 },
  { r: 110, a: 120 },
  { r: 170, a: 165 },
];
const at = (r: number, a: number) => ({
  x: CX + r * Math.cos((a * Math.PI) / 180),
  y: CY + r * Math.sin((a * Math.PI) / 180),
});

/** Daily reward chips drifting out of the centre: colour, label, position */
const CHIPS = [
  { color: "green", text: "+0.0013 ETH", x: 372, y: 118 },
  { color: "teal", text: "+0.153 SOL", x: 92, y: 268 },
  { color: "amber", text: "+0.439 ATOM", x: 362, y: 316 },
];

/**
 * Cover-style art for the closing call to action, in the line language of the article covers: the account at the
 * centre, every network on its orbit, rewards drifting out. Decorative only.
 */
function OrbitArt() {
  return (
    <svg viewBox="0 0 600 420" aria-hidden preserveAspectRatio="xMidYMid slice" className="block size-full">
      <circle cx={CX} cy={CY} r={230} fill={mix("blue", 10)} />
      {[60, 110, 170].map((r) => (
        <circle key={r} cx={CX} cy={CY} r={r} {...line} strokeDasharray={r === 170 ? "3 7" : undefined} />
      ))}
      {/* Paths from the centre to each network */}
      {PLACES.map(({ r, a }, i) => {
        const p = at(r, a);
        return <path key={i} d={`M${CX} ${CY}L${p.x} ${p.y}`} stroke={mix("blue", 45)} strokeWidth={1} />;
      })}
      {/* The account: brand disc with the ledger lines of the logo */}
      <circle cx={CX} cy={CY} r={44} fill="var(--accent)" />
      <path
        d={`M${CX - 18} ${CY - 9}h36M${CX - 18} ${CY}h36M${CX - 18} ${CY + 9}h18`}
        stroke="var(--on-accent)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {pools.map((pool, i) => {
        const { x, y } = at(PLACES[i].r, PLACES[i].a);
        return (
          <g key={pool.id}>
            <circle cx={x} cy={y} r={24} fill="var(--bg)" stroke="var(--rule-strong)" strokeWidth={1.5} />
            <image href={`/logos/networks/${pool.id}.svg`} x={x - 16} y={y - 16} width={32} height={32} />
          </g>
        );
      })}
      {CHIPS.map((c) => (
        <g key={c.text}>
          <rect
            x={c.x}
            y={c.y}
            width={122}
            height={30}
            rx={15}
            fill={mix(c.color, 22)}
            stroke={`var(--topic-${c.color})`}
            strokeWidth={1}
          />
          <circle cx={c.x + 16} cy={c.y + 15} r={4} fill={`var(--topic-${c.color})`} />
          <text x={c.x + 28} y={c.y + 19.5} fill="var(--text)" fontSize={12} fontFamily="var(--ds-font-mono)">
            {c.text}
          </text>
        </g>
      ))}
    </svg>
  );
}

const POINTS = ["Rewards paid daily", "Withdraw any time", "Every fee shown up front"];

/** Closing call to action: a navy card with the orbit art, the offer and the two next steps. */
export function StartCta() {
  return (
    <section aria-labelledby="cta-title" className="py-14 sm:py-24 md:py-32">
      <div className="container-page">
        <div
          data-tone="inverse"
          className="grid overflow-hidden rounded-card bg-bg text-text lg:grid-cols-12 lg:items-center"
        >
          <div className="p-6 sm:p-10 lg:col-span-6 lg:p-14 xl:p-16">
            <h2 id="cta-title" className="text-display">
              Start with 0.1 ETH.
            </h2>
            <p className="mt-5 max-w-[44ch] font-serif text-lead text-muted sm:mt-6">
              Create an account, pick a pool and see your first reward recorded within a day.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5 text-small sm:mt-8">
              {POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-pill tint-accent text-accent-text">
                    <Check aria-hidden className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              <Link href="/register" className={buttonClasses({ size: "lg" })}>
                Start staking
              </Link>
              <Link href="/staking" className={buttonClasses({ size: "lg", variant: "secondary" })}>
                See pools
              </Link>
            </div>
          </div>
          <div className="h-64 border-t border-rule sm:h-80 lg:col-span-6 lg:h-[34rem] lg:border-t-0 lg:border-l">
            <OrbitArt />
          </div>
        </div>
      </div>
    </section>
  );
}
