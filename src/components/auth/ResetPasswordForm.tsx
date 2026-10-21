"use client";

import { CircleCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { Button, Input, buttonClasses } from "@/design-system";
import { isEmail, useFocusFirstError } from "@/lib/forms";
import { CodeInput, isSixDigits } from "./CodeInput";
import { PasswordInput } from "./PasswordInput";
import { MIN_PASSWORD_LENGTH, PasswordStrength } from "./PasswordStrength";

type Errors = { email?: string; code?: string; password?: string; confirm?: string };

/** Second step of a password reset: the emailed code plus a new password. Any 6 digits work; nothing is stored. */
export function ResetPasswordForm() {
  const fromLink = useSearchParams().get("email") ?? "";
  const [email, setEmail] = useState(fromLink);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = {
      email: isEmail(email) ? undefined : "Enter the email address you signed up with.",
      code: isSixDigits(code) ? undefined : "Enter the 6-digit code from the email.",
      password: password.length >= MIN_PASSWORD_LENGTH ? undefined : `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
      confirm: confirm && confirm === password ? undefined : "The passwords don’t match.",
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      setAttempt((a) => a + 1);
      return;
    }
    setStatus("saving");
    window.setTimeout(() => setStatus("done"), 900);
  };

  if (status === "done") {
    return (
      <div role="status" className="flex flex-col gap-6">
        <CircleCheck aria-hidden className="size-8 text-success" />
        <div>
          <h1 className="text-h2">Password updated</h1>
          <p className="mt-3 text-body text-muted">
            You can log in with your new password now. For your security, every other device has been signed out.
          </p>
        </div>
        <Link href="/login" className={buttonClasses({ size: "lg", className: "self-stretch sm:self-start" })}>
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h2">Set a new password</h1>
        <p className="mt-2 text-body text-muted">
          Enter the code from the reset email and choose a password you don’t use anywhere else.
        </p>
      </div>
      <form ref={formRef} onSubmit={submit} noValidate aria-label="Set a new password" className="flex flex-col gap-5">
        {!fromLink && (
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
        )}
        <CodeInput
          label="Reset code"
          hint={fromLink ? `Sent to ${fromLink}.` : undefined}
          value={code}
          onValueChange={(v) => {
            setCode(v);
            if (errors.code) setErrors((x) => ({ ...x, code: undefined }));
          }}
          error={errors.code}
        />
        <div className="flex flex-col gap-3">
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint={`At least ${MIN_PASSWORD_LENGTH} characters. Longer is stronger.`}
          />
          <PasswordStrength password={password} />
        </div>
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
        <Button type="submit" size="lg" loading={status === "saving"} className="mt-2">
          {status === "saving" ? "Saving" : "Save new password"}
        </Button>
      </form>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-small">
        <Link href="/forgot-password" className="rounded-sm font-medium text-accent-text hover:underline">
          Send a new code
        </Link>
        <Link href="/login" className="rounded-sm font-medium text-accent-text hover:underline">
          Back to log in
        </Link>
      </div>
    </div>
  );
}
