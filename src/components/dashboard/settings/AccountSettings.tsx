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
        title="Reset account data"
        body="Puts balances, positions, activity and settings back to their starting state."
      >
        <Button variant="secondary" onClick={() => setConfirmReset(true)}>
          Reset account data
        </Button>
      </SettingsSection>
      <SettingsSection title="Log out" body="Ends the session on this device. Your balances and settings stay.">
        <Button variant="secondary" onClick={signOut}>
          Log out
        </Button>
      </SettingsSection>

      <Modal
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset account data?"
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
                toast({ tone: "success", title: "Account data reset" });
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
