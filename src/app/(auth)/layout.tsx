import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SkipLink } from "@/components/layout/SkipLink";

export const metadata: Metadata = { robots: { index: false } };

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SkipLink />
      <AuthShell>{children}</AuthShell>
    </>
  );
}
