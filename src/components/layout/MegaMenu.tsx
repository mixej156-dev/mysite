"use client";

import * as Nav from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { featuredPools } from "@/data/pools";
import { formatPercent, formatUnbondingShort } from "@/lib/format";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS, isSectionActive, type NavLink, type NavSection } from "./nav";

const panelLink =
  "group/link block rounded-field p-3 outline-offset-0 transition-colors duration-fast hover:bg-surface-2 focus-visible:bg-surface-2";

function MenuLink({ link }: { link: NavLink }) {
  return (
    <Nav.Link asChild>
      <Link href={link.href} className={panelLink}>
        <span className="block text-small font-medium text-text">{link.label}</span>
        {link.description && <span className="mt-0.5 block text-small text-muted">{link.description}</span>}
      </Link>
    </Nav.Link>
  );
}

function StakingPanel({ section }: { section: NavSection }) {
  return (
    <div className="grid gap-4 p-3 md:grid-cols-[minmax(0,1fr)_17rem]">
      <div>
        <p className="px-3 pt-2 pb-1 text-caption text-muted">Featured pools</p>
        <ul className="grid gap-x-2 sm:grid-cols-2">
          {featuredPools.map((pool) => (
            <li key={pool.id}>
              <Nav.Link asChild>
                <Link href={`/staking/${pool.id}`} className={cn(panelLink, "flex items-baseline justify-between gap-4")}>
                  <span>
                    <span className="block text-small font-medium text-text">{pool.name}</span>
                    <span className="mt-0.5 block text-small text-muted">
                      {pool.ticker}, {formatUnbondingShort(pool.unbondingDays)}
                    </span>
                  </span>
                  <span className="font-mono text-small text-text">{formatPercent(pool.apy)}</span>
                </Link>
              </Nav.Link>
            </li>
          ))}
        </ul>
        <div className="mt-1 border-t border-rule pt-1">
          {section.links.map((link) => (
            <MenuLink key={link.href} link={link} />
          ))}
        </div>
      </div>
      <Nav.Link asChild>
        <Link
          href="/tools/calculator"
          className="flex flex-col justify-between gap-6 rounded-field bg-surface-2 p-5 transition-colors duration-fast hover:bg-rule"
        >
          <span>
            <span className="block text-body font-medium text-text">Estimate your rewards</span>
            <span className="mt-1.5 block font-serif text-small text-muted">
              Pick a pool and an amount to see projected earnings by month and year.
            </span>
          </span>
          <span className="text-small font-medium text-accent-text">Open calculator</span>
        </Link>
      </Nav.Link>
    </div>
  );
}

function LinksPanel({ section }: { section: NavSection }) {
  return (
    <ul className="grid gap-1 p-3 sm:grid-cols-2 xl:grid-cols-4">
      {section.links.map((link) => (
        <li key={link.href}>
          <MenuLink link={link} />
        </li>
      ))}
    </ul>
  );
}

/** Desktop navigation. Renders inside the header pill so the panel can span its full width. */
export function MegaMenu({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <Nav.List className={cn("flex items-center gap-1", className)}>
      {NAV_SECTIONS.map((section) => {
        const active = isSectionActive(section, pathname);
        return (
          <Nav.Item key={section.id} value={section.id}>
            <Nav.Trigger
              data-active={active || undefined}
              className={cn(
                "group inline-flex h-9 items-center gap-1 rounded-pill px-3.5 text-small font-medium text-muted",
                "transition-colors duration-fast hover:text-text data-[state=open]:bg-surface-2 data-[state=open]:text-text",
                "data-active:text-text",
              )}
            >
              {section.label}
              <ChevronDown
                aria-hidden
                className="size-3.5 transition-transform duration-base group-data-[state=open]:rotate-180"
              />
            </Nav.Trigger>
            <Nav.Content className="data-[state=open]:animate-fade-in">
              {section.id === "staking" ? <StakingPanel section={section} /> : <LinksPanel section={section} />}
            </Nav.Content>
          </Nav.Item>
        );
      })}
    </Nav.List>
  );
}
