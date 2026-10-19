import Link from "next/link";
import { buttonClasses } from "@/design-system/components/Button";
import { pools } from "@/data/pools";

const mix = (color: string, pct: number) => `color-mix(in oklab, var(--topic-${color}) ${pct}%, var(--surface-2))`;

/**
 * Cover-style picture for the 404: networks on their orbit around the account, with one gap in the ring and the
 * coin that should be there drifting off along a dashed trail. Decorative only.
 */
function LostOrbit() {
  const cx = 210;
  const cy = 160;
  const r = 110;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const at = (deg: number) => ({ x: cx + r * Math.cos(rad(deg)), y: cy + r * Math.sin(rad(deg)) });
  /* Six evenly spaced places; the one at GAP is empty because its network has flown off */
  const GAP = 150;
  const placed = pools.slice(0, 5).map((pool, i) => ({ pool, ...at(GAP + 60 * (i + 1)) }));
  const lost = pools[5];
  const hole = at(GAP);
  /* The ring is drawn from 0° clockwise: a short break centred on the empty place */
  const before = r * rad(GAP - 9);
  const coin = { x: 62, y: 300 };
  return (
    <svg viewBox="0 0 400 360" aria-hidden className="block size-full" style={{ background: mix("blue", 12) }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={mix("blue", 55)}
        strokeWidth={1.5}
        fill="none"
        strokeDasharray={`${before} ${r * rad(18)} ${2 * Math.PI * r}`}
      />
      <circle cx={cx} cy={cy} r={58} stroke={mix("blue", 40)} strokeWidth={1.5} fill="none" />
      <circle cx={cx} cy={cy} r={32} fill="var(--accent)" />
      <path
        d={`M${cx - 13} ${cy - 7}h26M${cx - 13} ${cy}h26M${cx - 13} ${cy + 7}h13`}
        stroke="var(--on-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {placed.map(({ pool, x, y }) => (
        <g key={pool.id}>
          <circle cx={x} cy={y} r={20} fill="var(--surface-2)" stroke={mix("blue", 55)} strokeWidth={1.5} />
          <image href={`/logos/networks/${pool.id}.svg`} x={x - 13} y={y - 13} width={26} height={26} />
        </g>
      ))}
      {/* The empty place, and the trail out of the ring */}
      <circle
        cx={hole.x}
        cy={hole.y}
        r={20}
        fill="none"
        stroke={mix("rose", 60)}
        strokeWidth={1.5}
        strokeDasharray="3 5"
      />
      <path
        d={`M${hole.x - 8} ${hole.y + 20}C${hole.x - 22} ${hole.y + 50} ${coin.x + 20} ${coin.y - 50} ${coin.x + 6} ${coin.y - 22}`}
        stroke={mix("rose", 60)}
        strokeWidth={1.5}
        strokeDasharray="3 7"
        fill="none"
        strokeLinecap="round"
      />
      <g transform={`rotate(-18 ${coin.x} ${coin.y})`}>
        <circle cx={coin.x} cy={coin.y} r={20} fill="var(--surface-2)" stroke="var(--topic-rose)" strokeWidth={1.5} />
        <image href={`/logos/networks/${lost.id}.svg`} x={coin.x - 13} y={coin.y - 13} width={26} height={26} />
      </g>
      <text x={hole.x - 4} y={hole.y + 5} fill="var(--topic-rose)" fontSize={14} fontFamily="var(--ds-font-mono)">
        ?
      </text>
    </svg>
  );
}

const SUGGESTIONS = [
  { href: "/staking", label: "Staking pools" },
  { href: "/tools/calculator", label: "Rewards calculator" },
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function NotFoundContent() {
  return (
    <section className="container-page grid gap-10 pt-10 pb-14 sm:pt-16 sm:pb-24 md:pt-24 md:pb-32 lg:grid-cols-12 lg:gap-8">
      <div data-intro className="lg:col-span-7">
        <p className="font-mono text-h3 text-accent-text" aria-hidden>
          404
        </p>
        <h1 className="mt-4 text-h1 md:text-display">Page not found</h1>
        <p className="mt-6 max-w-[52ch] font-serif text-lead text-muted">
          The address may be mistyped or the page may have moved. Pick up from one of the places below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={buttonClasses({ size: "lg" })}>
            Back to home
          </Link>
          <Link href="/staking" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            See pools
          </Link>
        </div>
        <nav aria-label="Popular pages" className="mt-10 sm:mt-16 max-w-[40rem] border-t border-rule">
          <ul>
            {SUGGESTIONS.map((s) => (
              <li key={s.href} className="border-b border-rule">
                <Link
                  href={s.href}
                  className="flex h-12 items-center justify-between rounded-sm text-body transition-colors duration-fast hover:text-accent-text"
                >
                  {s.label}
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div data-intro className="max-lg:hidden lg:col-span-5 [--intro-start:300ms]">
        <div className="aspect-[10/9] overflow-hidden rounded-card border border-rule">
          <LostOrbit />
        </div>
      </div>
    </section>
  );
}
