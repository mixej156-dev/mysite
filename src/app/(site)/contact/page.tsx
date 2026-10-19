import {
  Activity,
  ArrowRight,
  BookOpen,
  Briefcase,
  CircleHelp,
  LifeBuoy,
  Newspaper,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Suspense } from "react";
import { ContactForm, ContactFormFromQuery } from "@/components/contact/ContactForm";
import { OfficesMap } from "@/components/contact/OfficesMap";
import { Link } from "@/components/Link";
import { CHANNELS, OFFICES } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get help with your account, ask about partnerships, press or careers, or report a security issue.",
};

const SELF_SERVE = [
  { icon: CircleHelp, title: "FAQ", body: "Short answers on staking, fees and withdrawals.", href: "/faq" },
  { icon: BookOpen, title: "Docs", body: "Step-by-step guides for every task in the dashboard.", href: "/docs" },
  {
    icon: Activity,
    title: "Validator performance",
    body: "Rewards look low today? Check live uptime and incidents.",
    href: "/validators",
  },
  { icon: Receipt, title: "Fees", body: "Every fee in one table, with a worked example.", href: "/fees" },
];

const CHANNEL_ICONS = { support: LifeBuoy, partnerships: Briefcase, press: Newspaper } as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        lead="Tell us what you need and the right team will reply. Most answers are a click away, so start there if you like."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section aria-labelledby="self-serve-title" className="container-page pb-16">
        <h2 id="self-serve-title" className="text-small font-medium text-muted">
          Before you write
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SELF_SERVE.map(({ icon: Icon, title, body, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-3 rounded-card border border-rule bg-surface p-5 transition-colors duration-fast hover:border-rule-strong"
              >
                <Icon aria-hidden className="size-5 text-accent-text" />
                <span className="flex items-center gap-1 text-body font-medium transition-colors duration-fast group-hover:text-accent-text">
                  {title}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-fast group-hover:translate-x-0.5"
                  />
                </span>
                <span className="text-small text-muted">{body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="container-page grid gap-8 sm:gap-10 pb-14 sm:pb-24 md:pb-32 lg:grid-cols-12 lg:gap-8">
        <section id="write" aria-label="Send a message" className="min-w-0 scroll-mt-24 lg:col-span-7">
          {/* The plain form is prerendered; the query (?topic=careers&role=…) is read on the client */}
          <Suspense fallback={<ContactForm />}>
            <ContactFormFromQuery />
          </Suspense>
        </section>
        <aside aria-label="Other ways to reach us" className="flex flex-col gap-4 lg:col-span-5">
          {CHANNELS.map(({ id, title, email, note }) => {
            const Icon = CHANNEL_ICONS[id];
            return (
              <div key={id} className="flex gap-4 rounded-card border border-rule p-5">
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
                <div>
                  <h2 className="text-body font-medium">{title}</h2>
                  <p className="mt-0.5 text-small text-muted">{note}</p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-2 inline-block rounded-sm text-small font-medium text-accent-text hover:underline"
                  >
                    {email}
                  </a>
                </div>
              </div>
            );
          })}
          <div className="flex gap-4 rounded-card bg-surface-2 p-5">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
            <div>
              <h2 className="text-body font-medium">Security issue?</h2>
              <p className="mt-0.5 text-small text-muted">
                Report vulnerabilities privately, not through this form. We acknowledge reports within two business
                days.
              </p>
              <Link
                href="/security#report-title"
                className="mt-2 inline-block rounded-sm text-small font-medium text-accent-text hover:underline"
              >
                How to report
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <Section tone="inverse" labelledBy="offices-title">
        <SectionHeader
          id="offices-title"
          title="Where we work"
          lead="Most of the team is remote within a few time zones. These are the offices people meet in."
        />
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            <OfficesMap offices={OFFICES} />
          </div>
          <ul className="flex flex-col lg:col-span-5">
            {OFFICES.map((o) => (
              <li key={o.city} className="border-t border-rule py-5 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-h4 font-medium">{o.city}</h3>
                  <span className="font-mono text-caption text-muted">{o.utc}</span>
                </div>
                <p className="mt-1 text-small text-muted">
                  {o.country}. {o.teams}.
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
