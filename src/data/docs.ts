import type { ContentBlock } from "@/lib/content";

/* Documentation: short task-focused articles in four sections. Fictional API; the host uses the reserved .example domain. */

export type DocArticle = {
  slug: string;
  title: string;
  description: string;
  body: ContentBlock[];
};

export type DocSection = { title: string; articles: DocArticle[] };

const API = "https://api.lonar-eco.example/v1";

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Getting started",
    articles: [
      {
        slug: "what-is-staking",
        title: "What is staking",
        description: "How proof-of-stake networks pay validators, and where you fit in.",
        body: [
          {
            type: "p",
            text: "Proof-of-stake networks are secured by validators that lock up tokens as collateral. In return for doing their work honestly, validators receive rewards from the network.",
          },
          { type: "h2", text: "Where rewards come from" },
          {
            type: "p",
            text: "Rewards come from new tokens issued by the network and from fees paid by its users. The mix differs by network; each pool page explains it.",
          },
          {
            type: "p",
            text: "Issuance usually falls as more of the supply is staked, so yield on a network moves over time even when nothing about the validator changes. The APY history on each pool page shows how far it has moved in the past.",
          },
          { type: "h2", text: "What staking with us means" },
          {
            type: "p",
            text: "You add tokens to a pool. We delegate them to validators we operate, record rewards each epoch, deduct the platform fee and pay out the rest daily.",
          },
          {
            type: "list",
            items: [
              "You choose the pool and the amount; we run the validator infrastructure",
              "Every reward is recorded against the epoch and validator that earned it",
              "The fee is a fixed share of rewards, never of your principal",
            ],
          },
          { type: "h2", text: "What can go wrong" },
          {
            type: "list",
            items: [
              "Slashing: a validator penalty that removes part of the stake",
              "Price: the asset can lose value",
              "Liquidity: unstaked funds are locked during unbonding",
            ],
          },
          {
            type: "note",
            title: "Before you stake",
            text: "Read the risk disclosure. Estimated APY is based on recent network conditions and is not a promise of future returns.",
          },
        ],
      },
      {
        slug: "create-an-account",
        title: "Create an account",
        description: "Sign up, verify your email and secure the account before your first stake.",
        body: [
          {
            type: "p",
            text: "You need an email address and a password. Business accounts can add more members later.",
          },
          { type: "h2", text: "Steps" },
          {
            type: "steps",
            items: [
              "Choose Start staking and enter your email and a password",
              "Confirm the email we send you",
              "Turn on two-factor authentication in Settings",
            ],
          },
          { type: "h2", text: "Choosing a password" },
          {
            type: "p",
            text: "Use at least 12 characters and don’t reuse a password from another service. A password manager makes this easy.",
          },
          { type: "h2", text: "Business accounts" },
          {
            type: "p",
            text: "Business accounts have members with roles. Owners manage members and withdrawals, operators can stake and unstake, and viewers can only read balances and export reports.",
          },
          { type: "h2", text: "Before your first stake" },
          {
            type: "p",
            text: "Add a withdrawal address and read the risk disclosure. You can then stake from the dashboard.",
          },
        ],
      },
      {
        slug: "fund-your-account",
        title: "Fund your account",
        description: "Deposit supported assets from an exchange or a wallet you control.",
        body: [
          {
            type: "p",
            text: "Each supported asset has its own deposit address. Funds appear in your wallet balance once the network confirms the transfer.",
          },
          { type: "h2", text: "Make a deposit" },
          {
            type: "steps",
            items: [
              "Open Wallet in the dashboard and choose Deposit next to the asset",
              "Copy the address or scan the QR code",
              "Send the funds from your exchange or wallet, on the network shown",
            ],
          },
          {
            type: "note",
            title: "Check the network",
            text: "Only send an asset on the network named next to its address. Funds sent on another network may not be recoverable.",
          },
          { type: "h2", text: "Confirmation times" },
          {
            type: "list",
            items: [
              "Ethereum: about 13 minutes (64 blocks)",
              "Solana: under a minute",
              "Cosmos, Polkadot, Avalanche and Cardano: a few minutes",
            ],
          },
          { type: "h2", text: "Minimums" },
          {
            type: "p",
            text: "There is no minimum deposit, but each pool has a minimum stake. It’s shown on the pool page and in the stake form.",
          },
        ],
      },
      {
        slug: "glossary",
        title: "Glossary",
        description: "The terms used across the dashboard and these docs.",
        body: [
          { type: "p", text: "Short definitions of the words you’ll see most often." },
          { type: "h2", text: "Network terms" },
          {
            type: "list",
            items: [
              "Validator: a node that proposes and attests to blocks and earns rewards for it",
              "Epoch: a fixed period on the network after which rewards are calculated",
              "Delegation: assigning stake to a validator without handing over the tokens",
              "Slashing: a penalty the network applies to a validator that misbehaves",
            ],
          },
          { type: "h2", text: "Platform terms" },
          {
            type: "list",
            items: [
              "Pool: a group of validators we run on one network, with one set of terms",
              "Position: one stake you hold in a pool",
              "Unbonding: the waiting period between unstaking and receiving funds",
              "Auto-restake: adding each payout to the position instead of the wallet",
            ],
          },
          { type: "h2", text: "Yield terms" },
          {
            type: "list",
            items: [
              "APR: yearly rate without compounding",
              "APY: yearly rate if every payout is restaked",
              "Net APY: APY after the platform fee, the figure shown on pool pages",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Staking",
    articles: [
      {
        slug: "choosing-a-pool",
        title: "Choosing a pool",
        description: "Compare yield, unbonding period, minimums and fees before you commit.",
        body: [
          {
            type: "p",
            text: "Pools differ in more than yield. How long funds take to come back, and how much yield moves, matter as much.",
          },
          { type: "h2", text: "What to compare" },
          {
            type: "list",
            items: [
              "Net APY, and how much it has moved over the last 90 days",
              "Unbonding period: from instant on Cardano to 28 days on Polkadot",
              "Minimum stake and platform fee",
              "Slashing rules on the network",
            ],
          },
          { type: "h2", text: "Use the tools" },
          {
            type: "p",
            text: "The pool comparison puts up to three pools side by side with their APY history. The rewards calculator projects a balance over one to five years, with or without restaking.",
          },
          {
            type: "note",
            title: "Spreading stake",
            text: "Some stakers split funds across pools with different unbonding periods, so part of the balance is always quick to withdraw.",
          },
        ],
      },
      {
        slug: "stake-and-unstake",
        title: "Stake and unstake",
        description: "Choose a pool, confirm the terms, and understand what happens when you unstake.",
        body: [
          { type: "p", text: "Staking takes a few steps and every term is shown before you confirm." },
          { type: "h2", text: "Stake" },
          {
            type: "steps",
            items: [
              "Open Stake in the dashboard and choose a pool",
              "Enter an amount at or above the pool minimum",
              "Review the APY, fee and unbonding period, then confirm",
            ],
          },
          {
            type: "p",
            text: "The position appears straight away. It starts earning from the next epoch, and the first reward is recorded the following day.",
          },
          { type: "h2", text: "Unstake" },
          {
            type: "p",
            text: "Choose Unstake on a position. Funds enter the network’s unbonding queue and earn nothing until it ends. The expected release date is shown before you confirm.",
          },
          { type: "h2", text: "Partial unstaking" },
          {
            type: "p",
            text: "You can unstake part of a position. The remainder keeps earning, and the unstaked part gets its own unbonding timer.",
          },
          { type: "h2", text: "Cancelling" },
          {
            type: "p",
            text: "Unbonding can’t be cancelled on most networks. To keep earning, stake the funds again once they are released.",
          },
        ],
      },
      {
        slug: "rewards-and-payouts",
        title: "Rewards and payouts",
        description: "How rewards are recorded per epoch and paid out daily, and how to read the ledger.",
        body: [
          {
            type: "p",
            text: "Rewards are recorded each epoch against the validator that earned them and paid out once a day.",
          },
          { type: "h2", text: "When payouts arrive" },
          {
            type: "p",
            text: "Payouts are made at 00:00 UTC and include every epoch that closed in the previous 24 hours. They land in your wallet balance unless auto-restake is on.",
          },
          { type: "h2", text: "Restaking" },
          { type: "p", text: "Turn on auto-restake for a position to add each payout to the stake. Off by default." },
          { type: "h2", text: "The ledger" },
          {
            type: "p",
            text: "The rewards ledger lists every reward and penalty by epoch and validator, before and after the fee. Export any range as CSV.",
          },
          {
            type: "code",
            label: "rewards.csv",
            code: "date,pool,asset,amount,usd_value\n2026-10-16,eth,ETH,0.004182,10.94\n2026-10-16,sol,SOL,0.081340,12.37",
          },
          { type: "h2", text: "Taxes" },
          {
            type: "p",
            text: "How staking rewards are taxed depends on where you live. The CSV export gives the date and value of each reward; ask a tax adviser how to report them.",
          },
        ],
      },
      {
        slug: "unbonding-periods",
        title: "Unbonding periods",
        description: "Why funds are locked after you unstake, and how long each network takes.",
        body: [
          {
            type: "p",
            text: "Networks hold unstaked funds for a while so that a validator can still be penalised for misbehaviour discovered after the fact.",
          },
          { type: "h2", text: "By network" },
          {
            type: "list",
            items: [
              "Ethereum: about 5 days, longer when the exit queue is busy",
              "Solana: about 3 days, until the end of the current epoch",
              "Cosmos: 21 days",
              "Polkadot: 28 days",
              "Avalanche: 14 days",
              "Cardano: none; funds are available straight away",
            ],
          },
          { type: "h2", text: "During unbonding" },
          {
            type: "p",
            text: "Funds earn no rewards and can’t be moved. Positions show the days left and the expected release date.",
          },
          {
            type: "note",
            text: "Queue length on Ethereum changes with demand. The date shown is our best estimate and can move later.",
          },
        ],
      },
      {
        slug: "slashing-and-performance",
        title: "Slashing and performance",
        description: "How validator penalties work and what we do to avoid them.",
        body: [
          {
            type: "p",
            text: "Slashing removes part of a validator’s stake when it breaks network rules, for example by signing two conflicting blocks.",
          },
          { type: "h2", text: "How we reduce the risk" },
          {
            type: "list",
            items: [
              "Signing keys are held by one active node at a time, with remote signers that refuse double signing",
              "Nodes run in several regions and with more than one client where the network allows it",
              "Upgrades are tested on testnets before they reach mainnet validators",
            ],
          },
          { type: "h2", text: "Performance figures" },
          {
            type: "p",
            text: "We track uptime and missed blocks for every validator and publish them in a quarterly performance report. Missed blocks lower rewards slightly but are not slashing.",
          },
          { type: "h2", text: "If a slashing event happens" },
          {
            type: "p",
            text: "We publish a report with the cause, the amount and the affected positions. The penalty shows as a separate line in the rewards ledger.",
          },
        ],
      },
    ],
  },
  {
    title: "Account & security",
    articles: [
      {
        slug: "two-factor-authentication",
        title: "Two-factor authentication",
        description: "Protect sign-ins and withdrawals with an authenticator app or a security key.",
        body: [
          {
            type: "p",
            text: "Two-factor authentication asks for a second proof that it’s you. It is required for withdrawals.",
          },
          { type: "h2", text: "Set it up" },
          {
            type: "steps",
            items: [
              "Open Settings, then Security",
              "Choose Set up two-factor",
              "Scan the code with an authenticator app, or add a hardware key",
            ],
          },
          { type: "h2", text: "Recovery codes" },
          { type: "p", text: "Store the recovery codes somewhere safe and offline. Each code works once." },
          { type: "h2", text: "Lost your device" },
          {
            type: "p",
            text: "Sign in with a recovery code, then set up two-factor again on the new device. Without a code, contact support; account recovery takes a few business days and includes identity checks.",
          },
        ],
      },
      {
        slug: "withdrawal-addresses",
        title: "Withdrawal addresses",
        description: "Save trusted addresses and how the allowlist delay protects them.",
        body: [
          {
            type: "p",
            text: "Withdrawals only go to addresses on your allowlist. Adding an address takes effect after a 24-hour delay.",
          },
          { type: "h2", text: "Add an address" },
          {
            type: "steps",
            items: [
              "Open Wallet and choose Withdraw, then Manage addresses",
              "Enter a label, the network and the address",
              "Confirm with two-factor and the link we email you",
            ],
          },
          { type: "h2", text: "Why the delay" },
          {
            type: "p",
            text: "If someone gets into your account, the delay gives you a day to notice the email and lock the account before funds can leave.",
          },
          {
            type: "note",
            title: "Lock your account",
            text: "If you see a change you didn’t make, choose Lock account in the email or in Settings. Withdrawals stop until support restores access.",
          },
        ],
      },
      {
        slug: "sessions-and-devices",
        title: "Sessions and devices",
        description: "See where you’re signed in and sign out of devices you don’t recognise.",
        body: [
          {
            type: "p",
            text: "Settings lists every active session with its device, browser, rough location and last activity.",
          },
          { type: "h2", text: "Sign out elsewhere" },
          {
            type: "p",
            text: "Choose Sign out next to a session, or Sign out of all other sessions. Signing out ends the session at once.",
          },
          { type: "h2", text: "Sign-in alerts" },
          {
            type: "p",
            text: "We email you when a new device signs in. You can’t turn these emails off, because they’re how you notice access you didn’t expect.",
          },
        ],
      },
      {
        slug: "api-keys",
        title: "API keys",
        description: "Read-only keys for reporting tools. Keys can’t move funds.",
        body: [
          { type: "p", text: "API keys let reporting and accounting tools read your positions and rewards." },
          { type: "h2", text: "Permissions" },
          { type: "p", text: "Keys are read-only. They can’t stake, unstake or withdraw." },
          { type: "h2", text: "Creating a key" },
          {
            type: "steps",
            items: [
              "Open Settings, then API keys",
              "Give the key a label so you know which tool uses it",
              "Copy the secret straight away; it is shown only once",
            ],
          },
          { type: "h2", text: "Rotating a key" },
          { type: "p", text: "Create a new key, update your tool, then revoke the old key in Settings." },
        ],
      },
    ],
  },
  {
    title: "Developers",
    articles: [
      {
        slug: "api-overview",
        title: "API overview",
        description: "A read-only REST API for positions, rewards and transactions.",
        body: [
          {
            type: "p",
            text: "The API returns JSON over HTTPS. It covers the same data as the dashboard and is meant for reporting, accounting and monitoring.",
          },
          { type: "h2", text: "Base URL" },
          { type: "code", code: API },
          { type: "h2", text: "Resources" },
          {
            type: "list",
            items: [
              "/pools: pool terms and current net APY",
              "/positions: your positions and their status",
              "/rewards: rewards and penalties per epoch",
              "/transactions: deposits, withdrawals, stakes and payouts",
            ],
          },
          { type: "h2", text: "Conventions" },
          {
            type: "list",
            items: [
              "Amounts are decimal strings in the asset’s units, so no precision is lost",
              "Timestamps are ISO 8601 in UTC",
              "Lists are paginated with a cursor and return at most 100 items",
            ],
          },
        ],
      },
      {
        slug: "authentication",
        title: "Authentication",
        description: "Send your API key as a bearer token on every request.",
        body: [
          {
            type: "p",
            text: "Create a key in Settings, then send it in the Authorization header. Requests without a valid key return 401.",
          },
          {
            type: "code",
            label: "curl",
            code: `curl ${API}/positions \\\n  -H "Authorization: Bearer $LONAR_API_KEY"`,
          },
          { type: "h2", text: "Keeping keys safe" },
          {
            type: "list",
            items: [
              "Store keys in environment variables or a secrets manager, never in source code",
              "Use one key per tool so you can revoke it on its own",
              "Revoke keys you no longer use",
            ],
          },
        ],
      },
      {
        slug: "positions-and-rewards",
        title: "Positions and rewards",
        description: "List positions and fetch the rewards they earned in a date range.",
        body: [
          { type: "p", text: "Most integrations need two calls: the positions you hold, and the rewards they earned." },
          { type: "h2", text: "List positions" },
          {
            type: "code",
            label: "GET /positions",
            code: `{\n  "data": [\n    {\n      "id": "pos_8f2c",\n      "pool": "eth",\n      "amount": "12.500000",\n      "status": "active",\n      "started_at": "2026-03-02T00:00:00Z",\n      "auto_restake": true\n    }\n  ],\n  "next_cursor": null\n}`,
          },
          { type: "h2", text: "Rewards in a range" },
          {
            type: "p",
            text: "Pass from and to as dates. Add position to filter to one position. Each item is one epoch on one validator.",
          },
          {
            type: "code",
            label: "GET /rewards?from=2026-10-01&to=2026-10-16",
            code: `{\n  "data": [\n    {\n      "epoch": 312840,\n      "position": "pos_8f2c",\n      "gross": "0.004647",\n      "fee": "0.000465",\n      "net": "0.004182",\n      "recorded_at": "2026-10-16T06:24:00Z"\n    }\n  ],\n  "next_cursor": "c_31a9"\n}`,
          },
        ],
      },
      {
        slug: "webhooks",
        title: "Webhooks",
        description: "Get notified when payouts land or unbonding ends.",
        body: [
          {
            type: "p",
            text: "Webhooks send a POST request to your URL when something happens on your account, so you don’t have to poll.",
          },
          { type: "h2", text: "Events" },
          {
            type: "list",
            items: [
              "payout.created: the daily payout reached your wallet or was restaked",
              "position.unbonding_started and position.released",
              "deposit.confirmed and withdrawal.sent",
            ],
          },
          { type: "h2", text: "Verifying requests" },
          {
            type: "p",
            text: "Each request carries a signature header: an HMAC-SHA256 of the raw body using your webhook secret. Reject requests whose signature doesn’t match.",
          },
          {
            type: "code",
            label: "verify.ts",
            code: `import { createHmac, timingSafeEqual } from "node:crypto";\n\nexport function verify(body: string, signature: string, secret: string) {\n  const expected = createHmac("sha256", secret).update(body).digest("hex");\n  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));\n}`,
          },
          { type: "h2", text: "Retries" },
          {
            type: "p",
            text: "Respond with a 2xx status within 10 seconds. Failed deliveries are retried with backoff for up to 24 hours.",
          },
        ],
      },
      {
        slug: "rate-limits-and-errors",
        title: "Rate limits and errors",
        description: "Request limits per key and the error format the API returns.",
        body: [
          { type: "p", text: "Each key can make 60 requests a minute. Limits are shown in response headers." },
          {
            type: "code",
            label: "Response headers",
            code: "X-RateLimit-Limit: 60\nX-RateLimit-Remaining: 42\nX-RateLimit-Reset: 1792195260",
          },
          { type: "h2", text: "Error format" },
          {
            type: "code",
            label: "429 Too Many Requests",
            code: `{\n  "error": {\n    "code": "rate_limited",\n    "message": "Too many requests. Retry after 18 seconds."\n  }\n}`,
          },
          { type: "h2", text: "Status codes" },
          {
            type: "list",
            items: [
              "400: the request is malformed; the message says which field",
              "401: the key is missing, revoked or wrong",
              "404: the resource doesn’t exist or isn’t yours",
              "429: rate limited; wait for the reset time",
              "5xx: a problem on our side; retry with backoff",
            ],
          },
        ],
      },
    ],
  },
];

export const DOC_ARTICLES = DOC_SECTIONS.flatMap((s) => s.articles.map((a) => ({ ...a, section: s.title })));

export function getDoc(slug: string) {
  return DOC_ARTICLES.find((a) => a.slug === slug);
}
