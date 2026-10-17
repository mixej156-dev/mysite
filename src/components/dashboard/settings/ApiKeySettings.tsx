"use client";

import { Copy, KeyRound } from "lucide-react";
import { useState } from "react";
import { Button, Input, Modal, useToast } from "@/design-system";
import type { ApiKey } from "@/data/portfolio";
import { formatDate } from "@/lib/format";
import { usePortfolio } from "@/lib/portfolio";
import { DEMO_TODAY } from "@/lib/series";
import { EmptyState } from "../../blocks/EmptyState";
import { SettingsSection } from "./SettingsSection";

function newSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `sk_demo_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function ApiKeySettings() {
  const { state, updatePrefs } = usePortfolio();
  const { toast } = useToast();
  const keys = state.prefs.apiKeys;

  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [labelError, setLabelError] = useState<string>();
  const [created, setCreated] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);

  const create = () => {
    if (!label.trim()) {
      setLabelError("Name the key so you can recognise it later.");
      return;
    }
    const secret = newSecret();
    updatePrefs({
      apiKeys: [
        ...keys,
        { id: `key-${Date.now().toString(36)}`, label: label.trim(), last4: secret.slice(-4), createdAt: DEMO_TODAY },
      ],
    });
    setCreated(secret);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreated(null);
    setLabel("");
    setLabelError(undefined);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ tone: "success", title: "Key copied" });
    } catch {
      toast({ tone: "error", title: "Couldn’t copy", description: "Select the key and copy it manually." });
    }
  };

  return (
    <SettingsSection title="API keys" body="Read-only keys for reporting and accounting tools. Keys can’t move funds.">
      <div className="flex flex-col gap-4">
        {keys.length === 0 ? (
          <EmptyState icon={KeyRound} title="No API keys" body="Create a key to connect a reporting tool." />
        ) : (
          <ul className="flex flex-col divide-y divide-rule rounded-field border border-rule">
            {keys.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-small font-medium">{k.label}</p>
                  <p className="font-mono text-caption text-muted">
                    sk_demo_••••{k.last4}, created {formatDate(k.createdAt)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setRevoking(k)}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        )}
        <div>
          <Button variant="secondary" onClick={() => setCreateOpen(true)}>
            Create API key
          </Button>
        </div>
      </div>

      <Modal
        open={createOpen}
        onOpenChange={(o) => !o && closeCreate()}
        title={created ? "Copy your new key" : "Create API key"}
        description={
          created
            ? "This is the only time the full key is shown. Store it somewhere safe."
            : "Keys are read-only: they can see positions and rewards but can’t stake or withdraw."
        }
        footer={
          created ? (
            <Button onClick={closeCreate}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={closeCreate}>
                Cancel
              </Button>
              <Button onClick={create}>Create key</Button>
            </>
          )
        }
      >
        {created ? (
          <div className="flex items-center gap-2 rounded-field bg-surface-2 p-3">
            <code className="min-w-0 flex-1 font-mono text-caption break-all">{created}</code>
            <button
              type="button"
              onClick={() => copy(created)}
              aria-label="Copy key"
              className="grid size-8 shrink-0 place-items-center rounded-field text-muted hover:bg-surface hover:text-text"
            >
              <Copy aria-hidden className="size-4" />
            </button>
          </div>
        ) : (
          <Input
            label="Key name"
            placeholder="e.g. Tax software"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              setLabelError(undefined);
            }}
            error={labelError}
          />
        )}
      </Modal>

      <Modal
        open={revoking !== null}
        onOpenChange={(o) => !o && setRevoking(null)}
        title="Revoke this key?"
        description={revoking ? `Tools using “${revoking.label}” will stop working straight away.` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRevoking(null)}>
              Keep key
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (!revoking) return;
                updatePrefs({ apiKeys: keys.filter((k) => k.id !== revoking.id) });
                toast({ tone: "info", title: "Key revoked", description: revoking.label });
                setRevoking(null);
              }}
            >
              Revoke key
            </Button>
          </>
        }
      />
    </SettingsSection>
  );
}
