import type { PostCategory } from "@/data/posts";

/** Stable small hash so each post gets its own variation of the category pattern. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Generated cover art: one motif per category, drawn with rule lines and a single accent mark.
 * Decorative only.
 */
export function PostCover({
  slug,
  category,
  fit = "cover",
}: {
  slug: string;
  category: PostCategory;
  /** "contain" keeps the whole motif visible in very wide frames */
  fit?: "cover" | "contain";
}) {
  const h = hash(slug);
  const pick = (shift: number, mod: number) => (h >>> shift) % mod;
  const line = { stroke: "var(--rule-strong)", strokeWidth: 1.5, fill: "none" } as const;
  const accent = { stroke: "var(--accent-text)", strokeWidth: 2, fill: "none" } as const;

  return (
    <svg
      viewBox="0 0 320 200"
      aria-hidden
      preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
      className="block size-full bg-surface-2"
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
              fill={i === 8 + pick(3, 4) ? "var(--accent-text)" : "var(--rule-strong)"}
            />
          );
        })}

      {category === "Product" &&
        [86, 66, 46, 26].map((r, i) => (
          <circle key={r} cx={200 + pick(2, 40) - 20} cy={100} r={r} {...(i === pick(5, 4) ? accent : line)} />
        ))}

      {category === "Security" &&
        Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => {
            const on = row * 10 + col === 20 + pick(1, 30);
            return (
              <rect
                key={`${row}-${col}`}
                x={36 + col * 26}
                y={30 + row * 24}
                width={14}
                height={14}
                rx={3}
                {...(on ? { fill: "var(--accent-text)" } : line)}
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
              <circle cx={40 + marker * run} cy={170 - marker * rise} r={6} fill="var(--accent-text)" />
            </>
          );
        })()}
    </svg>
  );
}
