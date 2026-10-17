"use client";

import { Info, LogOut, Settings, UserRound, Wallet } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  Modal,
  Tooltip,
  useToast,
} from "@/design-system";
import { Example, Section } from "../_components/Section";
import { ThemePair } from "../_components/ThemePair";

function ConfirmStakeModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const confirm = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast({ tone: "success", title: "Stake confirmed", description: "2.5 ETH is now earning in the Ethereum pool." });
    }, 1200);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Confirm stake"
      description="Check the details. Staked ETH can be withdrawn after a 2–5 day unbonding period."
      trigger={<Button>Review stake</Button>}
      footer={
        <>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button loading={submitting} onClick={confirm}>
            {submitting ? "Confirming" : "Confirm stake"}
          </Button>
        </>
      }
    >
      <dl className="flex flex-col divide-y divide-rule rounded-field border border-rule text-small">
        {[
          ["Pool", "Ethereum"],
          ["Amount", "2.5000 ETH"],
          ["Estimated APY", "3.80%"],
          ["Platform fee", "10% of rewards"],
        ].map(([term, value]) => (
          <div key={term} className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">{term}</dt>
            <dd className="font-mono">{value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}

export function ModalSection() {
  return (
    <Section
      id="modal"
      description="For confirming a consequential action without leaving the page. Focus is trapped inside, Escape closes, and focus returns to the button that opened it."
    >
      <ThemePair>
        {() => (
          <Example label="Confirmation with loading and success toast">
            <div>
              <ConfirmStakeModal />
            </div>
          </Example>
        )}
      </ThemePair>
    </Section>
  );
}

export function DropdownSection() {
  return (
    <Section id="dropdown" description="A short list of actions behind one control, such as the account menu.">
      <ThemePair>
        {() => (
          <Example label="Account menu">
            <div>
              <Dropdown>
                <DropdownTrigger asChild>
                  <Button variant="secondary" iconLeft={<UserRound aria-hidden />}>
                    alex@example.com
                  </Button>
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownLabel>Signed in as alex@example.com</DropdownLabel>
                  <DropdownItem icon={<Wallet aria-hidden />}>Wallet</DropdownItem>
                  <DropdownItem icon={<Settings aria-hidden />} shortcut="⌘,">
                    Settings
                  </DropdownItem>
                  <DropdownItem disabled>API keys</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem icon={<LogOut aria-hidden />} tone="danger">
                    Log out
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </Example>
        )}
      </ThemePair>
    </Section>
  );
}

export function TooltipSection() {
  return (
    <Section
      id="tooltip"
      description="Short definitions for terms and figures. Never the only place important information lives, since touch screens can't hover."
    >
      <ThemePair>
        {() => (
          <Example label="Hover or focus the icon">
            <div className="flex items-center gap-2 text-small">
              <span className="text-muted">Estimated APY</span>
              <span className="font-mono">3.80%</span>
              <Tooltip content="Annual yield if current network rewards and fees stay the same. Not guaranteed.">
                <button
                  type="button"
                  aria-label="About estimated APY"
                  className="grid size-6 place-items-center rounded-pill text-muted transition-colors duration-fast hover:text-text"
                >
                  <Info aria-hidden className="size-4" />
                </button>
              </Tooltip>
            </div>
          </Example>
        )}
      </ThemePair>
    </Section>
  );
}

export function ToastSection() {
  const { toast } = useToast();

  return (
    <Section
      id="toast"
      description="Confirms that an action finished, or explains why it didn't. Toasts appear bottom-right (bottom centre on phones), stack up to three and dismiss after a few seconds."
    >
      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => toast({ tone: "success", title: "Rewards claimed", description: "0.0412 ETH added to your wallet." })}
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              tone: "error",
              title: "Withdrawal not sent",
              description: "Amount exceeds your available balance of 1.2 ETH.",
            })
          }
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ tone: "info", title: "Unbonding started", description: "Funds unlock on 22 Oct." })}
        >
          Info
        </Button>
      </div>
    </Section>
  );
}
