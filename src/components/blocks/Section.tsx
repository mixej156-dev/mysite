import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionProps = {
  id?: string;
  /** "inverse" flips to the opposite theme palette for light/dark alternation */
  tone?: "base" | "inverse";
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
      className={cn("bg-bg py-24 text-text md:py-32", className)}
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
    <div className={cn("mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="max-w-[40rem]">
        <h2 id={id} className="text-h1">
          {title}
        </h2>
        {lead && <p className="mt-5 font-serif text-lead text-muted">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
