"use client";

import { Laptop, Smartphone } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Badge, Button, Input, Modal, useToast } from "@/design-system";
import { useFocusFirstError } from "@/lib/forms";
import { usePortfolio } from "@/lib/portfolio";
import { PasswordInput } from "../../auth/PasswordInput";
import { SettingsSection } from "./SettingsSection";

const SECRET = "JBSW Y3DP EHPK 3PXP"; // Demo setup key, not usable anywhere

/** Decorative QR-like grid. Not a scannable code. */
function FakeQr() {
  const cells = 21;
  const on = (x: number, y: number) => {
    const finder = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) {
      const lx = x % 14 === 0 || x % 14 === 6 || x === 20 || x === 6;
      const ly = y % 14 === 0 || y % 14 === 6 || y === 20 || y === 6;
      const inner = (x % 14 >= 2 && x % 14 <= 4) || (x >= 16 && x <= 18);
      const innerY = (y % 14 >= 2 && y % 14 <= 4) || (y >= 16 && y <= 18);
      return lx || ly || (inner && innerY);
    }
    return (x * 7 + y * 13 + x * y) % 5 < 2;
  };
  return (
    <svg
      viewBox={`0 0 ${cells} ${cells}`}
      aria-hidden
      className="size-40 rounded-field bg-white p-2 text-black"
      shapeRendering="crispEdges"
    >
      {Array.from({ length: cells * cells }, (_, i) => {
        const x = i % cells;
        const y = Math.floor(i / cells);
        return on(x, y) ? <rect key={i} x={x} y={y} width={1} height={1} fill="currentColor" /> : null;
      })}
    </svg>
  );
}

export function SecuritySettings() {
  const { state, updatePrefs } = usePortfolio();
  const { toast } = useToast();
  const enabled = state.prefs.twoFactor;

  const [setupOpen, setSetupOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const [working, setWorking] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Partial<Record<keyof typeof pw, string>>>({});
  const [pwAttempt, setPwAttempt] = useState(0);
  const [pwSaving, setPwSaving] = useState(false);
  const pwRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(pwRef, pwAttempt);

  const [sessions, setSessions] = useState([
    { id: "this", icon: Laptop, name: "This browser", detail: "Active now", current: true },
    { id: "phone", icon: Smartphone, name: "Phone, Safari", detail: "Last active Oct 15, 2026", current: false },
  ]);

  const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

  const enable = async () => {
    if (!/^\d{6}$/.test(code)) {
      setCodeError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setWorking(true);
    await wait(700);
    updatePrefs({ twoFactor: true });
    setWorking(false);
    setSetupOpen(false);
    toast({ tone: "success", title: "Two-factor authentication is on" });
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    const found = {
      current: pw.current ? undefined : "Enter your current password.",
      next: pw.next.length >= 8 ? undefined : "Use at least 8 characters.",
      confirm: pw.confirm === pw.next && pw.confirm ? undefined : "The passwords don’t match.",
    };
    setPwErrors(found);
    if (Object.values(found).some(Boolean)) {
      setPwAttempt((a) => a + 1);
      return;
    }
    setPwSaving(true);
    await wait(700);
    setPwSaving(false);
    setPw({ current: "", next: "", confirm: "" });
    toast({ tone: "success", title: "Password changed", description: "Demo: the new password isn’t stored anywhere." });
  };

  return (
    <>
      <SettingsSection
        title="Two-factor authentication"
        body="Asks for a code from an authenticator app when you sign in or withdraw."
      >
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-field border border-rule p-4">
          <div className="flex items-center gap-3">
            {enabled ? (
              <Badge tone="success" dot>
                On
              </Badge>
            ) : (
              <Badge tone="warning" dot>
                Off
              </Badge>
            )}
            <span className="text-small">Authenticator app</span>
          </div>
          {enabled ? (
            <Button variant="secondary" size="sm" onClick={() => setDisableOpen(true)}>
              Turn off
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setCode("");
                setCodeError(undefined);
                setSetupOpen(true);
              }}
            >
              Set up
            </Button>
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="Password" body="Use a password you don’t use anywhere else.">
        <form
          ref={pwRef}
          onSubmit={changePassword}
          noValidate
          aria-label="Change password"
          className="flex max-w-lg flex-col gap-5"
        >
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            value={pw.current}
            onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
            error={pwErrors.current}
          />
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            value={pw.next}
            onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
            error={pwErrors.next}
            hint="At least 8 characters."
          />
          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            value={pw.confirm}
            onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
            error={pwErrors.confirm}
          />
          <div>
            <Button type="submit" variant="secondary" loading={pwSaving}>
              {pwSaving ? "Changing" : "Change password"}
            </Button>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection title="Signed-in devices" body="Sign out of devices you don’t recognise.">
        <ul className="flex flex-col divide-y divide-rule rounded-field border border-rule">
          {sessions.map(({ id, icon: Icon, name, detail, current }) => (
            <li key={id} className="flex items-center gap-3 p-4">
              <Icon aria-hidden className="size-5 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-small font-medium">{name}</p>
                <p className="text-caption text-muted">{detail}</p>
              </div>
              {current ? (
                <Badge>This device</Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSessions((s) => s.filter((x) => x.id !== id));
                    toast({ tone: "info", title: `Signed out of ${name}` });
                  }}
                >
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SettingsSection>

      <Modal
        open={setupOpen}
        onOpenChange={(o) => !working && setSetupOpen(o)}
        title="Set up two-factor authentication"
        description="Scan the code with an authenticator app, then enter the 6-digit code it shows."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSetupOpen(false)} disabled={working}>
              Cancel
            </Button>
            <Button onClick={enable} loading={working}>
              {working ? "Turning on" : "Turn on"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <FakeQr />
          <div className="flex w-full flex-col gap-4">
            <div>
              <p className="text-small text-muted">Or enter this key</p>
              <code className="mt-1 block font-mono text-small">{SECRET}</code>
            </div>
            <Input
              label="Code from the app"
              inputMode="numeric"
              numeric
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setCodeError(undefined);
              }}
              error={codeError}
              hint="Demo: any 6 digits work."
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={disableOpen}
        onOpenChange={setDisableOpen}
        title="Turn off two-factor authentication?"
        description="Withdrawals will be blocked until you turn it back on."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDisableOpen(false)}>
              Keep it on
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                updatePrefs({ twoFactor: false });
                setDisableOpen(false);
                toast({ tone: "info", title: "Two-factor authentication is off" });
              }}
            >
              Turn off
            </Button>
          </>
        }
      />
    </>
  );
}
