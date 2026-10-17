import type { Metadata } from "next";
import { Settings } from "@/components/dashboard/pages/Settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <Settings />;
}
