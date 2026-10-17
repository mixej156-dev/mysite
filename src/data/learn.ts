import type { ContentBlock } from "@/lib/content";

/* ECO. LEARN: educational guides on crypto, staking and DeFi. General education, not financial advice. */

export type LearnTopic = "Fundamentals" | "Wallets & security" | "Staking" | "DeFi" | "Markets" | "Technology";
export type LearnLevel = "Beginner" | "Intermediate" | "Advanced";
export type GuideFormat = "Explainer" | "Guide" | "Checklist" | "Deep dive";

/** Names of --topic-* tokens; decorative cover colours only */
export type TopicColor = "blue" | "green" | "teal" | "orange" | "amber" | "violet" | "rose";

export type TopicMeta = { name: LearnTopic; description: string; color: TopicColor; secondary: TopicColor };

export const TOPICS: TopicMeta[] = [
  {
    name: "Fundamentals",
    description: "Blockchains, coins, tokens and what really happens when you send crypto.",
    color: "blue",
    secondary: "amber",
  },
  {
    name: "Wallets & security",
    description: "Keys, seed phrases, custody choices and how to avoid the common scams.",
    color: "green",
    secondary: "blue",
  },
  {
    name: "Staking",
    description: "Proof of stake, validator rewards, yield maths and liquid staking.",
    color: "teal",
    secondary: "orange",
  },
  {
    name: "DeFi",
    description: "Exchanges, lending and liquidity on-chain, and the risks that come with them.",
    color: "orange",
    secondary: "violet",
  },
  {
    name: "Markets",
    description: "Charts, supply, volatility and the habits that keep risk in proportion.",
    color: "amber",
    secondary: "rose",
  },
  {
    name: "Technology",
    description: "Consensus, cryptography, smart contracts and the layers built on top.",
    color: "violet",
    secondary: "teal",
  },
];

export const LEVELS: LearnLevel[] = ["Beginner", "Intermediate", "Advanced"];

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  topic: LearnTopic;
  level: LearnLevel;
  format: GuideFormat;
  minutes: number;
  /** "What you'll learn" bullets */
  outcomes: string[];
  body: ContentBlock[];
  takeaways: string[];
};

export const GUIDES: Guide[] = [
  /* Fundamentals */
  {
    slug: "what-is-a-blockchain",
    title: "What is a blockchain, really?",
    excerpt: "A shared ledger that no single party controls. Here’s how it stays honest without a referee.",
    topic: "Fundamentals",
    level: "Beginner",
    format: "Explainer",
    minutes: 6,
    outcomes: [
      "What a block contains and how blocks link together",
      "Why a blockchain is hard to rewrite",
      "Where blockchains are useful, and where a database is better",
    ],
    body: [
      {
        type: "p",
        text: "A blockchain is a list of records that thousands of computers keep identical copies of. New records are added in batches called blocks, and every block points back to the one before it. That chain of references is where the name comes from.",
      },
      { type: "h2", text: "What’s inside a block" },
      {
        type: "list",
        items: [
          "A batch of transactions: who sent what to whom",
          "A timestamp and a block number",
          "The fingerprint (hash) of the previous block",
          "Data the network uses to agree the block is valid",
        ],
      },
      { type: "h2", text: "Why it’s hard to change the past" },
      {
        type: "p",
        text: "Each block includes the hash of the block before it. Change one old transaction and that block’s hash changes, which breaks the link from the next block, and the next, all the way to today. To rewrite history you would have to redo every later block faster than the rest of the network adds new ones.",
      },
      {
        type: "note",
        title: "A useful mental model",
        text: "Think of a notebook where each page starts by copying a summary of the previous page. Tear out or edit one page and every later page stops matching.",
      },
      { type: "h2", text: "Who decides what gets added" },
      {
        type: "p",
        text: "Networks use a consensus mechanism to pick who proposes the next block and how everyone else checks it. Bitcoin uses proof of work; most newer networks, including all the ones we stake on, use proof of stake.",
      },
      { type: "h2", text: "When a blockchain makes sense" },
      {
        type: "p",
        text: "Blockchains are slow and expensive compared with an ordinary database. They earn their cost when many parties who don’t trust each other need one shared record that nobody can quietly edit: money, ownership, and settlement between institutions.",
      },
    ],
    takeaways: [
      "A blockchain is a shared ledger copied across many computers",
      "Hashes link blocks so editing the past breaks the chain",
      "Consensus rules decide who adds the next block",
    ],
  },
  {
    slug: "how-crypto-transactions-work",
    title: "What happens when you send crypto",
    excerpt: "From pressing Send to a confirmed transfer: signatures, mempools, fees and finality.",
    topic: "Fundamentals",
    level: "Beginner",
    format: "Explainer",
    minutes: 7,
    outcomes: [
      "The life of a transaction, step by step",
      "Why fees exist and what sets them",
      "What ‘confirmations’ and ‘finality’ mean",
    ],
    body: [
      {
        type: "p",
        text: "A crypto transfer isn’t a file moving between wallets. It’s a signed instruction that the network checks and writes into the ledger. Here’s the path it takes.",
      },
      { type: "h2", text: "The steps" },
      {
        type: "steps",
        items: [
          "Your wallet builds the transaction: recipient, amount and fee",
          "It signs the transaction with your private key, proving you own the funds",
          "The signed transaction is broadcast to nodes, which hold it in a waiting area called the mempool",
          "A block producer picks it up, usually favouring higher fees, and includes it in a block",
          "Other nodes verify the block, and the transfer gains confirmations as more blocks follow",
        ],
      },
      { type: "h2", text: "Why you pay a fee" },
      {
        type: "p",
        text: "Block space is limited. Fees decide which transactions go first and pay the people securing the network. When demand spikes, fees rise; when the network is quiet, they fall. On some networks the fee depends on how much computation your transaction needs, which is why a token transfer can cost more than a plain coin transfer.",
      },
      { type: "h2", text: "Confirmations and finality" },
      {
        type: "p",
        text: "A transaction in the latest block could, in rare cases, be dropped if the network briefly disagrees about the chain tip. Each new block on top makes that less likely. Some networks reach finality, a point after which a block can’t be reversed without destroying a large amount of stake.",
      },
      {
        type: "list",
        items: [
          "Ethereum: final after two epochs, about 13 minutes",
          "Solana: practically final within seconds",
          "Cosmos chains: final as soon as the block is committed",
        ],
      },
      {
        type: "note",
        title: "Transfers can’t be undone",
        text: "There is no chargeback on a blockchain. Check the address and the network before you send, and try a small test amount first when sending somewhere new.",
      },
    ],
    takeaways: [
      "A transaction is a signed instruction, verified by every node",
      "Fees buy priority for limited block space",
      "Wait for finality before treating a large transfer as settled",
    ],
  },
  {
    slug: "bitcoin-and-ethereum",
    title: "Bitcoin and Ethereum: what’s actually different",
    excerpt: "Digital money versus a programmable computer. Two designs, two sets of trade-offs.",
    topic: "Fundamentals",
    level: "Beginner",
    format: "Explainer",
    minutes: 6,
    outcomes: [
      "The design goals behind each network",
      "How supply and issuance differ",
      "Why Ethereum hosts most tokens and apps",
    ],
    body: [
      {
        type: "p",
        text: "Bitcoin and Ethereum are the two largest networks, and they’re often lumped together. They were built for different jobs, and that shows in almost every design choice.",
      },
      { type: "h2", text: "Bitcoin: a narrow, conservative design" },
      {
        type: "p",
        text: "Bitcoin does one thing: move a scarce digital asset between parties without an intermediary. Its scripting language is deliberately limited, changes are rare, and supply is capped at 21 million coins, with issuance halving about every four years.",
      },
      { type: "h2", text: "Ethereum: a shared computer" },
      {
        type: "p",
        text: "Ethereum adds a general-purpose virtual machine. Anyone can deploy a smart contract, a program that runs exactly as written on every node. Tokens, exchanges, lending markets and NFTs are all contracts on that machine.",
      },
      { type: "h2", text: "Side by side" },
      {
        type: "list",
        items: [
          "Consensus: Bitcoin uses proof of work; Ethereum moved to proof of stake in 2022",
          "Supply: Bitcoin has a fixed cap; Ether has no cap, but part of every fee is burned",
          "Block time: about 10 minutes for Bitcoin, 12 seconds for Ethereum",
          "Staking: not possible on Bitcoin itself; native to Ethereum",
        ],
      },
      {
        type: "quote",
        text: "Bitcoin optimises for being hard to change. Ethereum optimises for being able to build on.",
      },
      { type: "h2", text: "Why it matters to you" },
      {
        type: "p",
        text: "The design decides what you can do with the asset. You can hold or send bitcoin; you can hold, send, stake, lend or use ether in thousands of applications, each with its own extra risk.",
      },
    ],
    takeaways: [
      "Bitcoin is a narrow, fixed-supply payment network",
      "Ethereum is a programmable platform for tokens and apps",
      "More functionality brings more ways to earn and more ways to lose",
    ],
  },
  {
    slug: "what-are-stablecoins",
    title: "Stablecoins: how a token keeps its price",
    excerpt: "Fiat-backed, crypto-backed and algorithmic designs, and what can break each one.",
    topic: "Fundamentals",
    level: "Beginner",
    format: "Explainer",
    minutes: 7,
    outcomes: [
      "The three main stablecoin designs",
      "What a ‘depeg’ is and why it happens",
      "Questions to ask before holding one",
    ],
    body: [
      {
        type: "p",
        text: "A stablecoin is a token designed to track the value of something stable, usually the US dollar. They are the main way value moves between exchanges and applications without leaving the blockchain.",
      },
      { type: "h2", text: "Fiat-backed" },
      {
        type: "p",
        text: "An issuer holds cash and short-term government debt and mints one token per dollar held. You trust the issuer to keep the reserves and to redeem tokens on request. Most stablecoin volume is in this kind.",
      },
      { type: "h2", text: "Crypto-backed" },
      {
        type: "p",
        text: "Users lock more crypto in a smart contract than the stablecoins they mint, for example $150 of ether for $100 of tokens. If the collateral falls too far, it is sold automatically to keep every token covered.",
      },
      { type: "h2", text: "Algorithmic" },
      {
        type: "p",
        text: "These try to hold the peg with incentives and supply changes rather than full reserves. Several have collapsed when confidence fell faster than the mechanism could respond.",
      },
      { type: "h2", text: "What can go wrong" },
      {
        type: "list",
        items: [
          "Reserve risk: the backing isn’t there, or can’t be sold fast enough",
          "Redemption risk: only some holders can redeem directly with the issuer",
          "Collateral crashes: crypto backing falls faster than liquidations can run",
          "Freezes: issuers can block specific addresses",
        ],
      },
      {
        type: "note",
        title: "Before you hold one",
        text: "Check who issues it, what backs it, how often reserves are reported, and which networks it lives on. The same stablecoin on two networks is two separate tokens; send it on the wrong one and it may be lost.",
      },
    ],
    takeaways: [
      "Stablecoins track a reference asset, usually the dollar",
      "The backing model decides what can break the peg",
      "Always match the token to the network when sending",
    ],
  },

  /* Wallets & security */
  {
    slug: "custodial-vs-self-custody",
    title: "Custodial or self-custody: who holds your keys?",
    excerpt: "Exchanges, staking platforms and your own wallet each trade convenience for control.",
    topic: "Wallets & security",
    level: "Beginner",
    format: "Explainer",
    minutes: 6,
    outcomes: [
      "What ‘not your keys, not your coins’ means in practice",
      "The risks on each side",
      "How people often split funds between the two",
    ],
    body: [
      {
        type: "p",
        text: "Whoever controls the private key controls the funds. Custody is simply the question of who that is.",
      },
      { type: "h2", text: "Custodial" },
      {
        type: "p",
        text: "A company holds the keys and you hold an account. You get password resets, support and a familiar interface. You also depend on the company’s security, solvency and willingness to process withdrawals.",
      },
      { type: "h2", text: "Self-custody" },
      {
        type: "p",
        text: "You hold the keys in a wallet app or hardware device. Nobody can freeze or lose your funds for you, but nobody can recover them for you either. A lost seed phrase is usually permanent.",
      },
      { type: "h2", text: "Comparing the risks" },
      {
        type: "list",
        items: [
          "Custodial: company failure, hacks of the platform, account freezes",
          "Self-custody: losing the seed phrase, phishing, signing a malicious transaction",
          "Both: sending to the wrong address or network",
        ],
      },
      { type: "h2", text: "A common approach" },
      {
        type: "p",
        text: "Many people keep a small spending balance in an app, long-term holdings in self-custody, and only use a custodian for services that need it, such as fiat on-ramps. Whatever you choose, turn on two-factor authentication everywhere you can.",
      },
    ],
    takeaways: [
      "Custody is about who holds the private key",
      "Custodians add convenience and counterparty risk",
      "Self-custody removes the middleman and the safety net",
    ],
  },
  {
    slug: "seed-phrases",
    title: "Seed phrases: write it once, store it right",
    excerpt: "Twelve or twenty-four words that can rebuild your wallet. A checklist for keeping them safe.",
    topic: "Wallets & security",
    level: "Beginner",
    format: "Checklist",
    minutes: 5,
    outcomes: [
      "What a seed phrase is and how it relates to your keys",
      "Where to store it and where never to",
      "How to test a backup without exposing it",
    ],
    body: [
      {
        type: "p",
        text: "A seed phrase is a human-readable backup of every private key in a wallet. Anyone who has it can take the funds, from anywhere, without your password or device.",
      },
      { type: "h2", text: "Do" },
      {
        type: "list",
        items: [
          "Write it on paper or stamp it into metal, by hand",
          "Store copies in two separate safe places",
          "Check every word against the official word list as you write",
          "Test the backup by restoring onto a second device with a small balance",
        ],
      },
      { type: "h2", text: "Don’t" },
      {
        type: "list",
        items: [
          "Photograph it, type it into notes, or save it to cloud storage",
          "Enter it on any website, ever",
          "Share it with support staff; no legitimate company will ask for it",
          "Split the words across places in a way you can’t reassemble later",
        ],
      },
      {
        type: "note",
        title: "The one rule",
        text: "A seed phrase only ever goes into a wallet you are restoring yourself. Any other request for it is an attempt to steal your funds.",
      },
      { type: "h2", text: "Passphrases" },
      {
        type: "p",
        text: "Many wallets support an optional extra word, sometimes called the 25th word. It creates a different wallet from the same phrase. It adds protection if the paper is found, but if you forget the passphrase the funds are gone.",
      },
    ],
    takeaways: [
      "The seed phrase is the wallet; protect it like cash",
      "Offline, handwritten, in two places",
      "Nobody legitimate will ever ask for it",
    ],
  },
  {
    slug: "spotting-crypto-scams",
    title: "Spotting crypto scams before they spot you",
    excerpt: "Fake support, too-good yields, address poisoning and drainer links: the patterns to know.",
    topic: "Wallets & security",
    level: "Beginner",
    format: "Checklist",
    minutes: 8,
    outcomes: [
      "The most common scam patterns",
      "Red flags in messages, sites and offers",
      "What to do if you think you’ve been targeted",
    ],
    body: [
      {
        type: "p",
        text: "Most crypto losses don’t come from broken cryptography. They come from people being persuaded to send funds or sign something. The patterns repeat, so they’re learnable.",
      },
      { type: "h2", text: "Common patterns" },
      {
        type: "list",
        items: [
          "Fake support: someone replies to your public question and asks for your seed phrase or remote access",
          "Guaranteed yield: fixed high returns with no clear source of income",
          "Giveaways: ‘send 1, get 2 back’ from accounts posing as public figures",
          "Address poisoning: tiny transfers from an address that looks like one you use, hoping you copy it from history",
          "Drainer sites: copies of real apps that ask you to approve unlimited token spending",
          "Romance and ‘mentor’ schemes: long conversations that end in a fake trading platform",
        ],
      },
      { type: "h2", text: "Red flags" },
      {
        type: "list",
        items: [
          "Urgency: act now, limited slots, your account will be closed",
          "Contact you didn’t start, especially in direct messages",
          "Requests to install software or share your screen",
          "Returns described as risk-free or guaranteed",
        ],
      },
      { type: "h2", text: "Habits that help" },
      {
        type: "steps",
        items: [
          "Bookmark the sites you use and only open them from bookmarks",
          "Read what a wallet asks you to sign; reject unlimited approvals you don’t need",
          "Check the first and last six characters of every address",
          "Review and revoke old token approvals every few months",
        ],
      },
      {
        type: "note",
        title: "If something went wrong",
        text: "Move remaining funds to a new wallet with a new seed phrase, revoke approvals, change passwords and report the addresses involved to the platforms you use. Be wary of ‘recovery services’; many are a second scam.",
      },
    ],
    takeaways: [
      "Scams target people, not cryptography",
      "Urgency and guaranteed returns are the loudest warning signs",
      "Bookmarks, address checks and approval reviews prevent most losses",
    ],
  },
  {
    slug: "hardware-wallets",
    title: "Setting up a hardware wallet",
    excerpt: "Keys that never touch your computer. A step-by-step setup and the mistakes to avoid.",
    topic: "Wallets & security",
    level: "Intermediate",
    format: "Guide",
    minutes: 9,
    outcomes: [
      "Why a hardware wallet is safer than an app",
      "A clean setup from unboxing to first transfer",
      "How to use it with apps without giving up its protection",
    ],
    body: [
      {
        type: "p",
        text: "A hardware wallet is a small device that keeps your private keys offline and signs transactions internally. Your computer only ever sees the signed result, so malware on it can’t extract the keys.",
      },
      { type: "h2", text: "Before you start" },
      {
        type: "list",
        items: [
          "Buy directly from the manufacturer, not from a marketplace reseller",
          "Check the packaging is sealed and the device arrives with no pre-written seed",
          "Have paper or a metal plate ready for the seed phrase",
        ],
      },
      { type: "h2", text: "Setup" },
      {
        type: "steps",
        items: [
          "Install the manufacturer’s app from its official site",
          "Update the firmware when prompted",
          "Create a new wallet on the device and set a PIN",
          "Write down the seed phrase shown on the device screen, never on the computer",
          "Confirm the phrase on the device when asked",
          "Send a small test amount in, then out, before moving larger funds",
        ],
      },
      { type: "h2", text: "Using it day to day" },
      {
        type: "p",
        text: "Connect the device to wallet apps and exchanges that support it. Every transaction still needs a physical button press, and the device screen shows the real recipient and amount. Trust the device screen over the computer screen.",
      },
      {
        type: "note",
        title: "Blind signing",
        text: "Some apps ask the device to sign data it can’t display. Only allow this for apps you trust, and turn it off again afterwards.",
      },
      { type: "h2", text: "If the device breaks or is lost" },
      {
        type: "p",
        text: "The funds are on the blockchain, not on the device. Restore the seed phrase onto a new device and everything returns. That is also why the seed phrase needs more protection than the device itself.",
      },
    ],
    takeaways: [
      "Keys stay on the device; the computer only sees signatures",
      "Buy direct, set up fresh, test with a small amount",
      "The device screen is the source of truth",
    ],
  },

  /* Staking */
  {
    slug: "proof-of-stake-explained",
    title: "Proof of stake, explained simply",
    excerpt: "Validators lock collateral, do useful work and earn rewards. Break the rules and they lose stake.",
    topic: "Staking",
    level: "Beginner",
    format: "Explainer",
    minutes: 6,
    outcomes: [
      "How proof of stake secures a network",
      "Where staking rewards come from",
      "What delegators do and what they risk",
    ],
    body: [
      {
        type: "p",
        text: "In proof of stake, the right to add blocks comes from locking up the network’s own token as collateral. Honest work earns rewards; provable cheating destroys part of the collateral.",
      },
      { type: "h2", text: "The roles" },
      {
        type: "list",
        items: [
          "Validators run the software that proposes and checks blocks",
          "Delegators add their tokens to a validator’s stake without running anything themselves",
          "The protocol pays rewards and enforces penalties automatically",
        ],
      },
      { type: "h2", text: "Where rewards come from" },
      {
        type: "p",
        text: "Rewards are a mix of newly issued tokens and transaction fees. Issuance is effectively a transfer from holders who don’t stake to those who do, which is why staking is often described as keeping your share of the network from diluting.",
      },
      { type: "h2", text: "Penalties" },
      {
        type: "p",
        text: "Being offline usually costs a small amount of missed rewards. Signing two conflicting blocks is treated as an attack and is slashed: a portion of the stake is burned and the validator is removed. Delegated stake is often slashed alongside the validator’s own.",
      },
      {
        type: "quote",
        text: "Proof of stake replaces burning electricity with putting money at risk. The security comes from what attackers would lose.",
      },
    ],
    takeaways: [
      "Stake is collateral for honest behaviour",
      "Rewards come from issuance and fees",
      "Delegators share both the rewards and the slashing risk",
    ],
  },
  {
    slug: "apr-vs-apy",
    title: "APR vs APY: reading a yield figure",
    excerpt: "Why the same pool can show two numbers, and how compounding, fees and price change the picture.",
    topic: "Staking",
    level: "Beginner",
    format: "Explainer",
    minutes: 5,
    outcomes: [
      "The difference between APR and APY",
      "How payout frequency changes the result",
      "Why token yield isn’t the same as dollar return",
    ],
    body: [
      {
        type: "p",
        text: "APR is the simple yearly rate. APY assumes every reward is added back and starts earning too. The gap between them grows with the rate and with how often rewards are paid.",
      },
      { type: "h2", text: "A worked example" },
      {
        type: "code",
        label: "10 ETH at 4% APR",
        code: "Paid out, not restaked:   10 × 0.04            = 0.400 ETH\nRestaked daily:           10 × (1 + 0.04/365)^365 − 10 ≈ 0.408 ETH\nAPY ≈ 4.08%",
      },
      { type: "h2", text: "Fees come first" },
      {
        type: "p",
        text: "A provider’s fee is usually a share of rewards. A 4.5% network rate with a 10% fee leaves you 4.05%. Always compare net figures.",
      },
      { type: "h2", text: "Token yield vs dollar return" },
      {
        type: "p",
        text: "Staking yield is paid in the staked token. If the token falls 20% over a year, a 5% yield doesn’t make up for it. The yield figure tells you how many more tokens you’ll have, not what they’ll be worth.",
      },
      {
        type: "note",
        title: "Rates move",
        text: "Network yields change with how much of the supply is staked and how busy the network is. Treat any yearly figure as an estimate based on recent conditions.",
      },
    ],
    takeaways: [
      "APY includes compounding; APR doesn’t",
      "Compare yields after fees",
      "Yield is measured in tokens, not dollars",
    ],
  },
  {
    slug: "liquid-staking",
    title: "Liquid staking and its trade-offs",
    excerpt: "Staked positions you can trade or use elsewhere. Useful, with an extra layer of risk.",
    topic: "Staking",
    level: "Intermediate",
    format: "Explainer",
    minutes: 8,
    outcomes: [
      "How liquid staking tokens work",
      "Why they can trade below their underlying value",
      "The risks added on top of normal staking",
    ],
    body: [
      {
        type: "p",
        text: "Native staking locks your tokens and makes you wait to get them back. Liquid staking gives you a receipt token in return, which represents the staked position and can be sold or used in other applications.",
      },
      { type: "h2", text: "How it works" },
      {
        type: "steps",
        items: [
          "You deposit tokens into a liquid staking protocol",
          "The protocol stakes them with a set of validators",
          "You receive a receipt token that grows in value, or in quantity, as rewards accrue",
          "To exit, you redeem through the protocol’s queue or sell the receipt on the market",
        ],
      },
      { type: "h2", text: "Why the price can slip" },
      {
        type: "p",
        text: "Redeeming takes as long as the network’s unbonding period. Holders who want out immediately sell on the market instead, and in stressed conditions that selling pushes the receipt below the value of the stake behind it.",
      },
      { type: "h2", text: "Added risks" },
      {
        type: "list",
        items: [
          "Smart contract risk in the protocol",
          "Validator selection and governance decisions you don’t control",
          "Discounts to underlying value when many holders exit at once",
          "Compounded risk when the receipt is reused as collateral elsewhere",
        ],
      },
      {
        type: "note",
        text: "Liquid staking suits people who need the flexibility. If you plan to hold through the unbonding period anyway, native staking has fewer moving parts.",
      },
    ],
    takeaways: [
      "Liquid staking swaps a lock-up for a tradable receipt",
      "Market exits can happen below underlying value",
      "Each extra protocol adds its own risk",
    ],
  },
  {
    slug: "validator-economics",
    title: "How validators earn, and how they lose",
    excerpt: "A deep dive into duties, inclusion, MEV, uptime and slashing on modern proof-of-stake networks.",
    topic: "Staking",
    level: "Advanced",
    format: "Deep dive",
    minutes: 12,
    outcomes: [
      "The revenue lines of a validator",
      "How performance turns into small but real differences in yield",
      "The anatomy of a slashing event",
    ],
    body: [
      {
        type: "p",
        text: "Two validators on the same network can return noticeably different yields over a year. The difference comes from how reliably they perform each duty, and from how they handle the rare events that cost money.",
      },
      { type: "h2", text: "Revenue lines" },
      {
        type: "list",
        items: [
          "Consensus rewards: attesting to blocks and taking part in committees",
          "Proposal rewards: occasional, larger payments when chosen to propose a block",
          "Priority fees: tips paid by users to be included",
          "MEV: value from ordering transactions, usually captured through specialised block builders",
        ],
      },
      { type: "h2", text: "Performance matters at the margin" },
      {
        type: "p",
        text: "A late attestation earns less than a timely one, and a missed proposal can’t be made up. Network latency, client choice and hardware all contribute. Over thousands of duties, a 0.5% difference in effectiveness becomes a visible gap in yield.",
      },
      { type: "h2", text: "Costs" },
      {
        type: "list",
        items: [
          "Infrastructure across regions and cloud providers",
          "Engineering time for upgrades and incident response",
          "Monitoring and key management",
        ],
      },
      { type: "h2", text: "Anatomy of a slashing event" },
      {
        type: "steps",
        items: [
          "Two machines sign with the same key, often after a failover goes wrong",
          "Another validator submits proof of the conflicting signatures",
          "The protocol burns an initial penalty and schedules the validator’s exit",
          "If many validators are slashed around the same time, an extra correlation penalty applies",
        ],
      },
      {
        type: "note",
        title: "Correlation is the real danger",
        text: "Penalties grow when many validators fail together. Running diverse clients and avoiding a single cloud provider limits how much one bug or outage can cost.",
      },
    ],
    takeaways: [
      "Yield differences come from duty effectiveness and proposals",
      "Most validator mistakes cost rewards, not stake",
      "Slashing usually comes from duplicate signing, and correlated failures cost more",
    ],
  },

  /* DeFi */
  {
    slug: "what-is-defi",
    title: "What is DeFi?",
    excerpt: "Financial services run by smart contracts instead of companies. The building blocks and the catch.",
    topic: "DeFi",
    level: "Beginner",
    format: "Explainer",
    minutes: 6,
    outcomes: [
      "The main kinds of DeFi applications",
      "What ‘composability’ means",
      "The risks that are specific to DeFi",
    ],
    body: [
      {
        type: "p",
        text: "Decentralised finance, or DeFi, is a set of applications that offer trading, lending and saving through public smart contracts. Anyone with a wallet can use them, with no account and no approval.",
      },
      { type: "h2", text: "The building blocks" },
      {
        type: "list",
        items: [
          "Exchanges: swap one token for another against a pool of liquidity",
          "Lending markets: deposit to earn interest, or borrow against collateral",
          "Stablecoins: dollar-tracking tokens that most activity is priced in",
          "Derivatives: perpetual futures and options settled on-chain",
        ],
      },
      { type: "h2", text: "Composability" },
      {
        type: "p",
        text: "Because every contract is public, applications can plug into each other. A token earned in one protocol can be deposited in another in the same transaction. That makes DeFi fast to build on, and means a failure in one piece can spread to everything stacked on top of it.",
      },
      { type: "h2", text: "The catch" },
      {
        type: "list",
        items: [
          "Code risk: bugs in contracts can drain funds",
          "Oracle risk: wrong price data can trigger bad liquidations",
          "Governance risk: token holders can change the rules",
          "No recourse: there is usually nobody to call",
        ],
      },
    ],
    takeaways: [
      "DeFi offers financial services through public contracts",
      "Composability makes it powerful and fragile",
      "Code and oracle risk replace counterparty risk",
    ],
  },
  {
    slug: "how-amms-work",
    title: "How automated market makers set prices",
    excerpt: "No order book, just a formula and a pool. Why big trades move the price and who earns the fees.",
    topic: "DeFi",
    level: "Intermediate",
    format: "Explainer",
    minutes: 9,
    outcomes: [
      "The constant-product formula in plain terms",
      "What price impact and slippage are",
      "How liquidity providers earn",
    ],
    body: [
      {
        type: "p",
        text: "An automated market maker (AMM) holds two tokens in a pool and prices trades with a formula. Traders swap against the pool; liquidity providers supply the tokens and earn a fee on each trade.",
      },
      { type: "h2", text: "The formula" },
      {
        type: "p",
        text: "The classic design keeps the product of the two balances constant. Buy one token and its balance falls, so its price, the ratio of the balances, rises.",
      },
      {
        type: "code",
        label: "constant product",
        code: "x × y = k\n\nPool: 100 ETH × 260,000 USDC = 26,000,000\nBuy 10 ETH → ETH balance 90 → USDC must be 288,889\nYou pay 28,889 USDC: ≈ 2,889 per ETH vs 2,600 before",
      },
      { type: "h2", text: "Price impact and slippage" },
      {
        type: "p",
        text: "Price impact is how much your own trade moves the price; it shrinks as the pool grows. Slippage is the difference between the price you saw and the price you got, which includes other trades landing before yours. A slippage tolerance tells the contract to cancel if the final price is worse than you accept.",
      },
      { type: "h2", text: "Liquidity providers" },
      {
        type: "p",
        text: "Providers deposit both tokens in the current ratio and receive a share of trading fees. Newer designs let providers concentrate liquidity in a price range, earning more fees while the price stays there and nothing when it leaves.",
      },
      {
        type: "note",
        text: "Large swaps in small pools are expensive. Splitting a trade or using a deeper pool usually gets a better price.",
      },
    ],
    takeaways: [
      "AMMs price trades from pool balances, not order books",
      "Price impact grows with trade size relative to the pool",
      "Slippage tolerance protects you from bad fills",
    ],
  },
  {
    slug: "impermanent-loss",
    title: "Impermanent loss, without the maths headache",
    excerpt: "Why providing liquidity can leave you with less than simply holding, and when fees make up for it.",
    topic: "DeFi",
    level: "Intermediate",
    format: "Explainer",
    minutes: 7,
    outcomes: [
      "What impermanent loss is and why it happens",
      "How big it gets as prices move",
      "When fees can offset it",
    ],
    body: [
      {
        type: "p",
        text: "When you provide liquidity, the pool rebalances your tokens as prices move: it sells the one going up and buys the one going down. Compared with holding both tokens in your wallet, you end up with less of the winner.",
      },
      { type: "h2", text: "How big it gets" },
      {
        type: "list",
        items: [
          "Price moves 1.25×: about 0.6% behind holding",
          "Price moves 1.5×: about 2.0% behind",
          "Price moves 2×: about 5.7% behind",
          "Price moves 4×: about 20% behind",
        ],
      },
      { type: "h2", text: "Why ‘impermanent’" },
      {
        type: "p",
        text: "If the price returns to where you entered, the gap closes. If you withdraw while prices are apart, the loss becomes permanent. The name has confused people for years; ‘divergence loss’ is more accurate.",
      },
      { type: "h2", text: "When fees make up for it" },
      {
        type: "p",
        text: "Pools with heavy trading and pairs that move together, such as two dollar stablecoins, tend to earn more in fees than they lose to divergence. Volatile pairs with little volume rarely do.",
      },
      {
        type: "note",
        title: "Concentrated liquidity",
        text: "Concentrating liquidity in a narrow range amplifies both fees and impermanent loss. It suits active management, not set-and-forget.",
      },
    ],
    takeaways: [
      "Pools sell winners and buy losers as prices move",
      "The loss grows with how far prices diverge",
      "Volume and correlated pairs help fees win",
    ],
  },
  {
    slug: "lending-protocols",
    title: "Lending and borrowing on-chain",
    excerpt: "Over-collateralised loans, health factors and liquidations, explained with one example.",
    topic: "DeFi",
    level: "Intermediate",
    format: "Guide",
    minutes: 9,
    outcomes: [
      "How deposit and borrow rates are set",
      "What a health factor measures",
      "How to avoid being liquidated",
    ],
    body: [
      {
        type: "p",
        text: "On-chain lending markets pool deposits and lend them to borrowers who post more collateral than they borrow. No credit check is needed because the collateral can be sold automatically if the loan becomes risky.",
      },
      { type: "h2", text: "Rates" },
      {
        type: "p",
        text: "Rates float with utilisation, the share of deposits currently borrowed. When utilisation is high, borrowing gets expensive and depositors earn more, which pulls in liquidity and pushes out borrowers.",
      },
      { type: "h2", text: "Health factor" },
      {
        type: "code",
        label: "example",
        code: "Collateral: 10 ETH at $2,600   = $26,000\nLiquidation threshold: 80%     = $20,800\nBorrowed: $13,000 USDC\nHealth factor = 20,800 / 13,000 = 1.6\n\nLiquidation when health < 1.0 → ETH below $1,625",
      },
      { type: "h2", text: "Liquidations" },
      {
        type: "p",
        text: "When the health factor drops below 1, anyone can repay part of your loan and take some of your collateral at a discount. You keep the borrowed funds, but lose more collateral than the debt repaid.",
      },
      { type: "h2", text: "Staying safe" },
      {
        type: "list",
        items: [
          "Borrow well below the maximum; a health factor above 2 leaves room for volatility",
          "Set price alerts on your collateral",
          "Repay or add collateral early when markets move fast",
          "Remember borrow rates can jump without warning",
        ],
      },
    ],
    takeaways: [
      "Loans are over-collateralised and rates float with demand",
      "Health factor is collateral headroom over debt",
      "Borrow conservatively; liquidations are automatic and costly",
    ],
  },

  /* Markets */
  {
    slug: "reading-a-price-chart",
    title: "Reading a candlestick chart",
    excerpt: "Open, high, low, close: what each candle tells you, and what it doesn’t.",
    topic: "Markets",
    level: "Beginner",
    format: "Guide",
    minutes: 6,
    outcomes: ["How to read a single candle", "What volume adds", "Common mistakes when reading charts"],
    body: [
      {
        type: "p",
        text: "Candlestick charts compress price movement into bars, one per time period. Each candle shows four prices: where the period opened, its high, its low, and where it closed.",
      },
      { type: "h2", text: "Anatomy of a candle" },
      {
        type: "list",
        items: [
          "The body spans the open and close",
          "A filled or green body closed higher than it opened; red closed lower",
          "Thin lines, or wicks, reach to the high and low",
          "Long wicks show prices that were reached and then rejected",
        ],
      },
      { type: "h2", text: "Timeframes" },
      {
        type: "p",
        text: "The same market looks calm on a weekly chart and chaotic on a one-minute chart. Pick the timeframe that matches how long you plan to hold, and check one level above it for context.",
      },
      { type: "h2", text: "Volume" },
      {
        type: "p",
        text: "Volume bars show how much traded in each period. A move on high volume reflects broad participation; the same move on thin volume can reverse easily.",
      },
      {
        type: "note",
        title: "Charts describe, they don’t predict",
        text: "Patterns are a way to summarise what happened. Treat any pattern-based forecast as one input among many, never a certainty.",
      },
    ],
    takeaways: [
      "Each candle shows open, high, low and close",
      "Timeframe changes the story; match it to your horizon",
      "Volume shows how much conviction was behind a move",
    ],
  },
  {
    slug: "market-cap-and-supply",
    title: "Market cap, supply and dilution",
    excerpt: "Circulating vs fully diluted, unlock schedules, and why a low price per token means little.",
    topic: "Markets",
    level: "Beginner",
    format: "Explainer",
    minutes: 7,
    outcomes: [
      "The difference between circulating and fully diluted value",
      "How token unlocks affect supply",
      "Why price per token alone tells you nothing",
    ],
    body: [
      {
        type: "p",
        text: "A token priced at one cent isn’t cheap and a token at $2,000 isn’t expensive. What matters is price multiplied by how many tokens exist, and how many will exist later.",
      },
      { type: "h2", text: "Three numbers to check" },
      {
        type: "list",
        items: [
          "Circulating supply: tokens that can trade today",
          "Total supply: tokens that exist, including locked ones",
          "Max supply: the hard cap, if there is one",
        ],
      },
      {
        type: "code",
        label: "example",
        code: "Price $2.00 × circulating 400M  = $800M market cap\nPrice $2.00 × max 2,000M        = $4B fully diluted value\n→ 80% of supply still to arrive",
      },
      { type: "h2", text: "Unlocks and emissions" },
      {
        type: "p",
        text: "Team, investor and treasury tokens are often released on a schedule. Large unlocks add supply that may be sold. Staking emissions also add supply, which is why staking yield partly offsets dilution rather than adding pure profit.",
      },
      { type: "h2", text: "Where to look" },
      {
        type: "p",
        text: "Project documentation usually publishes a token distribution and vesting schedule. Block explorers show the real balances of large holders, which is worth comparing with what’s claimed.",
      },
    ],
    takeaways: [
      "Compare market caps, not prices per token",
      "Fully diluted value shows what’s still to come",
      "Unlock schedules can move supply more than demand",
    ],
  },
  {
    slug: "dollar-cost-averaging",
    title: "Dollar-cost averaging, and when it helps",
    excerpt: "Buying a fixed amount on a schedule removes timing decisions. Here’s what it does and doesn’t do.",
    topic: "Markets",
    level: "Beginner",
    format: "Explainer",
    minutes: 5,
    outcomes: [
      "How dollar-cost averaging works",
      "What it protects you from",
      "Its limits compared with investing at once",
    ],
    body: [
      {
        type: "p",
        text: "Dollar-cost averaging (DCA) means buying the same dollar amount at regular intervals regardless of price. You buy more units when the price is low and fewer when it’s high.",
      },
      {
        type: "code",
        label: "$100 a month for four months",
        code: "Month 1: $100 at $20 → 5.00\nMonth 2: $100 at $10 → 10.00\nMonth 3: $100 at $16 → 6.25\nMonth 4: $100 at $25 → 4.00\n25.25 units for $400 → average cost $15.84",
      },
      { type: "h2", text: "What it helps with" },
      {
        type: "list",
        items: [
          "Removes the pressure of picking the right moment",
          "Smooths the impact of volatility on your entry price",
          "Turns investing into a habit rather than a reaction to headlines",
        ],
      },
      { type: "h2", text: "What it doesn’t do" },
      {
        type: "p",
        text: "DCA doesn’t make a bad asset good, and in a steadily rising market a single early purchase usually ends ahead. Its value is behavioural: it keeps decisions simple and emotions out of them.",
      },
      {
        type: "note",
        text: "Fees matter more with small, frequent purchases. Check that each buy isn’t losing a large share to fixed fees.",
      },
    ],
    takeaways: [
      "DCA buys a fixed amount on a fixed schedule",
      "It reduces timing risk, not asset risk",
      "Watch fees on small recurring buys",
    ],
  },
  {
    slug: "volatility-and-risk",
    title: "Volatility, drawdowns and position sizing",
    excerpt: "How to think about swings you can live with, and size positions so one bad move isn’t a disaster.",
    topic: "Markets",
    level: "Intermediate",
    format: "Guide",
    minutes: 8,
    outcomes: [
      "What volatility and drawdown measure",
      "Why losses need larger gains to recover",
      "Simple rules for sizing positions",
    ],
    body: [
      {
        type: "p",
        text: "Crypto assets routinely move 50% or more in a year, in both directions. Managing that starts with deciding how much of a fall you can sit through.",
      },
      { type: "h2", text: "Drawdowns are asymmetric" },
      {
        type: "list",
        items: ["Down 20% needs +25% to recover", "Down 50% needs +100%", "Down 80% needs +400%"],
      },
      { type: "h2", text: "Sizing positions" },
      {
        type: "steps",
        items: [
          "Decide the largest loss on your whole portfolio you could accept without changing your life",
          "Estimate a severe but plausible fall for the asset, for example 70%",
          "Size the position so that fall stays within your limit",
        ],
      },
      {
        type: "code",
        label: "example",
        code: "Portfolio: $50,000, maximum acceptable loss: 10% = $5,000\nPlausible fall: 70%\nPosition size: 5,000 / 0.70 ≈ $7,100",
      },
      { type: "h2", text: "Other habits" },
      {
        type: "list",
        items: [
          "Spread holdings across assets that don’t all move together",
          "Rebalance on a schedule rather than on feelings",
          "Avoid leverage unless you understand exactly how liquidation works",
        ],
      },
    ],
    takeaways: [
      "Large losses need much larger gains to recover",
      "Size positions by the loss you can accept",
      "Diversify and rebalance on a schedule",
    ],
  },

  /* Technology */
  {
    slug: "consensus-mechanisms",
    title: "Consensus mechanisms compared",
    excerpt: "Proof of work, proof of stake and BFT-style finality: how networks agree, and what each costs.",
    topic: "Technology",
    level: "Intermediate",
    format: "Explainer",
    minutes: 9,
    outcomes: [
      "The problem consensus solves",
      "How the main families differ",
      "The trade-offs between speed, finality and decentralisation",
    ],
    body: [
      {
        type: "p",
        text: "Thousands of computers that don’t trust each other have to agree on one order of transactions. Consensus mechanisms are the rules that make that possible even when some participants lie or go offline.",
      },
      { type: "h2", text: "Proof of work" },
      {
        type: "p",
        text: "Miners compete to find a number that makes a block’s hash meet a target. Finding it is expensive; checking it is cheap. The heaviest chain wins, and finality is probabilistic: more blocks on top, more certainty.",
      },
      { type: "h2", text: "Proof of stake" },
      {
        type: "p",
        text: "Validators are chosen in proportion to their stake. Misbehaviour is punished by slashing. Energy use is low, and many designs add explicit finality checkpoints.",
      },
      { type: "h2", text: "BFT-style consensus" },
      {
        type: "p",
        text: "Networks such as those built on Tendermint run voting rounds where two-thirds of stake must sign a block before it’s committed. Finality is immediate, at the cost of halting if too many validators go offline.",
      },
      { type: "h2", text: "Trade-offs" },
      {
        type: "list",
        items: [
          "Liveness vs safety: keep producing blocks, or stop rather than risk a conflict",
          "Validator count vs speed: more participants means more messages per block",
          "Hardware requirements vs who can take part",
        ],
      },
    ],
    takeaways: [
      "Consensus lets untrusting parties agree on one history",
      "Work, stake and voting are different ways to make cheating costly",
      "Each design trades speed, finality and openness differently",
    ],
  },
  {
    slug: "layer-2-rollups",
    title: "Layer 2s and rollups",
    excerpt:
      "Cheaper transactions that still settle on Ethereum. Optimistic vs zero-knowledge, and the bridges between.",
    topic: "Technology",
    level: "Intermediate",
    format: "Explainer",
    minutes: 9,
    outcomes: [
      "Why layer 2 networks exist",
      "How optimistic and zero-knowledge rollups differ",
      "The risks of bridging funds",
    ],
    body: [
      {
        type: "p",
        text: "Ethereum’s base layer is secure but has limited space, so busy periods get expensive. Rollups process transactions elsewhere and post compressed results back to Ethereum, inheriting much of its security.",
      },
      { type: "h2", text: "Optimistic rollups" },
      {
        type: "p",
        text: "Batches are assumed valid unless someone proves otherwise during a challenge window, typically seven days. Withdrawals to Ethereum wait for that window unless you use a third-party bridge that fronts the funds.",
      },
      { type: "h2", text: "Zero-knowledge rollups" },
      {
        type: "p",
        text: "Each batch comes with a cryptographic proof that it was computed correctly. Ethereum verifies the proof, so withdrawals can complete once it’s accepted, without a long challenge period.",
      },
      { type: "h2", text: "What to watch" },
      {
        type: "list",
        items: [
          "Sequencers: most rollups still rely on one operator to order transactions",
          "Upgrade keys: who can change the rollup’s contracts, and how quickly",
          "Bridges: contracts holding large balances have been frequent targets",
        ],
      },
      {
        type: "note",
        title: "Same token, different chain",
        text: "ETH on a rollup is not the same as ETH on Ethereum until it’s bridged back. Check which network your wallet and the recipient are on before sending.",
      },
    ],
    takeaways: [
      "Rollups move execution off Ethereum and settle back to it",
      "Optimistic rollups use challenge windows; ZK rollups use proofs",
      "Bridges and upgrade keys are where the extra risk lives",
    ],
  },
  {
    slug: "smart-contracts",
    title: "Smart contracts: code that holds money",
    excerpt: "What a contract is, how you interact with one, and what an approval actually allows.",
    topic: "Technology",
    level: "Beginner",
    format: "Explainer",
    minutes: 7,
    outcomes: [
      "What a smart contract is",
      "What happens when you ‘connect’ and ‘approve’",
      "How audits help, and their limits",
    ],
    body: [
      {
        type: "p",
        text: "A smart contract is a program stored on a blockchain. It has its own address, can hold funds, and runs exactly as written whenever someone calls it. Nobody, including its author, can change a deployed contract unless it was built to be upgradable.",
      },
      { type: "h2", text: "Connecting and approving" },
      {
        type: "list",
        items: [
          "Connecting a wallet only shares your public address with a site",
          "Signing a transaction lets a contract act once, as described",
          "An approval lets a contract move a token from your wallet later, up to a limit",
        ],
      },
      {
        type: "code",
        label: "an approval, in plain terms",
        code: "approve(spender = 0x7a3…e91, amount = 500 USDC)\n→ contract 0x7a3…e91 may move up to 500 USDC from your wallet\n→ until you revoke it or it’s used up",
      },
      { type: "h2", text: "Audits" },
      {
        type: "p",
        text: "An audit is an independent code review. It reduces the chance of known bug classes but can’t prove a contract is safe, and doesn’t cover changes made after the review. Check whether an audit covers the version actually deployed.",
      },
      {
        type: "note",
        text: "Prefer limited approvals to unlimited ones, and revoke approvals for apps you’ve stopped using.",
      },
    ],
    takeaways: [
      "Contracts are programs with addresses and balances",
      "Approvals grant ongoing access to your tokens",
      "Audits lower risk but never remove it",
    ],
  },
  {
    slug: "cryptography-basics",
    title: "Hashes, keys and signatures",
    excerpt: "The three pieces of cryptography every blockchain relies on, explained from first principles.",
    topic: "Technology",
    level: "Advanced",
    format: "Deep dive",
    minutes: 11,
    outcomes: [
      "What a hash function guarantees",
      "How public and private keys relate",
      "How a signature proves ownership without revealing the key",
    ],
    body: [
      {
        type: "p",
        text: "Blockchains combine a few well-studied cryptographic tools. None is new; what’s new is using them together to replace a trusted record-keeper.",
      },
      { type: "h2", text: "Hash functions" },
      {
        type: "p",
        text: "A hash function turns any input into a fixed-size fingerprint. Change one character and the output changes completely, and there’s no practical way to find an input that produces a chosen output.",
      },
      {
        type: "code",
        label: "SHA-256",
        code: '"stake"  → 7d1a…c4f0\n"stake." → e93b…0a12',
      },
      { type: "h2", text: "Key pairs" },
      {
        type: "p",
        text: "A private key is a very large random number. The public key is derived from it with one-way elliptic-curve maths: easy to compute forwards, infeasible to reverse. Your address is usually a hash of the public key.",
      },
      { type: "h2", text: "Signatures" },
      {
        type: "steps",
        items: [
          "Your wallet hashes the transaction",
          "It combines that hash with your private key to produce a signature",
          "Anyone can check the signature against your public key and the transaction",
          "If a single byte of the transaction changes, the signature no longer verifies",
        ],
      },
      { type: "h2", text: "What could break it" },
      {
        type: "p",
        text: "Weak randomness when keys are generated has caused real losses; strong algorithms don’t help if the starting number is guessable. Large quantum computers could one day threaten today’s signature schemes, and networks are researching replacements well ahead of that.",
      },
      {
        type: "note",
        title: "Why this matters for you",
        text: "Your security is your private key’s secrecy. Every protection in this section assumes nobody else ever sees it.",
      },
    ],
    takeaways: [
      "Hashes fingerprint data and link blocks",
      "Private keys derive public keys one way only",
      "Signatures prove control without revealing the key",
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

export function getTopic(name: LearnTopic) {
  return TOPICS.find((t) => t.name === name) ?? TOPICS[0];
}

export function relatedGuides(guide: Guide, count = 3) {
  const sameTopic = GUIDES.filter((g) => g.slug !== guide.slug && g.topic === guide.topic);
  const others = GUIDES.filter((g) => g.slug !== guide.slug && g.topic !== guide.topic && g.level === guide.level);
  return [...sameTopic, ...others].slice(0, count);
}

export const totalLearnMinutes = GUIDES.reduce((sum, g) => sum + g.minutes, 0);
