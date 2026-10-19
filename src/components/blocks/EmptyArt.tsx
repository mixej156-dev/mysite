import type { TopicColor } from "@/data/learn-meta";

export type EmptyArtKind = "positions" | "rewards" | "search" | "notifications" | "invites" | "keys";

/* Colour pair per picture, from the decorative topic palette */
const COLORS: Record<EmptyArtKind, [TopicColor, TopicColor]> = {
  positions: ["blue", "teal"],
  rewards: ["amber", "green"],
  search: ["violet", "rose"],
  notifications: ["teal", "green"],
  invites: ["violet", "amber"],
  keys: ["amber", "blue"],
};

const mix = (color: TopicColor, pct: number) => `color-mix(in oklab, var(--topic-${color}) ${pct}%, var(--surface-2))`;

/**
 * Small cover-style pictures for empty states, in the line language of the article covers: the thing that will be
 * here, drawn dashed because it isn't yet. Colours come from tokens, so they work in the dashboard's dark theme.
 */
export function EmptyArt({ kind }: { kind: EmptyArtKind }) {
  const [color, second] = COLORS[kind];
  const bg = mix(color, 14);
  const line = { stroke: mix(color, 60), strokeWidth: 1.5, fill: "none", strokeLinecap: "round" } as const;
  const dashed = { ...line, strokeDasharray: "4 5" } as const;
  const accent = `var(--topic-${second})`;

  return (
    <svg viewBox="0 0 160 112" aria-hidden className="h-28 w-40 rounded-card" style={{ background: bg }}>
      {kind === "positions" && (
        <>
          {/* An empty stack: coins drawn as outlines, the top one waiting to be added */}
          {[0, 1].map((i) => (
            <g key={i}>
              <path d={`M50 ${80 - i * 14}v8a30 9 0 0 0 60 0v-8`} {...line} fill={bg} />
              <ellipse cx={80} cy={80 - i * 14} rx={30} ry={9} {...line} fill={bg} />
            </g>
          ))}
          <ellipse cx={80} cy={38} rx={30} ry={9} {...dashed} />
          <circle cx={122} cy={30} r={11} fill={accent} />
          <path d="M117 30h10M122 25v10" stroke="var(--surface-2)" strokeWidth={2} strokeLinecap="round" />
        </>
      )}

      {kind === "rewards" && (
        <>
          {/* A calendar of days without payouts; the first one is about to fill */}
          <rect x={34} y={22} width={92} height={70} rx={8} {...line} />
          <path d="M34 38h92M56 16v12M104 16v12" {...line} />
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: 5 }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                x={42 + col * 16}
                y={46 + row * 14}
                width={10}
                height={8}
                rx={2}
                {...(row === 0 && col === 0 ? { fill: accent } : row === 0 && col === 1 ? dashed : line)}
              />
            )),
          )}
        </>
      )}

      {kind === "search" && (
        <>
          {/* A page with nothing on it, under the lens */}
          <rect x={30} y={18} width={62} height={78} rx={6} {...line} fill={bg} />
          <path d="M40 34h34M40 46h24" {...dashed} />
          <circle cx={98} cy={60} r={20} {...line} strokeWidth={3} stroke={mix(color, 75)} fill={mix(color, 8)} />
          <path d="M113 75l14 14" {...line} strokeWidth={5} stroke={mix(color, 75)} />
          <path d="M92 54l12 12M104 54l-12 12" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
        </>
      )}

      {kind === "notifications" && (
        <>
          {/* A quiet bell with a tick: nothing waiting */}
          <path d="M60 76V54a20 20 0 0 1 40 0v22l6 6H54z" {...line} fill={bg} />
          <path d="M74 88a6 6 0 0 0 12 0" {...line} />
          <path d="M40 40c-6 8-6 20 0 28M120 40c6 8 6 20 0 28" {...dashed} />
          <circle cx={104} cy={40} r={12} fill={accent} />
          <path d="M98 40l4 4 8-8" stroke="var(--surface-2)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      )}

      {kind === "invites" && (
        <>
          {/* You, and a friend still to come */}
          <circle cx={62} cy={44} r={12} {...line} fill={mix(color, 30)} />
          <path d="M40 92c0-16 10-26 22-26s22 10 22 26" {...line} fill={mix(color, 30)} />
          <circle cx={102} cy={44} r={12} {...dashed} />
          <path d="M80 92c0-16 10-26 22-26s22 10 22 26" {...dashed} />
          <circle cx={124} cy={30} r={10} fill={accent} />
          <path d="M120 30h8M124 26v8" stroke="var(--surface-2)" strokeWidth={2} strokeLinecap="round" />
        </>
      )}

      {kind === "keys" && (
        <>
          {/* A key outline on its ring, not cut yet */}
          <circle cx={58} cy={56} r={18} {...line} fill={mix(color, 24)} />
          <circle cx={58} cy={56} r={6} {...line} fill={bg} />
          <path d="M76 56h48v12M110 56v8" {...dashed} />
          <circle cx={122} cy={34} r={10} fill={accent} />
          <path d="M118 34h8M122 30v8" stroke="var(--surface-2)" strokeWidth={2} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
