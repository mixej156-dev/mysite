import type { ReactNode } from "react";

/** Heading row for a dashboard page: h1, one line of context, optional actions. */
export function PageTitle({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
  return (
    <div
      data-enter
      className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4 short:mb-6"
    >
      <div>
        <h1 className="text-h2">{title}</h1>
        {lead && <p className="mt-1 max-w-[60ch] text-small text-muted sm:mt-2">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
