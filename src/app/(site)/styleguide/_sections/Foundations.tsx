"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/design-system";
import { duration, ease } from "@/design-system/motion";
import { cn } from "@/lib/cn";
import { Example, Section } from "../_components/Section";
import { Preview } from "../_components/Preview";

const COLOR_GROUPS = [
  { label: "Surfaces", tokens: ["bg", "surface", "surface-2", "rule", "rule-strong"] },
  { label: "Text", tokens: ["text", "muted", "accent-text"] },
  { label: "Accent & status", tokens: ["accent", "accent-hover", "success", "warning", "danger"] },
  {
    label: "Topic palette (cover art only, never text or UI state)",
    tokens: ["topic-blue", "topic-green", "topic-teal", "topic-orange", "topic-amber", "topic-violet", "topic-rose"],
  },
  { label: "Window controls (screenshot frames only)", tokens: ["chrome-close", "chrome-minimize", "chrome-zoom"] },
] as const;

function toHex(rgb: string): string {
  const parts = rgb.match(/\d+(\.\d+)?/g);
  if (!parts) return rgb;
  return (
    "#" +
    parts
      .slice(0, 3)
      .map((n) => Math.round(Number(n)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** Shows the token's resolved value in the current theme scope. */
function Swatch({ token }: { token: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState("");

  useEffect(() => {
    if (ref.current) setHex(toHex(getComputedStyle(ref.current).backgroundColor));
  }, []);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        ref={ref}
        className="size-10 shrink-0 rounded-field border border-rule"
        style={{ backgroundColor: `var(--${token})` }}
      />
      <div className="min-w-0">
        <p className="truncate text-small font-medium">{token}</p>
        <p className="font-mono text-caption text-muted">{hex || " "}</p>
      </div>
    </div>
  );
}

export function ColorSection() {
  return (
    <Section
      id="colors"
      description="One accent, used for actions, focus and the active line of a chart. Everything else is ink, paper and rules. Status colours appear only where a state needs naming. The topic palette colours generated cover art in ECO. LEARN and the home news, nothing else."
    >
      <Preview>
        {() =>
          COLOR_GROUPS.map((group) => (
            <Example key={group.label} label={group.label}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.tokens.map((token) => (
                  <Swatch key={token} token={token} />
                ))}
              </div>
            </Example>
          ))
        }
      </Preview>
    </Section>
  );
}

const TYPE_SCALE = [
  { name: "display", className: "text-display font-semibold", sample: "Staking, kept to account." },
  { name: "h1", className: "text-h1 font-semibold", sample: "Rewards you can reconcile" },
  { name: "h2", className: "text-h2 font-semibold", sample: "How a stake earns" },
  { name: "h3", className: "text-h3 font-semibold", sample: "Ethereum validator pool" },
  { name: "h4", className: "text-h4 font-medium", sample: "Withdrawal window" },
  {
    name: "lead, serif",
    className: "font-serif text-lead",
    sample: "Every reward is recorded per epoch, so the number in your dashboard matches the chain.",
  },
  {
    name: "body, serif",
    className: "font-serif text-body max-w-[68ch]",
    sample:
      "Staked assets stay delegated to validators operated under published uptime targets. Rewards accrue each epoch and are paid out daily, minus the platform fee shown on every pool.",
  },
  { name: "small", className: "text-small", sample: "Minimum stake 0.1 ETH, unbonding in 2–5 days" },
  { name: "caption", className: "text-caption text-muted", sample: "Updated 2 minutes ago" },
  { name: "mono", className: "font-mono text-h4", sample: "4.12% APY   $1,284,560.08   0x7a3f…c91e" },
] as const;

export function TypographySection() {
  return (
    <Section
      id="typography"
      description="Schibsted Grotesk sets headings and interface. Source Serif 4 carries reading text, the way a fund report does. IBM Plex Mono is reserved for figures, addresses and hashes, always with tabular digits."
    >
      <div className="flex flex-col divide-y divide-rule rounded-card border border-rule">
        {TYPE_SCALE.map((row) => (
          <div key={row.name} className="grid gap-2 p-5 sm:grid-cols-[8rem_1fr] sm:gap-6 sm:p-6">
            <p className="pt-1 font-mono text-caption text-muted">{row.name}</p>
            <p className={cn("min-w-0 break-words", row.className)}>{row.sample}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96];
const RADII = [
  { name: "sm 6px", className: "rounded-sm" },
  { name: "field 10px", className: "rounded-field" },
  { name: "card 16px", className: "rounded-card" },
  { name: "pill", className: "rounded-pill" },
];

export function SpaceSection() {
  return (
    <Section
      id="space"
      description="A 4/8 spacing scale. Three radii plus pill, applied by role rather than taste. Depth comes from changing surface; shadows are kept for things that float above the page."
    >
      <Example label="Spacing (px)">
        <div className="flex flex-col gap-2">
          {SPACING.map((px) => (
            <div key={px} className="flex items-center gap-4">
              <span className="w-8 text-right font-mono text-caption text-muted">{px}</span>
              <div className="h-3 rounded-sm bg-accent" style={{ width: `${px / 4}rem` }} />
            </div>
          ))}
        </div>
      </Example>
      <Example label="Radius">
        <div className="flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div className={cn("h-16 w-24 border border-rule-strong bg-surface-2", r.className)} />
              <span className="font-mono text-caption text-muted">{r.name}</span>
            </div>
          ))}
        </div>
      </Example>
      <Preview>
        {() => (
          <Example label="Shadows: float and overlay">
            <div className="flex flex-wrap gap-6 py-2">
              <div className="grid h-20 w-36 place-items-center rounded-card border border-rule bg-surface text-small text-muted shadow-float">
                float
              </div>
              <div className="grid h-20 w-36 place-items-center rounded-card border border-rule bg-surface text-small text-muted shadow-overlay">
                overlay
              </div>
            </div>
          </Example>
        )}
      </Preview>
    </Section>
  );
}

const DURATIONS = [
  { name: "fast 160ms", value: duration.fast, use: "hover, colour, small toggles" },
  { name: "base 280ms", value: duration.base, use: "modals, panels, accordions" },
  { name: "slow 480ms", value: duration.slow, use: "charts, counters, page reveals" },
];

export function MotionSection() {
  const [run, setRun] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="motion"
      description="One easing curve, cubic-bezier(0.22, 1, 0.36, 1): quick to respond, soft to settle. Motion answers an action; with reduced motion enabled, movement becomes a plain fade."
    >
      <div className="flex flex-col gap-5 rounded-card border border-rule p-5 sm:p-6">
        {DURATIONS.map((d) => (
          <div key={d.name} className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-6">
            <div>
              <p className="font-mono text-caption">{d.name}</p>
              <p className="text-caption text-muted">{d.use}</p>
            </div>
            <div className="relative h-8 rounded-pill bg-surface-2">
              <motion.div
                key={run}
                className="absolute top-1 left-1 size-6 rounded-pill bg-accent"
                // Same initial on server and client; reduced motion only changes the duration
                initial={{ left: "0.25rem" }}
                animate={{ left: "calc(100% - 1.75rem)" }}
                transition={{ duration: run === 0 || reduceMotion ? 0 : d.value, ease }}
              />
            </div>
          </div>
        ))}
        <div>
          <Button variant="secondary" size="sm" onClick={() => setRun((r) => r + 1)}>
            Replay
          </Button>
        </div>
      </div>
    </Section>
  );
}
