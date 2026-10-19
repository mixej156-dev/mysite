import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { HeroScreenshot } from "./HeroScreenshot";

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="container-page grid items-center gap-10 pt-8 pb-12 sm:gap-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28 lg:grid-cols-12 lg:gap-12">
        <div data-intro className="lg:col-span-5">
          <h1 id="hero-title" className="max-w-[11ch] text-display">
            Staking, kept to account.
          </h1>
          <p className="mt-8 max-w-[46ch] font-serif text-lead text-muted">
            Stake ETH, SOL, ATOM and more with validators held to published uptime targets. Every reward is recorded per
            epoch and paid out daily.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3">
            <Link href="/register" className={buttonClasses({ size: "lg" })}>
              Start staking
            </Link>
            <Link href="/staking" className={buttonClasses({ size: "lg", variant: "secondary" })}>
              See pools
            </Link>
          </div>
          <p className="mt-6 text-small text-muted">
            From 0.1 ETH. Withdraw any time; funds release after the network’s unbonding period.
          </p>
        </div>
        {/* The shot rises after the headline */}
        <div data-intro className="lg:col-span-7 [--intro-start:300ms]">
          <HeroScreenshot className="mx-auto w-full max-w-[18rem] sm:max-w-none" />
        </div>
      </div>
    </section>
  );
}
