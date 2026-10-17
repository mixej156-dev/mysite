import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Titled surface for dashboard sections. */
export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = `panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section
      aria-labelledby={id}
      className={cn("min-w-0 rounded-card border border-rule bg-surface p-5 md:p-6", className)}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id={id} className="text-body font-medium">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
