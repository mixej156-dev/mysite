"use client";

import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Coins, Layers, Plus } from "lucide-react";
import { useMemo } from "react";
import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { usePortfolio } from "@/lib/portfolio";
import { earnedByPosition, rewardsUsd, stakedUsd, valueHistory, walletUsd } from "@/lib/portfolioStats";
import { DEMO_TODAY } from "@/lib/series";
import { EmptyState } from "../../blocks/EmptyState";
import { TimeSeriesChart } from "../../charts/TimeSeriesChart";
import { ActivityList } from "../ActivityList";
import { BalanceCard } from "../BalanceCard";
import { DashboardTour } from "../DashboardTour";
import { PageTitle } from "../PageTitle";
import { Panel } from "../Panel";
import { RewardsFeed } from "../RewardsFeed";
import { StakePositionsTable } from "../StakePositionsTable";

const viewAll = "rounded-sm text-small font-medium text-accent-text hover:underline";

export function Overview() {
  const { session } = useAuth();
  const { state, rewards, transactions } = usePortfolio();

  const history = useMemo(() => valueHistory(state), [state]);
  const earned = useMemo(() => earnedByPosition(rewards), [rewards]);
  const staked = stakedUsd(state);
  const wallet = walletUsd(state);
  const total = staked + wallet;
  const monthAgo = history[history.length - 31]?.value ?? total;

  const rows = state.positions.map((p) => ({ ...p, earned: earned.get(p.id) ?? 0 }));
  const activity = transactions.filter((t) => t.type !== "reward").slice(0, 5);

  return (
    <>
      <PageTitle
        title={`Good to see you, ${session?.name.split(" ")[0] ?? "there"}`}
        lead={`Here’s where your stake stands on ${formatDate(DEMO_TODAY)}.`}
      />

      <div className="flex flex-col gap-6 short:gap-5">
        <BalanceCard
          total={total}
          change={total - monthAgo}
          periodLabel="past 30 days"
          breakdown={[
            {
              label: "Staked",
              value: staked,
              note: `${state.positions.length} positions`,
              tone: "blue",
              inTotal: true,
            },
            { label: "In wallet", value: wallet, note: "Available to stake or withdraw", tone: "teal", inTotal: true },
            { label: "30-day rewards", value: rewardsUsd(rewards, 30), note: "Paid out daily", tone: "amber" },
          ]}
          actions={
            <>
              <Link href="/dashboard/stake" className={buttonClasses({ className: "gap-1.5 px-1" })}>
                <Plus aria-hidden />
                Stake
              </Link>
              <Link
                href="/dashboard/wallet?deposit=ETH"
                className={buttonClasses({ variant: "secondary", className: "gap-1.5 px-1" })}
              >
                <ArrowDownLeft aria-hidden />
                Deposit
              </Link>
              <Link
                href="/dashboard/wallet?withdraw=ETH"
                className={buttonClasses({ variant: "secondary", className: "gap-1.5 px-1" })}
              >
                <ArrowUpRight aria-hidden />
                Withdraw
              </Link>
            </>
          }
        />

        <div className="grid gap-6 xl:grid-cols-3 short:gap-5">
          <TimeSeriesChart
            title="Balance"
            series={[{ id: "value", label: "Balance", color: "var(--series-1)", points: history }]}
            valueFormat="usd"
            note="Positions and today’s wallet balances at reference prices."
            animate
            className="xl:col-span-2"
          />
          <Panel
            title="Latest rewards"
            icon={Coins}
            tone="amber"
            action={
              <Link href="/dashboard/rewards" className={viewAll}>
                All rewards
              </Link>
            }
          >
            {/* Phones and short screens show two days so the page stays short */}
            <div className="max-sm:[&_ol>li:nth-child(3)]:hidden short:[&_ol>li:nth-child(3)]:hidden">
              <RewardsFeed entries={rewards} days={3} />
            </div>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 short:gap-5">
          <Panel
            title="Positions"
            icon={Layers}
            tour="positions"
            className="xl:col-span-2"
            action={
              <Link href="/dashboard/positions" className={viewAll}>
                Manage
              </Link>
            }
          >
            {rows.length === 0 ? (
              <EmptyState
                art="positions"
                title="No positions yet"
                body="Stake from your wallet balance and rewards start the next day."
                action={
                  <Link href="/dashboard/stake" className={buttonClasses()}>
                    Start staking
                  </Link>
                }
              />
            ) : (
              <StakePositionsTable rows={rows} compact label="Positions overview" />
            )}
          </Panel>
          <Panel
            title="Recent activity"
            icon={ArrowLeftRight}
            tone="violet"
            action={
              <Link href="/dashboard/transactions" className={viewAll}>
                All activity
              </Link>
            }
          >
            {/* Short screens show four items to match the positions table */}
            <div className="short:[&_ul>li:nth-child(4)]:border-0 short:[&_ul>li:nth-child(5)]:hidden">
              <ActivityList items={activity} />
            </div>
          </Panel>
        </div>
      </div>
      <DashboardTour />
    </>
  );
}
