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
    quote: "Unbonding dates up front, and they were right. Rarer than it should be.",
    name: "Teodor Lisk",
    role: "Portfolio Manager",
    company: "Ashgrove Partners",
  },
  {
    id: "anika",
    quote:
      "Honestly, I came for the daily payouts. I stayed because I can see which validator earned what, down to the epoch, and my old provider never showed me that.",
    name: "Anika Rao",
    role: "Independent investor",
    company: "Private client",
  },
  {
    id: "jules",
    quote: "They publish uptime reports and incident notes before anyone asks. At our size, that is the product.",
    name: "Jules Benedek",
    role: "COO",
    company: "Kettle Digital Assets",
  },
];
