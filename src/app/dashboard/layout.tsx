import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { template: "%s · Dashboard — LONAR ECO.", default: "Dashboard — LONAR ECO." },
  robots: { index: false },
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return <DashboardShell>{children}</DashboardShell>;
}
