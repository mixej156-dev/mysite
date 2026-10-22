/* Security controls, ordered by the life of a stake: from key creation to withdrawal. Neutral wording only. */

export const SECURITY_CONTROLS = [
  {
    title: "Key management",
    body: "Signing keys are generated offline and split across separate secure locations. No single person can sign alone.",
  },
  {
    title: "Validator operations",
    body: "Several regions, several hosting providers. One outage doesn’t stop a pool.",
  },
  {
    title: "Monitoring",
    body: "Performance and missed duties are watched around the clock. When something slips, an on-call engineer picks it up and a note is published, even when no rewards were lost.",
  },
  {
    title: "Reward accounting",
    body: "Each reward is recorded per epoch against the validator that earned it. You see the same ledger in your dashboard.",
  },
  {
    title: "Withdrawals",
    body: "Unstaking follows the network’s own unbonding queue. You see the release date before you confirm.",
  },
];

export const CUSTODY_PRACTICES = [
  {
    title: "Key storage",
    body: "Signing keys are held in hardware security modules. Backups are encrypted and kept in separate locations from the live keys.",
  },
  {
    title: "Access control",
    body: "Production access needs two people, hardware security keys and a recorded reason. Access is reviewed every quarter.",
  },
  {
    title: "Change management",
    body: "Every change to validator infrastructure is peer-reviewed, tested on a test network first and rolled out in stages.",
  },
];

export const INCIDENT_STEPS = [
  { title: "Detect", body: "Alerts and on-call engineers catch missed duties, outages and anything that looks off." },
  { title: "Contain", body: "Isolate or fail over, by the written runbook." },
  { title: "Communicate", body: "A status note goes out while we work, and affected stakers are contacted directly." },
  {
    title: "Review",
    body: "Every incident ends with a written review: what caused it, what it cost in rewards, and what we changed so it doesn’t happen the same way twice.",
  },
];

export const BOUNTY_SEVERITIES = [
  { level: "Critical", example: "Loss or theft of staked funds or signing keys" },
  { level: "High", example: "Unauthorised access to accounts or withdrawal flows" },
  { level: "Medium", example: "Exposure of personal data, broken access checks" },
  { level: "Low", example: "Issues with limited impact and no direct path to funds" },
];
