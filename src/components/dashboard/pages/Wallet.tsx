"use client";

import { ArrowDownLeft, ArrowUpRight, Copy, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/components/Link";
import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Input,
  Modal,
  Select,
  buttonClasses,
  useToast,
} from "@/design-system";
import { pools } from "@/data/pools";
import { formatCurrency } from "@/lib/format";
import { useFocusFirstError } from "@/lib/forms";
import { PORTFOLIO_TICKERS, priceOf, usePortfolio } from "@/lib/portfolio";
import { walletUsd } from "@/lib/portfolioStats";
import { ActivityList } from "../ActivityList";
import { PageTitle } from "../PageTitle";
import { Panel } from "../Panel";
import { tokenAmount } from "../txMeta";

/* Demo deposit addresses: shaped like each network's addresses, not real */
const DEPOSIT_ADDRESSES: Record<string, string> = {
  ETH: "0x4f2a9c1e7b3d5a6f8e0c2b4d6a8f0e1c3b5d7a9e",
  SOL: "7nVxq3PkQ8mZt2hRw5LcYf9JdG4sBn6EaUoK1iTzX3Vp",
  ATOM: "cosmos1v9k3x8fz3qj7w2m5n4l6p0r8t9y2u4e6a3s5d7",
  DOT: "15Hc8yWq8nP3kR6tM2vB9xL4zQ7jF5gD1sA8hN3cE6uK",
  AVAX: "0x8b1d4e7a2c5f9b3e6d0a4c7f1b5e8d2a6c9f3b7e",
  ADA: "addr1qx9k3m7v2n5p8r4t6w0y3z5b7d9f2h4j6l8n0q2s4u",
};

const tickerOptions = PORTFOLIO_TICKERS.map((t) => ({ value: t, label: t }));

function parseAmount(text: string) {
  const n = Number(text.replace(/,/g, ""));
  return text.trim() !== "" && Number.isFinite(n) ? n : NaN;
}

export function Wallet() {
  const params = useSearchParams();
  const router = useRouter();
  const { state, transactions, deposit, withdraw } = usePortfolio();
  const { toast } = useToast();
  /* ?deposit=ETH or ?withdraw=ETH opens that form, e.g. from the overview's quick actions */
  const requestedMode = params.has("withdraw") ? "withdraw" : "deposit";
  const requested = params.get(requestedMode);
  const [modal, setModal] = useState<"deposit" | "withdraw" | null>(
    requested && PORTFOLIO_TICKERS.includes(requested) ? requestedMode : null,
  );
  const [ticker, setTicker] = useState(requested && PORTFOLIO_TICKERS.includes(requested) ? requested : "ETH");
  const [amountText, setAmountText] = useState("");
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; address?: string; code?: string }>({});
  const [attempt, setAttempt] = useState(0);
  const [working, setWorking] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);

  const total = walletUsd(state);
  const assets = PORTFOLIO_TICKERS.map((t) => ({
    ticker: t,
    amount: state.wallet[t] ?? 0,
    usd: (state.wallet[t] ?? 0) * priceOf(t),
  })).sort((a, b) => b.usd - a.usd);
  const transfers = transactions.filter((t) => t.type === "deposit" || t.type === "withdraw").slice(0, 6);
  const balance = state.wallet[ticker] ?? 0;

  const open = (kind: "deposit" | "withdraw", t: string) => {
    setTicker(t);
    setAmountText("");
    setAddress("");
    setCode("");
    setErrors({});
    setModal(kind);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DEPOSIT_ADDRESSES[ticker]);
      toast({ tone: "success", title: "Address copied" });
    } catch {
      toast({ tone: "error", title: "Couldn’t copy", description: "Select the address and copy it manually." });
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const amount = parseAmount(amountText);
    const found: typeof errors = {
      amount: !(amount > 0)
        ? "Enter an amount greater than 0."
        : modal === "withdraw" && amount > balance
          ? `You have ${tokenAmount(balance, ticker)} available.`
          : undefined,
    };
    if (modal === "withdraw") {
      found.address = address.trim().length >= 10 ? undefined : "Paste the full withdrawal address.";
      found.code = /^\d{6}$/.test(code) ? undefined : "Enter the 6-digit code from your authenticator app.";
    }
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      setAttempt((a) => a + 1);
      return;
    }
    setWorking(true);
    const result = modal === "deposit" ? await deposit(ticker, amount) : await withdraw(ticker, amount, address.trim());
    setWorking(false);
    if (!result.ok) {
      toast({
        tone: "error",
        title: modal === "deposit" ? "Deposit failed" : "Withdrawal not sent",
        description: result.error,
      });
      return;
    }
    toast({
      tone: "success",
      title: modal === "deposit" ? "Deposit received" : "Withdrawal sent",
      description: modal === "deposit" ? result.message : `${result.message} It shows as pending for a few seconds.`,
    });
    setModal(null);
  };

  return (
    <>
      <PageTitle
        title="Wallet"
        lead="Balances available to stake or withdraw."
        actions={
          <>
            <Button variant="secondary" iconLeft={<ArrowDownLeft aria-hidden />} onClick={() => open("deposit", "ETH")}>
              Deposit
            </Button>
            <Button variant="secondary" iconLeft={<ArrowUpRight aria-hidden />} onClick={() => open("withdraw", "ETH")}>
              Withdraw
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <section
          aria-labelledby="assets-title"
          className="min-w-0 rounded-card border border-rule bg-surface xl:col-span-2"
        >
          <div className="border-b border-rule p-5 md:p-6">
            <h2 id="assets-title" className="text-small text-muted">
              Available balance
            </h2>
            <p className="mt-1 text-h1 font-semibold tracking-tight">{formatCurrency(total)}</p>
          </div>
          <ul>
            {assets.map((a) => {
              const pool = pools.find((p) => p.ticker === a.ticker);
              return (
                <li
                  key={a.ticker}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-3 border-b border-rule py-3 pr-2 pl-5 last:border-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_16rem] md:gap-x-4 md:px-6 md:py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {pool && (
                      <Image
                        src={`/logos/networks/${pool.id}.svg`}
                        alt=""
                        width={32}
                        height={32}
                        unoptimized
                        className="size-8 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium">{a.ticker}</p>
                      <p className="truncate text-caption text-muted">{pool?.network}</p>
                    </div>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="font-mono text-small">{tokenAmount(a.amount, a.ticker)}</p>
                    <p className="font-mono text-caption text-muted">{formatCurrency(a.usd)}</p>
                  </div>
                  {/* Phones: the three actions fold into a menu so each asset takes one line */}
                  <Dropdown>
                    <DropdownTrigger
                      aria-label={`${a.ticker} actions`}
                      className="grid size-10 place-items-center rounded-field text-muted [-webkit-tap-highlight-color:transparent] hover:bg-surface-2 hover:text-text active:bg-accent active:text-on-accent data-[state=open]:bg-surface-2 data-[state=open]:text-text md:hidden"
                    >
                      <MoreHorizontal aria-hidden className="size-5" />
                    </DropdownTrigger>
                    <DropdownContent align="end">
                      <DropdownItem icon={<ArrowDownLeft aria-hidden />} onSelect={() => open("deposit", a.ticker)}>
                        Deposit
                      </DropdownItem>
                      <DropdownItem
                        icon={<ArrowUpRight aria-hidden />}
                        disabled={a.amount === 0}
                        onSelect={() => open("withdraw", a.ticker)}
                      >
                        Withdraw
                      </DropdownItem>
                      {pool && a.amount >= pool.minStake && (
                        <DropdownItem
                          icon={<PlusCircle aria-hidden />}
                          onSelect={() => router.push(`/dashboard/stake?pool=${pool.id}`)}
                        >
                          Stake
                        </DropdownItem>
                      )}
                    </DropdownContent>
                  </Dropdown>
                  <div className="flex flex-wrap justify-end gap-2 max-md:hidden">
                    <Button size="sm" variant="ghost" onClick={() => open("deposit", a.ticker)}>
                      Deposit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => open("withdraw", a.ticker)}
                      disabled={a.amount === 0}
                    >
                      Withdraw
                    </Button>
                    {pool && a.amount >= pool.minStake && (
                      <Link
                        href={`/dashboard/stake?pool=${pool.id}`}
                        className={buttonClasses({ size: "sm", variant: "secondary" })}
                      >
                        Stake
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <Panel
          title="Recent transfers"
          action={
            <Link
              href="/dashboard/transactions"
              className="rounded-sm text-small font-medium text-accent-text hover:underline"
            >
              All activity
            </Link>
          }
        >
          <ActivityList items={transfers} empty="No deposits or withdrawals yet." />
        </Panel>
      </div>

      <Modal
        open={modal !== null}
        onOpenChange={(o) => !working && !o && setModal(null)}
        title={modal === "withdraw" ? "Withdraw" : "Deposit"}
        description={
          modal === "withdraw"
            ? "Send funds to an address you control."
            : "Send funds to your deposit address, then confirm below once the transfer is on its way."
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)} disabled={working}>
              Cancel
            </Button>
            <Button type="submit" form="transfer-form" loading={working}>
              {modal === "withdraw" ? (working ? "Sending" : "Withdraw") : working ? "Confirming" : "I’ve sent it"}
            </Button>
          </>
        }
      >
        <form id="transfer-form" ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Select label="Asset" value={ticker} onValueChange={(t) => setTicker(t)} options={tickerOptions} />
          {modal === "deposit" && (
            <div className="flex flex-col gap-1.5">
              <p className="text-small font-medium">
                Your {pools.find((p) => p.ticker === ticker)?.network} deposit address
              </p>
              <div className="flex items-center gap-2 rounded-field bg-surface-2 p-3">
                <code className="min-w-0 flex-1 font-mono text-caption break-all">{DEPOSIT_ADDRESSES[ticker]}</code>
                <button
                  type="button"
                  onClick={copyAddress}
                  aria-label="Copy deposit address"
                  className="grid size-8 shrink-0 place-items-center rounded-field text-muted hover:bg-surface hover:text-text"
                >
                  <Copy aria-hidden className="size-4" />
                </button>
              </div>
              <p className="text-caption text-muted">Only send this asset on this network.</p>
            </div>
          )}
          <Input
            label="Amount"
            inputMode="decimal"
            numeric
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            error={errors.amount}
            hint={modal === "withdraw" ? `Available ${tokenAmount(balance, ticker)}` : undefined}
            suffix={
              modal === "withdraw" ? (
                <span className="flex items-center gap-2">
                  {ticker}
                  <button
                    type="button"
                    onClick={() => setAmountText(String(balance))}
                    className="rounded-sm px-1.5 py-0.5 text-caption font-medium text-accent-text hover:bg-surface-2"
                  >
                    Max
                  </button>
                </span>
              ) : (
                ticker
              )
            }
          />
          {modal === "withdraw" && (
            <>
              <Input
                label="Withdrawal address"
                numeric
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
                autoComplete="off"
              />
              <Input
                label="Two-factor code"
                inputMode="numeric"
                numeric
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                error={errors.code}
                hint="Enter the 6-digit code from your authenticator app."
                autoComplete="one-time-code"
              />
            </>
          )}
        </form>
      </Modal>
    </>
  );
}
