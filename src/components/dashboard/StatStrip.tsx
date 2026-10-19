import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { AnimatedNumber } from "./AnimatedNumber";
import { IconChip, type Tone } from "./tones";

export type Stat = { label: string; value: number; format: (v: number) => string; icon: LucideIcon; tone: Tone };

/** A row of headline figures in one card (stacked on phones), each with a tinted icon; figures count up. */
export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <dl data-enter className="grid overflow-hidden rounded-card border border-rule bg-surface sm:grid-cols-3">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            "flex items-center gap-4 p-4 sm:items-start sm:p-5",
            i > 0 && "border-t border-rule sm:border-t-0 sm:border-l",
          )}
        >
          <IconChip icon={s.icon} tone={s.tone} />
          <div className="min-w-0">
            <dt className="text-small text-muted">{s.label}</dt>
            <dd className="mt-0.5 font-mono text-h4 sm:mt-1 sm:text-h3">
              <AnimatedNumber value={s.value} format={s.format} />
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
