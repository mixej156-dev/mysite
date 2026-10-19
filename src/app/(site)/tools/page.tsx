import { ArrowLeftRight, Calculator, Columns2, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { MenuIcon } from "@/components/layout/MenuIcon";
import type { NavTone } from "@/components/layout/nav";
import { PlayOnView } from "@/components/layout/PlayOnView";
import { Link } from "@/components/Link";
import { Card } from "@/design-system";

export const metadata: Metadata = {
  title: "Tools",
  description: "Rewards calculator, pool comparison and a converter with network fees and arrival times.",
};

/* Same icons and hues as these tools have in the navigation menu */
const FEATURED: { href: string; icon: LucideIcon; tone: NavTone; title: string; body: string }[] = [
  {
    href: "/tools/calculator",
    icon: Calculator,
    tone: "violet",
    title: "Rewards calculator",
    body: "Pick a pool, an amount and a period to project earnings month by month, with or without restaking.",
  },
  {
    href: "/tools/compare",
    icon: Columns2,
    tone: "teal",
    title: "Compare pools",
    body: "Put up to three pools side by side: yield, withdrawal period, minimum, fee and APY history.",
  },
  {
    href: "/tools/converter",
    icon: ArrowLeftRight,
    tone: "orange",
    title: "Converter",
    body: "Convert between assets, stablecoins and fiat, with conversion and network fees, slippage and arrival time.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Tools"
        lead="Work out what a stake could earn and what it costs before you commit."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}
      />
      <section aria-label="Planning tools" className="container-page pb-14 sm:pb-24 md:pb-32">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map(({ href, icon, tone, title, body }) => (
            <li key={href}>
              <Card interactive padding="lg" className="group/link flex h-full flex-col gap-8">
                {/* Phones: in colour, acting out once in view. Larger screens: grey until the card is hovered */}
                <PlayOnView className="sm:hidden">
                  <MenuIcon icon={icon} tone={tone} colored className="size-12" iconClassName="size-6" />
                </PlayOnView>
                <span className="max-sm:hidden">
                  <MenuIcon icon={icon} tone={tone} className="size-12 bg-surface-2" iconClassName="size-6" />
                </span>
                <div>
                  <h2 className="text-h3">
                    <Link href={href} className="stretched-link">
                      {title}
                    </Link>
                  </h2>
                  <p className="mt-2 max-w-[48ch] font-serif text-body text-muted">{body}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
