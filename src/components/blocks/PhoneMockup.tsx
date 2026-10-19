import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* Body is 78 × 163.4 mm and 8.75 mm thick: the edge is drawn as stacked copies of the outline behind the glass */
const LAYERS = 16;
const LAYER_GAP = "calc(var(--pw) * 0.0072)";
/* Left side, top to bottom: Action button, volume up, volume down (fractions of the body height) */
const SIDE_BUTTONS = [
  { top: 0.2, height: 0.05 },
  { top: 0.285, height: 0.085 },
  { top: 0.39, height: 0.085 },
];

function StatusIcons() {
  return (
    <span aria-hidden className="flex items-center gap-[0.35em]">
      <svg viewBox="0 0 18 12" className="h-[0.75em] w-auto" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="0.8" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
        <rect x="10" y="3" width="3" height="9" rx="0.8" />
        <rect x="15" y="0" width="3" height="12" rx="0.8" />
      </svg>
      <svg viewBox="0 0 16 12" className="h-[0.75em] w-auto" fill="currentColor">
        <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .5 10.6 10.6 0 0 0 .7 3.4L2 4.8a8.6 8.6 0 0 1 6-2.4Z" />
        <path d="M8 6c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6Z" />
        <path d="M8 9.6c.5 0 .9.2 1.2.5L8 11.5l-1.2-1.4c.3-.3.7-.5 1.2-.5Z" />
      </svg>
      <svg viewBox="0 0 27 12" className="h-[0.8em] w-auto" fill="none">
        <rect x="0.5" y="0.5" width="23" height="11" rx="3.2" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
        <path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4Z" fill="currentColor" opacity="0.5" />
      </svg>
    </span>
  );
}

/**
 * iPhone 17 Pro Max in 3D, leaning back and turned towards the right, with `children` (a 440 × 860 pt screenshot)
 * on the screen between a status bar and the home indicator. Width comes from `--pw` on the parent or className.
 */
export function PhoneMockup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-(--pw) [perspective:1800px]", className)}>
      {/* Soft contact shadow, offset away from the light (top left) */}
      <span
        aria-hidden
        className="absolute bottom-[-4%] left-[18%] h-[9%] w-[80%] rounded-pill bg-text opacity-20 blur-2xl"
      />
      <div
        className="relative [transform-style:preserve-3d]"
        style={{ transform: "rotateY(22deg) rotateX(12deg) rotateZ(-3deg)" }}
      >
        {/* Edge: copies of the outline stepping back; the first ones catch the light */}
        {Array.from({ length: LAYERS }, (_, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-[calc(var(--pw)*0.2)]"
            style={
              {
                transform: `translateZ(calc(${LAYER_GAP} * -${i + 1}))`,
                background:
                  i < 2
                    ? "var(--device-frame-light)"
                    : `linear-gradient(90deg, var(--device-frame-dark), var(--device-frame) 18%, var(--device-frame) 82%, var(--device-frame-dark))`,
              } as CSSProperties
            }
          >
            {i > 3 &&
              i < LAYERS - 3 &&
              SIDE_BUTTONS.map((b) => (
                <span
                  key={b.top}
                  className="absolute left-[-0.9%] w-[1.8%] rounded-l-sm"
                  style={{
                    top: `${b.top * 100}%`,
                    height: `${b.height * 100}%`,
                    background: "linear-gradient(90deg, var(--device-frame-light), var(--device-frame))",
                  }}
                />
              ))}
          </div>
        ))}

        {/* Front: aluminium rim, black glass border, screen */}
        <div
          className="relative aspect-[78/163.4] rounded-[calc(var(--pw)*0.2)] p-[1.1%]"
          style={{
            background:
              "linear-gradient(140deg, var(--device-frame-light), var(--device-frame) 45%, var(--device-frame-dark))",
          }}
        >
          <div className="h-full rounded-[calc(var(--pw)*0.19)] p-[3.4%]" style={{ background: "var(--device-bezel)" }}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--pw)*0.155)] bg-bg text-text">
              {/* Status bar: 62 of 956 pt */}
              <div className="flex h-[6.5%] shrink-0 items-center justify-between px-[9%] pt-[1.5%] text-[calc(var(--pw)*0.043)] font-semibold">
                <span>9:41</span>
                <StatusIcons />
              </div>
              <div className="min-h-0 flex-1">{children}</div>
              {/* Home indicator area: 34 of 956 pt */}
              <div className="relative h-[3.55%] shrink-0 bg-bg">
                <span className="absolute bottom-[30%] left-1/2 h-[calc(var(--pw)*0.013)] w-[35%] -translate-x-1/2 rounded-pill bg-text" />
              </div>
              {/* Dynamic Island */}
              <span
                aria-hidden
                className="absolute top-[1.25%] left-1/2 h-[3.7%] w-[30%] -translate-x-1/2 rounded-pill"
                style={{ background: "var(--device-bezel)" }}
              />
              {/* Glass reflection */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.22)_0%,rgb(255_255_255/0)_38%)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
