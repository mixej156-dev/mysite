import Image from "next/image";
import { cn } from "@/lib/cn";

/** One entry in the strip: a brand name and its logo in the brand's own colours. */
export type MarqueeItem = { name: string; logo: string };

/* Each row repeats the set three times so it's wider than the strip even on wide screens; otherwise a gap shows */
function MarqueeRow({ items, hidden = false }: { items: MarqueeItem[]; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16",
        "animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
        "motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6 motion-reduce:pr-0",
        hidden && "motion-reduce:hidden",
      )}
    >
      {[...items, ...items, ...items].map((item, i) => (
        <li
          key={`${item.name}-${i}`}
          aria-hidden={i >= items.length || undefined}
          className={cn(
            "flex items-center gap-2.5 text-body font-semibold whitespace-nowrap sm:gap-3 sm:text-h4",
            i >= items.length && "motion-reduce:hidden",
          )}
        >
          <Image src={item.logo} alt="" width={32} height={32} unoptimized className="size-7 shrink-0 sm:size-8" />
          {item.name}
        </li>
      ))}
    </ul>
  );
}

/** Endless strip of brand logos. Pauses on hover; static and wrapped with reduced motion. */
export function LogoMarquee({ items, label }: { items: MarqueeItem[]; label: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]"
    >
      <MarqueeRow items={items} />
      <MarqueeRow items={items} hidden />
    </div>
  );
}
