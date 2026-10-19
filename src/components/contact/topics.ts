import { Briefcase, LifeBuoy, MessageCircle, Newspaper, Users, type LucideIcon } from "lucide-react";
import type { ContactTopic } from "@/data/contact";
import type { NavTone } from "../layout/nav";

/* One icon and hue per contact topic, shared by the form's topic picker and the channels beside it */
export const TOPIC_ICONS: Record<ContactTopic, { icon: LucideIcon; tone: NavTone }> = {
  support: { icon: LifeBuoy, tone: "teal" },
  partnerships: { icon: Briefcase, tone: "blue" },
  press: { icon: Newspaper, tone: "rose" },
  careers: { icon: Users, tone: "violet" },
  other: { icon: MessageCircle, tone: "amber" },
};

/** Border and wash for the chosen topic, in its hue */
export const TOPIC_SELECTED: Record<NavTone, string> = {
  blue: "border-topic-blue tint-topic-blue",
  green: "border-topic-green tint-topic-green",
  teal: "border-topic-teal tint-topic-teal",
  orange: "border-topic-orange tint-topic-orange",
  amber: "border-topic-amber tint-topic-amber",
  violet: "border-topic-violet tint-topic-violet",
  rose: "border-topic-rose tint-topic-rose",
};
