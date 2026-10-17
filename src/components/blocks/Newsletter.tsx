"use client";

import { CircleCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button, Input, useToast } from "@/design-system";
import { isEmail } from "@/lib/forms";

/** Newsletter sign-up. Nothing is sent: submitting only simulates a request. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const { toast } = useToast();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    setError(undefined);
    setStatus("sending");
    window.setTimeout(() => {
      setStatus("done");
      toast({ tone: "success", title: "Subscribed", description: `Monthly notes will go to ${email.trim()}.` });
    }, 900);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div>
        <h3 className="text-h3">Monthly staking notes</h3>
        <p className="mt-2 max-w-[46ch] font-serif text-body text-muted">
          Network yields, validator performance and product changes. One email a month, no promotions.
        </p>
      </div>
      {status === "done" ? (
        <p role="status" className="flex items-start gap-3 text-body">
          <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
          <span>
            You’re subscribed. The next issue goes out on the 1st.
          </span>
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            className="flex-1 [&_label]:sr-only"
          />
          <Button type="submit" size="lg" loading={status === "sending"} className="h-11">
            {status === "sending" ? "Subscribing" : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}
