"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Button } from "@/design-system";

/** The demo Google account: no OAuth happens, the button just signs in as this person */
export const GOOGLE_DEMO_ACCOUNT = { name: "Alex Morgan", email: "alex.morgan@gmail.com" };

/**
 * "Continue with Google" above the email form, with an "or" rule under it. Like the rest of the demo sign-in it
 * only imitates the round trip: a short wait, then `onContinue` signs in locally.
 */
export function GoogleSignIn({
  onContinue,
  disabled,
  note,
}: {
  onContinue: () => Promise<void>;
  disabled?: boolean;
  /** Small print under the button, e.g. the terms on sign-up */
  note?: ReactNode;
}) {
  const [working, setWorking] = useState(false);

  const start = async () => {
    setWorking(true);
    await new Promise((res) => setTimeout(res, 900));
    await onContinue();
    setWorking(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          loading={working}
          disabled={disabled}
          onClick={start}
          iconLeft={<Image src="/logos/google.svg" alt="" width={20} height={20} unoptimized className="size-5" />}
        >
          {working ? "Connecting to Google" : "Continue with Google"}
        </Button>
        {note && <p className="text-center text-caption text-muted">{note}</p>}
      </div>
      <div className="flex items-center gap-4 text-caption text-muted">
        <span aria-hidden className="h-px flex-1 bg-rule" />
        or with email
        <span aria-hidden className="h-px flex-1 bg-rule" />
      </div>
    </div>
  );
}
