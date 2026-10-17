import type { Metadata } from "next";
import { Referrals } from "@/components/dashboard/pages/Referrals";

export const metadata: Metadata = { title: "Referrals" };

export default function ReferralsPage() {
  return <Referrals />;
}
