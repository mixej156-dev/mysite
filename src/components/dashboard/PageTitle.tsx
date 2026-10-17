import type { ReactNode } from "react";

/** Heading row for a dashboard page: h1, one line of context, optional actions. */
export function PageTitle({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-h2">{title}</h1>
        {lead && <p className="mt-2 max-w-[60ch] text-small text-muted">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
