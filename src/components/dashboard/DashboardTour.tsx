"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/design-system/components/Button";
import { cn } from "@/lib/cn";
import { TOUR_DONE_KEY, TOUR_START_EVENT } from "./tour";

/*
 * First-visit tour of the overview: the page dims, a cut-out glides from one part to the next and a card explains
 * it. Targets are marked with data-tour; where a part has a phone and a desktop version (the Stake button, the
 * navigation) both carry the same name and the visible one is used. Finished or skipped once, it stays away until
 * "Take the tour" in the account menu clears the flag.
 */

type Step = { target?: string; title: string; body: string };

const STEPS: Step[] = [
  {
    title: "Welcome to your dashboard",
    body: "A quick look around: five stops, under a minute. You can leave at any point.",
  },
  {
    target: "balance",
    title: "Your balance",
    body: "Everything you hold here, staked and in your wallet, at reference prices. Below the figure is the change over the past 30 days.",
  },
  {
    target: "positions",
    title: "Your positions",
    body: "Each stake with its pool, estimated APY and the rewards it has earned. Manage opens the full table, where you can unstake.",
  },
  {
    target: "stake",
    title: "Stake in a few steps",
    body: "Pick a pool, enter an amount and review every term before you confirm. Rewards start the next day.",
  },
  {
    target: "notifications",
    title: "Stay in the loop",
    body: "Payouts, finished unbonding, security events and network incidents show up here.",
  },
  {
    target: "nav",
    title: "Everything else",
    body: "Rewards history, transactions, your wallet, referrals and settings are all one tap away.",
  },
];

type Box = { top: number; left: number; width: number; height: number };

const GAP = 12;
const EDGE = 16;
/** Room the cut-out leaves around its target */
const PAD = 6;

function findTarget(name: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`);
  return [...all].find((el) => el.getClientRects().length > 0 && el.getBoundingClientRect().width > 0) ?? null;
}

const sameBox = (a: Box | null, b: Box | null) =>
  a === b || (!!a && !!b && a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height);

/** Where the card goes: beside a tall target if there is room, else below or above, else docked at the bottom */
function placeCard(box: Box | null, card: { width: number; height: number }): CSSProperties {
  const vw = window.innerWidth;
  /* Phones and tablets: the bottom tab bar is not room for the card */
  const tabs = document.querySelector('[aria-label="Dashboard shortcuts"]')?.getBoundingClientRect();
  const vh = tabs && tabs.height > 0 ? tabs.top : window.innerHeight;
  if (!box) return { top: Math.max(EDGE, (vh - card.height) / 2), left: (vw - card.width) / 2 };

  const clampX = (x: number) => Math.min(Math.max(x, EDGE), vw - card.width - EDGE);
  const clampY = (y: number) => Math.min(Math.max(y, EDGE), vh - card.height - EDGE);
  const right = vw - (box.left + box.width);

  if (box.height > vh * 0.5 && right >= card.width + GAP + EDGE)
    return { top: clampY(box.top + box.height / 2 - card.height / 2), left: box.left + box.width + GAP };

  const below = vh - (box.top + box.height);
  const centerX = clampX(box.left + box.width / 2 - card.width / 2);
  if (below >= card.height + GAP + EDGE) return { top: box.top + box.height + GAP, left: centerX };
  if (box.top >= card.height + GAP + EDGE) return { top: box.top - GAP - card.height, left: centerX };
  return { top: vh - card.height - EDGE, left: centerX };
}

function Tour({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [cardStyle, setCardStyle] = useState<CSSProperties>({ opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  /* Bring the target into view, then follow it every frame (smooth scrolling, resizes, late layout) */
  useEffect(() => {
    const el = step.target ? findTarget(step.target) : null;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 80) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      }
    }
    let frame = 0;
    const follow = () => {
      const r = el?.getBoundingClientRect();
      const next = r
        ? {
            top: Math.round(r.top - PAD),
            left: Math.round(r.left - PAD),
            width: Math.round(r.width + PAD * 2),
            height: Math.round(r.height + PAD * 2),
          }
        : null;
      setBox((prev) => (sameBox(prev, next) ? prev : next));
      frame = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(frame);
  }, [step.target]);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    setCardStyle(placeCard(box, { width: card.offsetWidth, height: card.offsetHeight }));
  }, [box, index]);

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, [index]);

  const go = (to: number) => (to >= STEPS.length ? onClose() : setIndex(Math.max(0, to)));

  /* Esc leaves, arrows step, Tab stays inside the card. On the window, so it works wherever focus was left */
  const keys = useRef<(e: globalThis.KeyboardEvent) => void>(null);
  useEffect(() => {
    keys.current = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "Tab") {
        const focusable = [...(cardRef.current?.querySelectorAll<HTMLElement>("button") ?? [])];
        const at = focusable.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        focusable[(at + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus();
      }
    };
  });
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => keys.current?.(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const small = box !== null && box.width < 140;

  return (
    <div className="fixed inset-0 z-tooltip">
      {/* The dim with a cut-out: one shadow around a box that glides to each target. With no target (the
          welcome) the box shrinks to a point in the middle and the shadow dims everything. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed transition-[top,left,width,height,opacity] duration-slow ease-brand",
          box && "ring-2 ring-accent",
          small ? "rounded-field" : "rounded-card",
        )}
        style={{
          ...(box ?? { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 }),
          boxShadow: "0 0 0 200vmax var(--scrim)",
          opacity: box || !step.target ? 1 : 0,
        }}
      />

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        style={cardStyle}
        className="fixed w-[min(22rem,calc(100vw-2rem))] rounded-card border border-rule bg-surface p-5 text-text shadow-overlay transition-[top,left] duration-slow ease-brand"
      >
        <div key={index} className="animate-pop-in">
          <p className="font-mono text-caption text-muted">
            {index === 0 ? "Getting around" : `${index} of ${STEPS.length - 1}`}
          </p>
          <h2 id="tour-title" className="mt-1.5 text-h4 font-medium">
            {step.title}
          </h2>
          <p id="tour-body" className="mt-2 text-small text-muted">
            {step.body}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden className="mr-auto flex gap-1.5">
              {STEPS.slice(1).map((s, i) => (
                <span
                  key={s.title}
                  className={cn(
                    "h-1.5 rounded-pill transition-[width,background-color] duration-base ease-brand",
                    i + 1 === index ? "w-4 bg-accent" : "w-1.5 bg-rule-strong",
                  )}
                />
              ))}
            </span>
          )}
          {index === 0 ? (
            <Button variant="ghost" size="sm" onClick={onClose} className="mr-auto -ml-2">
              Not now
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => go(index - 1)}>
              Back
            </Button>
          )}
          <Button ref={nextRef} size="sm" onClick={() => go(index + 1)}>
            {index === 0 ? "Show me around" : last ? "Finish" : "Next"}
          </Button>
        </div>
        {index > 0 && !last && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-sm text-caption text-muted transition-colors duration-fast hover:text-text"
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  );
}

/** Mounted on the overview. Starts by itself on the first visit, once the page has settled in. */
export function DashboardTour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(TOUR_DONE_KEY) === "done";
    } catch {
      // Storage blocked: don't show it on every visit
    }
    /* After the entrance animations, so the cut-out lands on parts that have stopped moving */
    const timer = seen ? 0 : window.setTimeout(() => setOpen(true), 1100);
    /* From the account menu: let it close and hand focus back first, then the tour takes focus */
    let later = 0;
    const onStart = () => {
      later = window.setTimeout(() => setOpen(true), 150);
    };
    window.addEventListener(TOUR_START_EVENT, onStart);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(later);
      window.removeEventListener(TOUR_START_EVENT, onStart);
    };
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(TOUR_DONE_KEY, "done");
    } catch {
      // Storage blocked: it shows again next visit
    }
  };

  return open ? createPortal(<Tour onClose={close} />, document.body) : null;
}
