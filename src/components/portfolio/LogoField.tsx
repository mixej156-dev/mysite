"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { pools } from "@/data/pools";
import { cn } from "@/lib/cn";
import { POOL_TONES, TONE_CHIP, type Tone } from "../dashboard/tones";

/*
 * A field of crypto logos at three depths around a centred headline: near ones large and sharp, far ones small,
 * blurred and faint, like a lens focused on the middle. They come into focus from the centre outwards on load,
 * drift gently, and shift with the pointer and the scroll, nearer ones more. Hovering the hero's main button
 * ([data-orbit-trigger]) gathers them into rings around the centre that turn, nearer rings faster (CSS only, see
 * globals.css). Every move is a transform, so the browser can run it on the compositor. The layout is seeded, so
 * the server and the browser draw the same field. Decorative only.
 */

type Depth = 0 | 1 | 2;
type Logo = { src: string; tone: Tone };
type Item = {
  x: number;
  y: number;
  depth: Depth;
  /** A logo, or a plain tinted dot for the far haze */
  logo?: Logo;
  tone: Tone;
  /** Drift: offset and timing */
  fx: number;
  fy: number;
  fd: number;
  fdelay: number;
  /** Phones show fewer, and none behind the text */
  phone: boolean;
  /** Slot on its ring when the field gathers into orbits, in degrees */
  angle: number;
  /** A small per-logo delay, so the gathering ripples instead of moving as one block */
  gatherDelay: number;
};

const SIZE: Record<Depth, string> = { 0: "size-12", 1: "size-8", 2: "size-6" };
const IMG: Record<Depth, string> = { 0: "size-9", 1: "size-6", 2: "size-4" };
const BLUR = [0, 2, 4];
const OPACITY = [1, 0.85, 0.55];
/** How far each depth moves with the pointer and the scroll */
const DRIFT = [1, 0.55, 0.25];

/*
 * Our networks first, then other well-known assets people hold next to them (cryptocurrency-icons, CC0). Only a
 * picture of the wider market: the pools stay the six networks in data/pools.ts.
 */
const LOGOS: Logo[] = [
  ...pools.map((p) => ({ src: `/logos/networks/${p.id}.svg`, tone: POOL_TONES[p.id] ?? "blue" })),
  ...(
    [
      ["btc", "orange"],
      ["usdc", "blue"],
      ["usdt", "green"],
      ["link", "blue"],
      ["matic", "violet"],
      ["xtz", "blue"],
      ["algo", "teal"],
      ["bnb", "amber"],
      ["xrp", "blue"],
      ["ltc", "blue"],
      ["uni", "rose"],
      ["dai", "amber"],
      ["doge", "amber"],
      ["trx", "rose"],
    ] as const
  ).map(([id, tone]) => ({ src: `/logos/coins/${id}.svg`, tone })),
];
const TONES = Object.values(POOL_TONES);

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Rounded: the server's and the browser's maths can differ in the last digit, which would break hydration */
const round = (v: number, digits = 2) => Math.round(v * 10 ** digits) / 10 ** digits;

function layout(count: number): Item[] {
  const rand = seeded(7);
  const items: Item[] = [];
  let logos = 0;
  let tries = 0;
  while (items.length < count && tries++ < 4000) {
    const x = 3 + rand() * 94;
    const y = 4 + rand() * 92;
    /* Keep the headline clear: an ellipse in the middle */
    const dx = (x - 50) / 31;
    const dy = (y - 50) / 25;
    if (dx * dx + dy * dy < 1) continue;
    /* Even spacing, in a roughly square measure (the field is about twice as wide as tall) */
    if (items.some((o) => ((o.x - x) / 2) ** 2 + (o.y - y) ** 2 < 7.5 ** 2)) continue;
    const r = rand();
    const depth: Depth = r < 0.3 ? 0 : r < 0.62 ? 1 : 2;
    const dot = depth === 2 && rand() < 0.45;
    items.push({
      x: round(x),
      y: round(y),
      depth,
      /* Logos in turn, so all twenty appear before any repeats */
      logo: dot ? undefined : LOGOS[logos++ % LOGOS.length],
      tone: TONES[Math.floor(rand() * TONES.length)],
      fx: round((rand() - 0.5) * 12),
      fy: round((rand() - 0.5) * 12),
      fd: round(5 + rand() * 4),
      fdelay: round(-rand() * 8),
      phone: Math.abs(y - 50) > 24,
      angle: 0,
      gatherDelay: Math.round(rand() * 120),
    });
  }
  /* Ring slots: each depth is one ring, spaced evenly, in the order the logos already sit around the centre, so
     each one flies to the nearest free slot rather than across the field */
  for (const depth of [0, 1, 2] as Depth[]) {
    const ring = items
      .filter((o) => o.depth === depth)
      .sort((a, b) => Math.atan2(a.y - 50, (a.x - 50) / 2) - Math.atan2(b.y - 50, (b.x - 50) / 2));
    const first = ring[0];
    const start = first ? (Math.atan2(first.y - 50, (first.x - 50) / 2) * 180) / Math.PI : 0;
    ring.forEach((o, k) => (o.angle = round(start + (k / ring.length) * 360, 1)));
  }
  return items;
}

const ITEMS = layout(58);

export function LogoField({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  /* Pointer and scroll feed custom properties; the browser does the moving. Eased towards the pointer each frame,
     and only while something is still changing. */
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const target = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let frame = 0;

    const step = () => {
      now.x += (target.x - now.x) * 0.12;
      now.y += (target.y - now.y) * 0.12;
      el.style.setProperty("--mx", now.x.toFixed(4));
      el.style.setProperty("--my", now.y.toFixed(4));
      el.style.setProperty("--sy", String(Math.min(window.scrollY, 1200)));
      frame = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", kick, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", kick);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-no-reveal
      className={cn("logo-field pointer-events-none absolute inset-0", className)}
    >
      {ITEMS.map((item, i) => {
        const distance = Math.hypot((item.x - 50) / 50, (item.y - 50) / 50);
        return (
          <span
            key={i}
            className={cn("logo-field-item absolute", !item.phone && "max-sm:hidden")}
            style={
              {
                left: `${item.x}%`,
                top: `${item.y}%`,
                zIndex: 3 - item.depth,
                "--drift": DRIFT[item.depth],
              } as CSSProperties
            }
          >
            {/* Gather: from its spot to the centre of the field */}
            <span
              className="logo-field-gather block"
              style={
                {
                  "--gx": round(50 - item.x),
                  "--gy": round(50 - item.y),
                  "--gd": `${item.gatherDelay}ms`,
                } as CSSProperties
              }
            >
              <span
                className="logo-field-float block"
                style={
                  {
                    "--fx": `${item.fx}px`,
                    "--fy": `${item.fy}px`,
                    "--fd": `${item.fd}s`,
                    "--fdelay": `${item.fdelay}s`,
                  } as CSSProperties
                }
              >
                {/* Orbit: turn to the slot, reach out to the ring, turn back so the logo stays upright */}
                <span
                  className="logo-field-orbit block"
                  style={{ "--a": `${item.angle}deg`, "--ring": item.depth } as CSSProperties}
                >
                  <span className="logo-field-arm block">
                    <span className="logo-field-upright block">
                      <span
                        className={cn(
                          "logo-field-focus -translate-1/2 grid place-items-center rounded-pill",
                          SIZE[item.depth],
                          TONE_CHIP[item.logo?.tone ?? item.tone],
                        )}
                        style={
                          {
                            "--blur": `${BLUR[item.depth]}px`,
                            "--o": OPACITY[item.depth],
                            "--appear": `${Math.round(150 + distance * 650 + item.depth * 120)}ms`,
                          } as CSSProperties
                        }
                      >
                        {item.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, decorative
                          <img src={item.logo.src} alt="" className={IMG[item.depth]} />
                        ) : (
                          <span className="size-2 rounded-pill bg-current opacity-60" />
                        )}
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
