import type { ReactNode } from "react";

/** Width cap for form-led dashboard pages (stake, positions, settings); the rest fill the main area. */
export function ContainedPage({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-[84rem]">{children}</div>;
}
