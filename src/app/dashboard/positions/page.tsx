import type { Metadata } from "next";
import { Positions } from "@/components/dashboard/pages/Positions";

export const metadata: Metadata = { title: "Positions" };

export default function PositionsPage() {
  return <Positions />;
}
