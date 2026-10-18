"use client";

import { Progress } from "@/design-system";

export const MIN_PASSWORD_LENGTH = 8;

const STRENGTH = [
  { label: "Too short", tone: "warning" },
  { label: "Weak", tone: "warning" },
  { label: "Fair", tone: "warning" },
  { label: "Good", tone: "accent" },
  { label: "Strong", tone: "success" },
] as const;

/** 0–4: length first, then variety of character types. Advisory only, beyond the minimum length. */
function strength(password: string): number {
  if (password.length < MIN_PASSWORD_LENGTH) return 0;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  return Math.min(4, Math.max(1, kinds - (password.length >= 12 ? 0 : 1)));
}

/** Strength bar shown under a new-password field once something is typed. */
export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = strength(password);
  return (
    <Progress
      label="Password strength"
      value={password.length < MIN_PASSWORD_LENGTH ? (password.length / MIN_PASSWORD_LENGTH) * 20 : score * 25}
      valueLabel={STRENGTH[score].label}
      tone={STRENGTH[score].tone}
    />
  );
}
