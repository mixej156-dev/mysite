import { cn } from "@/lib/cn";

const W = 100;
const H = 32;
/* Room for the stroke at the top and bottom edges */
const PAD = 2;

/** Trailing moving average over `window` points, so day-to-day noise doesn't read as a jagged line at this size */
function smooth(values: number[], window: number) {
  if (window <= 1) return values;
  return values.map((_, i) => {
    const from = Math.max(0, i - window + 1);
    const slice = values.slice(from, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

/**
 * A small line chart with no axes: the shape of a series at a glance. Pure SVG, rendered on the server. The chart
 * opens left to right once on load and the last point lands as a dot (CSS .sparkline-* in globals.css); static with
 * reduced motion. Decorative: give the figures in text next to it. Size it with `className` (it fills the box).
 * `smoothing` is the moving-average window in points (1 draws the raw series).
 */
export function Sparkline({
  values: raw,
  smoothing = 1,
  className,
}: {
  values: number[];
  smoothing?: number;
  className?: string;
}) {
  const values = smooth(raw, smoothing);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((v, i) => [(i / (values.length - 1)) * W, PAD + (1 - (v - min) / span) * (H - PAD * 2)]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const [endX, endY] = points[points.length - 1];

  return (
    <div aria-hidden className={cn("relative text-accent", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="sparkline-chart absolute inset-0 size-full overflow-visible"
      >
        <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="currentColor" opacity={0.08} />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The end dot is HTML so it stays round: the SVG stretches to the box */}
      <span
        className="sparkline-dot absolute size-2 -translate-1/2 rounded-pill bg-accent ring-2 ring-surface"
        style={{ left: `${(endX / W) * 100}%`, top: `${(endY / H) * 100}%` }}
      />
    </div>
  );
}
