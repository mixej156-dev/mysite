import type { Metadata } from "next";
import { Settings } from "@/components/dashboard/pages/Settings";
import { ContainedPage } from "@/components/dashboard/ContainedPage";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <ContainedPage>
      <Settings />
    </ContainedPage>
  );
}
