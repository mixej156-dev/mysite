"use client";

import { ArrowDownToLine, Mail, Plus, Search } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Select,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
} from "@/design-system";
import { Example, Section } from "../_components/Section";
import { Preview } from "../_components/Preview";

function ClaimButton() {
  const [loading, setLoading] = useState(false);

  const claim = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1600);
  };

  return (
    <Button variant="secondary" loading={loading} onClick={claim}>
      {loading ? "Claiming" : "Claim rewards"}
    </Button>
  );
}

export function ButtonSection() {
  return (
    <Section
      id="button"
      description="Primary is the one action that moves the user forward on a screen; there is never more than one. Secondary sits beside it, ghost is for tertiary and toolbar actions."
    >
      <Preview>
        {() => (
          <>
            <Example label="Variants">
              <div className="flex flex-wrap gap-3">
                <Button>Start staking</Button>
                <Button variant="secondary">See pools</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </Example>
            <Example label="Sizes: sm, md, lg">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Stake</Button>
                <Button size="md">Stake</Button>
                <Button size="lg">Stake</Button>
              </div>
            </Example>
            <Example label="With icon">
              <div className="flex flex-wrap gap-3">
                <Button iconLeft={<Plus aria-hidden />}>New stake</Button>
                <Button variant="secondary" iconLeft={<ArrowDownToLine aria-hidden />}>
                  Export CSV
                </Button>
              </div>
            </Example>
            <Example label="Disabled and loading">
              <div className="flex flex-wrap gap-3">
                <Button disabled>Stake</Button>
                <Button variant="secondary" disabled>
                  Unstake
                </Button>
                <Button loading>Confirming</Button>
                <ClaimButton />
              </div>
            </Example>
          </>
        )}
      </Preview>
    </Section>
  );
}

export function InputSection() {
  return (
    <Section
      id="input"
      description="Labels sit above the field and stay visible. Hints explain the rule before it is broken; errors say what is wrong and how to fix it. Amounts use monospace digits and show the asset as a suffix."
    >
      <Preview className="sm:grid sm:grid-cols-2 sm:gap-x-6">
        {() => (
          <>
            <Input label="Email" type="email" placeholder="you@company.com" prefix={<Mail aria-hidden />} />
            <Input label="Amount" inputMode="decimal" numeric defaultValue="2.5" suffix="ETH" hint="Minimum 0.1 ETH" />
            <Input
              label="Withdrawal address"
              numeric
              defaultValue="0x7a3f9c"
              error="Address is too short. Paste the full 42-character address."
            />
            <Input label="Referral code" placeholder="Not available" disabled />
            <Input
              label="Search pools"
              placeholder="Asset or network"
              prefix={<Search aria-hidden />}
              className="sm:col-span-2"
            />
            <Textarea label="Message" hint="At least 20 characters." className="sm:col-span-2" rows={3} />
            <Textarea
              label="Message"
              defaultValue="Too short"
              error="Write at least 20 characters so we can help."
              className="sm:col-span-2"
              rows={3}
            />
          </>
        )}
      </Preview>
    </Section>
  );
}

const POOL_OPTIONS = [
  { value: "eth", label: "Ethereum (3.8% APY)" },
  { value: "sol", label: "Solana (6.9% APY)" },
  { value: "atom", label: "Cosmos Hub (14.2% APY)" },
  { value: "dot", label: "Polkadot (11.5% APY)", disabled: true },
];

export function SelectSection() {
  return (
    <Section
      id="select"
      description="For choosing one option from a known list. The open list can be operated with arrow keys and type-ahead."
    >
      <Preview className="sm:grid sm:grid-cols-2 sm:gap-x-6">
        {() => (
          <>
            <Select label="Pool" options={POOL_OPTIONS} placeholder="Choose a pool" />
            <Select label="Pool" options={POOL_OPTIONS} defaultValue="sol" hint="Unbonding takes 2–3 days" />
            <Select label="Payout asset" options={POOL_OPTIONS} error="Choose where rewards are paid" />
            <Select label="Lock period" options={POOL_OPTIONS} disabled placeholder="Flexible only" />
          </>
        )}
      </Preview>
    </Section>
  );
}

export function CheckboxSection() {
  return (
    <Section
      id="checkbox"
      description="Checkbox for agreeing or selecting several items; toggle for settings that apply immediately."
    >
      <Preview className="sm:grid sm:grid-cols-2 sm:gap-x-8">
        {() => (
          <>
            <Example label="Checkbox">
              <div className="flex flex-col gap-4">
                <Checkbox label="Auto-compound rewards" />
                <Checkbox
                  label="I have read the risk disclosure"
                  description="Staked assets can lose value and may be slashed."
                  defaultChecked
                />
                <Checkbox label="Select all positions" checked="indeterminate" />
                <Checkbox label="I agree to the terms" error="Agree to the terms to create an account." />
                <Checkbox label="Unavailable option" disabled />
              </div>
            </Example>
            <Example label="Toggle">
              <div className="flex flex-col gap-4">
                <Toggle label="Email me when rewards are paid" defaultChecked />
                <Toggle label="Two-factor authentication" description="Asks for a code on every sign-in." />
                <Toggle label="Price alerts" disabled />
              </div>
            </Example>
          </>
        )}
      </Preview>
    </Section>
  );
}

function SliderDemo({ disabled = false }: { disabled?: boolean }) {
  const [months, setMonths] = useState(24);
  return (
    <Slider
      label={disabled ? "Lock period (unavailable)" : "Period"}
      value={months}
      onValueChange={setMonths}
      min={1}
      max={60}
      valueText={`${months} months`}
      disabled={disabled}
    />
  );
}

export function SliderSection() {
  return (
    <Section
      id="slider"
      description="For choosing a value in a range where the exact number matters less than the feel of it. Pair it with a text field when people need to type an exact amount. Arrow keys step, Home and End jump to the ends."
    >
      <Preview>
        {() => (
          <>
            <SliderDemo />
            <SliderDemo disabled />
          </>
        )}
      </Preview>
    </Section>
  );
}

export function TabsSection() {
  return (
    <Section
      id="tabs"
      description="Underline tabs switch between views of the same subject. Segmented tabs switch a small range, such as a chart period."
    >
      <Preview>
        {() => (
          <>
            <Example label="Underline">
              <Tabs defaultValue="overview">
                <TabsList aria-label="Pool details">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                  <TabsTrigger value="validators" disabled>
                    Validators
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="text-body text-muted">
                  Ethereum pool delegates to a set of independent validators.
                </TabsContent>
                <TabsContent value="rewards" className="text-body text-muted">
                  Rewards are paid daily in ETH.
                </TabsContent>
                <TabsContent value="risks" className="text-body text-muted">
                  Slashing, smart-contract and price risk apply.
                </TabsContent>
              </Tabs>
            </Example>
            <Example label="Segmented">
              <Tabs defaultValue="1m" variant="segmented">
                <TabsList aria-label="Chart period">
                  {["1W", "1M", "3M", "1Y", "All"].map((p) => (
                    <TabsTrigger key={p} value={p.toLowerCase()}>
                      {p}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </Example>
          </>
        )}
      </Preview>
    </Section>
  );
}
