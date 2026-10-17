"use client";

import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/components/Link";
import { usePathname } from "next/navigation";
import { featuredPools } from "@/data/pools";
import { formatPercent, formatUnbondingShort } from "@/lib/format";
import { cn } from "@/lib/cn";
import { LearnCover } from "@/components/blocks/LearnCover";
import { NAV_SECTIONS, POOL_ART, isSectionActive, type NavFeature, type NavLink, type NavSection } from "./nav";
import { NavArt } from "./NavArt";

const panelLink =
  "group/link flex items-center gap-4 rounded-field p-3 outline-offset-0 transition-colors duration-fast hover:bg-surface-2 focus-visible:bg-surface-2";

const tileLink = "h-full border border-rule p-4 hover:border-rule-strong";

/** `tile` draws the link as a bordered card that fills its grid cell */
function MenuLink({ link, tile = false }: { link: NavLink; tile?: boolean }) {
  return (
    <Nav.Link asChild>
      <Link href={link.href} className={cn(panelLink, tile && tileLink)}>
        {link.art && <NavArt {...link.art} className={tile ? "size-16" : undefined} />}
        <span className="min-w-0">
          <span className="block text-body font-medium text-text transition-colors duration-fast group-hover/link:text-accent-text">
            {link.label}
          </span>
          {link.description && <span className="mt-0.5 block text-small text-muted">{link.description}</span>}
        </span>
      </Link>
    </Nav.Link>
  );
}

/** Right-hand promo card, with cover art in the ECO. LEARN style */
function FeatureCard({ feature }: { feature: NavFeature }) {
  return (
    <Nav.Link asChild>
      <Link
        href={feature.href}
        className="group/feature flex flex-col overflow-hidden rounded-field border border-rule bg-surface-2 transition-colors duration-fast hover:border-rule-strong"
      >
        <span className="block aspect-[16/9] overflow-hidden border-b border-rule">
          <span className="block size-full transition-transform duration-slow group-hover/feature:scale-[1.04] motion-reduce:transition-none">
            <LearnCover slug={feature.seed} topic={feature.topic} />
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-1.5 p-5">
          <span className="text-body font-medium text-text">{feature.title}</span>
          <span className="font-serif text-small text-muted">{feature.body}</span>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-small font-medium text-accent-text">
            {feature.cta}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-fast group-hover/feature:translate-x-0.5"
            />
          </span>
        </span>
      </Link>
    </Nav.Link>
  );
}

function Panel({ section, children }: { section: NavSection; children: ReactNode }) {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">{children}</div>
      <FeatureCard feature={section.feature} />
    </div>
  );
}

function StakingPanel({ section }: { section: NavSection }) {
  return (
    <Panel section={section}>
      <ul aria-label="Featured pools" className="grid h-full auto-rows-fr gap-3 sm:grid-cols-2">
        {featuredPools.map((pool) => (
          <li key={pool.id}>
            <Nav.Link asChild>
              <Link href={`/staking/${pool.id}`} className={cn(panelLink, tileLink)}>
                {POOL_ART[pool.id] && <NavArt {...POOL_ART[pool.id]} className="size-16" />}
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-medium text-text transition-colors duration-fast group-hover/link:text-accent-text">
                    {pool.name}
                  </span>
                  <span className="mt-0.5 block text-small text-muted">
                    {pool.ticker}, {formatUnbondingShort(pool.unbondingDays)}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-body text-text">{formatPercent(pool.apy)}</span>
                  <span className="block text-caption text-muted">APY</span>
                </span>
              </Link>
            </Nav.Link>
          </li>
        ))}
        {section.links.map((link) => (
          <li key={link.href} className="sm:col-span-2">
            <MenuLink link={link} tile />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function LinksPanel({ section }: { section: NavSection }) {
  return (
    <Panel section={section}>
      {/* Tiles stretch to the promo card's height: three stack in rows, four sit in a 2×2 grid */}
      <ul className={cn("grid h-full auto-rows-fr gap-3", section.links.length % 2 === 0 && "sm:grid-cols-2")}>
        {section.links.map((link) => (
          <li key={link.href}>
            <MenuLink link={link} tile />
          </li>
        ))}
      </ul>
    </Panel>
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
                "group inline-flex h-9 items-center gap-1 rounded-field px-3.5 text-small font-medium text-muted",
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
