import type { Metadata } from "next";
import { Calculator } from "@/components/home/Calculator";
import { Closing, LatestPosts, Testimonials } from "@/components/home/Closing";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Metrics } from "@/components/home/Metrics";
import { Pools } from "@/components/home/Pools";
import { Trust } from "@/components/home/Trust";

export const metadata: Metadata = {
  title: { absolute: "LONAR ECO. — Staking, kept to account" },
  description:
    "Stake ETH, SOL, ATOM and more with validators held to published uptime targets. Rewards recorded per epoch and paid out daily. Demo prototype.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Metrics />
      <Pools />
      <HowItWorks />
      <Trust />
      <Calculator />
      <Testimonials />
      <LatestPosts />
      <Closing />
    </>
  );
}
