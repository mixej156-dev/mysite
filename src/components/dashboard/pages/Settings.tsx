"use client";

import { useState } from "react";
import { Select, Tabs, TabsContent, TabsList, TabsTrigger } from "@/design-system";
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
  const [tab, setTab] = useState("profile");

  return (
    <>
      <PageTitle title="Settings" lead="Profile, security, notifications, API keys and account." />
      <Tabs value={tab} onValueChange={setTab}>
        {/* Phones: five tabs don't fit a row, so the section is picked from a list */}
        <Select
          label="Settings section"
          value={tab}
          onValueChange={setTab}
          options={TABS.map((t) => ({ value: t.id, label: t.label }))}
          className="sm:hidden [&>label]:sr-only"
        />
        <TabsList aria-label="Settings sections" className="max-sm:hidden">
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
