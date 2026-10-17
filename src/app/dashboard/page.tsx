"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { Link } from "@/components/Link";
import { Button, Skeleton, buttonClasses } from "@/design-system";
import { useAuth } from "@/lib/auth";

/* Temporary until the dashboard is built in Stage 7: proves the guard and the session work. */
function Placeholder() {
  const { session, signOut } = useAuth();
  return (
    <main id="main" className="container-page flex min-h-dvh flex-col justify-center gap-6 py-24">
      <h1 className="text-h1">Hello, {session?.name.split(" ")[0]}.</h1>
      <p className="max-w-[48ch] font-serif text-lead text-muted">
        You’re signed in to the demo as {session?.email}. The dashboard arrives in the next stage.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className={buttonClasses({ variant: "secondary" })}>
          Back to site
        </Link>
        <Button variant="ghost" onClick={signOut}>
          Log out
        </Button>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth
      fallback={
        <div
          aria-busy="true"
          aria-label="Loading"
          className="container-page flex min-h-dvh flex-col justify-center gap-4"
        >
          <Skeleton className="h-14 w-72" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>
      }
    >
      <Placeholder />
    </RequireAuth>
  );
}
