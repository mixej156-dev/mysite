import { Coins, Layers, Lock, LogOut, Receipt, Rocket, Server, type LucideIcon } from "lucide-react";
import type { NavTone } from "../layout/nav";

/*
 * Icon and hue per FAQ topic, in the menu's icon language (MenuIcon): the topic filters, the group headings,
 * the popular-question cards and the site search use them. Animations live with the menu ones in globals.css.
 */
export const FAQ_CATEGORY_ICONS: Record<string, { icon: LucideIcon; tone: NavTone }> = {
  start: { icon: Rocket, tone: "violet" },
  staking: { icon: Layers, tone: "blue" },
  rewards: { icon: Coins, tone: "green" },
  fees: { icon: Receipt, tone: "amber" },
  withdrawals: { icon: LogOut, tone: "orange" },
  validators: { icon: Server, tone: "teal" },
  account: { icon: Lock, tone: "rose" },
};
