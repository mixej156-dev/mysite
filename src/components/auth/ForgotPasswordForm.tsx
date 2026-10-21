"use client";

import { MailCheck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { Button, Input, buttonClasses, useToast } from "@/design-system";
import { isEmail, useFocusFirstError } from "@/lib/forms";

const RESEND_SECONDS = 30;

/** First step of a password reset: asks for the email, then points to the code screen. Nothing is sent. */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [cooldown, setCooldown] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  useFocusFirstError(formRef, attempt);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const send = () => {
    setStatus("sending");
    window.setTimeout(() => {
      setStatus("sent");
      setCooldown(RESEND_SECONDS);
    }, 800);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Enter the email address you signed up with.");
      setAttempt((a) => a + 1);
      return;
    }
    setError(undefined);
    send();
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col gap-6">
        <MailCheck aria-hidden className="size-8 text-accent-text" />
        <div>
          <h1 className="text-h2">Check your inbox</h1>
          <p className="mt-3 text-body text-muted">
            If an account exists for <span className="font-display font-medium text-text">{email.trim()}</span>, an
            email with a reset link and a 6-digit code is on its way. Both work for 30 minutes.
          </p>
        </div>
        <Link
          href={`/reset-password?email=${encodeURIComponent(email.trim())}`}
          className={buttonClasses({ size: "lg", className: "self-stretch sm:self-start" })}
        >
          Enter the code
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            disabled={cooldown > 0}
            onClick={() => {
              setCooldown(RESEND_SECONDS);
              toast({ tone: "info", title: "Link sent again", description: `To ${email.trim()}.` });
            }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
          </Button>
          <Button variant="ghost" onClick={() => setStatus("idle")}>
            Use a different email
          </Button>
        </div>
        <Link href="/login" className="self-start rounded-sm text-small font-medium text-accent-text hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h2">Reset your password</h1>
        <p className="mt-2 text-body text-muted">Enter your email and we’ll send a link to set a new one.</p>
      </div>
      <form ref={formRef} onSubmit={submit} noValidate aria-label="Reset password" className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <Button type="submit" size="lg" loading={status === "sending"}>
          {status === "sending" ? "Sending link" : "Send reset link"}
        </Button>
      </form>
      <Link href="/login" className="self-start rounded-sm text-small font-medium text-accent-text hover:underline">
        Back to log in
      </Link>
    </div>
  );
}
