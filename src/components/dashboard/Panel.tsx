import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconChip, type Tone } from "./tones";

/** Titled surface for dashboard sections; an optional tinted icon marks what the panel is about. */
export function Panel({
  title,
  icon,
  tone = "blue",
  action,
  children,
  className,
  tour,
}: {
  title: string;
  icon?: LucideIcon;
  tone?: Tone;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Stop in the first-visit tour (DashboardTour) */
  tour?: string;
}) {
  const id = `panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section
      aria-labelledby={id}
      data-enter
      data-tour={tour}
      className={cn("min-w-0 rounded-card border border-rule bg-surface p-4 sm:p-5 md:p-6", className)}
    >
      <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
        <h2 id={id} className="flex items-center gap-2.5 text-body font-medium">
          {icon && <IconChip icon={icon} tone={tone} size="sm" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
