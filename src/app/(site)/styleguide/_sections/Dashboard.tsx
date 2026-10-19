"use client";

import { ArrowLeftRight, CalendarDays, Coins, Layers } from "lucide-react";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { Panel } from "@/components/dashboard/Panel";
import { RewardsFeed } from "@/components/dashboard/RewardsFeed";
import { StakePositionsTable } from "@/components/dashboard/StakePositionsTable";
import { StatStrip } from "@/components/dashboard/StatStrip";
import { IconChip, type Tone } from "@/components/dashboard/tones";
import { ThemeScope } from "@/design-system";
import { SEED_PORTFOLIO } from "@/data/portfolio";
import { formatCurrency } from "@/lib/format";
import { positionRewards } from "@/lib/portfolio";
import { Example, Section } from "../_components/Section";
import { Preview } from "../_components/Preview";

const TONES: Tone[] = ["blue", "green", "teal", "orange", "amber", "violet", "rose"];
const count = (v: number) => String(Math.round(v));

const rewards = SEED_PORTFOLIO.positions.flatMap(positionRewards);
const rows = SEED_PORTFOLIO.positions.slice(0, 2).map((p) => ({
  ...p,
  earned: rewards.filter((r) => r.positionId === p.id).reduce((s, r) => s + r.amount, 0),
}));

export function DashboardSection() {
  return (
    <Section
      id="dashboard"
      description="Blocks used in the signed-in dashboard, shown with the account’s seed data. The sidebar and top bar are visible on any /dashboard page. The dashboard also has a near-black dark theme (Settings → Appearance or the top-bar switch); panels rise in on load and figures count up."
    >
      <Preview>
        {() => (
          <>
            <Example label="BalanceCard">
              <BalanceCard
                total={198321}
                change={2404}
                periodLabel="past 30 days"
                breakdown={[
                  { label: "Staked", value: 170793, note: "4 positions", tone: "blue", inTotal: true },
                  { label: "In wallet", value: 27528, tone: "teal", inTotal: true },
                  { label: "Rewards, 30 days", value: 872.1, tone: "amber" },
                ]}
              />
            </Example>
            <Example label="StatStrip">
              <StatStrip
                stats={[
                  {
                    label: "Last 30 days",
                    value: 872.1,
                    format: formatCurrency,
                    icon: Coins,
                    tone: "amber",
                  },
                  {
                    label: "Last 12 months",
                    value: 4680,
                    format: formatCurrency,
                    icon: CalendarDays,
                    tone: "green",
                  },
                  { label: "Earning positions", value: 3, format: count, icon: Layers, tone: "blue" },
                ]}
              />
            </Example>
            <Example label="IconChip tones (topic palette; marks a kind of thing next to its label)">
              <div className="flex flex-wrap gap-3">
                {TONES.map((t) => (
                  <span key={t} className="flex items-center gap-2 text-small text-muted">
                    <IconChip icon={ArrowLeftRight} tone={t} size="sm" />
                    {t}
                  </span>
                ))}
              </div>
            </Example>
            <Example label="Dark theme (dashboard only)">
              <ThemeScope theme="dark" className="grid gap-6 rounded-card bg-bg p-4 text-text sm:p-6 lg:grid-cols-2">
                <Panel title="Latest rewards" icon={Coins} tone="amber">
                  <RewardsFeed entries={rewards} days={1} />
                </Panel>
                <Panel title="Recent activity" icon={ArrowLeftRight} tone="violet">
                  <ActivityList items={SEED_PORTFOLIO.activity.slice(-3).reverse()} />
                </Panel>
              </ThemeScope>
            </Example>
            <div className="grid gap-6 lg:grid-cols-2">
              <Example label="Panel with RewardsFeed">
                <Panel title="Latest rewards" icon={Coins} tone="amber">
                  <RewardsFeed entries={rewards} days={2} />
                </Panel>
              </Example>
              <Example label="Panel with ActivityList">
                <Panel title="Recent activity" icon={ArrowLeftRight} tone="violet">
                  <ActivityList items={SEED_PORTFOLIO.activity.slice(-3).reverse()} />
                </Panel>
              </Example>
            </div>
            <Example label="StakePositionsTable (cards below 768px)">
              <StakePositionsTable rows={rows} label="Positions example" />
            </Example>
            <Example label="Empty ActivityList">
              <ActivityList items={[]} empty="No activity yet." />
            </Example>
          </>
        )}
      </Preview>
    </Section>
  );
}
