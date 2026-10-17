"use client";

import type { ReactNode } from "react";
import { Skeleton } from "@/design-system";
import { PortfolioProvider } from "@/lib/portfolio";
import { RequireAuth } from "../auth/RequireAuth";
import { SkipLink } from "../layout/SkipLink";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

function ShellSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="flex min-h-dvh">
      <div className="w-64 border-r border-rule max-lg:hidden" />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-card" />
        <Skeleton className="h-72 w-full rounded-card" />
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <RequireAuth fallback={<ShellSkeleton />}>
      <PortfolioProvider>
        <SkipLink />
        <div className="flex min-h-dvh">
          <aside aria-label="Sidebar" className="sticky top-0 h-dvh w-64 shrink-0 border-r border-rule bg-bg max-lg:hidden">
            <Sidebar />
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main
              id="main"
              tabIndex={-1}
              className="w-full max-w-[84rem] flex-1 px-4 py-8 outline-none sm:px-6 lg:px-7 lg:py-10"
            >
              {children}
            </main>
            <footer className="border-t border-rule px-4 py-4 text-caption text-muted sm:px-6 lg:px-7">
              <p>Staking involves risk, including loss of principal. Estimated APY is not guaranteed.</p>
            </footer>
          </div>
        </div>
      </PortfolioProvider>
    </RequireAuth>
  );
}
