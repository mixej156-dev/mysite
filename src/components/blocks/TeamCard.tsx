import type { TeamMember } from "@/data/team";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

/** Person card with an initials avatar (no photos in the prototype) and placeholder profile links. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-card border border-rule bg-surface p-4 sm:gap-5 sm:p-6">
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-pill tint-accent font-display text-body sm:size-14 sm:text-h4 font-semibold text-accent-text"
      >
        {initials(member.name)}
      </span>
      <div>
        <h3 className="text-h4 font-medium">{member.name}</h3>
        <p className="mt-1 text-small text-muted">{member.role}</p>
      </div>
      <ul className="mt-auto flex gap-4 text-caption" aria-label={`${member.name} profiles (placeholders)`}>
        {["LinkedIn", "X"].map((network) => (
          <li key={network}>
            <a
              href="#"
              aria-disabled="true"
              className="rounded-sm text-muted transition-colors duration-fast hover:text-text"
            >
              {network}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
