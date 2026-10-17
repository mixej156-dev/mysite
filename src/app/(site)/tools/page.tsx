import { Calculator, Columns3 } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Link } from "@/components/Link";
import { Converter } from "@/components/tools/Converter";
import { GasEstimate } from "@/components/tools/GasEstimate";
import { Card } from "@/design-system";

export const metadata: Metadata = {
  title: "Tools",
  description: "Rewards calculator, pool comparison, asset converter and network fee estimates. Demo data.",
};

const FEATURED = [
  {
    href: "/tools/calculator",
    icon: Calculator,
    title: "Rewards calculator",
    body: "Pick a pool, an amount and a period to project earnings month by month, with or without restaking.",
  },
  {
    href: "/tools/compare",
    icon: Columns3,
    title: "Compare pools",
    body: "Put up to three pools side by side: yield, withdrawal period, minimum, fee and APY history.",
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
      <section aria-label="Planning tools" className="container-page">
        <ul className="grid gap-4 md:grid-cols-2">
          {FEATURED.map(({ href, icon: Icon, title, body }) => (
            <li key={href}>
              <Card interactive padding="lg" className="flex h-full flex-col gap-8">
                <Icon aria-hidden className="size-6 text-accent-text" />
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

      <Section id="converter" labelledBy="converter-title" className="scroll-mt-20">
        <SectionHeader
          id="converter-title"
          title="Converter"
          lead="Convert between the assets we support and US dollars, at demo rates."
        />
        <Converter />
      </Section>

      <Section id="gas" tone="inverse" labelledBy="gas-title" className="scroll-mt-20">
        <SectionHeader
          id="gas-title"
          title="Gas estimate"
          lead="Typical network fees to stake, unstake and claim rewards on each network."
        />
        <GasEstimate />
      </Section>
    </>
  );
}
