/* Fictional referrals for the demo account. Masked emails, no real people. */

export type Referral = {
  id: string;
  email: string;
  joined: string;
  status: "active" | "signed-up";
  /** Referral reward earned so far, USD */
  earned: number;
};

export const REFERRALS: Referral[] = [
  { id: "r1", email: "j•••@fastmail.example", joined: "2026-06-02", status: "active", earned: 41.2 },
  { id: "r2", email: "m•••@proton.example", joined: "2026-07-19", status: "active", earned: 18.75 },
  { id: "r3", email: "s•••@company.example", joined: "2026-09-08", status: "active", earned: 6.4 },
  { id: "r4", email: "d•••@mail.example", joined: "2026-10-11", status: "signed-up", earned: 0 },
];

/** Demo programme terms, not an offer */
export const REFERRAL_SHARE_PERCENT = 10;
export const REFERRAL_MONTHS = 12;
