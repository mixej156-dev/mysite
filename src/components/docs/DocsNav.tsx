"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Link } from "@/components/Link";
import { DOC_SECTIONS } from "@/data/docs";
import { cn } from "@/lib/cn";

const linkClass =
  "block rounded-sm border-l py-1.5 pl-4 text-small transition-colors duration-fast hover:border-rule-strong hover:text-text";

export function DocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const list = (
    <div className="flex flex-col gap-6">
      <Link
        href="/docs"
        aria-current={pathname === "/docs" ? "page" : undefined}
        className={cn(linkClass, pathname === "/docs" ? "border-accent text-text" : "border-rule text-muted")}
      >
        Overview
      </Link>
      {DOC_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-2 text-caption font-medium text-text">{section.title}</p>
          <ul>
            {section.articles.map((a) => {
              const active = pathname === `/docs/${a.slug}`;
              return (
                <li key={a.slug}>
                  <Link
                    href={`/docs/${a.slug}`}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(linkClass, active ? "border-accent text-text" : "border-rule text-muted")}
                  >
                    {a.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <nav aria-label="Documentation">
      {/* Phones and tablets: collapsible */}
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="docs-nav-list"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-field border border-rule bg-surface px-4 py-3 text-small font-medium"
        >
          Browse documentation
          <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-base", open && "rotate-180")} />
        </button>
        <div id="docs-nav-list" hidden={!open} className="mt-4 rounded-field border border-rule p-4">
          {list}
        </div>
      </div>
      {/* Desktop: sticky sidebar */}
      <div className="sticky top-24 max-lg:hidden">{list}</div>
    </nav>
  );
}
