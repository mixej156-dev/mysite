import type { TopicColor } from "@/data/learn-meta";
import type { PostCategory } from "@/data/posts";

/** Colour pairs for the `colored` variant, from the decorative topic palette (as on ECO. LEARN covers) */
const CATEGORY_COLORS: Record<PostCategory, { color: TopicColor; secondary: TopicColor }> = {
  Research: { color: "blue", secondary: "amber" },
  Product: { color: "violet", secondary: "teal" },
  Security: { color: "green", secondary: "blue" },
  Guides: { color: "orange", secondary: "violet" },
};

/** Stable small hash so each post gets its own variation of the category pattern. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Generated cover art: one motif per category, drawn with rule lines and a single accent mark.
 * `colored` draws the same motif in the category's palette colours. Decorative only.
 */
export function PostCover({
  slug,
  category,
  fit = "cover",
  colored = false,
}: {
  slug: string;
  category: PostCategory;
  /** "contain" keeps the whole motif visible in very wide frames */
  fit?: "cover" | "contain";
  colored?: boolean;
}) {
  const h = hash(slug);
  const pick = (shift: number, mod: number) => (h >>> shift) % mod;
  const palette = colored ? CATEGORY_COLORS[category] : undefined;
  const mix = (pct: number) =>
    palette && `color-mix(in oklab, var(--topic-${palette.color}) ${pct}%, var(--surface-2))`;
  const ruleColor = mix(60) ?? "var(--rule-strong)";
  const accentColor = palette ? `var(--topic-${palette.secondary})` : "var(--accent-text)";
  /* Second solid colour; in the monochrome variant it stays a rule line */
  const strongFill = palette ? `var(--topic-${palette.color})` : "var(--rule-strong)";
  const line = { stroke: ruleColor, strokeWidth: 1.5, fill: "none" } as const;
  const accent = { stroke: accentColor, strokeWidth: 2, fill: "none" } as const;

  return (
    <svg
      viewBox="0 0 320 200"
      aria-hidden
      preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
      className="block size-full bg-surface-2"
      style={palette ? { background: mix(14) } : undefined}
    >
      {category === "Research" &&
        Array.from({ length: 12 }, (_, i) => {
          const height = 30 + (((h >>> i) % 9) + i * 4) * 3.2;
          return (
            <rect
              key={i}
              x={34 + i * 22}
              y={176 - height}
              width={10}
              height={height}
              rx={2}
              fill={i === 8 + pick(3, 4) ? accentColor : palette && i % 3 === 0 ? strongFill : ruleColor}
            />
          );
        })}

      {category === "Product" &&
        [86, 66, 46, 26].map((r, i) => (
          <circle
            key={r}
            cx={200 + pick(2, 40) - 20}
            cy={100}
            r={r}
            {...(i === pick(5, 4) ? accent : palette && i === 3 ? { fill: strongFill } : line)}
          />
        ))}

      {category === "Security" &&
        Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => {
            const on = row * 10 + col === 20 + pick(1, 30);
            const solid = palette && (row * 7 + col * 3 + pick(7, 5)) % 9 === 0;
            return (
              <rect
                key={`${row}-${col}`}
                x={36 + col * 26}
                y={30 + row * 24}
                width={14}
                height={14}
                rx={3}
                {...(on ? { fill: accentColor } : solid ? { fill: strongFill } : line)}
              />
            );
          }),
        )}

      {category === "Guides" &&
        (() => {
          /* A staircase whose step count and rise vary per post */
          const steps = 3 + pick(6, 3);
          const run = 240 / steps;
          const rise = 18 + pick(9, 4) * 6;
          const marker = pick(4, steps);
          return (
            <>
              {Array.from({ length: steps }, (_, i) => (
                <path key={i} d={`M${40 + i * run} ${170 - i * rise}h${run}v-${rise}`} {...line} />
              ))}
              <circle cx={40 + marker * run} cy={170 - marker * rise} r={6} fill={accentColor} />
              {palette && (
                <rect
                  x={40 + (steps - 1) * run + run - 22}
                  y={170 - (steps - 1) * rise - rise - 22}
                  width={18}
                  height={18}
                  rx={4}
                  fill={strongFill}
                />
              )}
            </>
          );
        })()}
    </svg>
  );
}
