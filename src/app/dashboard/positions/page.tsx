import type { Metadata } from "next";
import { Positions } from "@/components/dashboard/pages/Positions";
import { ContainedPage } from "@/components/dashboard/ContainedPage";

export const metadata: Metadata = { title: "Positions" };

export default function PositionsPage() {
  return (
    <ContainedPage>
      <Positions />
    </ContainedPage>
  );
}
