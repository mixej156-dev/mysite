import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { POOL_TONES } from "../dashboard/tones";
import type { NavTone } from "./nav";

/*
 * Grey chip at rest; it takes the link's hue while the link (a `group/link`) is hovered, keyboard-focused,
 * pressed or the current page. Each icon also acts out its meaning: see the [data-menu-icon] rules in globals.css.
 */
const TONES: Record<NavTone, string> = {
  blue: "group-hover/link:tint-topic-blue group-hover/link:text-topic-blue group-focus-visible/link:tint-topic-blue group-focus-visible/link:text-topic-blue group-active/link:tint-topic-blue group-active/link:text-topic-blue group-aria-[current=page]/link:tint-topic-blue group-aria-[current=page]/link:text-topic-blue",
  green:
    "group-hover/link:tint-topic-green group-hover/link:text-topic-green group-focus-visible/link:tint-topic-green group-focus-visible/link:text-topic-green group-active/link:tint-topic-green group-active/link:text-topic-green group-aria-[current=page]/link:tint-topic-green group-aria-[current=page]/link:text-topic-green",
  teal: "group-hover/link:tint-topic-teal group-hover/link:text-topic-teal group-focus-visible/link:tint-topic-teal group-focus-visible/link:text-topic-teal group-active/link:tint-topic-teal group-active/link:text-topic-teal group-aria-[current=page]/link:tint-topic-teal group-aria-[current=page]/link:text-topic-teal",
  orange:
    "group-hover/link:tint-topic-orange group-hover/link:text-topic-orange group-focus-visible/link:tint-topic-orange group-focus-visible/link:text-topic-orange group-active/link:tint-topic-orange group-active/link:text-topic-orange group-aria-[current=page]/link:tint-topic-orange group-aria-[current=page]/link:text-topic-orange",
  amber:
    "group-hover/link:tint-topic-amber group-hover/link:text-topic-amber group-focus-visible/link:tint-topic-amber group-focus-visible/link:text-topic-amber group-active/link:tint-topic-amber group-active/link:text-topic-amber group-aria-[current=page]/link:tint-topic-amber group-aria-[current=page]/link:text-topic-amber",
  violet:
    "group-hover/link:tint-topic-violet group-hover/link:text-topic-violet group-focus-visible/link:tint-topic-violet group-focus-visible/link:text-topic-violet group-active/link:tint-topic-violet group-active/link:text-topic-violet group-aria-[current=page]/link:tint-topic-violet group-aria-[current=page]/link:text-topic-violet",
  rose: "group-hover/link:tint-topic-rose group-hover/link:text-topic-rose group-focus-visible/link:tint-topic-rose group-focus-visible/link:text-topic-rose group-active/link:tint-topic-rose group-active/link:text-topic-rose group-aria-[current=page]/link:tint-topic-rose group-aria-[current=page]/link:text-topic-rose",
};

const LOGO_IN_COLOUR =
  "group-hover/link:opacity-100 group-hover/link:grayscale-0 group-focus-visible/link:opacity-100 group-focus-visible/link:grayscale-0 group-active/link:opacity-100 group-active/link:grayscale-0 group-aria-[current=page]/link:opacity-100 group-aria-[current=page]/link:grayscale-0";

const chip = "grid shrink-0 place-items-center rounded-field transition-colors duration-base";

/** A link's icon in a square chip */
export function MenuIcon({
  icon: Icon,
  tone,
  className = "size-9 bg-surface-2",
}: {
  icon: LucideIcon;
  tone: NavTone;
  className?: string;
}) {
  return (
    <span aria-hidden data-menu-icon className={cn(chip, "text-muted", className, TONES[tone])}>
      <Icon className="size-[1.125rem]" />
    </span>
  );
}

/** A pool's network logo in the same chip: greyed out at rest, in its own colours when active */
export function PoolMenuIcon({ poolId }: { poolId: string }) {
  return (
    <span aria-hidden data-menu-icon className={cn(chip, "size-9 bg-surface-2", TONES[POOL_TONES[poolId] ?? "blue"])}>
      <Image
        src={`/logos/networks/${poolId}.svg`}
        alt=""
        width={20}
        height={20}
        unoptimized
        className={cn("size-5 opacity-60 grayscale transition-[filter,opacity] duration-base", LOGO_IN_COLOUR)}
      />
    </span>
  );
}
