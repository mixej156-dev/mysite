import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Converter } from "@/components/tools/Converter";

export const metadata: Metadata = {
  title: "Converter",
  description:
    "Convert between supported assets, stablecoins and fiat. See the rate, conversion fee, network fee, slippage and arrival time for each network.",
};

export default function ConverterPage() {
  return (
    <>
      <PageHeader
        title="Converter"
        lead="See what you’d receive after every fee, on the network you choose, and how long it takes to arrive."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Converter" }]}
      />
      <section aria-label="Converter" className="container-page pb-24 md:pb-32">
        <Converter />
      </section>
    </>
  );
}
