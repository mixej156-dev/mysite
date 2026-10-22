import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NavTone } from "../layout/nav";
import { MenuIcon } from "../layout/MenuIcon";
import { PlayOnView } from "../layout/PlayOnView";

export type Control = { title: string; body: string };
/** Optional icon per row, in order; it acts out its meaning as the row comes into view */
export type ControlIcon = { icon: LucideIcon; tone: NavTone };

/**
 * Numbered rows for an ordered sequence: number, title, explanation. `active` marks one row (a live log beside it):
 * a line beside the rows works as a progress bar — rows before it are full, the active one fills over `stepMs`, the
 * rest wait empty, and on wrapping back to the first row the bars empty out.
 */
export function ControlsList({
  items,
  icons,
  active,
  stepMs = 2400,
}: {
  items: Control[];
  icons?: ControlIcon[];
  active?: number;
  stepMs?: number;
}) {
  return (
    <ol className="border-b border-rule">
      {items.map((item, i) => (
        <li
          key={item.title}
          className={cn(
            "relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 gap-y-2 border-t border-rule py-5 sm:grid-cols-1 sm:gap-3 sm:py-8 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8",
          )}
        >
          {active !== undefined && (
            <span aria-hidden className="absolute inset-y-4 -left-3 w-0.5 overflow-hidden rounded-pill bg-rule">
              <span
                className={cn(
                  "block size-full origin-top bg-accent",
                  i < active && "scale-y-100 transition-transform duration-slow",
                  i > active && "scale-y-0 transition-transform duration-slow",
                  i === active && "animate-fill-y",
                )}
                style={i === active ? { animationDuration: `${stepMs}ms` } : undefined}
              />
            </span>
          )}
          <span
            className={cn(
              "font-mono text-small leading-7 transition-colors duration-slow sm:leading-5",
              active === i ? "text-accent-text" : "text-muted",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="flex items-center gap-3 text-h4 sm:text-h3">
            {icons?.[i] && (
              <PlayOnView>
                <MenuIcon icon={icons[i].icon} tone={icons[i].tone} colored className="size-9 sm:size-10" />
              </PlayOnView>
            )}
            {item.title}
          </h3>
          <p className="col-start-2 max-w-[56ch] text-body text-muted sm:col-start-auto">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}
