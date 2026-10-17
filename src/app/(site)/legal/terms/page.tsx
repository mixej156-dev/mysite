import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using the LONAR ECO. website and staking service. Template text for the prototype.",
};

export default function Page() {
  return <LegalPage slug="terms" />;
}
