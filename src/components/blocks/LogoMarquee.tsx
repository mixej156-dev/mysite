import type { Partner, PartnerGlyph } from "@/data/partners";
import { cn } from "@/lib/cn";

function Glyph({ type }: { type: PartnerGlyph }) {
  const common = { stroke: "currentColor", strokeWidth: 1.75, fill: "none" } as const;
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="size-5 shrink-0">
      {type === "ring" && <circle cx="10" cy="10" r="7" {...common} />}
      {type === "square" && <rect x="3.5" y="3.5" width="13" height="13" rx="2" {...common} />}
      {type === "triangle" && <path d="M10 3.5 17 16.5H3z" {...common} strokeLinejoin="round" />}
      {type === "bars" && <path d="M4 16V9M8 16V5M12 16v-8M16 16V3" {...common} strokeLinecap="round" />}
      {type === "arc" && <path d="M3 15a7 7 0 0 1 14 0" {...common} strokeLinecap="round" />}
      {type === "diamond" && <path d="m10 2.5 7.5 7.5-7.5 7.5L2.5 10z" {...common} strokeLinejoin="round" />}
      {type === "slash" && <path d="M5 17 15 3M10 17l5-7" {...common} strokeLinecap="round" />}
      {type === "dot-grid" &&
        [5, 10, 15].flatMap((x) => [5, 10, 15].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="currentColor" />))}
    </svg>
  );
}

function PartnerRow({ partners, hidden = false }: { partners: Partner[]; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-14 pr-14",
        "animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
        "motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6 motion-reduce:pr-0",
        hidden && "motion-reduce:hidden",
      )}
    >
      {partners.map((p) => (
        <li key={p.name} className="flex items-center gap-2.5 text-body font-semibold whitespace-nowrap text-muted">
          <Glyph type={p.glyph} />
          {p.name}
        </li>
      ))}
    </ul>
  );
}

/** Endless strip of partner wordmarks. Pauses on hover; static and wrapped with reduced motion. */
export function LogoMarquee({ partners, label }: { partners: Partner[]; label: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]"
    >
      <PartnerRow partners={partners} />
      <PartnerRow partners={partners} hidden />
    </div>
  );
}
