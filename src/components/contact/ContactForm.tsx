"use client";

import { CircleCheck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, Input, Select, Textarea, useToast } from "@/design-system";

const TOPICS = [
  { value: "support", label: "Account or staking support" },
  { value: "partnerships", label: "Partnerships" },
  { value: "press", label: "Press" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Something else" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = "Enter your name.";
  if (!EMAIL.test(f.email.trim())) errors.email = "Enter an email address like name@example.com.";
  if (!f.topic) errors.topic = "Choose what your message is about.";
  if (f.message.trim().length < 20) errors.message = "Write at least 20 characters so we can help.";
  return errors;
}

const EMPTY: Fields = { name: "", email: "", topic: "", message: "" };

/** Contact form. Nothing is sent: submitting only simulates a request. */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  /* After a failed submit, move focus to the first field with an error */
  useEffect(() => {
    if (attempt === 0) return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [attempt]);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setAttempt((a) => a + 1);
      return;
    }
    setStatus("sending");
    window.setTimeout(() => {
      setStatus("sent");
      toast({ tone: "success", title: "Message sent", description: `We’ll reply to ${fields.email.trim()}.` });
    }, 1200);
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-card border border-rule bg-surface p-6 md:p-8"
      >
        <CircleCheck aria-hidden className="size-6 text-success" />
        <h2 className="text-h3">Thanks, {fields.name.trim().split(" ")[0]}.</h2>
        <p className="max-w-[48ch] font-serif text-body text-muted">
          Your message is with the team. We’ll reply to {fields.email.trim()}, usually within one business day.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setFields(EMPTY);
            setStatus("idle");
            setAttempt(0);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-label="Contact form"
      className="flex flex-col gap-6 rounded-card border border-rule bg-surface p-6 md:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Name"
          autoComplete="name"
          value={fields.name}
          onChange={(e) => set("name")(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(e) => set("email")(e.target.value)}
          error={errors.email}
        />
      </div>
      <Select
        label="Topic"
        placeholder="Choose a topic"
        value={fields.topic}
        onValueChange={set("topic")}
        options={TOPICS}
        error={errors.topic}
      />
      <Textarea
        label="Message"
        value={fields.message}
        onChange={(e) => set("message")(e.target.value)}
        error={errors.message}
        hint="Don’t include passwords, recovery codes or private keys."
        rows={6}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-muted">Demo form: nothing is sent.</p>
        <Button type="submit" size="lg" loading={status === "sending"}>
          {status === "sending" ? "Sending" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
