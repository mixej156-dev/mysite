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
 * the server and the browser draw the same field; it is laid out for three stage shapes, so desktops, tablets and
 * phones see the same picture, and without hover the field gathers by itself now and then. Decorative only.
 */

type Depth = 0 | 1 | 2;
type Logo = { src: string; tone: Tone };
/** Where an item sits in one stage shape, in % of the field, and its slot on its ring in degrees */
type Spot = { x: number; y: number; a: number };
type Item = {
  depth: Depth;
  logo: Logo;
  /** One spot per stage shape: wide (desktop), square (tablet), tall (phone) */
  spots: [Spot, Spot, Spot];
  /** Drift: offset and timing */
  fx: number;
  fy: number;
  fd: number;
  fdelay: number;
  /** A small per-logo delay, so the gathering ripples instead of moving as one block */
  gatherDelay: number;
};

/* Square chips with the site's icon radius, smaller ones a smaller radius so they keep the same look */
const SIZE: Record<Depth, string> = { 0: "size-12 rounded-field", 1: "size-8 rounded-field", 2: "size-6 rounded-sm" };
const IMG: Record<Depth, string> = { 0: "size-8", 1: "size-5", 2: "size-4" };
const BLUR = [0, 2, 4];
const OPACITY = [1, 0.85, 0.55];
/** How far each depth moves with the pointer and the scroll */
const DRIFT = [1, 0.55, 0.25];
const COUNT = 84;
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

/*
 * The three stage shapes the hero takes, in reference pixels: the field is laid out once per shape so it looks the
 * same everywhere (evenly spread, the headline clear), and CSS picks the shape by the field's aspect ratio. `rx`/`ry`
 * is the clearing around the text, `gap` the spacing between logos.
 */
const STAGES = [
  { w: 1440, h: 832, rx: 440, ry: 220, gap: 96 },
  { w: 768, h: 736, rx: 330, ry: 215, gap: 62 },
  { w: 375, h: 640, rx: 205, ry: 190, gap: 42 },
];

function place(depths: Depth[], stage: (typeof STAGES)[number], seed: number): Spot[] {
  const rand = seeded(seed);
  const { w, h, rx, ry } = stage;
  const pts: { x: number; y: number }[] = [];
  let gap = stage.gap;
  for (const depth of depths) {
    /* Far logos may sit closer in, behind the soft clearing; if the field is full, the spacing gives a little */
    const clear = depth === 2 ? 0.6 : 1;
    for (let misses = 0; ; misses++) {
      if (misses > 400) {
        gap *= 0.95;
        misses = 0;
      }
      const x = w * (0.03 + rand() * 0.94);
      const y = h * (0.04 + rand() * 0.92);
      const dx = (x - w / 2) / (rx * clear);
      const dy = (y - h / 2) / (ry * clear);
      if (dx * dx + dy * dy < 1) continue;
      if (pts.some((o) => (o.x - x) ** 2 + (o.y - y) ** 2 < gap * gap)) continue;
      pts.push({ x, y });
      break;
    }
  }
  const spots = pts.map((o) => ({ x: round((o.x / w) * 100), y: round((o.y / h) * 100), a: 0 }));
  /* Ring slots: each depth is one ring, spaced evenly, in the order the logos already sit around the centre, so
     each one flies to the nearest free slot rather than across the field */
  const angle = (k: number) => Math.atan2(pts[k].y - h / 2, pts[k].x - w / 2);
  for (const depth of [0, 1, 2] as Depth[]) {
    const ring = depths.map((d, k) => (d === depth ? k : -1)).filter((k) => k >= 0);
    ring.sort((a, b) => angle(a) - angle(b));
    const start = ring.length ? (angle(ring[0]) * 180) / Math.PI : 0;
    ring.forEach((k, n) => (spots[k].a = round(start + (n / ring.length) * 360, 1)));
  }
  return spots;
}

function layout(count: number): Item[] {
  const rand = seeded(7);
  const depths = Array.from({ length: count }, (): Depth => {
    const r = rand();
    return r < 0.3 ? 0 : r < 0.62 ? 1 : 2;
  });
  const [wide, square, tall] = STAGES.map((stage, k) => place(depths, stage, 11 + k));
  return depths.map((depth, i) => ({
    depth,
    /* Logos in turn, so all twenty appear before any repeats */
    logo: LOGOS[i % LOGOS.length],
    spots: [wide[i], square[i], tall[i]],
    fx: round((rand() - 0.5) * 12),
    fy: round((rand() - 0.5) * 12),
    fd: round(5 + rand() * 4),
    fdelay: round(-rand() * 8),
    gatherDelay: Math.round(rand() * 120),
  }));
}

const ITEMS = layout(COUNT);

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

    /* Without hover (phones, tablets) nobody can point at the button, so the field gathers into its rings by itself
       now and then, the same as on a desktop */
    let orbit = 0;
    const hero = el.closest<HTMLElement>("[data-logo-hero]");
    if (hero && !window.matchMedia("(hover: hover)").matches) {
      let on = false;
      const toggle = () => {
        on = !on;
        hero.toggleAttribute("data-orbiting", on);
        orbit = window.setTimeout(toggle, on ? 6000 : 4000);
      };
      orbit = window.setTimeout(toggle, 2200);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(orbit);
      hero?.removeAttribute("data-orbiting");
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
        const [wide, square, tall] = item.spots;
        const distance = Math.hypot((wide.x - 50) / 50, (wide.y - 50) / 50);
        return (
          <span
            key={i}
            className="logo-field-item absolute"
            style={
              {
                "--x1": wide.x,
                "--y1": wide.y,
                "--a1": `${wide.a}deg`,
                "--x2": square.x,
                "--y2": square.y,
                "--a2": `${square.a}deg`,
                "--x3": tall.x,
                "--y3": tall.y,
                "--a3": `${tall.a}deg`,
                zIndex: 3 - item.depth,
                "--drift": DRIFT[item.depth],
              } as CSSProperties
            }
          >
            {/* Gather: from its spot to the centre of the field */}
            <span className="logo-field-gather block" style={{ "--gd": `${item.gatherDelay}ms` } as CSSProperties}>
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
                <span className="logo-field-orbit block" style={{ "--ring": item.depth } as CSSProperties}>
                  <span className="logo-field-arm block">
                    <span className="logo-field-upright block">
                      <span
                        className={cn(
                          "logo-field-focus -translate-1/2 grid place-items-center",
                          SIZE[item.depth],
                          TONE_CHIP[item.logo.tone],
                        )}
                        style={
                          {
                            "--blur": `${BLUR[item.depth]}px`,
                            "--o": OPACITY[item.depth],
                            "--appear": `${Math.round(150 + distance * 650 + item.depth * 120)}ms`,
                          } as CSSProperties
                        }
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, decorative */}
                        <img src={item.logo.src} alt="" className={IMG[item.depth]} />
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
