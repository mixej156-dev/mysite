import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Accent hues from the site's decorative palette (--topic-*). In the dashboard they mark kinds of things — a
 * transaction type, a notification category, a network — always next to a text label, never as text colour or
 * as a status (success / warning / danger keep that job).
 */
export type Tone = "blue" | "green" | "teal" | "orange" | "amber" | "violet" | "rose";

export const TONE_CHIP: Record<Tone, string> = {
  blue: "tint-topic-blue text-topic-blue",
  green: "tint-topic-green text-topic-green",
  teal: "tint-topic-teal text-topic-teal",
  orange: "tint-topic-orange text-topic-orange",
  amber: "tint-topic-amber text-topic-amber",
  violet: "tint-topic-violet text-topic-violet",
  rose: "tint-topic-rose text-topic-rose",
};

export const TONE_FILL: Record<Tone, string> = {
  blue: "bg-topic-blue",
  green: "bg-topic-green",
  teal: "bg-topic-teal",
  orange: "bg-topic-orange",
  amber: "bg-topic-amber",
  violet: "bg-topic-violet",
  rose: "bg-topic-rose",
};

/** One hue per network, close to its logo, in a fixed order so a network keeps its colour on every page */
export const POOL_TONES: Record<string, Tone> = {
  eth: "blue",
  sol: "teal",
  atom: "violet",
  dot: "rose",
  avax: "orange",
  ada: "amber",
};

export const poolTone = (poolId: string): Tone => POOL_TONES[poolId] ?? "blue";

/** Round tinted badge holding an icon. Decorative: the label beside it carries the meaning. */
export function IconChip({
  icon: Icon,
  tone,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone: Tone;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-pill",
        size === "sm" ? "size-7" : "size-9",
        TONE_CHIP[tone],
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4"} />
    </span>
  );
}
