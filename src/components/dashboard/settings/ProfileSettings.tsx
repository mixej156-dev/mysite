"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button, Input, useToast } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { isEmail, useFocusFirstError } from "@/lib/forms";
import { SettingsSection } from "./SettingsSection";

export function ProfileSettings() {
  const { session, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(session?.name ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

  const changed = name.trim() !== session?.name || email.trim() !== session?.email;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const found = {
      name: name.trim() ? undefined : "Enter your name.",
      email: isEmail(email) ? undefined : "Enter an email address like name@example.com.",
    };
    setErrors(found);
    if (found.name || found.email) {
      setAttempt((a) => a + 1);
      return;
    }
    setSaving(true);
    await updateProfile(name, email);
    setSaving(false);
    toast({ tone: "success", title: "Profile saved" });
  };

  return (
    <SettingsSection title="Profile" body="Your name appears in the dashboard. The email is where notices would go.">
      <form ref={formRef} onSubmit={save} noValidate aria-label="Profile" className="flex flex-col gap-5">
        <Input
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          hint="We’ll ask you to confirm a new address."
        />
        <div>
          <Button type="submit" loading={saving} disabled={!changed && !saving}>
            {saving ? "Saving" : "Save changes"}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
