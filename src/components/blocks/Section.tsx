import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionProps = {
  id?: string;
  /** "inverse" flips to the opposite theme palette for light/dark alternation; "subtle" is a light grey band */
  tone?: "base" | "subtle" | "inverse";
  /** id of the heading that names this section */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, tone = "base", labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === "inverse" ? "inverse" : undefined}
      className={cn(tone === "subtle" ? "bg-surface-2" : "bg-bg", "py-14 text-text sm:py-24 md:py-32", className)}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export type SectionHeaderProps = {
  id: string;
  title: string;
  lead?: string;
  /** Link or button aligned to the right on wide screens */
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({ id, title, lead, action, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-5 sm:mb-12 sm:gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-[40rem]">
        <h2 id={id} className="text-h1">
          {title}
        </h2>
        {lead && <p className="mt-3 text-lead text-muted sm:mt-5">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
