/* Security controls, ordered by the life of a stake: from key creation to withdrawal. Neutral wording only. */

export const SECURITY_CONTROLS = [
  {
    title: "Key management",
    body: "Validator signing keys are generated offline and split across separate secure locations, so no single person can sign alone.",
  },
  {
    title: "Validator operations",
    body: "Validators run across several regions and hosting providers, so one outage doesn’t stop a pool.",
  },
  {
    title: "Monitoring",
    body: "Performance and missed duties are watched around the clock, with on-call engineers and published incident notes.",
  },
  {
    title: "Reward accounting",
    body: "Each reward is recorded per epoch against the validator that earned it, and the ledger is visible in your dashboard.",
  },
  {
    title: "Withdrawals",
    body: "Unstake requests follow the network’s unbonding queue. The expected release date is shown before you confirm.",
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
  { title: "Detect", body: "Automated alerts and on-call engineers pick up missed duties, outages and unusual behaviour." },
  { title: "Contain", body: "Affected validators are isolated or failed over, following written runbooks." },
  { title: "Communicate", body: "A status note goes out while we work, and affected stakers are contacted directly." },
  { title: "Review", body: "Each incident ends with a written review: cause, impact on rewards, and what changed." },
];

export const BOUNTY_SEVERITIES = [
  { level: "Critical", example: "Loss or theft of staked funds or signing keys" },
  { level: "High", example: "Unauthorised access to accounts or withdrawal flows" },
  { level: "Medium", example: "Exposure of personal data, broken access checks" },
  { level: "Low", example: "Issues with limited impact and no direct path to funds" },
];
