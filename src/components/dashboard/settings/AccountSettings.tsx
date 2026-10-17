"use client";

import { useState } from "react";
import { Button, Modal, useToast } from "@/design-system";
import { useAuth } from "@/lib/auth";
import { usePortfolio } from "@/lib/portfolio";
import { SettingsSection } from "./SettingsSection";

export function AccountSettings() {
  const { reset } = usePortfolio();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <SettingsSection
        title="Reset demo data"
        body="Puts balances, positions, activity and settings back to how the demo started."
      >
        <Button variant="secondary" onClick={() => setConfirmReset(true)}>
          Reset demo data
        </Button>
      </SettingsSection>
      <SettingsSection title="Log out" body="Clears the demo session from this browser. Your demo data stays.">
        <Button variant="secondary" onClick={signOut}>
          Log out
        </Button>
      </SettingsSection>

      <Modal
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset demo data?"
        description="Stakes, deposits, withdrawals and setting changes you made will be removed."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                reset();
                setConfirmReset(false);
                toast({ tone: "success", title: "Demo data reset" });
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </>
  );
}
