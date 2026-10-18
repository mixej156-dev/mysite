import {
  ArrowLeftRight,
  Bell,
  Coins,
  Layers,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = { href: string; label: string; icon: LucideIcon };

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/stake", label: "Stake", icon: PlusCircle },
  { href: "/dashboard/positions", label: "Positions", icon: Layers },
  { href: "/dashboard/rewards", label: "Rewards", icon: Coins },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/referrals", label: "Referrals", icon: Users },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

/** Bottom tab bar on small screens */
export const MOBILE_TABS: DashboardNavItem[] = [
  "/dashboard",
  "/dashboard/positions",
  "/dashboard/stake",
  "/dashboard/rewards",
  "/dashboard/wallet",
].map((href) => DASHBOARD_NAV.find((item) => item.href === href)!);

export function isNavActive(href: string, pathname: string) {
  return href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}
