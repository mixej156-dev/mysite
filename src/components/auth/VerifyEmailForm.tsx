"use client";

import { MailCheck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { Button, Skeleton, useToast } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { useFocusFirstError } from "@/lib/forms";
import { CodeInput, isSixDigits } from "./CodeInput";
import { setPendingSignup, usePendingSignup } from "./pendingSignup";
import { useRedirectWhenAuthed } from "./useRedirectWhenAuthed";

const RESEND_SECONDS = 30;

/** Second step of sign-up: the 6-digit code from the confirmation email creates the account. Any 6 digits work. */
export function VerifyEmailForm() {
  const pending = usePendingSignup();
  const { signUp, status } = useAuth();
  const { toast } = useToast();
  useRedirectWhenAuthed();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const verify = async (value: string) => {
    if (!pending || submitting) return;
    if (!isSixDigits(value)) {
      setError("Enter the 6-digit code from the email.");
      setAttempt((a) => a + 1);
      return;
    }
    setError(undefined);
    setSubmitting(true);
    const session = await signUp(pending.name, pending.email);
    setPendingSignup(null);
    toast({ tone: "success", title: "Email confirmed", description: `Welcome, ${session.name.split(" ")[0]}.` });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void verify(code);
  };

  if (pending === undefined) {
    return (
      <div aria-busy="true" className="flex flex-col gap-4">
        <Skeleton className="size-8" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (pending === null) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-h2">Nothing to confirm</h1>
          <p className="mt-3 font-serif text-body text-muted">
            This confirmation has expired or was opened in another tab. Create your account again to get a new code.
          </p>
        </div>
        <Link
          href="/register"
          className="self-start rounded-sm text-small font-medium text-accent-text hover:underline"
        >
          Create an account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <MailCheck aria-hidden className="size-8 text-accent-text" />
        <h1 className="mt-6 text-h2">Confirm your email</h1>
        <p className="mt-3 font-serif text-body text-muted">
          We sent a 6-digit code to <span className="font-display font-medium text-text">{pending.email}</span>. Enter
          it below, or open the link in the email. The code works for 15 minutes.
        </p>
      </div>
      <form ref={formRef} onSubmit={submit} noValidate aria-label="Confirm email" className="flex flex-col gap-5">
        <CodeInput
          label="Confirmation code"
          value={code}
          onValueChange={(v) => {
            setCode(v);
            if (error) setError(undefined);
            if (isSixDigits(v)) void verify(v);
          }}
          error={error}
          autoFocus
        />
        <Button type="submit" size="lg" loading={submitting || status === "authed"}>
          {submitting ? "Confirming" : "Confirm and continue"}
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-small">
        <button
          type="button"
          disabled={cooldown > 0}
          onClick={() => {
            setCooldown(RESEND_SECONDS);
            toast({ tone: "info", title: "Code sent again", description: `To ${pending.email}.` });
          }}
          className="rounded-sm font-medium text-accent-text hover:underline disabled:pointer-events-none disabled:text-muted"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
        <Link href="/register" className="rounded-sm font-medium text-accent-text hover:underline">
          Use a different email
        </Link>
      </div>
      <p className="text-caption text-muted">Can’t find it? Check spam, or search your inbox for “LONAR ECO.”.</p>
    </div>
  );
}
