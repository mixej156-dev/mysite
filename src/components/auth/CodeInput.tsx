"use client";

import { Input, type InputProps } from "@/design-system";

/**
 * One-time code field: digits only, wide monospace spacing, autofill from SMS/email where the platform offers it.
 * `recovery` switches to the XXXX-XXXX recovery code format.
 */
export function CodeInput({
  value,
  onValueChange,
  recovery = false,
  ...props
}: Omit<InputProps, "value" | "onChange"> & { value: string; onValueChange: (v: string) => void; recovery?: boolean }) {
  return (
    <Input
      numeric
      inputMode={recovery ? "text" : "numeric"}
      autoComplete="one-time-code"
      maxLength={recovery ? 9 : 6}
      placeholder={recovery ? "XXXX-XXXX" : "000000"}
      value={value}
      onChange={(e) => {
        const raw = e.target.value.toUpperCase();
        onValueChange(recovery ? raw.replace(/[^A-Z0-9-]/g, "") : raw.replace(/\D/g, ""));
      }}
      className="[&_input]:text-lead [&_input]:tracking-widest"
      {...props}
    />
  );
}

export const isSixDigits = (v: string) => /^\d{6}$/.test(v);
export const isRecoveryCode = (v: string) => /^[A-Z0-9]{4}-?[A-Z0-9]{4}$/.test(v);
