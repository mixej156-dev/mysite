import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** macOS-style app window around a product screenshot: traffic lights, a centred address bar, soft shadow. */
export function MacWindow({
  address,
  children,
  className,
}: {
  address: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden rounded-card border border-rule bg-bg shadow-overlay", className)}>
      <div
        aria-hidden
        className="relative flex h-8 items-center gap-1.5 border-b border-rule bg-surface-2 px-3 sm:h-10 sm:gap-2 sm:px-4"
      >
        <span className="size-2.5 rounded-pill bg-chrome-close sm:size-3" />
        <span className="size-2.5 rounded-pill bg-chrome-minimize sm:size-3" />
        <span className="size-2.5 rounded-pill bg-chrome-zoom sm:size-3" />
        <span className="absolute inset-x-0 mx-auto flex h-5 w-fit max-w-[60%] items-center gap-1.5 rounded-sm bg-bg px-3 text-caption text-muted sm:h-6 sm:px-4">
          <Lock className="size-3 shrink-0" />
          <span className="truncate">{address}</span>
        </span>
      </div>
      {children}
    </figure>
  );
}
