import type { ReactNode } from "react";

/** One settings group: title and explanation on the left, controls on the right. */
export function SettingsSection({ title, body, children }: { title: string; body?: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-rule py-8 first:pt-2 last:border-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 className="text-body font-medium">{title}</h2>
        {body && <p className="mt-1 text-small text-muted">{body}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
