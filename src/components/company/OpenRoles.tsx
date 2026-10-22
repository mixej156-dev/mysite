"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, Check, Plus } from "lucide-react";
import { Link } from "@/components/Link";
import { Badge, buttonClasses } from "@/design-system";
import { OPEN_ROLES } from "@/data/team";

/** Open roles as rows that unfold into the details and an Apply link to the careers form, role preselected. */
export function OpenRoles() {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-rule">
      {OPEN_ROLES.map((role) => (
        <Accordion.Item key={role.id} value={role.id} className="border-b border-rule">
          <Accordion.Header>
            <Accordion.Trigger className="group grid w-full gap-2 py-6 text-left transition-colors duration-fast hover:text-accent-text md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_6rem_1.5rem] md:items-center md:gap-6">
              <span className="flex items-start justify-between gap-4 text-h4 font-medium">
                {role.title}
                <Plus
                  aria-hidden
                  className="mt-1 size-5 shrink-0 text-muted transition-transform duration-base group-data-[state=open]:rotate-45 md:hidden"
                />
              </span>
              <span className="text-small text-muted">{role.department}</span>
              <span className="text-small text-muted">{role.location}</span>
              <Badge tone={role.type === "Remote" ? "accent" : "neutral"} className="justify-self-start">
                {role.type}
              </Badge>
              <Plus
                aria-hidden
                className="size-5 text-muted transition-transform duration-base group-data-[state=open]:rotate-45 max-md:hidden"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="grid gap-6 pb-8 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_7.5rem] md:gap-6">
              <div>
                <p className="max-w-[48ch] text-lead">{role.summary}</p>
                <h4 className="mt-6 text-small font-medium text-muted">What you’ll do</h4>
                <ul className="mt-3 flex flex-col gap-2 text-small">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <ArrowRight aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:pt-1">
                <h4 className="text-small font-medium text-muted">What helps</h4>
                <ul className="mt-3 flex flex-col gap-2 text-small">
                  {role.helps.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-caption text-muted">None of these is a hard requirement.</p>
              </div>
              <div className="md:pt-1">
                <Link
                  href={`/contact?topic=careers&role=${role.id}#write`}
                  className={buttonClasses({ className: "w-full md:w-auto" })}
                >
                  Apply
                </Link>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
