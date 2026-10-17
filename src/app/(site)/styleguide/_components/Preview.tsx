import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Bordered panel around a set of examples. Children are a render function so previews mount lazily per panel. */
export function Preview({
  children,
  className,
}: {
  children: () => ReactNode;
  className?: string;
}) {
  return (
    <div className="min-w-0 rounded-card border border-rule bg-bg text-text">
      <div className={cn("flex flex-col gap-8 p-5 sm:p-6", className)}>{children()}</div>
    </div>
  );
}
