"use client";

import { Toggle } from "@/design-system";
import type { Prefs } from "@/data/portfolio";
import { usePortfolio } from "@/lib/portfolio";
import { SettingsSection } from "./SettingsSection";

const NOTIFICATIONS: { key: keyof Prefs["notifications"]; label: string; description: string }[] = [
  { key: "rewards", label: "Daily rewards summary", description: "One email a day with what each position earned." },
  { key: "unbonding", label: "Unbonding finished", description: "When unstaked funds are back in your wallet." },
  { key: "security", label: "Security alerts", description: "New sign-ins, withdrawals and setting changes." },
  { key: "product", label: "Product news", description: "New pools and features, at most once a month." },
];

export function NotificationSettings() {
  const { state, updatePrefs } = usePortfolio();
  const notifications = state.prefs.notifications;

  return (
    <SettingsSection title="Email notifications" body="Changes save as you make them.">
      <div className="flex max-w-lg flex-col gap-5">
        {NOTIFICATIONS.map((n) => (
          <Toggle
            key={n.key}
            label={n.label}
            description={n.description}
            checked={notifications[n.key]}
            onCheckedChange={(on) => updatePrefs({ notifications: { ...notifications, [n.key]: on } })}
          />
        ))}
      </div>
    </SettingsSection>
  );
}
