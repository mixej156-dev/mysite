import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { RewardsCalculator } from "@/components/tools/RewardsCalculator";

export const metadata: Metadata = {
  title: "Rewards calculator",
  description: "Project staking rewards by pool, amount and period, with or without restaking. Demo data, not a forecast.",
};

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        title="Rewards calculator"
        lead="See how a stake could grow month by month, and what restaking adds."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Calculator" }]}
      />
      <section aria-label="Calculator" className="container-page pb-24 md:pb-32">
        <RewardsCalculator />
      </section>
    </>
  );
}
