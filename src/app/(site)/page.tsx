import type { Metadata } from "next";
import { Calculator } from "@/components/home/Calculator";
import { Hero } from "@/components/home/Hero";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomePools } from "@/components/home/HomePools";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LatestNews } from "@/components/home/LatestNews";
import { Metrics } from "@/components/home/Metrics";
import { StakeComparison } from "@/components/home/StakeComparison";
import { StartCta } from "@/components/home/StartCta";
import { Testimonials } from "@/components/home/Testimonials";
import { Trust } from "@/components/home/Trust";
import { latestPosts, toPostSummary } from "@/data/posts";

export const metadata: Metadata = {
  title: { absolute: "LONAR ECO. — Staking, kept to account" },
  description:
    "Stake ETH, SOL, ATOM and more with validators held to published uptime targets. Rewards recorded per epoch and paid out daily.",
};

export default function HomePage() {
  return (
    <>
      {/* What it is → what you get → how it works → why it's different → your numbers → why trust it → people →
          news → act → remaining questions */}
      <Hero />
      <Metrics />
      <HomePools />
      <HowItWorks />
      <StakeComparison />
      <Calculator />
      <Trust />
      <Testimonials />
      <LatestNews stories={latestPosts(3).map(toPostSummary)} />
      <StartCta />
      <HomeFaq />
    </>
  );
}
