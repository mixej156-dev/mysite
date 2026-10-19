import type { TopicColor } from "@/data/learn-meta";
import { TEAM, type Department, type TeamMember } from "@/data/team";

/* One hue per department, from the decorative topic palette (as on article covers) */
export const DEPARTMENT_COLORS: Record<Department, TopicColor> = {
  Leadership: "blue",
  Engineering: "violet",
  "Validator operations": "teal",
  Security: "green",
  Operations: "amber",
};
/* Leaders get a hue each, ones no department uses, so the three portraits read as three people */
const LEADER_COLORS: Record<string, TopicColor> = { lena: "blue", omar: "orange", ines: "rose" };
const SECOND: TopicColor[] = ["orange", "rose", "amber", "blue", "violet", "green", "teal"];

const mix = (color: TopicColor, pct: number) => `color-mix(in oklab, var(--topic-${color}) ${pct}%, var(--surface-2))`;


/**
 * Drawn portrait in the line language of the article covers: a head-and-shoulders figure over a pattern that
 * differs per person, in the department's hue. The team is fictional, so there are no photos. Decorative only.
 */
export function TeamAvatar({ member }: { member: TeamMember }) {
  const color = LEADER_COLORS[member.id] ?? DEPARTMENT_COLORS[member.department];
  /* Pattern and accent follow the person's place in the list, so neighbours never match */
  const h = Math.max(0, TEAM.findIndex((m) => m.id === member.id));
  const candidate = SECOND[(h * 3) % SECOND.length];
  const second = candidate === color ? SECOND[(h * 3 + 1) % SECOND.length] : candidate;
  const pattern = h % 4;
  const line = { stroke: mix(color, 55), strokeWidth: 1.5, fill: "none" } as const;
  /* The figure leans a little left or right of centre */
  const x = 100 + (h % 3) * 8 - 8;

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className="block size-full"
      style={{ background: mix(color, 14) }}
    >
      {pattern === 0 && [36, 60, 84].map((r) => <circle key={r} cx={x} cy={84} r={r} {...line} />)}
      {pattern === 1 &&
        Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={20 + col * 32} cy={18 + row * 32} r={2.5} fill={mix(color, 50)} />
          )),
        )}
      {pattern === 2 && [-40, 0, 40, 80, 120, 160].map((o) => <path key={o} d={`M${o} 200L${o + 120} 0`} {...line} />)}
      {pattern === 3 && (
        <>
          <path d={`M10 150C60 60 140 60 190 150`} {...line} strokeDasharray="4 7" strokeLinecap="round" />
          <path d={`M30 40h40M30 54h26`} {...line} strokeLinecap="round" />
        </>
      )}
      {/* Accent in the person's second hue */}
      <circle cx={x + 58} cy={46} r={10} fill={`var(--topic-${second})`} />
      {/* Head and shoulders */}
      <circle cx={x} cy={88} r={30} fill={mix(color, 40)} />
      <path d={`M${x - 62} 200c0-46 28-74 62-74s62 28 62 74z`} fill={`var(--topic-${color})`} />
      <circle cx={x} cy={88} r={30} {...line} stroke={`var(--topic-${color})`} />
    </svg>
  );
}
