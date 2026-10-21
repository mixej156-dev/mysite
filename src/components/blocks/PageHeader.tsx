import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export type PageHeaderProps = {
  title: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  /** Content under the lead: meta line, actions */
  children?: ReactNode;
  /** Right-hand column on wide screens, e.g. key figures */
  aside?: ReactNode;
  className?: string;
};

export function PageHeader({ title, lead, breadcrumbs, children, aside, className }: PageHeaderProps) {
  return (
    <header data-intro className={cn("container-page pt-6 pb-10 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className={cn("grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-end lg:gap-8", breadcrumbs && "mt-5 sm:mt-8")}>
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <h1 className="text-h1 md:text-display">{title}</h1>
          {lead && <p className="mt-4 max-w-[52ch] text-lead text-muted sm:mt-6">{lead}</p>}
          {children && <div className="mt-6 sm:mt-8">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </header>
  );
}
