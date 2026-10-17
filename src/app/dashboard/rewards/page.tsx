import type { Metadata } from "next";
import { Rewards } from "@/components/dashboard/pages/Rewards";

export const metadata: Metadata = { title: "Rewards" };

export default function RewardsPage() {
  return <Rewards />;
}
