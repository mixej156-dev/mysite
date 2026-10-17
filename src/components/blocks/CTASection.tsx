import type { ReactNode } from "react";

export type CTASectionProps = {
  id: string;
  title: string;
  lead: string;
  /** Buttons or links */
  actions: ReactNode;
};

export function CTASection({ id, title, lead, actions }: CTASectionProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[44rem]">
        <h2 id={id} className="text-display">
          {title}
        </h2>
        <p className="mt-6 max-w-[48ch] font-serif text-lead text-muted">{lead}</p>
      </div>
      <div className="flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}
