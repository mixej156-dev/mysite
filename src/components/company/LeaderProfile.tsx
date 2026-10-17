import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { LeaderProfile as Profile, TeamMember } from "@/data/team";

/** Head-and-shoulders silhouette on an accent wash, used until a real photo is added. */
function PortraitPlaceholder() {
  return (
    <svg viewBox="0 0 400 500" aria-hidden className="size-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="500" fill="color-mix(in oklab, var(--accent) 22%, var(--surface))" />
      <circle cx="200" cy="200" r="150" fill="color-mix(in oklab, var(--accent) 34%, var(--surface))" />
      <circle cx="200" cy="190" r="72" fill="var(--surface-2)" />
      <path d="M60 500c0-96 63-170 140-170s140 74 140 170z" fill="var(--surface-2)" />
    </svg>
  );
}

/** Leader feature: portrait, bio, quote, key achievements and profile links. */
export function LeaderProfile({ member, profile, titleId }: { member: TeamMember; profile: Profile; titleId: string }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-card border border-rule bg-surface">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={`Portrait of ${member.name}`}
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
            />
          ) : (
            <PortraitPlaceholder />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:col-span-7">
        <p className="text-small text-muted">{member.role}</p>
        <h2 id={titleId} className="mt-2 text-h2">
          {member.name}
        </h2>
        <p className="mt-5 max-w-[60ch] font-serif text-body text-muted">{profile.bio}</p>

        <figure className="mt-10 border-l-2 border-accent pl-6">
          <blockquote className="max-w-[52ch] font-serif text-lead text-text">“{profile.quote}”</blockquote>
          <figcaption className="mt-3 text-small text-muted">
            {member.name}, {member.role}
          </figcaption>
        </figure>

        <dl className="mt-12 grid border-t border-rule sm:grid-cols-2">
          {profile.achievements.map((a, i) => (
            <div
              key={a.label}
              className={`flex flex-col-reverse justify-end border-b border-rule py-5 ${i % 2 === 1 ? "sm:border-l sm:pl-6" : "sm:pr-6"}`}
            >
              <dt className="mt-1 text-small text-muted">{a.label}</dt>
              <dd className="font-mono text-h3">{a.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label={`${member.name} profiles`}>
          {profile.social.map((s) => (
            <li key={s.network}>
              <a
                href={s.href}
                className="inline-flex items-center gap-1 rounded-sm text-small font-medium text-text transition-colors duration-fast hover:text-accent-text"
              >
                {s.network}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
