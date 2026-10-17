import type { Metadata } from "next";
import { Suspense } from "react";
import { StakeFlow } from "@/components/dashboard/pages/StakeFlow";

export const metadata: Metadata = { title: "Stake" };

export default function StakePage() {
  // StakeFlow reads ?pool= from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <StakeFlow />
    </Suspense>
  );
}
