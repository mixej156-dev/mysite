import type { Office } from "@/data/contact";

/* Equirectangular crop around the offices (30°W–125°E, 68°N–15°S), so the pins don't bunch together */
const WEST = -30;
const EAST = 125;
const NORTH = 68;
const SOUTH = -15;
const W = EAST - WEST;
const H = NORTH - SOUTH;
const STEP = 3.5;

const toX = (lon: number) => lon - WEST;
const toY = (lat: number) => NORTH - lat;

/**
 * Abstract map: a dot grid with each office pinned at its real coordinates and arcs between them.
 * Decorative; the list beside it carries the same information. Labels are HTML so they stay legible at any width.
 */
export function OfficesMap({ offices }: { offices: Office[] }) {
  const pins = offices.map((o) => ({ ...o, x: toX(o.lon), y: toY(o.lat) }));
  const cx = W / 2;
  const cy = H / 2;

  return (
    <div aria-hidden className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full">
        {Array.from({ length: Math.floor(H / STEP) + 1 }, (_, r) =>
          Array.from({ length: Math.floor(W / STEP) + 1 }, (_, c) => {
            const x = c * STEP;
            const y = r * STEP;
            /* Fade towards the edges so the grid reads as a globe-like field, not a table */
            const d = Math.hypot((x - cx) / cx, (y - cy) / cy);
            return (
              <circle
                key={`${r}-${c}`}
                cx={x}
                cy={y}
                r={0.55}
                fill="var(--muted)"
                opacity={Math.max(0.12, 0.7 - d * 0.55)}
              />
            );
          }),
        )}
        {pins.slice(1).map((p, i) => {
          const a = pins[i];
          const mx = (a.x + p.x) / 2;
          const my = Math.min(a.y, p.y) - Math.abs(p.x - a.x) * 0.25;
          return (
            <path
              key={p.city}
              d={`M${a.x} ${a.y} Q${mx} ${my} ${p.x} ${p.y}`}
              fill="none"
              stroke="var(--accent-text)"
              strokeWidth={0.6}
              strokeDasharray="1.5 2"
              opacity={0.7}
            />
          );
        })}
        {pins.map((p) => (
          <g key={p.city}>
            <circle cx={p.x} cy={p.y} r={4} fill="var(--accent)" opacity={0.2} />
            <circle cx={p.x} cy={p.y} r={1.8} fill="var(--accent)" stroke="var(--bg)" strokeWidth={0.6} />
          </g>
        ))}
      </svg>
      {pins.map((p) => (
        <span
          key={p.city}
          className="absolute rounded-sm bg-bg px-1.5 py-0.5 font-display text-caption font-medium whitespace-nowrap text-text"
          style={{
            left: `${(p.x / W) * 100}%`,
            top: `${(p.y / H) * 100}%`,
            /* Labels sit below the pin, except where a neighbour to the south-west would collide */
            transform: `translate(-50%, ${p.labelAbove ? "calc(-100% - 0.5rem)" : "0.5rem"})`,
          }}
        >
          {p.city}
        </span>
      ))}
    </div>
  );
}
