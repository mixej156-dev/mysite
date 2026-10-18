"use client";

import { ShieldCheck } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { Button, Checkbox, Input, useToast } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { isTwoFactorEnabled } from "@/lib/portfolio";
import { isEmail, useFocusFirstError } from "@/lib/forms";
import { CodeInput, isRecoveryCode, isSixDigits } from "./CodeInput";
import { PasswordInput } from "./PasswordInput";
import { useRedirectWhenAuthed } from "./useRedirectWhenAuthed";

export function LoginForm() {
  const { signIn, status } = useAuth();
  const { toast } = useToast();
  const next = useRedirectWhenAuthed();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  /* Second step, shown only when two-factor is on in Settings */
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [code, setCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [codeError, setCodeError] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

  const finish = async () => {
    setSubmitting(true);
    const session = await signIn(email);
    toast({ tone: "success", title: `Welcome back, ${session.name.split(" ")[0]}` });
    // useRedirectWhenAuthed moves on to `next` now that the session exists
  };

  const verifyCode = (value: string) => {
    if (submitting) return;
    const ok = useRecovery ? isRecoveryCode(value) : isSixDigits(value);
    if (!ok) {
      setCodeError(useRecovery ? "Enter a recovery code like 4F7K-29QD." : "Enter the 6-digit code from your app.");
      setAttempt((a) => a + 1);
      return;
    }
    setCodeError(undefined);
    void finish();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = {
      email: isEmail(email) ? undefined : "Enter an email address like name@example.com.",
      password: password ? undefined : "Enter your password.",
    };
    setErrors(found);
    if (found.email || found.password) {
      setAttempt((a) => a + 1);
      return;
    }
    if (isTwoFactorEnabled()) {
      setSubmitting(true);
      await new Promise((res) => setTimeout(res, 600));
      setSubmitting(false);
      setStep("code");
      return;
    }
    await finish();
  };

  if (step === "code") {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <ShieldCheck aria-hidden className="size-8 text-accent-text" />
          <h1 className="mt-6 text-h2">Two-factor authentication</h1>
          <p className="mt-3 font-serif text-body text-muted">
            {useRecovery
              ? "Enter one of the recovery codes you saved when you set up two-factor. Each code works once."
              : "Open your authenticator app and enter the 6-digit code for LONAR ECO."}
          </p>
        </div>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            verifyCode(code);
          }}
          noValidate
          aria-label="Two-factor code"
          className="flex flex-col gap-5"
        >
          <CodeInput
            key={useRecovery ? "recovery" : "app"}
            label={useRecovery ? "Recovery code" : "Authentication code"}
            recovery={useRecovery}
            value={code}
            onValueChange={(v) => {
              setCode(v);
              if (codeError) setCodeError(undefined);
              if (!useRecovery && isSixDigits(v)) verifyCode(v);
            }}
            error={codeError}
            autoFocus
          />
          <Checkbox
            label="Trust this device for 30 days"
            description="You won’t be asked for a code here until then."
          />
          <Button type="submit" size="lg" loading={submitting || status === "authed"} className="mt-2">
            {submitting ? "Verifying" : "Verify and log in"}
          </Button>
        </form>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-small">
          <button
            type="button"
            onClick={() => {
              setUseRecovery((r) => !r);
              setCode("");
              setCodeError(undefined);
            }}
            className="rounded-sm font-medium text-accent-text hover:underline"
          >
            {useRecovery ? "Use your authenticator app" : "Use a recovery code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("credentials");
              setCode("");
              setUseRecovery(false);
            }}
            className="rounded-sm font-medium text-accent-text hover:underline"
          >
            Back
          </button>
        </div>
        <p className="text-caption text-muted">
          Lost access to your device and your recovery codes?{" "}
          <Link href="/contact" className="rounded-sm text-accent-text underline underline-offset-2">
            Contact support
          </Link>{" "}
          to start an identity check.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h2">Log in</h1>
        <p className="mt-2 text-small text-muted">
          New here?{" "}
          <Link href="/register" className="rounded-sm font-medium text-accent-text hover:underline">
            Create an account
          </Link>
        </p>
      </div>
      <form ref={formRef} onSubmit={submit} noValidate aria-label="Log in" className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <div className="flex flex-col gap-2">
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Link
            href="/forgot-password"
            className="self-end rounded-sm text-small font-medium text-accent-text hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Checkbox label="Keep me logged in" description="Stay signed in on this device until you log out." />
        <Button type="submit" size="lg" loading={submitting || status === "authed"} className="mt-2">
          {submitting ? "Logging in" : "Log in"}
        </Button>
        {next !== "/dashboard" && (
          <p className="text-center text-caption text-muted">You’ll go back to the page you were on.</p>
        )}
      </form>
    </div>
  );
}
