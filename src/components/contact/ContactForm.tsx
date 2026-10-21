"use client";

import { CircleCheck, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button, Input, Select, Textarea, useToast } from "@/design-system";
import { CONTACT_TOPICS, type ContactTopic } from "@/data/contact";
import { pools } from "@/data/pools";
import { OPEN_ROLES } from "@/data/team";
import { cn } from "@/lib/cn";
import { isEmail, useFocusFirstError } from "@/lib/forms";
import { MenuIcon } from "../layout/MenuIcon";
import { TOPIC_ICONS, TOPIC_SELECTED } from "./topics";

const SUPPORT_AREAS = [
  { value: "staking", label: "Staking or unstaking" },
  { value: "rewards", label: "Rewards" },
  { value: "withdrawal", label: "Deposit or withdrawal" },
  { value: "access", label: "Signing in or two-factor" },
  { value: "other", label: "Something else" },
];

const STAKE_SIZES = [
  { value: "lt1", label: "Under $1M" },
  { value: "1-10", label: "$1M–$10M" },
  { value: "10-50", label: "$10M–$50M" },
  { value: "gt50", label: "Over $50M" },
];

const POOL_OPTIONS = [
  { value: "none", label: "Not about a pool" },
  ...pools.map((p) => ({ value: p.id, label: p.name })),
];
const ROLE_OPTIONS = [
  ...OPEN_ROLES.map((r) => ({ value: r.id, label: `${r.title}, ${r.location}` })),
  { value: "open", label: "Open application" },
];

type Fields = Record<
  | "name"
  | "email"
  | "message"
  | "area"
  | "pool"
  | "txHash"
  | "company"
  | "stakeSize"
  | "website"
  | "outlet"
  | "deadline"
  | "role"
  | "portfolio",
  string
>;
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  name: "",
  email: "",
  message: "",
  area: "",
  pool: "none",
  txHash: "",
  company: "",
  stakeSize: "",
  website: "",
  outlet: "",
  deadline: "",
  role: "",
  portfolio: "",
};

const isUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v.trim());

function validate(topic: ContactTopic, f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Enter your name.";
  if (!isEmail(f.email)) e.email = "Enter an email address like name@example.com.";
  if (topic === "support" && !f.area) e.area = "Choose what it’s about.";
  if (topic === "partnerships") {
    if (!f.company.trim()) e.company = "Enter your organisation.";
    if (!f.stakeSize) e.stakeSize = "Choose an approximate size.";
    if (f.website.trim() && !isUrl(f.website)) e.website = "Enter a full address starting with https://";
  }
  if (topic === "press" && !f.outlet.trim()) e.outlet = "Enter the publication or outlet.";
  if (topic === "careers") {
    if (!f.role) e.role = "Choose a role, or Open application.";
    if (f.portfolio.trim() && !isUrl(f.portfolio)) e.portfolio = "Enter a full address starting with https://";
  }
  if (f.message.trim().length < 20) e.message = "Write at least 20 characters so we can help.";
  return e;
}

/** Contact form. The topic picks the extra fields and the reply time. Nothing is sent: submitting simulates a request. */
export function ContactForm({
  initialTopic = "support",
  initialRole = "",
}: {
  initialTopic?: ContactTopic;
  initialRole?: string;
}) {
  const [topic, setTopic] = useState<ContactTopic>(initialTopic);
  const [fields, setFields] = useState<Fields>({ ...EMPTY, role: initialRole });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const meta = CONTACT_TOPICS.find((t) => t.id === topic) ?? CONTACT_TOPICS[0];

  useFocusFirstError(formRef, attempt);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const field = (key: keyof Fields) => ({
    value: fields[key],
    onChange: (e: { target: { value: string } }) => set(key)(e.target.value),
    error: errors[key],
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(topic, fields);
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
        <p className="max-w-[48ch] text-body text-muted">
          Your message is with the {meta.label.toLowerCase()} team. We’ll reply to {fields.email.trim()}, {meta.reply}.
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
      <fieldset>
        <legend className="text-small font-medium">What is it about?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {CONTACT_TOPICS.map((t) => {
            const { icon, tone } = TOPIC_ICONS[t.id];
            const chosen = topic === t.id;
            return (
              <label
                key={t.id}
                className={cn(
                  "group/link flex cursor-pointer items-start gap-3 rounded-field border p-3 transition-colors duration-fast",
                  "focus-within:ring-3 focus-within:ring-accent-text/25",
                  chosen ? TOPIC_SELECTED[tone] : "border-rule hover:border-rule-strong",
                )}
              >
                <input
                  type="radio"
                  name="topic"
                  value={t.id}
                  checked={topic === t.id}
                  onChange={() => {
                    setTopic(t.id);
                    setErrors({});
                  }}
                  className="sr-only"
                />
                {/* The chosen topic's icon is in colour and acts out its meaning once (remounted by the key) */}
                <span key={chosen ? "on" : "off"} data-icon-play={chosen || undefined} className="flex">
                  <MenuIcon icon={icon} tone={tone} colored={chosen} />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-small font-medium">{t.label}</span>
                  <span className="text-caption text-muted">{t.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Name" autoComplete="name" {...field("name")} />
        <Input
          label={topic === "support" ? "Account email" : "Email"}
          type="email"
          autoComplete="email"
          hint={topic === "support" ? "The email you sign in with, so we can find your account." : undefined}
          {...field("email")}
        />
      </div>

      {topic === "support" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            label="Related to"
            placeholder="Choose one"
            value={fields.area}
            onValueChange={set("area")}
            options={SUPPORT_AREAS}
            error={errors.area}
          />
          <Select label="Pool (optional)" value={fields.pool} onValueChange={set("pool")} options={POOL_OPTIONS} />
          {(fields.area === "withdrawal" || fields.area === "rewards") && (
            <Input
              label="Transaction hash (optional)"
              numeric
              className="sm:col-span-2"
              hint="From Transactions in the dashboard. Speeds up the reply."
              {...field("txHash")}
            />
          )}
        </div>
      )}

      {topic === "partnerships" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Input label="Organisation" autoComplete="organization" {...field("company")} />
          <Select
            label="Approximate stake"
            placeholder="Choose a range"
            value={fields.stakeSize}
            onValueChange={set("stakeSize")}
            options={STAKE_SIZES}
            error={errors.stakeSize}
          />
          <Input
            label="Website (optional)"
            type="url"
            placeholder="https://"
            className="sm:col-span-2"
            {...field("website")}
          />
        </div>
      )}

      {topic === "press" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Input label="Publication or outlet" {...field("outlet")} />
          <Input label="Deadline (optional)" type="date" {...field("deadline")} />
        </div>
      )}

      {topic === "careers" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            label="Role"
            placeholder="Choose a role"
            value={fields.role}
            onValueChange={set("role")}
            options={ROLE_OPTIONS}
            error={errors.role}
          />
          <Input
            label="CV, LinkedIn or portfolio (optional)"
            type="url"
            placeholder="https://"
            {...field("portfolio")}
          />
        </div>
      )}

      <Textarea
        label="Message"
        hint="Don’t include passwords, recovery codes or private keys."
        rows={6}
        {...field("message")}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-caption text-muted">
          <Clock aria-hidden className="size-3.5" />
          {meta.label} usually replies {meta.reply}.
        </p>
        <Button type="submit" size="lg" loading={status === "sending"}>
          {status === "sending" ? "Sending" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

/** The form, opened on ?topic= (and ?role= for careers), e.g. from an Apply link on /team */
export function ContactFormFromQuery() {
  const params = useSearchParams();
  const topic = CONTACT_TOPICS.find((t) => t.id === params.get("topic"))?.id;
  const role = params.get("role");
  const knownRole = ROLE_OPTIONS.some((o) => o.value === role) ? (role ?? "") : "";
  return <ContactForm key={`${topic}-${knownRole}`} initialTopic={topic} initialRole={knownRole} />;
}
