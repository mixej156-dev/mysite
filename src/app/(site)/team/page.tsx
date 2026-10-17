import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { TeamDirectory } from "@/components/company/TeamDirectory";
import { Link } from "@/components/Link";
import { Badge } from "@/design-system";
import { OPEN_ROLES } from "@/data/team";

export const metadata: Metadata = {
  title: "Team & careers",
  description: "The people who run {BRAND_NAME}'s validators and the roles we're hiring for. Demo prototype.",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="The team"
        lead="Engineers, operators and security people who run the validators behind every pool."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team & careers" }]}
      >
        <p className="text-small text-muted">People and roles shown are fictional, for the prototype.</p>
      </PageHeader>

      <section aria-label="People" className="container-page pb-24 md:pb-32">
        <TeamDirectory />
      </section>

      <Section id="careers" tone="inverse" labelledBy="careers-title" className="scroll-mt-20">
        <SectionHeader
          id="careers-title"
          title="Open roles"
          lead="Small teams, written decisions and on-call shared fairly. Most roles are remote within a few time zones."
        />
        <ul className="border-t border-rule">
          {OPEN_ROLES.map((role) => (
            <li
              key={role.id}
              className="relative grid gap-2 border-b border-rule py-6 transition-colors duration-fast hover:bg-surface-2/40 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-6"
            >
              <h3 className="text-h4 font-medium">
                <Link href="/contact" className="stretched-link">
                  {role.title}
                </Link>
              </h3>
              <p className="text-small text-muted">{role.department}</p>
              <p className="text-small text-muted">{role.location}</p>
              <Badge tone={role.type === "Remote" ? "accent" : "neutral"} className="justify-self-start">
                {role.type}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-serif text-body text-muted">
          Don’t see your role?{" "}
          <Link
            href="/contact"
            className="rounded-sm font-display text-small font-medium text-accent-text hover:underline"
          >
            Write to us
          </Link>{" "}
          with what you’d like to work on.
        </p>
      </Section>
    </>
  );
}
