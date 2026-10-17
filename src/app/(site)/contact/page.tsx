import { Briefcase, LifeBuoy, Newspaper, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { Link } from "@/components/Link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get help with your account, ask about partnerships or press, or report a security issue.",
};

const CHANNELS = [
  {
    icon: LifeBuoy,
    title: "Support",
    email: "support@example.com",
    note: "Account, staking and withdrawal questions.",
  },
  {
    icon: Briefcase,
    title: "Partnerships",
    email: "partners@example.com",
    note: "Funds, custodians and integrations.",
  },
  { icon: Newspaper, title: "Press", email: "press@example.com", note: "Interviews and media requests." },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        lead="Tell us what you need and the right team will reply, usually within one business day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="container-page grid gap-10 pb-24 md:pb-32 lg:grid-cols-12 lg:gap-8">
        <section aria-label="Send a message" className="min-w-0 lg:col-span-7">
          <ContactForm />
        </section>
        <aside aria-label="Other ways to reach us" className="flex flex-col gap-4 lg:col-span-5">
          {CHANNELS.map(({ icon: Icon, title, email, note }) => (
            <div key={title} className="flex gap-4 rounded-card border border-rule p-5">
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
          ))}
          <div className="flex gap-4 rounded-card bg-surface-2 p-5">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
            <div>
              <h2 className="text-body font-medium">Security issue?</h2>
              <p className="mt-0.5 text-small text-muted">Report vulnerabilities privately, not through this form.</p>
              <Link
                href="/security"
                className="mt-2 inline-block rounded-sm text-small font-medium text-accent-text hover:underline"
              >
                How to report
              </Link>
            </div>
          </div>
          <p className="text-caption text-muted">Addresses are placeholders for the prototype.</p>
        </aside>
      </div>
    </>
  );
}
