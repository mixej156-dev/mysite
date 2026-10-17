/* Illustrative quotes from fictional people, for the prototype only. */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "maren",
    quote:
      "We needed staking our auditors could follow. Per-epoch records meant month-end reconciliation took an afternoon instead of a week.",
    name: "Maren Oduya",
    role: "Head of Treasury",
    company: "Brightfold Capital",
  },
  {
    id: "teodor",
    quote:
      "The unbonding dates are shown before you commit, and they matched what happened. That is rarer than it should be.",
    name: "Teodor Lisk",
    role: "Portfolio Manager",
    company: "Ashgrove Partners",
  },
  {
    id: "anika",
    quote:
      "I moved a long-term ETH position here mainly for the daily payouts. The dashboard shows exactly which validator earned what.",
    name: "Anika Rao",
    role: "Independent investor",
    company: "Private client",
  },
  {
    id: "jules",
    quote:
      "Uptime reports and incident notes are published without us asking. For a fund our size, that transparency is the product.",
    name: "Jules Benedek",
    role: "COO",
    company: "Kettle Digital Assets",
  },
];
