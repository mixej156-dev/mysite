import type { Metadata } from "next";
import { ToastProvider } from "@/design-system";
import { fontVariables } from "@/design-system/fonts";
import { themeInitScript } from "@/design-system/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — {BRAND_NAME}",
    default: "{BRAND_NAME} — Staking, kept to account",
  },
  description: "Design prototype of a staking platform. All figures are demo data.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
