import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Risk disclosure",
  description: "What can go wrong when you stake: slashing, price, liquidity and more. Template text for the prototype.",
};

export default function Page() {
  return <LegalPage slug="risk-disclosure" />;
}
