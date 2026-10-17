import type { Metadata } from "next";
import { Overview } from "@/components/dashboard/pages/Overview";

export const metadata: Metadata = { title: "Overview" };

export default function DashboardPage() {
  return <Overview />;
}
