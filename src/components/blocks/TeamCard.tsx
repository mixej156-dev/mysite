import { ArrowUpRight } from "lucide-react";
import type { TeamMember } from "@/data/team";
import { DEPARTMENT_COLORS, TeamAvatar } from "../company/TeamAvatar";

const PROFILES = ["LinkedIn", "X"];

function ProfileLinks({ member }: { member: TeamMember }) {
  return (
    <ul className="flex gap-4 text-caption" aria-label={`${member.name} profiles (placeholders)`}>
      {PROFILES.map((network) => (
        <li key={network}>
          <a
            href="#"
            aria-disabled="true"
            className="inline-flex items-center gap-0.5 rounded-sm text-muted transition-colors duration-fast hover:text-text"
          >
            {network}
            <ArrowUpRight aria-hidden className="size-3" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Person card: drawn portrait (no photos in the prototype), name, role, department and placeholder profile links. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-rule bg-surface">
      <div className="aspect-[4/3] overflow-hidden border-b border-rule">
        <div className="size-full transition-transform duration-slow ease-brand group-hover:scale-[1.04]">
          <TeamAvatar member={member} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
        <div>
          <h3 className="text-body font-medium sm:text-h4">{member.name}</h3>
          <p className="mt-1 text-small text-muted">{member.role}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-caption text-muted">
            <span
              aria-hidden
              className="size-2 rounded-pill"
              style={{ background: `var(--topic-${DEPARTMENT_COLORS[member.department]})` }}
            />
            {member.department}
          </span>
          <ProfileLinks member={member} />
        </div>
      </div>
    </article>
  );
}

/** Leadership: a larger portrait (4:5) with a short bio; on phones the portrait is a square beside the text */
export function LeaderCard({ member }: { member: TeamMember }) {
  return (
    <article className="group grid grid-cols-[6.5rem_minmax(0,1fr)] content-start gap-x-4 sm:flex sm:h-full sm:flex-col">
      <div className="row-span-4 aspect-square overflow-hidden rounded-card border border-rule sm:aspect-[4/5]">
        <div className="size-full transition-transform duration-slow ease-brand group-hover:scale-[1.03]">
          <TeamAvatar member={member} />
        </div>
      </div>
      <p className="text-caption text-muted sm:mt-6 sm:text-small">{member.role}</p>
      <h3 className="mt-0.5 text-h4 sm:mt-1 sm:text-h3">{member.name}</h3>
      {member.bio && (
        <p className="mt-2 max-w-[44ch] font-serif text-small text-muted sm:mt-3 sm:text-body">{member.bio}</p>
      )}
      <div className="mt-3 sm:mt-4">
        <ProfileLinks member={member} />
      </div>
    </article>
  );
}
