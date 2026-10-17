"use client";

import { Copy, UserPlus } from "lucide-react";
import { Badge, Button, TBody, TD, TH, THead, TR, Table, useToast } from "@/design-system";
import { REFERRALS, REFERRAL_MONTHS, REFERRAL_SHARE_PERCENT } from "@/data/referrals";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/format";
import { EmptyState } from "../../blocks/EmptyState";
import { StepsFlow } from "../../blocks/StepsFlow";
import { PageTitle } from "../PageTitle";
import { Panel } from "../Panel";

/** Stable 4-character suffix from the email, so the code doesn't change between visits */
function codeFor(name: string, email: string) {
  let h = 7;
  for (const c of email) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const suffix = h.toString(36).toUpperCase().slice(-4).padStart(4, "0");
  return `${(name.split(" ")[0] || "FRIEND").toUpperCase().slice(0, 8)}-${suffix}`;
}

export function Referrals() {
  const { session } = useAuth();
  const { toast } = useToast();
  const code = codeFor(session?.name ?? "", session?.email ?? "");
  const link = `https://example.com/r/${code}`;
  const active = REFERRALS.filter((r) => r.status === "active").length;
  const earned = REFERRALS.reduce((s, r) => s + r.earned, 0);

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ tone: "success", title: `${what} copied` });
    } catch {
      toast({ tone: "error", title: "Couldn’t copy", description: "Select the text and copy it manually." });
    }
  };

  return (
    <>
      <PageTitle
        title="Referrals"
        lead={`Invite people you know. You receive ${REFERRAL_SHARE_PERCENT}% of the platform fee on their rewards for ${REFERRAL_MONTHS} months.`}
      />

      <div className="flex flex-col gap-6">
        <section aria-labelledby="ref-link-title" className="rounded-card border border-rule bg-surface p-5 md:p-6">
          <h2 id="ref-link-title" className="text-body font-medium">
            Your invite
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {[
              { label: "Link", value: link, what: "Link" },
              { label: "Code", value: code, what: "Code" },
            ].map((item) => (
              <div key={item.label} className="flex min-w-0 flex-col gap-1.5">
                <p className="text-small text-muted">{item.label}</p>
                <div className="flex items-center gap-2 rounded-field border border-rule bg-bg py-1.5 pr-1.5 pl-3.5">
                  <code className="min-w-0 flex-1 truncate font-mono text-small">{item.value}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<Copy aria-hidden />}
                    onClick={() => copy(item.value, item.what)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-caption text-muted">Demo programme: terms are illustrative and not an offer.</p>
        </section>

        <dl className="grid overflow-hidden rounded-card border border-rule bg-surface sm:grid-cols-3">
          {[
            { label: "Invited", value: String(REFERRALS.length) },
            { label: "Staking now", value: String(active) },
            { label: "Earned so far", value: formatCurrency(earned) },
          ].map((s, i) => (
            <div key={s.label} className={i > 0 ? "border-t border-rule p-5 sm:border-t-0 sm:border-l" : "p-5"}>
              <dt className="text-small text-muted">{s.label}</dt>
              <dd className="mt-1 font-mono text-h3">{s.value}</dd>
            </div>
          ))}
        </dl>

        <Panel title="How it works">
          <StepsFlow
            steps={[
              { title: "Share", body: "Send your link or code to someone you know." },
              { title: "They stake", body: "They create an account and make their first stake." },
              {
                title: "You earn",
                body: `You get ${REFERRAL_SHARE_PERCENT}% of the platform fee on their rewards, paid daily for ${REFERRAL_MONTHS} months. Their yield doesn’t change.`,
              },
            ]}
          />
        </Panel>

        <Panel title="People you’ve invited">
          {REFERRALS.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No invites yet"
              body="Share your link and people who sign up appear here."
            />
          ) : (
            <Table label="Invited people">
              <THead>
                <tr>
                  <TH>Account</TH>
                  <TH className="max-sm:hidden">Joined</TH>
                  <TH>Status</TH>
                  <TH numeric>You earned</TH>
                </tr>
              </THead>
              <TBody>
                {REFERRALS.map((r) => (
                  <TR key={r.id}>
                    <TD className="font-mono text-small">{r.email}</TD>
                    <TD className="text-muted max-sm:hidden">{formatDate(r.joined)}</TD>
                    <TD>
                      {r.status === "active" ? (
                        <Badge tone="success" dot>
                          Staking
                        </Badge>
                      ) : (
                        <Badge>Signed up</Badge>
                      )}
                    </TD>
                    <TD numeric>{formatCurrency(r.earned)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </Panel>
      </div>
    </>
  );
}
