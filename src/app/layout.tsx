import type { Metadata } from "next";
import { ToastProvider } from "@/design-system";
import { fontVariables } from "@/design-system/fonts";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { AuthProvider } from "@/lib/auth";
import { themeInitScript } from "@/design-system/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — LONAR ECO.",
    default: "LONAR ECO. — Staking, kept to account",
  },
  description: "Staking on six proof-of-stake networks with daily payouts, per-epoch reward records and every fee stated up front.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
          <CookieNotice />
        </ToastProvider>
      </body>
    </html>
  );
}
