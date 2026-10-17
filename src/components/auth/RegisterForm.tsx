"use client";

import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { Button, Checkbox, Input, Progress, useToast } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { isEmail, useFocusFirstError } from "@/lib/forms";
import { PasswordInput } from "./PasswordInput";
import { useRedirectWhenAuthed } from "./useRedirectWhenAuthed";

const MIN_LENGTH = 8;
const STRENGTH = [
  { label: "Too short", tone: "warning" },
  { label: "Weak", tone: "warning" },
  { label: "Fair", tone: "warning" },
  { label: "Good", tone: "accent" },
  { label: "Strong", tone: "success" },
] as const;

/** 0–4: length first, then variety of character types. Advisory only, beyond the minimum length. */
function strength(password: string): number {
  if (password.length < MIN_LENGTH) return 0;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  return Math.min(4, Math.max(1, kinds - (password.length >= 12 ? 0 : 1)));
}

type Errors = { name?: string; email?: string; password?: string; consent?: string };

export function RegisterForm() {
  const { signUp, status } = useAuth();
  const { toast } = useToast();
  useRedirectWhenAuthed();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

  const score = strength(password);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = {
      name: name.trim() ? undefined : "Enter your name.",
      email: isEmail(email) ? undefined : "Enter an email address like name@example.com.",
      password: password.length >= MIN_LENGTH ? undefined : `Use at least ${MIN_LENGTH} characters.`,
      consent: consent ? undefined : "Agree to the terms and the risk disclosure to continue.",
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      setAttempt((a) => a + 1);
      return;
    }
    setSubmitting(true);
    const session = await signUp(name, email);
    toast({ tone: "success", title: "Account created", description: `Welcome, ${session.name.split(" ")[0]}.` });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h2">Create an account</h1>
        <p className="mt-2 text-small text-muted">
          Already have one?{" "}
          <Link href="/login" className="rounded-sm font-medium text-accent-text hover:underline">
            Log in
          </Link>
        </p>
      </div>
      <form ref={formRef} onSubmit={submit} noValidate aria-label="Create an account" className="flex flex-col gap-5">
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
        />
        <div className="flex flex-col gap-3">
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint={`At least ${MIN_LENGTH} characters. Longer is stronger.`}
          />
          {password && (
            <Progress
              label="Password strength"
              value={password.length < MIN_LENGTH ? (password.length / MIN_LENGTH) * 20 : score * 25}
              valueLabel={STRENGTH[score].label}
              tone={STRENGTH[score].tone}
            />
          )}
        </div>
        <Checkbox
          label={
            <>
              I agree to the{" "}
              <Link href="/legal/terms" className="text-accent-text underline underline-offset-2">
                terms of use
              </Link>{" "}
              and have read the{" "}
              <Link href="/legal/risk-disclosure" className="text-accent-text underline underline-offset-2">
                risk disclosure
              </Link>
            </>
          }
          checked={consent}
          onCheckedChange={(v) => {
            setConsent(v === true);
            if (v === true) setErrors((e) => ({ ...e, consent: undefined }));
          }}
          error={errors.consent}
        />
        <Button type="submit" size="lg" loading={submitting || status === "authed"} className="mt-2">
          {submitting ? "Creating account" : "Create account"}
        </Button>
      </form>
    </div>
  );
}
