"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Toggle } from "@/design-system";
import { useThemePreference, type ThemePreference } from "@/design-system/theme";
import type { Prefs } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { usePortfolio } from "@/lib/portfolio";
import { SettingsSection } from "./SettingsSection";

const NOTIFICATIONS: { key: keyof Prefs["notifications"]; label: string; description: string }[] = [
  { key: "rewards", label: "Daily rewards summary", description: "One email a day with what each position earned." },
  { key: "unbonding", label: "Unbonding finished", description: "When unstaked funds are back in your wallet." },
  { key: "security", label: "Security alerts", description: "New sign-ins, withdrawals and setting changes." },
  { key: "product", label: "Product news", description: "New pools and features, at most once a month." },
];

const THEMES: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function NotificationSettings() {
  const { state, updatePrefs } = usePortfolio();
  const notifications = state.prefs.notifications;

  return (
    <SettingsSection title="Email notifications" body="Changes save as you make them. Demo: no emails are sent.">
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

export function AppearanceSettings() {
  const { preference, setPreference } = useThemePreference();

  return (
    <SettingsSection title="Theme" body="System follows your device’s light or dark setting.">
      <div role="radiogroup" aria-label="Theme" className="grid max-w-lg grid-cols-3 gap-3">
        {THEMES.map(({ value, label, icon: Icon }) => {
          const selected = preference === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPreference(value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-field border p-4 text-small transition-colors duration-fast",
                selected
                  ? "border-accent bg-accent/5 text-text"
                  : "border-rule text-muted hover:border-rule-strong hover:text-text",
              )}
            >
              <Icon aria-hidden className="size-5" />
              {label}
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}
