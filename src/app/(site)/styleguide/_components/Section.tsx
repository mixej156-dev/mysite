import type { ReactNode } from "react";
import { sectionTitle, type SectionId } from "./sections";

export function Section({ id, description, children }: { id: SectionId; description: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-rule py-14 first:border-t-0 first:pt-0">
      <h2 id={`${id}-title`} className="text-h3">
        {sectionTitle(id)}
      </h2>
      <p className="mt-2 max-w-[62ch] font-serif text-body text-muted">{description}</p>
      <div className="mt-8 flex flex-col gap-6">{children}</div>
    </section>
  );
}

/** A labelled group of examples inside a preview panel. */
export function Example({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption text-muted">{label}</p>
      {children}
    </div>
  );
}
