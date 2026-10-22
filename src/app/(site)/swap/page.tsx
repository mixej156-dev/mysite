import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section } from "@/components/blocks/Section";
import { Swap } from "@/components/swap/Swap";
import { Accordion } from "@/design-system";
import { Link } from "@/components/Link";
import { getConversionTerms, getPools, getPrices } from "@/lib/api/catalog";
import { formatPercent } from "@/lib/format";

export const metadata: Metadata = {
  title: "Swap",
  description:
    "Swap between staking assets, stablecoins and cash. See the rate, swap fee, network fee, slippage and arrival time before you confirm.",
};

export default async function SwapPage() {
  const [terms, prices, pools] = await Promise.all([getConversionTerms(), getPrices(), getPools()]);
  const stakeable = pools.map((p) => ({ ticker: p.ticker, poolId: p.id, name: p.name, apy: p.apy }));
  const fee = formatPercent(terms.fee * 100, 1);

  const steps = [
    {
      title: "Get a quote",
      body: "The rate, every fee and the minimum you’ll receive are shown before anything moves.",
    },
    {
      title: "Pay on your network",
      body: "Send from the network you hold the asset on. The swap starts once the payment confirms.",
    },
    {
      title: "Receive where you choose",
      body: "Stablecoins can arrive on Ethereum, Solana or Avalanche; cash goes to a bank account in your name.",
    },
  ];

  const facts = [
    { label: "Swap fee", value: fee },
    { label: "Assets", value: String(terms.assets.length) },
    { label: "Networks", value: String(terms.networks.length) },
  ];

  const faq = [
    {
      id: "fee",
      title: "What does a swap cost?",
      content: `${fee} of the swapped value, plus the network fee for delivery, which goes to the network. Moving the same asset between networks has no swap fee.`,
    },
    {
      id: "slippage",
      title: "What is slippage tolerance?",
      content:
        "How far the rate may move against you between the quote and the swap. If it would move further, the swap is returned in full instead.",
    },
    {
      id: "speed",
      title: "Why choose a network speed?",
      content:
        "A faster setting pays a higher network fee so the delivery is included sooner. Slow is cheapest and usually arrives within minutes.",
    },
    {
      id: "stake",
      title: "Can I stake what I receive?",
      content: (
        <>
          Yes. Swap into any of the {pools.length} staking assets, then open a position from its pool page. Swaps and
          stakes are separate steps.{" "}
          <Link href="/staking" className="rounded-sm font-medium text-accent-text hover:underline">
            See staking pools
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Swap"
        lead={`Trade one asset for another across ${terms.networks.length} networks, stablecoins and cash. One ${fee} fee, shown before you confirm.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Swap" }]}
      />
      <section aria-label="Swap assets" className="container-page pb-14 sm:pb-24 md:pb-32">
        <Swap
          terms={terms}
          prices={prices}
          stakeable={stakeable}
          intro={
            <div className="flex h-full flex-col gap-8">
              <ol className="flex flex-col border-t border-rule">
                {steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 border-b border-rule py-5"
                  >
                    <span className="font-mono text-small leading-7 text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h2 className="text-h4">{step.title}</h2>
                      <p className="mt-1 text-body text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <dl className="grid grid-cols-3 border-b border-rule">
                {facts.map((fact, i) => (
                  <div key={fact.label} className={i > 0 ? "border-l border-rule py-4 pl-4" : "py-4 pr-4"}>
                    <dt className="text-caption text-muted">{fact.label}</dt>
                    <dd className="mt-1 font-mono text-h4">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-caption text-muted">
                Reference prices, not an offer. Network fees go to the network, not to us, and change with network load.
              </p>
            </div>
          }
        />
      </section>
      <Section tone="subtle" labelledBy="swap-faq-title">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
          <h2 id="swap-faq-title" className="text-h1 lg:col-span-4">
            Questions about swaps
          </h2>
          <div className="lg:col-span-8">
            <Accordion items={faq} />
          </div>
        </div>
      </Section>
    </>
  );
}
