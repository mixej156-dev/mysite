import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NavTone } from "../layout/nav";
import { MenuIcon } from "../layout/MenuIcon";
import { PlayOnView } from "../layout/PlayOnView";

export type Step = { title: string; body: string };
/** Optional icon per step, in order: it replaces the dot on the rule and plays as the step comes into view */
export type StepIcon = { icon: LucideIcon; tone: NavTone };

const COLUMNS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/** Numbered sequence. A rule with step markers runs across on desktop and down the side on mobile. */
export function StepsFlow({ steps, icons, className }: { steps: Step[]; icons?: StepIcon[]; className?: string }) {
  return (
    <ol className={cn("grid gap-0 lg:gap-8", COLUMNS[steps.length] ?? "lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative flex gap-5 pb-7 last:pb-0 sm:gap-6 sm:pb-12 lg:flex-col lg:gap-0 lg:pb-0"
        >
          {/* Connector: vertical on mobile, horizontal on desktop; it runs through the middle of the marker */}
          <span
            aria-hidden
            className={cn(
              "absolute bottom-0 w-px bg-rule lg:right-[-2rem] lg:bottom-auto lg:h-px lg:w-auto",
              icons ? "top-5 left-5 lg:top-5 lg:left-10" : "top-3 left-[0.6875rem] lg:top-[0.6875rem] lg:left-6",
              i === steps.length - 1 && "hidden",
            )}
          />
          {icons?.[i] ? (
            <PlayOnView className="relative z-10 rounded-field bg-bg">
              <MenuIcon icon={icons[i].icon} tone={icons[i].tone} colored className="size-10" />
            </PlayOnView>
          ) : (
            <span
              aria-hidden
              className="relative z-10 grid size-6 shrink-0 place-items-center rounded-pill border border-rule-strong bg-bg"
            >
              <span className="size-2 rounded-pill bg-accent" />
            </span>
          )}
          <div className={icons ? "lg:mt-6" : "lg:mt-8"}>
            <p className="font-mono text-caption text-muted">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-h4 sm:mt-2 sm:text-h3">{step.title}</h3>
            <p className="mt-2 max-w-[34ch] text-body text-muted sm:mt-3">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
