"use client";

import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input, useToast } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { isEmail, useFocusFirstError } from "@/lib/forms";
import { GOOGLE_DEMO_ACCOUNT, GoogleSignIn } from "./GoogleSignIn";
import { PasswordInput } from "./PasswordInput";
import { MIN_PASSWORD_LENGTH as MIN_LENGTH, PasswordStrength } from "./PasswordStrength";
import { setPendingSignup } from "./pendingSignup";
import { useRedirectWhenAuthed } from "./useRedirectWhenAuthed";

type Errors = { name?: string; email?: string; password?: string; consent?: string };

export function RegisterForm() {
  const { status, signUp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
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
    /* The account is created once the email is confirmed on the next screen */
    await new Promise((res) => setTimeout(res, 700));
    setPendingSignup({ name: name.trim(), email: email.trim() });
    router.push("/verify-email");
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
      <GoogleSignIn
        disabled={submitting || status === "authed"}
        onContinue={async () => {
          /* Google has already confirmed the address, so there is no verification step */
          await signUp(GOOGLE_DEMO_ACCOUNT.name, GOOGLE_DEMO_ACCOUNT.email);
          toast({ tone: "success", title: "Account created", description: "Signed up with your Google account." });
        }}
        note={
          <>
            By continuing with Google you agree to the{" "}
            <Link href="/legal/terms" className="rounded-sm text-accent-text underline underline-offset-2">
              terms
            </Link>{" "}
            and the{" "}
            <Link href="/legal/risk-disclosure" className="rounded-sm text-accent-text underline underline-offset-2">
              risk disclosure
            </Link>
            .
          </>
        }
      />
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        aria-label="Create an account"
        className="-mt-2 flex flex-col gap-5"
      >
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
          <PasswordStrength password={password} />
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
