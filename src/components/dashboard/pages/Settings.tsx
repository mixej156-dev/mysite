"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/design-system";
import { PageTitle } from "../PageTitle";
import { AccountSettings } from "../settings/AccountSettings";
import { ApiKeySettings } from "../settings/ApiKeySettings";
import { NotificationSettings } from "../settings/PreferenceSettings";
import { ProfileSettings } from "../settings/ProfileSettings";
import { SecuritySettings } from "../settings/SecuritySettings";

const TABS = [
  { id: "profile", label: "Profile", content: <ProfileSettings /> },
  { id: "security", label: "Security", content: <SecuritySettings /> },
  { id: "notifications", label: "Notifications", content: <NotificationSettings /> },
  { id: "api", label: "API keys", content: <ApiKeySettings /> },
  { id: "account", label: "Account", content: <AccountSettings /> },
];

export function Settings() {
  return (
    <>
      <PageTitle
        title="Settings"
        lead="Profile, security, notifications and appearance. Changes stay in this browser."
      />
      <Tabs defaultValue="profile">
        <TabsList aria-label="Settings sections">
          {TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.id} value={t.id}>
            {t.content}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
