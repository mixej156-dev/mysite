"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { pools } from "@/data/pools";
import { cn } from "@/lib/cn";
import { POOL_TONES, TONE_CHIP, type Tone } from "../dashboard/tones";

/*
 * A field of crypto logos at three depths around a centred headline: near ones large and sharp, far ones small,
 * blurred and faint, like a lens focused on the middle. They come into focus from the centre outwards on load,
 * drift gently, and shift with the pointer and the scroll, nearer ones more (each depth is one layer that moves). Hovering the hero's main button
 * ([data-orbit-trigger]) gathers them into rings around the centre that turn, nearer rings faster (see also
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
const MAX_GATHER_DELAY = 120;
/** Far layer first, so nearer ones paint over it */
const DEPTHS_ORDER: Depth[] = [2, 1, 0];
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
    gatherDelay: Math.round(rand() * MAX_GATHER_DELAY),
  }));
}

const ITEMS = layout(COUNT);
/* In the order the field renders them: by depth, far first */
const ITEMS_BY_NODE = DEPTHS_ORDER.flatMap((depth) => ITEMS.filter((item) => item.depth === depth));

export function LogoField({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  /* The pointer moves three depth layers, not every logo. While the logos orbit the parallax eases to rest, so the
     rings stay centred. The scroll parallax is a scroll-driven CSS animation where the browser has them; elsewhere
     the pointer glide does it too. */
  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest<HTMLElement>("[data-logo-hero]");
    if (!el || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    const drift = layers.map((l) => DRIFT[Number(l.dataset.depth)]);
    const scrollInCss = CSS.supports("animation-timeline: scroll()");
    const fine = window.matchMedia("(pointer: fine)").matches;
    const pointer = { x: 0, y: 0 };
    const ease = getComputedStyle(document.documentElement).getPropertyValue("--ds-ease-brand").trim() || "ease-out";
    const glides: (Animation | undefined)[] = [];
    let orbiting = false;
    let timer = 0;
    let sent = 0;

    /* Each aim glides the layers from where they are to where the pointer says, as one compositor animation; a new
       aim takes over mid-glide. A few aims a second read as following the pointer, and the page does no work in
       between (setting a style every frame made the browser recheck every logo's animation, every frame). */
    const aim = () => {
      timer = 0;
      sent = performance.now();
      const tx = orbiting ? 0 : pointer.x;
      const ty = orbiting ? 0 : pointer.y;
      const sy = scrollInCss ? 0 : Math.min(window.scrollY, 1200);
      layers.forEach((layer, i) => {
        /* Where the layer is now, mid-glide or not, in the same form as the target, so the two interpolate simply */
        const from = new DOMMatrix(getComputedStyle(layer).transform);
        const x = tx * drift[i] * -80;
        const y = (ty * -56 - sy * 0.3) * drift[i];
        const glide = layer.animate(
          [
            { transform: `translate3d(${from.m41.toFixed(1)}px, ${from.m42.toFixed(1)}px, 0)` },
            { transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)` },
          ],
          { duration: 700, easing: ease, fill: "forwards" },
        );
        glides[i]?.cancel();
        glides[i] = glide;
      });
    };
    const kick = () => {
      if (!timer) timer = window.setTimeout(aim, Math.max(0, 90 - (performance.now() - sent)));
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    if (!scrollInCss) window.addEventListener("scroll", kick, { passive: true });

    /* The gathering: each logo flies to the centre and out to its ring, and back. Web Animations rather than CSS
       transitions, which fire start and end events for every logo and kept the main thread busy all through the
       move. A new move starts from wherever the last one got to. The rings' turning is CSS ([data-orbiting]). A
       resize while gathered keeps the old rings until the next move; fine for a hover. */
    const inOut =
      getComputedStyle(document.documentElement).getPropertyValue("--ds-ease-in-out").trim() || "ease-in-out";
    const gathers = Array.from(el.querySelectorAll<HTMLElement>(".logo-field-gather"));
    const arms = Array.from(el.querySelectorAll<HTMLElement>(".logo-field-orbit"));
    let moves: Animation[] = [];
    /* Ring radii by stage shape (the same thresholds as the container queries in globals.css), in pixels: plain
       numbers keep the moves on the compositor, where var() and container units would not */
    const rings = (w: number, h: number) => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (w / h < 0.8) return [0.46 * w, 0.09 * w]; // tall: the text fills a phone's width, so wider than the screen
      if (w / h < 1.35) return [0.34 * w, 0.06 * w];
      return [Math.min(22 * rem, 0.4 * w), 3.5 * rem];
    };
    const setOrbiting = (on: boolean) => {
      if (on === orbiting) return;
      orbiting = on;
      hero.toggleAttribute("data-orbiting", on);
      kick();
      const { width: w, height: h } = el.getBoundingClientRect();
      const [r0, rs] = rings(w, h);
      const at = gathers.map((g) => {
        const [x = 0, y = 0] = getComputedStyle(g)
          .translate.split(" ")
          .map((v) => parseFloat(v) || 0);
        return { x, y };
      });
      const reach = arms.map((o) => new DOMMatrix(getComputedStyle(o).transform).m41);
      const spots = gathers.map((g) => {
        const item = getComputedStyle(g.parentElement!);
        return { x: parseFloat(item.getPropertyValue("--x")), y: parseFloat(item.getPropertyValue("--y")) };
      });
      moves.forEach((m) => m.cancel());
      /* All moves start and end together (each start or end of its own would wake the main thread); the ripple
         is a hold at the start of each logo's keyframes instead of a delay */
      const total = 750 + MAX_GATHER_DELAY;
      moves = gathers.flatMap((g, i) => {
        const hold = ITEMS_BY_NODE[i].gatherDelay / total;
        const gx = on ? ((50 - spots[i].x) / 100) * w : 0;
        const gy = on ? ((50 - spots[i].y) / 100) * h : 0;
        const r = on ? r0 + ITEMS_BY_NODE[i].depth * rs : 0;
        const path = (from: string, to: string, property: "translate" | "transform") => [
          { [property]: from },
          { [property]: from, offset: hold, easing: inOut },
          { [property]: to },
        ];
        const timing: KeyframeAnimationOptions = { duration: total, fill: "both" };
        return [
          g.animate(
            path(
              `${at[i].x.toFixed(1)}px ${at[i].y.toFixed(1)}px`,
              `${gx.toFixed(1)}px ${gy.toFixed(1)}px`,
              "translate",
            ),
            timing,
          ),
          arms[i].animate(
            path(`translateX(${reach[i].toFixed(1)}px)`, `translateX(${r.toFixed(1)}px)`, "transform"),
            timing,
          ),
        ];
      });
    };
    const trigger = hero.querySelector<HTMLElement>("[data-orbit-trigger]");
    const onTrigger = () => setOrbiting(!!trigger?.matches(":hover, :focus-visible"));
    const triggerEvents = ["pointerenter", "pointerleave", "focus", "blur"] as const;
    triggerEvents.forEach((type) => trigger?.addEventListener(type, onTrigger));

    /* Without hover (phones, tablets) nobody can point at the button, so the field gathers into its rings by itself
       now and then, the same as on a desktop */
    let orbit = 0;
    if (!window.matchMedia("(hover: hover)").matches) {
      const toggle = () => {
        setOrbiting(!orbiting);
        orbit = window.setTimeout(toggle, orbiting ? 6000 : 4000);
      };
      orbit = window.setTimeout(toggle, 2200);
    }

    /* The idle drift, as Web Animations too: as CSS animations, each on its own rhythm, they kept pulling the main
       thread in (their iteration events), which made the field stutter. Off screen, they pause. */
    const drifts = Array.from(el.querySelectorAll<HTMLElement>(".logo-field-gather")).map((g) => {
      const v = (name: string) => g.style.getPropertyValue(name);
      return g.animate([{ transform: "none" }, { transform: `translate(${v("--fx")}, ${v("--fy")})` }], {
        duration: parseFloat(v("--fd")) * 1000,
        delay: parseFloat(v("--fdelay")) * 1000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      });
    });
    const seen = new IntersectionObserver(([entry]) =>
      drifts.forEach((d) => (entry.isIntersecting ? d.play() : d.pause())),
    );
    seen.observe(el);

    return () => {
      window.clearTimeout(timer);
      glides.forEach((g) => g?.cancel());
      window.clearTimeout(orbit);
      seen.disconnect();
      drifts.forEach((d) => d.cancel());
      moves.forEach((m) => m.cancel());
      triggerEvents.forEach((type) => trigger?.removeEventListener(type, onTrigger));
      hero.removeAttribute("data-orbiting");
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
      {DEPTHS_ORDER.map((depth) => (
        <div
          key={depth}
          data-depth={depth}
          className="logo-field-depth absolute inset-0"
          style={{ zIndex: 3 - depth, "--drift": DRIFT[depth] } as CSSProperties}
        >
          <div className="logo-field-scroll absolute inset-0">
            {ITEMS.map((item, i) => {
              if (item.depth !== depth) return null;
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
                      "--ring": depth,
                    } as CSSProperties
                  }
                >
                  {/* Gather to the centre (translate) while drifting (transform) */}
                  <span
                    className="logo-field-gather block"
                    style={
                      {
                        "--fx": `${item.fx}px`,
                        "--fy": `${item.fy}px`,
                        "--fd": `${item.fd}s`,
                        "--fdelay": `${item.fdelay}s`,
                      } as CSSProperties
                    }
                  >
                    {/* Turn to the ring slot (rotate), reach out to the ring (transform) */}
                    <span className="logo-field-orbit block">
                      {/* Turn back so the logo stays upright; the depth look and the load-in */}
                      <span
                        className={cn(
                          "logo-field-chip -translate-1/2 grid place-items-center",
                          SIZE[depth],
                          TONE_CHIP[item.logo.tone],
                        )}
                        style={
                          {
                            "--blur": `${BLUR[depth]}px`,
                            "--o": OPACITY[depth],
                            "--appear": `${Math.round(150 + distance * 650 + depth * 120)}ms`,
                          } as CSSProperties
                        }
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, decorative */}
                        <img src={item.logo.src} alt="" className={IMG[depth]} />
                      </span>
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
