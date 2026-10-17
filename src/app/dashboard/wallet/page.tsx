import type { Metadata } from "next";
import { Suspense } from "react";
import { Wallet } from "@/components/dashboard/pages/Wallet";

export const metadata: Metadata = { title: "Wallet" };

export default function WalletPage() {
  // Wallet reads ?deposit= from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <Wallet />
    </Suspense>
  );
}
