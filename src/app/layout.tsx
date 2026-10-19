import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/design-system/components/Toast";
import { fontVariables } from "@/design-system/fonts";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { AuthProvider } from "@/lib/auth";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { themeInitScript } from "@/design-system/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s — LONAR ECO.",
    default: "LONAR ECO. — Staking, kept to account",
  },
  description:
    "Staking on six proof-of-stake networks with daily payouts, per-epoch reward records and every fee stated up front.",
  /* No og:title/description here: previews fall back to each page's own <title> and description.
     Images come from the opengraph-image files (a default here, per page for pools, articles, guides). */
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

/* Lets fixed bars use the safe-area insets (home indicator) on phones */
export const viewport: Viewport = { viewportFit: "cover" };

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
