"use client";

import { Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Pagination,
  Progress,
  Skeleton,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tag,
  type SortDirection,
} from "@/design-system";
import { Example, Section } from "../_components/Section";
import { ThemePair } from "../_components/ThemePair";

const FILTERS = [
  { id: "all", label: "All pools", count: 12 },
  { id: "flexible", label: "Flexible", count: 7 },
  { id: "locked", label: "Locked", count: 5 },
];

function FilterTags() {
  const [active, setActive] = useState("all");
  const [applied, setApplied] = useState(["Ethereum", "APY > 5%"]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Pool type">
        {FILTERS.map((f) => (
          <Tag key={f.id} selected={active === f.id} count={f.count} onClick={() => setActive(f.id)}>
            {f.label}
          </Tag>
        ))}
        <Tag disabled>Liquid</Tag>
      </div>
      <div className="flex flex-wrap gap-2">
        {applied.map((label) => (
          <Tag key={label} onRemove={() => setApplied((a) => a.filter((x) => x !== label))}>
            {label}
          </Tag>
        ))}
        {applied.length === 0 && <p className="text-small text-muted">No filters applied.</p>}
      </div>
    </div>
  );
}

export function BadgeSection() {
  return (
    <Section
      id="badge"
      description="Badges name a state and can't be clicked. Tags are filters: they toggle, show a count, or can be removed."
    >
      <ThemePair>
        {() => (
          <>
            <Example label="Badge tones">
              <div className="flex flex-wrap gap-2">
                <Badge>Flexible</Badge>
                <Badge tone="accent">New</Badge>
                <Badge tone="success" dot>
                  Active
                </Badge>
                <Badge tone="warning" dot>
                  Unbonding
                </Badge>
                <Badge tone="danger" dot>
                  Slashed
                </Badge>
              </div>
            </Example>
            <Example label="Tags">
              <FilterTags />
            </Example>
          </>
        )}
      </ThemePair>
    </Section>
  );
}

export function CardSection() {
  return (
    <Section
      id="card"
      description="Surface cards hold a unit of content. Outline cards group without adding weight. Inset cards sit inside another surface, like a summary inside a form."
    >
      <ThemePair>
        {() => (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card variant="surface" padding="sm">
                <p className="text-small text-muted">Surface</p>
              </Card>
              <Card variant="outline" padding="sm">
                <p className="text-small text-muted">Outline</p>
              </Card>
              <Card variant="inset" padding="sm">
                <p className="text-small text-muted">Inset</p>
              </Card>
            </div>
            <Example label="Interactive pool card">
              <Card interactive className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-h4 font-medium">
                      <a href="#card" className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none">
                        Ethereum
                      </a>
                    </h3>
                    <p className="text-small text-muted">ETH, flexible term</p>
                  </div>
                  <Badge tone="success" dot>
                    Open
                  </Badge>
                </div>
                <dl className="grid grid-cols-3 gap-4">
                  {[
                    ["APY", "3.80%"],
                    ["TVL", "$412.6M"],
                    ["Min.", "0.1 ETH"],
                  ].map(([term, value]) => (
                    <div key={term}>
                      <dt className="text-caption text-muted">{term}</dt>
                      <dd className="font-mono text-body">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </Example>
          </>
        )}
      </ThemePair>
    </Section>
  );
}

type Position = { pool: string; amount: number; ticker: string; apy: number; rewards: number; status: "active" | "unbonding" };

const POSITIONS: Position[] = [
  { pool: "Ethereum", amount: 12.5, ticker: "ETH", apy: 3.8, rewards: 0.4121, status: "active" },
  { pool: "Solana", amount: 840, ticker: "SOL", apy: 6.9, rewards: 18.204, status: "active" },
  { pool: "Cosmos Hub", amount: 1200, ticker: "ATOM", apy: 14.2, rewards: 61.88, status: "unbonding" },
];

type SortKey = "apy" | "rewards";

function PositionsTable({ empty = false }: { empty?: boolean }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: Exclude<SortDirection, null> }>({ key: "apy", dir: "desc" });

  const rows = useMemo(() => {
    if (empty) return [];
    const sorted = [...POSITIONS].sort((a, b) => a[sort.key] - b[sort.key]);
    return sort.dir === "asc" ? sorted : sorted.reverse();
  }, [empty, sort]);

  const toggle = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));

  return (
    <Table label={empty ? "Positions (empty)" : "Positions"}>
      <THead>
        <tr>
          <TH>Pool</TH>
          <TH numeric>Staked</TH>
          <TH numeric sort={sort.key === "apy" ? sort.dir : null} onSort={() => toggle("apy")}>
            APY
          </TH>
          <TH numeric sort={sort.key === "rewards" ? sort.dir : null} onSort={() => toggle("rewards")}>
            Rewards
          </TH>
          <TH>Status</TH>
        </tr>
      </THead>
      <TBody>
        {rows.map((p) => (
          <TR key={p.pool}>
            <TD className="font-medium">{p.pool}</TD>
            <TD numeric>
              {p.amount.toLocaleString("en-US")} {p.ticker}
            </TD>
            <TD numeric>{p.apy.toFixed(2)}%</TD>
            <TD numeric className="text-success">
              +{p.rewards.toFixed(4)}
            </TD>
            <TD>
              <Badge tone={p.status === "active" ? "success" : "warning"} dot>
                {p.status === "active" ? "Active" : "Unbonding"}
              </Badge>
            </TD>
          </TR>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={5} className="py-12">
              <div className="flex flex-col items-center gap-3 text-center">
                <Inbox aria-hidden className="size-6 text-muted" />
                <p className="text-small text-muted">You have no positions yet.</p>
                <Button size="sm">Start staking</Button>
              </div>
            </td>
          </tr>
        )}
      </TBody>
    </Table>
  );
}

export function TableSection() {
  return (
    <Section
      id="table"
      description="Figures are monospace and right-aligned so decimals line up. Sortable columns say which way they sort. On narrow screens the table scrolls inside its own frame."
    >
      <ThemePair stacked>
        {() => (
          <>
            <Example label="Sortable">
              <PositionsTable />
            </Example>
            <Example label="Empty">
              <PositionsTable empty />
            </Example>
          </>
        )}
      </ThemePair>
    </Section>
  );
}

const FAQ = [
  {
    id: "unbonding",
    title: "How long does it take to unstake?",
    content: "It depends on the network. Ethereum takes 2–5 days, Cosmos Hub 21 days. The pool page shows the current estimate.",
  },
  {
    id: "rewards",
    title: "When are rewards paid?",
    content: "Rewards are calculated every epoch and paid to your wallet once a day, after the platform fee.",
  },
  {
    id: "slashing",
    title: "What happens if a validator is slashed?",
    content: "A slashing penalty reduces the staked balance of the affected pool. The risk disclosure explains how losses are allocated.",
  },
];

export function AccordionSection() {
  return (
    <Section id="accordion" description="For FAQs and long secondary detail. One panel open at a time by default.">
      <ThemePair>{() => <Accordion items={FAQ} defaultOpen={["unbonding"]} />}</ThemePair>
    </Section>
  );
}

export function ProgressSection() {
  return (
    <Section
      id="progress"
      description="Progress shows how far along a known process is, such as an unbonding period. Skeletons hold the shape of content while it loads."
    >
      <ThemePair>
        {() => (
          <>
            <Example label="Progress">
              <div className="flex flex-col gap-5">
                <Progress label="Unbonding" value={60} valueLabel="3 of 5 days" />
                <Progress label="Pool capacity" value={92} tone="warning" />
                <Progress label="Referral goal" value={100} tone="success" />
              </div>
            </Example>
            <Example label="Skeleton of a loading pool card">
              <div className="flex flex-col gap-5 rounded-card border border-rule p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-pill" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </div>
            </Example>
          </>
        )}
      </ThemePair>
    </Section>
  );
}

function PaginationDemo({ pageCount }: { pageCount: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />;
}

export function PaginationSection() {
  return (
    <Section
      id="pagination"
      description="For long lists like transactions and blog posts. On phones the page numbers collapse into a counter between the arrows."
    >
      <ThemePair>
        {() => (
          <>
            <Example label="5 pages">
              <PaginationDemo pageCount={5} />
            </Example>
            <Example label="24 pages">
              <PaginationDemo pageCount={24} />
            </Example>
          </>
        )}
      </ThemePair>
    </Section>
  );
}
