import type { Metadata } from "next";
import { Suspense } from "react";
import { StakeFlow } from "@/components/dashboard/pages/StakeFlow";
import { ContainedPage } from "@/components/dashboard/ContainedPage";

export const metadata: Metadata = { title: "Stake" };

export default function StakePage() {
  // StakeFlow reads ?pool= from the URL, which needs a Suspense boundary
  return (
    <ContainedPage>
      <Suspense>
        <StakeFlow />
      </Suspense>
    </ContainedPage>
  );
}
