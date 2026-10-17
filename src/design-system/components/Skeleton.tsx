import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

/** Loading placeholder. Size it with className; decorative to assistive tech. */
export function Skeleton({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div aria-hidden className={cn("animate-pulse rounded-sm bg-surface-2", className)} {...props} />;
}
