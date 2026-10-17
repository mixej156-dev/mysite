import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal data LONAR ECO. collects, why, and your choices. Template text for the prototype.",
};

export default function Page() {
  return <LegalPage slug="privacy" />;
}
