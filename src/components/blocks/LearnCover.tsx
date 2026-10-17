import { getTopic, type LearnTopic, type TopicColor } from "@/data/learn";

/** Stable small hash so each guide gets its own variation of the topic motif. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  return h >>> 0;
}

const PALETTE: TopicColor[] = ["blue", "green", "teal", "orange", "amber", "violet", "rose"];

const tone = (color: TopicColor) => `var(--topic-${color})`;
const mix = (color: TopicColor, pct: number) => `color-mix(in oklab, var(--topic-${color}) ${pct}%, var(--surface-2))`;

/**
 * Generated cover art for ECO. LEARN: the same line language as blog covers (PostCover),
 * in the topic's colours. One motif per topic. Decorative only.
 */
export function LearnCover({
  slug,
  topic,
  fit = "cover",
}: {
  slug: string;
  topic: LearnTopic;
  /** "contain" keeps the whole motif visible in very wide frames */
  fit?: "cover" | "contain";
}) {
  const { color, secondary } = getTopic(topic);
  const h = hash(slug);
  const pick = (shift: number, mod: number) => (h >>> shift) % mod;
  const line = { stroke: mix(color, 60), strokeWidth: 1.5, fill: "none" } as const;
  const primary = tone(color);
  /* Every third guide keeps the topic's own pairing; the rest borrow another palette colour */
  const extras = PALETTE.filter((c) => c !== color);
  const secondColor = h % 3 === 0 ? secondary : extras[pick(11, extras.length)];
  const second = tone(secondColor);

  return (
    <svg
      viewBox="0 0 320 200"
      aria-hidden
      preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
      className="block size-full"
      style={{ background: mix(color, 14) }}
    >
      {topic === "Fundamentals" &&
        (() => {
          /* A chain of blocks, each linked to the last: in a row, rising, or wrapped onto two rows */
          const layout = pick(1, 3);
          const count = 4 + pick(4, 3);
          const filled = pick(2, count);
          const marked = (filled + 2 + pick(5, 2)) % count;
          const pos = (i: number) => {
            if (layout === 0) return { x: 160 - (count * 54 - 18) / 2 + i * 54, y: 64 + ((h >>> (i * 3)) % 3) * 14 };
            if (layout === 1) return { x: 160 - (count * 50 - 14) / 2 + i * 50, y: 140 - i * (90 / (count - 1)) };
            const perRow = Math.ceil(count / 2);
            const row = Math.floor(i / perRow);
            const col = row === 0 ? i % perRow : perRow - 1 - (i % perRow);
            return { x: 160 - (perRow * 60 - 24) / 2 + col * 60, y: 34 + row * 76 };
          };
          return Array.from({ length: count }, (_, i) => {
            const { x, y } = pos(i);
            const prev = i > 0 ? pos(i - 1) : undefined;
            return (
              <g key={i}>
                {prev && <path d={`M${prev.x + 18} ${prev.y + 22}L${x + 18} ${y + 22}`} {...line} />}
                <rect
                  x={x}
                  y={y}
                  width={36}
                  height={44}
                  rx={5}
                  {...(i === filled
                    ? { fill: primary }
                    : i === marked
                      ? { fill: mix(secondColor, 70) }
                      : { ...line, fill: mix(color, 14) })}
                />
                {[0, 1, 2].map((r) => (
                  <path
                    key={r}
                    d={`M${x + 8} ${y + 12 + r * 10}h${20 - r * 6}`}
                    stroke={i === filled ? "var(--surface-2)" : mix(color, 45)}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                ))}
              </g>
            );
          });
        })()}

      {topic === "Wallets & security" &&
        (() => {
          /* Nested frames around a keyhole: rounded rectangles or rings, placed left, centre or right */
          const cx = [104, 160, 216][pick(2, 3)];
          const rings = pick(4, 2) === 1;
          const frames = [104, 80, 56, 34].slice(0, 2 + pick(6, 2));
          const dotsVertical = pick(9, 2) === 1;
          return (
            <>
              {frames.map((size, i) => {
                const style = i === pick(5, frames.length) ? { stroke: second, strokeWidth: 2, fill: "none" } : line;
                return rings ? (
                  <circle key={size} cx={cx} cy={100} r={size * 0.78} {...style} />
                ) : (
                  <rect key={size} x={cx - size} y={100 - size * 0.62} width={size * 2} height={size * 1.24} rx={14} {...style} />
                );
              })}
              <circle cx={cx} cy={92} r={12} fill={primary} />
              <path d={`M${cx - 7} 98 L${cx + 7} 98 L${cx + 10} 124 L${cx - 10} 124 Z`} fill={primary} />
              {Array.from({ length: 6 }, (_, i) => (
                <circle
                  key={i}
                  cx={dotsVertical ? (cx < 160 ? 280 : 40) : cx - 50 + i * 20}
                  cy={dotsVertical ? 50 + i * 20 : 172}
                  r={3}
                  fill={i === pick(8, 6) ? second : mix(color, 50)}
                />
              ))}
            </>
          );
        })()}

      {topic === "Staking" &&
        (() => {
          /* Coin stacks: steadily growing, a peak, or uneven */
          const cols = 5 + pick(1, 4);
          const pattern = pick(4, 3);
          const gap = 236 / (cols - 1);
          const highlight = pick(7, cols);
          const height = (col: number) =>
            pattern === 0
              ? 2 + Math.round((col / (cols - 1)) * 7)
              : pattern === 1
                ? 2 + Math.round((1 - Math.abs(col - (cols - 1) / 2) / ((cols - 1) / 2)) * 7)
                : 2 + ((h >>> (col * 2)) % 8);
          return Array.from({ length: cols }, (_, col) => {
            const coins = height(col);
            const x = 42 + col * gap;
            return Array.from({ length: coins }, (_, i) => {
              const last = i === coins - 1;
              return (
                <ellipse
                  key={`${col}-${i}`}
                  cx={x}
                  cy={172 - i * 12}
                  rx={14}
                  ry={5}
                  {...(last && col === highlight
                    ? { fill: second }
                    : last && coins === Math.max(...Array.from({ length: cols }, (_, c) => height(c)))
                      ? { fill: primary }
                      : { ...line, fill: mix(color, 14) })}
                />
              );
            });
          });
        })()}

      {topic === "DeFi" &&
        (() => {
          /* A network of pools: nodes and the routes between them */
          const nodes = Array.from({ length: 8 }, (_, i) => {
            const x = 40 + i * 34 + ((h >>> i) % 3) * 6;
            const y = 50 + ((h >>> (i * 2)) % 5) * 25;
            /* Keep nodes clear of the hub so none hides under it */
            const nearHub = Math.abs(x - 160) < 48 && Math.abs(y - 100) < 44;
            return { x, y: nearHub ? (y < 100 ? 44 : 156) : y };
          });
          const hub = { x: 160, y: 100 };
          const a = pick(3, 8);
          const b = (a + 3) % 8;
          return (
            <>
              {nodes.map((n, i) => (
                <path key={`e-${i}`} d={`M${hub.x} ${hub.y}L${n.x} ${n.y}`} {...line} />
              ))}
              {nodes.slice(1).map((n, i) => (
                <path key={`c-${i}`} d={`M${nodes[i].x} ${nodes[i].y}L${n.x} ${n.y}`} stroke={mix(color, 35)} strokeWidth={1} />
              ))}
              {nodes.map((n, i) => (
                <circle
                  key={`n-${i}`}
                  cx={n.x}
                  cy={n.y}
                  r={i === a || i === b ? 8 : 5}
                  {...(i === a ? { fill: second } : i === b ? { fill: tone("teal") } : { ...line, fill: mix(color, 14) })}
                />
              ))}
              <circle cx={hub.x} cy={hub.y} r={18} fill={primary} />
              <circle cx={hub.x} cy={hub.y} r={28} {...line} />
            </>
          );
        })()}

      {topic === "Markets" &&
        (() => {
          /* Candlesticks with a moving average */
          let price = 110;
          const candles = Array.from({ length: 13 }, (_, i) => {
            const delta = (((h >>> i) % 7) - 3) * 6 + (i % 4 === 0 ? -4 : 3);
            const open = price;
            price = Math.min(160, Math.max(50, price - delta));
            return { x: 36 + i * 20, open, close: price, wick: 6 + ((h >>> (i + 3)) % 4) * 4 };
          });
          const avg = candles.map((c, i) => {
            const win = candles.slice(Math.max(0, i - 2), i + 1);
            return `${c.x},${win.reduce((s, w) => s + w.close, 0) / win.length}`;
          });
          return (
            <>
              {candles.map((c) => {
                const up = c.close < c.open;
                const top = Math.min(c.open, c.close);
                const height = Math.max(4, Math.abs(c.open - c.close));
                return (
                  <g key={c.x}>
                    <path d={`M${c.x} ${top - c.wick}V${top + height + c.wick}`} stroke={mix(color, 60)} strokeWidth={1.5} />
                    <rect
                      x={c.x - 5}
                      y={top}
                      width={10}
                      height={height}
                      rx={1.5}
                      {...(up ? { fill: primary } : { stroke: second, strokeWidth: 1.5, fill: mix(color, 14) })}
                    />
                  </g>
                );
              })}
              <polyline points={avg.join(" ")} stroke={second} strokeWidth={2} fill="none" strokeLinejoin="round" />
            </>
          );
        })()}

      {topic === "Technology" &&
        (() => {
          /* Stacked layers, the top one carrying blocks */
          const layers = 3 + pick(2, 2);
          const lit = pick(5, layers);
          const dx = [-50, 0, 50][pick(7, 3)];
          return (
            <>
              {Array.from({ length: layers }, (_, i) => {
                const y = 150 - i * 26;
                return (
                  <path
                    key={i}
                    d={`M${160 + dx} ${y - 30}L${250 + dx} ${y}L${160 + dx} ${y + 30}L${70 + dx} ${y}Z`}
                    {...(i === lit ? { fill: mix(color, 45), stroke: primary, strokeWidth: 1.5 } : { ...line, fill: mix(color, 14) })}
                  />
                );
              })}
              {[-1, 0, 1].map((k) => {
                const y = 150 - (layers - 1) * 26;
                return (
                  <rect
                    key={k}
                    x={152 + dx + k * 28}
                    y={y - 12 + Math.abs(k) * 4}
                    width={16}
                    height={16}
                    rx={3}
                    fill={k === pick(9, 3) - 1 ? second : primary}
                  />
                );
              })}
            </>
          );
        })()}
    </svg>
  );
}
