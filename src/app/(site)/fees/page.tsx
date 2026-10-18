import type { Metadata } from "next";
import { CTASection } from "@/components/blocks/CTASection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Link } from "@/components/Link";
import { Accordion, TBody, TD, TH, THead, TR, Table, buttonClasses } from "@/design-system";
import { CONVERSION_FEE, getAsset, getNetwork, networkFee } from "@/data/networks";
import { pools } from "@/data/pools";
import { USD_PRICES } from "@/data/prices";
import { formatCurrency, formatNumber, formatPercent, formatToken, formatUnbonding } from "@/lib/format";

export const metadata: Metadata = {
  title: "Fees",
  description:
    "One platform fee, taken as a share of rewards. No deposit, staking or unstaking fees. Every pool's fee, conversion and network fees in one place.",
};

const feeRange = [Math.min(...pools.map((p) => p.feePercent)), Math.max(...pools.map((p) => p.feePercent))];

const FACTS = [
  { label: "Platform fee", value: `${feeRange[0]}–${feeRange[1]}%`, note: "of rewards only" },
  { label: "Deposits", value: "Free", note: "you pay the network fee" },
  { label: "Staking & unstaking", value: "Free", note: "no exit penalty" },
  { label: "Conversion", value: formatPercent(CONVERSION_FEE * 100, 1), note: "of the converted value" },
];

const OTHER_FEES = [
  { item: "Deposit", fee: "Free", detail: "The sending wallet or exchange pays the network fee." },
  { item: "Stake", fee: "Free", detail: "No charge to open a position, at any amount above the pool minimum." },
  { item: "Unstake", fee: "Free", detail: "Funds wait out the network’s unbonding period; we add no penalty." },
  { item: "Withdraw", fee: "Network fee only", detail: "Passed through at cost; see the table below." },
  {
    item: "Convert",
    fee: `${formatPercent(CONVERSION_FEE * 100, 1)} of value`,
    detail: "Moving the same asset between networks is free.",
  },
  { item: "Auto-restake", fee: "Free", detail: "Payouts are added to the position at no charge." },
  { item: "Account, reports, API", fee: "Free", detail: "No subscription, custody or inactivity fees." },
];

const FAQ = [
  {
    id: "principal",
    title: "Is the fee ever taken from my principal?",
    content:
      "No. The fee is a share of each reward. If a pool earns nothing on a given day, there is nothing to take a fee from.",
  },
  {
    id: "slashing",
    title: "Do I pay the fee on penalties?",
    content:
      "No. Penalties and missed rewards reduce what the validator earns, and the fee applies only to what is actually paid out.",
  },
  {
    id: "change",
    title: "Can fees change?",
    content:
      "Fee changes are announced at least 30 days in advance by email and in the dashboard. Positions keep the old fee until the change takes effect.",
  },
  {
    id: "volume",
    title: "Are there lower fees for large balances?",
    content:
      "Institutional accounts can agree a custom fee. For individual accounts the fee is the same at every size.",
  },
  {
    id: "referral",
    title: "Does the referral programme change my fee?",
    content:
      "No. Referral rewards come out of our share of the fee, so the person you invite earns exactly the same yield.",
  },
];

/* Worked example: 10 ETH for one year */
const example = (() => {
  const pool = pools.find((p) => p.id === "eth") ?? pools[0];
  const amount = 10;
  const netRate = pool.apy / 100;
  const grossRate = netRate / (1 - pool.feePercent / 100);
  const gross = amount * grossRate;
  const net = amount * netRate;
  return { pool, amount, gross, fee: gross - net, net, price: USD_PRICES[pool.ticker] };
})();

export default function FeesPage() {
  return (
    <>
      <PageHeader
        title="Fees"
        lead="One fee, taken as a share of the rewards you earn. Nothing on deposits, staking or unstaking, and nothing taken from your principal."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staking", href: "/staking" }, { label: "Fees" }]}
        aside={
          <dl className="grid grid-cols-2 border-t border-rule">
            {FACTS.map((fact, i) => (
              <div key={fact.label} className={`border-b border-rule py-5 ${i % 2 === 1 ? "border-l pl-6" : "pr-6"}`}>
                <dt className="text-small text-muted">{fact.label}</dt>
                <dd className="mt-1 font-mono text-h3">{fact.value}</dd>
                <dd className="mt-0.5 text-caption text-muted">{fact.note}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section aria-labelledby="platform-title" className="container-page pb-14 sm:pb-24 md:pb-32">
        <div className="border-t border-rule pt-10">
          <h2 id="platform-title" className="text-h2">
            Platform fee by pool
          </h2>
          <p className="mt-3 max-w-[60ch] font-serif text-body text-muted">
            The fee is a fixed share of each reward, deducted before payout. APY figures are estimates; the one on pool
            pages is already net of the fee.
          </p>
        </div>
        <div className="mt-8 rounded-card border border-rule bg-surface p-2 sm:p-4">
          <Table label="Fee and estimated APY for each pool">
            <THead>
              <tr>
                <TH>Pool</TH>
                <TH numeric>Fee</TH>
                <TH numeric className="max-md:hidden">
                  APY before fee
                </TH>
                <TH numeric>APY you earn</TH>
                <TH numeric className="max-sm:hidden">
                  Unbonding
                </TH>
              </tr>
            </THead>
            <TBody>
              {pools.map((p) => (
                <TR key={p.id}>
                  <TD>
                    <Link href={`/staking/${p.id}`} className="rounded-sm font-medium hover:text-accent-text">
                      {p.name}
                    </Link>
                    <span className="ml-2 text-caption text-muted max-sm:hidden">{p.ticker}</span>
                  </TD>
                  <TD numeric>{p.feePercent}%</TD>
                  <TD numeric className="max-md:hidden">
                    {formatPercent(p.apy / (1 - p.feePercent / 100))}
                  </TD>
                  <TD numeric>{formatPercent(p.apy)}</TD>
                  <TD numeric className="max-sm:hidden">
                    {formatUnbonding(p.unbondingDays)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-6 lg:grid-cols-12">
          <figure className="self-start rounded-card border border-rule bg-surface p-6 md:p-8 lg:col-span-5">
            <figcaption className="text-small font-medium">
              Example: {example.amount} {example.pool.ticker} for one year
            </figcaption>
            <dl className="mt-6 flex flex-col divide-y divide-rule border-y border-rule text-small">
              {[
                ["Rewards before fee", example.gross],
                [`Platform fee (${example.pool.feePercent}%)`, -example.fee],
                ["Rewards you receive", example.net],
              ].map(([label, value], i) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className={i === 2 ? "font-medium" : "text-muted"}>{label}</dt>
                  <dd className="text-right font-mono">
                    {Number(value) < 0 ? "−" : ""}
                    {formatToken(Math.abs(Number(value)), example.pool.ticker)}
                    <span className="block text-caption text-muted">
                      ≈ {formatCurrency(Math.abs(Number(value)) * example.price)}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-caption text-muted">
              Without restaking, at today’s estimated APY and a reference price. Yields change; this is not a forecast.
            </p>
          </figure>

          <div className="lg:col-span-7">
            <h2 className="text-h3">Everything else</h2>
            <dl className="mt-6 flex flex-col border-t border-rule">
              {OTHER_FEES.map((f) => (
                <div
                  key={f.item}
                  className="grid gap-x-6 gap-y-1 border-b border-rule py-4 sm:grid-cols-[10rem_9rem_minmax(0,1fr)]"
                >
                  <dt className="font-medium">{f.item}</dt>
                  <dd className="font-mono text-small">{f.fee}</dd>
                  <dd className="text-small text-muted">{f.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Section tone="inverse" labelledBy="network-fees-title">
        <SectionHeader
          id="network-fees-title"
          title="Network fees"
          lead="Paid to the network, not to us, and passed through at cost when you withdraw. Typical figures at standard speed; real fees move with network load."
        />
        <Table label="Typical network fees">
          <THead>
            <tr>
              <TH>Network</TH>
              <TH numeric>Withdrawal fee</TH>
              <TH numeric>Confirmation</TH>
            </tr>
          </THead>
          <TBody>
            {pools.map((p) => {
              const network = getNetwork(getAsset(p.ticker).networks[0]);
              const native = networkFee(network, network.nativeTicker, "standard");
              const usd = (v: number) => formatCurrency(v * USD_PRICES[network.nativeTicker]);
              return (
                <TR key={p.id}>
                  <TD className="font-medium">{network.name}</TD>
                  <TD numeric>
                    {formatNumber(native, 6)} {network.nativeTicker}
                    <span className="block text-caption text-muted">≈ {usd(native)}</span>
                  </TD>
                  <TD numeric>
                    {network.finalityMinutes < 1
                      ? "under a minute"
                      : `about ${Math.round(network.finalityMinutes)} min`}
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
        <p className="mt-6 text-small text-muted">
          Compare networks for a specific transfer in the{" "}
          <Link href="/tools/converter" className="rounded-sm font-medium text-accent-text hover:underline">
            converter
          </Link>
          .
        </p>
      </Section>

      <Section labelledBy="fees-faq-title">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
          <h2 id="fees-faq-title" className="text-h1 lg:col-span-4">
            Questions about fees
          </h2>
          <div className="lg:col-span-8">
            <Accordion items={FAQ} />
          </div>
        </div>
      </Section>

      <Section tone="inverse" labelledBy="fees-cta-title">
        <CTASection
          id="fees-cta-title"
          title="See what a stake earns after fees."
          lead="The calculator shows rewards net of the platform fee for any pool, amount and period."
          actions={
            <>
              <Link href="/tools/calculator" className={buttonClasses({ size: "lg" })}>
                Open calculator
              </Link>
              <Link href="/staking" className={buttonClasses({ size: "lg", variant: "secondary" })}>
                Compare pools
              </Link>
            </>
          }
        />
      </Section>
    </>
  );
}
