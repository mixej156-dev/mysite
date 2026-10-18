import type { TopicColor } from "@/data/learn-meta";

/* Colour pair per step, from the decorative topic palette (as on ECO. LEARN and blog covers) */
const COLORS: { color: TopicColor; second: TopicColor }[] = [
  { color: "blue", second: "teal" },
  { color: "violet", second: "amber" },
  { color: "green", second: "blue" },
  { color: "orange", second: "violet" },
];

const tone = (color: TopicColor) => `var(--topic-${color})`;
const mix = (color: TopicColor, pct: number) => `color-mix(in oklab, var(--topic-${color}) ${pct}%, var(--surface-2))`;

/**
 * Cover art for the four "How a stake earns" steps, in the line language of the article covers.
 * Read left to right they tell one story: coins go into a pool, the pool is split across validators,
 * rewards build up epoch by epoch, and a payment lands in the wallet each day. Decorative only.
 */
export function StakeStoryCover({ step }: { step: 0 | 1 | 2 | 3 }) {
  const { color, second } = COLORS[step];
  const primary = tone(color);
  const accent = tone(second);
  const line = { stroke: mix(color, 60), strokeWidth: 1.5, fill: "none" } as const;
  const bg = mix(color, 14);

  return (
    <svg
      viewBox="0 0 320 200"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className="block size-full"
      style={{ background: bg }}
    >
      {step === 0 && (
        <>
          {/* A stack of coins, the top one on its way into the pool */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M50 ${150 - i * 14}v8a28 9 0 0 0 56 0v-8`} {...line} fill={bg} />
              <ellipse cx={78} cy={150 - i * 14} rx={28} ry={9} {...line} fill={bg} />
            </g>
          ))}
          <path d="M92 86C120 40 180 34 214 70" {...line} strokeDasharray="4 6" strokeLinecap="round" />
          <circle cx={152} cy={46} r={9} fill={accent} />
          <circle cx={234} cy={118} r={56} {...line} />
          <circle cx={234} cy={118} r={38} fill={mix(color, 32)} />
          <circle cx={234} cy={118} r={16} fill={primary} />
        </>
      )}

      {step === 1 && (
        <>
          {/* One pool delegated across validators; the strongest takes the larger share */}
          {[38, 74, 110, 146].map((y, i) => (
            <path key={y} d={`M96 100C150 100 160 ${y + 12} 206 ${y + 12}`} {...line} strokeWidth={i === 2 ? 3 : 1.5} />
          ))}
          <circle cx={80} cy={100} r={26} fill={primary} />
          <circle cx={80} cy={100} r={38} {...line} />
          {[38, 74, 110, 146].map((y, i) => (
            <g key={y}>
              <rect
                x={206}
                y={y}
                width={72}
                height={24}
                rx={5}
                {...(i === 2 ? { fill: accent } : { ...line, fill: bg })}
              />
              {[0, 1, 2].map((d) => (
                <circle
                  key={d}
                  cx={220 + d * 10}
                  cy={y + 12}
                  r={2.5}
                  fill={i === 2 ? "var(--surface-2)" : mix(color, 60)}
                />
              ))}
            </g>
          ))}
        </>
      )}

      {step === 2 &&
        (() => {
          /* Epoch blocks along the bottom; the reward bar above each one grows */
          const tops = [118, 110, 103, 94, 88, 78, 70, 58];
          return (
            <>
              {tops.map((top, i) => (
                <g key={i}>
                  <rect
                    x={40 + i * 31}
                    y={top}
                    width={18}
                    height={140 - top}
                    rx={3}
                    fill={i === tops.length - 1 ? primary : mix(color, i % 3 === 0 ? 45 : 28)}
                  />
                  <rect x={38 + i * 31} y={150} width={22} height={22} rx={4} {...line} fill={bg} />
                </g>
              ))}
              <path
                d={`M${49} ${tops[0] - 14}${tops.map((t, i) => `L${49 + i * 31} ${t - 14}`).join("")}`}
                {...line}
                strokeDasharray="3 5"
                strokeLinecap="round"
              />
              <circle cx={49 + 7 * 31} cy={tops[7] - 14} r={7} fill={accent} />
            </>
          );
        })()}

      {step === 3 && (
        <>
          {/* A month of daily payouts, today's on its way to the wallet */}
          {Array.from({ length: 28 }, (_, i) => {
            const x = 34 + (i % 7) * 22;
            const y = 46 + Math.floor(i / 7) * 28;
            const today = i === 23;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={16}
                  height={20}
                  rx={3}
                  {...(today ? { fill: primary } : { ...line, fill: bg })}
                />
                {i < 23 && <circle cx={x + 8} cy={y + 10} r={2.5} fill={mix(color, 60)} />}
              </g>
            );
          })}
          <path d="M150 130C190 150 210 120 232 104" {...line} strokeDasharray="4 6" strokeLinecap="round" />
          <circle cx={226} cy={86} r={9} fill={accent} />
          <rect x={218} y={98} width={76} height={56} rx={8} fill={mix(color, 32)} />
          <path d="M218 112h76" {...line} />
          <rect x={268} y={118} width={26} height={18} rx={4} fill={primary} />
          <circle cx={278} cy={127} r={3} fill="var(--surface-2)" />
        </>
      )}
    </svg>
  );
}
