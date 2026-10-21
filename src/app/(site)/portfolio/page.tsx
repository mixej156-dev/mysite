import type { Metadata } from "next";
import { CTASection } from "@/components/blocks/CTASection";
import { MacWindow } from "@/components/blocks/MacWindow";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Link } from "@/components/Link";
import { Features } from "@/components/portfolio/Features";
import { LivePreview } from "@/components/portfolio/LivePreview";
import { LogoField } from "@/components/portfolio/LogoField";
import { buttonClasses } from "@/design-system";
import { pools } from "@/data/pools";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Every stake in one view: your balance across networks, daily rewards, unbonding dates and the alerts that matter.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* Clipped at the top and the sides only: near logos at the bottom, pushed down by the parallax, spill into
          the next section's empty top instead of being cut */}
      <section
        aria-labelledby="portfolio-title"
        data-logo-hero
        className="relative isolate overflow-x-clip [clip-path:inset(0_0_-12rem_0)]"
      >
        <LogoField className="-z-10" />
        {/* A soft clearing behind the words, so the far logos never fight the text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[28rem] max-w-3xl -translate-y-1/2 rounded-pill bg-bg opacity-80 blur-3xl"
        />
        {/* The first screen, under the site header (4.25rem) */}
        <div
          data-intro
          className="container-page flex min-h-[max(36rem,calc(100svh-4.25rem))] flex-col items-center justify-center py-24 text-center"
        >
          <p className="text-small font-medium text-accent-text">Portfolio</p>
          <h1 id="portfolio-title" className="mt-4 max-w-[14ch] text-display">
            Every stake, in one view.
          </h1>
          <p className="mt-6 max-w-[44ch] text-lead text-muted">
            Your balance across {pools.length} networks, every daily reward, and when each unstake comes back. All on
            one screen.
          </p>
          {/* Hovering it gathers the logos into turning rings (LogoField) */}
          <div className="mt-8 sm:mt-10">
            <Link href="/register" data-orbit-trigger className={buttonClasses({ size: "lg" })}>
              Start staking
            </Link>
          </div>
        </div>
      </section>

      <Section labelledBy="preview-title">
        <SectionHeader
          id="preview-title"
          title="Your dashboard, live"
          lead="This is the real overview, running on a sample account. Rewards land, the chart moves, nothing to set up."
        />
        <p className="sr-only">
          A preview of the dashboard overview playing by itself: total balance, a balance chart whose period switches
          between 30 days, 90 days and a year, latest rewards, open positions and recent activity, with new rewards
          arriving every few seconds.
        </p>
        <div data-reveal-item>
          <MacWindow address="lonar.eco/dashboard">
            <LivePreview />
          </MacWindow>
        </div>
      </Section>

      <Section labelledBy="features-title">
        <SectionHeader
          id="features-title"
          title="What you can see at a glance"
          lead="The same figures the dashboard shows, nothing estimated twice."
        />
        <Features />
      </Section>

      <Section tone="inverse" labelledBy="portfolio-cta">
        <CTASection
          id="portfolio-cta"
          title="Bring your stake into view."
          lead="Create an account, stake from 0.1 ETH and watch the first reward arrive within a day. Estimates, not an offer or a forecast."
          actions={
            <>
              <Link href="/register" className={buttonClasses({ size: "lg" })}>
                Start staking
              </Link>
              <Link href="/staking" className={buttonClasses({ size: "lg", variant: "secondary" })}>
                See pools
              </Link>
            </>
          }
        />
      </Section>
    </>
  );
}
