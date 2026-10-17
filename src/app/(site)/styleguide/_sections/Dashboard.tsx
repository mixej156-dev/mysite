"use client";

import { ActivityList } from "@/components/dashboard/ActivityList";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { Panel } from "@/components/dashboard/Panel";
import { RewardsFeed } from "@/components/dashboard/RewardsFeed";
import { StakePositionsTable } from "@/components/dashboard/StakePositionsTable";
import { SEED_PORTFOLIO } from "@/data/portfolio";
import { positionRewards } from "@/lib/portfolio";
import { Example, Section } from "../_components/Section";
import { ThemePair } from "../_components/ThemePair";

const rewards = SEED_PORTFOLIO.positions.flatMap(positionRewards);
const rows = SEED_PORTFOLIO.positions.slice(0, 2).map((p) => ({
  ...p,
  earned: rewards.filter((r) => r.positionId === p.id).reduce((s, r) => s + r.amount, 0),
}));

export function DashboardSection() {
  return (
    <Section
      id="dashboard"
      description="Blocks used in the signed-in dashboard, shown with the demo account’s seed data. The sidebar and top bar are visible on any /dashboard page."
    >
      <ThemePair stacked>
        {() => (
          <>
            <Example label="BalanceCard">
              <BalanceCard
                total={198321}
                change={2404}
                periodLabel="past 30 days"
                breakdown={[
                  { label: "Staked", value: 170793, note: "4 positions" },
                  { label: "In wallet", value: 27528 },
                  { label: "Rewards, 30 days", value: 872.1 },
                ]}
              />
            </Example>
            <div className="grid gap-6 lg:grid-cols-2">
              <Example label="Panel with RewardsFeed">
                <Panel title="Latest rewards">
                  <RewardsFeed entries={rewards} days={2} />
                </Panel>
              </Example>
              <Example label="Panel with ActivityList">
                <Panel title="Recent activity">
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
      </ThemePair>
    </Section>
  );
}
