import Image from "next/image";
import { cn } from "@/lib/cn";

/** Network logo for a pool (public/logos/networks/{pool id}.svg), decorative next to the pool or ticker name. */
export function AssetIcon({ poolId, className }: { poolId: string; className?: string }) {
  return (
    <Image
      src={`/logos/networks/${poolId}.svg`}
      alt=""
      width={32}
      height={32}
      unoptimized
      className={cn("size-5 shrink-0 rounded-pill dark:ring-1 dark:ring-rule-strong", className)}
    />
  );
}
