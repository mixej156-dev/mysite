import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { PoolCompare } from "@/components/tools/PoolCompare";

export const metadata: Metadata = {
  title: "Compare pools",
  description: "Compare yield, withdrawal period, fees and APY history across up to three staking pools.",
};

export default function ComparePage() {
  return (
    <>
      <PageHeader
        title="Compare pools"
        lead="Put up to three pools side by side before you choose where to stake."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Compare" }]}
      />
      <section aria-label="Comparison" className="container-page pb-24 md:pb-32">
        <PoolCompare />
      </section>
    </>
  );
}
