"use client";

import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import { Button, Checkbox, Input, useToast } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { isEmail, useFocusFirstError } from "@/lib/forms";
import { DemoNotice } from "./AuthShell";
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
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

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
    setSubmitting(true);
    const session = await signIn(email);
    toast({ tone: "success", title: `Welcome back, ${session.name.split(" ")[0]}` });
    // useRedirectWhenAuthed moves on to `next` now that the session exists
  };

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
      <DemoNotice>Demo: any email and password will log you in. Nothing leaves this browser.</DemoNotice>
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
        <Checkbox label="Keep me logged in" description="In this demo the session always stays until you log out." />
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
