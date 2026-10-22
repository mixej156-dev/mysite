"use client";

import { useReducedMotion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { useInViewOnce } from "../blocks/useInViewOnce";
import type { DayStatus, UptimeDay } from "@/data/validators";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

export const STATUS_META: Record<DayStatus, { label: string; className: string }> = {
  operational: { label: "Operational", className: "bg-success" },
  degraded: { label: "Degraded", className: "bg-warning" },
  outage: { label: "Outage", className: "bg-danger" },
};

/** Legend for the strips: colour plus a word, so status never relies on colour alone. */
export function StatusLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-1 text-caption text-muted", className)}>
      {(Object.keys(STATUS_META) as DayStatus[]).map((s) => (
        <li key={s} className="flex items-center gap-1.5">
          <span aria-hidden className={cn("size-2.5 rounded-sm", STATUS_META[s].className)} />
          {STATUS_META[s].label}
        </li>
      ))}
    </ul>
  );
}

/**
 * One cell per day, oldest on the left. Hovering a cell shows its date and uptime in the line above.
 * Phones show the last 30 days so cells stay wide enough to read and hit.
 */
export function UptimeStrip({ days, label }: { days: UptimeDay[]; label: string }) {
  const [active, setActive] = useState<number | null>(null);
  /* Below the fold the days fill in left to right once the strip scrolls into view; on screen at load, as they are */
  const reduceMotion = useReducedMotion();
  const { ref, inView, startedVisible } = useInViewOnce<HTMLDivElement>("0px 0px -10% 0px");
  const armed = startedVisible === false && !reduceMotion;
  const day = active === null ? null : days[active];
  const nonOperational = days.filter((d) => d.status !== "operational").length;
  const average = days.reduce((sum, d) => sum + d.uptime, 0) / days.length;

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="flex items-baseline justify-between gap-4 text-caption text-muted">
        <span aria-hidden className="font-mono">
          {day ? (
            `${formatDate(day.date)}: ${day.uptime.toFixed(2)}%, ${STATUS_META[day.status].label.toLowerCase()}`
          ) : (
            <>
              <span className="sm:hidden">Last 30 days</span>
              <span className="max-sm:hidden">Last {days.length} days</span>
            </>
          )}
        </span>
        <span className="sr-only">
          {label}: {average.toFixed(2)}% average uptime over {days.length} days,{" "}
          {nonOperational === 0
            ? "no degraded days"
            : `${nonOperational} degraded ${nonOperational === 1 ? "day" : "days"}`}
          .
        </span>
      </figcaption>
      <div
        ref={ref}
        aria-hidden
        data-filling={armed ? (inView ? "run" : "wait") : undefined}
        className="flex h-8 gap-0.5"
        onMouseLeave={() => setActive(null)}
        /* --o: days hidden on phones, so the wave there starts at the first visible day */
        style={{ "--o": days.length - 30 } as CSSProperties}
      >
        {days.map((d, i) => (
          <span
            key={d.date}
            onMouseEnter={() => setActive(i)}
            data-incident={d.status !== "operational" || undefined}
            style={{ "--i": i } as CSSProperties}
            className={cn(
              "uptime-cell min-w-0 flex-1 rounded-sm transition-opacity duration-fast",
              STATUS_META[d.status].className,
              active !== null && active !== i && "opacity-40",
              i < days.length - 30 && "max-sm:hidden",
            )}
          />
        ))}
      </div>
    </figure>
  );
}
