import type { Metadata } from "next";
import { LeaderCard } from "@/components/blocks/TeamCard";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { OpenRoles } from "@/components/company/OpenRoles";
import { TeamDirectory } from "@/components/company/TeamDirectory";
import { Link } from "@/components/Link";
import { TEAM } from "@/data/team";

export const metadata: Metadata = {
  title: "Team & careers",
  description: "The people who run LONAR ECO.'s validators and the roles we're hiring for.",
};

const LEADERS = TEAM.filter((m) => m.department === "Leadership");

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="The team"
        lead="Engineers, operators and security people who run the validators behind every pool."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team & careers" }]}
      />

      <section aria-labelledby="leadership-title" className="container-page pb-14 sm:pb-24 md:pb-28">
        <h2 id="leadership-title" className="mb-6 text-h2 sm:mb-10">
          Leadership
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {LEADERS.map((member) => (
            <li key={member.id}>
              <LeaderCard member={member} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="people-title" className="container-page pb-14 sm:pb-24 md:pb-32">
        <h2 id="people-title" className="mb-6 text-h2 sm:mb-8">
          The people running the pools
        </h2>
        <TeamDirectory />
      </section>

      <Section id="careers" tone="inverse" labelledBy="careers-title" className="scroll-mt-20">
        <SectionHeader
          id="careers-title"
          title="Open roles"
          lead="Small teams, written decisions and on-call shared fairly. Most roles are remote within a few time zones."
        />
        <OpenRoles />
        <p className="mt-8 text-body text-muted">
          Don’t see your role?{" "}
          <Link
            href="/contact?topic=careers&role=open#write"
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
