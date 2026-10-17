import type { TopicColor } from "@/data/learn";
import { cn } from "@/lib/cn";

export type NavArtKind =
  | "pools"
  | "layers"
  | "speed"
  | "orbits"
  | "dots"
  | "peaks"
  | "arcs"
  | "rings"
  | "bars"
  | "exchange"
  | "timeline"
  | "people"
  | "lock"
  | "message"
  | "stairs"
  | "article"
  | "doc"
  | "question";

export type NavArtSpec = { kind: NavArtKind; color: TopicColor; secondary: TopicColor };

const tone = (c: TopicColor) => `var(--topic-${c})`;
const mix = (c: TopicColor, pct: number) => `color-mix(in oklab, var(--topic-${c}) ${pct}%, var(--surface-2))`;

/**
 * Small square illustration for a menu link: the cover-art line language (see LearnCover) at icon size,
 * in the decorative topic palette. Decorative only.
 */
export function NavArt({ kind, color, secondary, className }: NavArtSpec & { className?: string }) {
  const line = {
    stroke: mix(color, 65),
    strokeWidth: 1.5,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  const fill = tone(color);
  const second = tone(secondary);
  const soft = mix(color, 14);

  return (
    <span
      aria-hidden
      className={cn("block size-14 shrink-0 overflow-hidden rounded-field border border-rule", className)}
      style={{ background: soft }}
    >
      <svg viewBox="0 0 48 48" className="size-full">
        {kind === "pools" &&
          [14, 24, 34].map((x, col) =>
            Array.from({ length: 2 + col }, (_, i) => (
              <ellipse
                key={`${x}-${i}`}
                cx={x}
                cy={36 - i * 6}
                rx={5}
                ry={2}
                {...(i === 1 + col ? { fill: col === 2 ? fill : second } : { ...line, fill: soft })}
              />
            )),
          )}

        {kind === "layers" &&
          [32, 24, 16].map((y, i) => (
            <path
              key={y}
              d={`M24 ${y - 7}L37 ${y}L24 ${y + 7}L11 ${y}Z`}
              {...(i === 2 ? { fill, stroke: fill, strokeWidth: 1.5 } : { ...line, fill: soft })}
            />
          ))}

        {kind === "speed" && (
          <>
            {[
              [8, 16, 22],
              [12, 24, 18],
              [6, 32, 14],
            ].map(([x, y, w], i) => (
              <path
                key={y}
                d={`M${x} ${y}h${w}`}
                stroke={i === 1 ? second : mix(color, 65)}
                strokeWidth={3}
                strokeLinecap="round"
              />
            ))}
            <circle cx={36} cy={24} r={6} fill={fill} />
          </>
        )}

        {kind === "orbits" && (
          <>
            <ellipse cx={24} cy={24} rx={16} ry={7} {...line} transform="rotate(-30 24 24)" />
            <ellipse cx={24} cy={24} rx={16} ry={7} {...line} transform="rotate(30 24 24)" />
            <circle cx={24} cy={24} r={4.5} fill={fill} />
            <circle cx={37} cy={17} r={2.5} fill={second} />
          </>
        )}

        {kind === "dots" &&
          Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={24 + Math.cos(a) * 12}
                cy={24 + Math.sin(a) * 12}
                r={3.5}
                {...(i === 0 ? { fill } : i === 3 ? { fill: second } : { ...line, fill: soft })}
              />
            );
          }).concat(<circle key="c" cx={24} cy={24} r={2} fill={mix(color, 65)} />)}

        {kind === "peaks" && (
          <>
            <path d="M6 37L19 15L32 37Z" {...line} fill={soft} />
            <path d="M18 37L30 18L42 37Z" fill={fill} />
            <path d="M26.5 23.5L30 18L33.5 23.5" stroke="var(--surface-2)" strokeWidth={1.5} fill="none" />
            <circle cx={38} cy={11} r={3} fill={second} />
          </>
        )}

        {kind === "arcs" && (
          <>
            {[16, 11, 6].map((r) => (
              <path key={r} d={`M${24 - r} 34a${r} ${r} 0 0 1 ${r * 2} 0`} {...line} />
            ))}
            <circle cx={24} cy={34} r={3} fill={fill} />
            <circle cx={35} cy={23} r={2.5} fill={second} />
          </>
        )}

        {kind === "rings" &&
          [17, 13, 9]
            .map((r, i) => (
              <circle key={r} cx={24} cy={24} r={r} fill={mix(color, 30 + i * 30)} stroke={soft} strokeWidth={1.5} />
            ))
            .concat(<circle key="c" cx={24} cy={24} r={5} fill="var(--surface-2)" />)}

        {kind === "bars" &&
          [
            [12, 18],
            [21, 26],
            [30, 12],
          ].map(([x, h], i) => (
            <rect
              key={x}
              x={x}
              y={37 - h}
              width={6}
              height={h}
              rx={1.5}
              {...(i === 1 ? { fill } : i === 2 ? { fill: second } : { ...line, fill: soft })}
            />
          ))}

        {kind === "exchange" && (
          <>
            <circle cx={17} cy={19} r={7} fill={fill} />
            <circle cx={31} cy={29} r={7} {...line} fill={soft} />
            <path d="M28 12h7v7M35 12l-6 6" stroke={second} strokeWidth={1.75} fill="none" strokeLinecap="round" />
            <path d="M20 36h-7v-7M13 36l6-6" {...line} />
          </>
        )}

        {kind === "timeline" && (
          <>
            <path d="M8 24h32" {...line} />
            {[10, 19, 28, 38].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={24}
                r={i === 3 ? 4 : 3}
                {...(i === 3 ? { fill } : i === 1 ? { fill: second } : { ...line, fill: soft })}
              />
            ))}
            <path d="M19 18v-6M28 30v6" {...line} />
          </>
        )}

        {kind === "people" &&
          [
            [14, 1],
            [34, 1],
            [24, 0],
          ].map(([x, back]) => (
            <g key={x}>
              <circle cx={x} cy={back ? 19 : 21} r={back ? 4 : 5} {...(back ? { ...line, fill: soft } : { fill })} />
              <path
                d={back ? `M${x - 7} 36a7 7 0 0 1 14 0` : `M${x - 9} 39a9 9 0 0 1 18 0`}
                {...(back ? { ...line, fill: soft } : { fill })}
              />
            </g>
          ))}

        {kind === "lock" && (
          <>
            <rect x={9} y={11} width={30} height={26} rx={5} {...line} />
            <rect x={14} y={15} width={20} height={18} rx={3} stroke={second} strokeWidth={1.5} fill="none" />
            <circle cx={24} cy={22} r={3.5} fill={fill} />
            <path d="M22 24h4l1 5h-6z" fill={fill} />
          </>
        )}

        {kind === "message" && (
          <>
            <path
              d="M9 12h30a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H21l-7 6v-6H9a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z"
              {...line}
              fill={soft}
            />
            <path d="M13 20h16" stroke={fill} strokeWidth={2} strokeLinecap="round" />
            <path d="M13 26h10" {...line} />
            <circle cx={34} cy={26} r={2.5} fill={second} />
          </>
        )}

        {kind === "stairs" && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${8 + i * 8} ${38 - i * 7}h8v-7`} {...line} />
            ))}
            <circle cx={40} cy={10} r={4} fill={fill} />
            <circle cx={16} cy={31} r={2.5} fill={second} />
          </>
        )}

        {kind === "article" && (
          <>
            <rect x={9} y={10} width={30} height={14} rx={2.5} fill={fill} />
            <circle cx={33} cy={15} r={2.5} fill={second} />
            <path d="M9 30h30M9 36h20" {...line} />
          </>
        )}

        {kind === "doc" && (
          <>
            <path d="M13 8h15l8 8v24a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" {...line} fill={soft} />
            <path d="M28 8v8h8" {...line} />
            <path
              d="M19 24l-3 3 3 3M27 24l3 3-3 3"
              stroke={fill}
              strokeWidth={1.75}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M16 35h10" stroke={second} strokeWidth={1.75} strokeLinecap="round" />
          </>
        )}

        {kind === "question" && (
          <>
            <circle cx={24} cy={23} r={15} {...line} fill={soft} />
            <path
              d="M19.5 19a4.5 4.5 0 1 1 6.3 4.1c-1.2.6-1.8 1.4-1.8 2.7v1"
              stroke={fill}
              strokeWidth={2.25}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={24} cy={31.5} r={1.6} fill={fill} />
            <circle cx={37} cy={10} r={2.5} fill={second} />
          </>
        )}
      </svg>
    </span>
  );
}
