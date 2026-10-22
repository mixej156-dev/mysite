"use client";

import { Check, Coins, Wallet } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { buttonClasses } from "@/design-system";
import { getPool } from "@/data/pools";
import { NETWORK_PERFORMANCE } from "@/data/validators";
import { cn } from "@/lib/cn";
import { formatDateShort, formatNumber, formatToken, formatUnbonding } from "@/lib/format";
import { DEMO_TODAY, addDays } from "@/lib/series";
import { AnimatedNumber } from "../dashboard/AnimatedNumber";
import { IconChip, TONE_FILL, poolTone } from "../dashboard/tones";

/*
 * The four "How a stake earns" steps acted out in small pieces of the dashboard, one stake of 2.5 ETH followed
 * from the form to the wallet. They play in turn, first to fourth and round again, while the steps are on screen:
 * each acts its part once and holds its last frame until its next turn. Nothing to click. Figures come from
 * the Ethereum pool and its validator data, so they agree with the rest of the site. Decorative: the step text
 * beside each says the same in words.
 */

const POOL = getPool("eth")!;
const PERF = NETWORK_PERFORMANCE.find((n) => n.poolId === POOL.id)!;
const AMOUNT = 2.5;
const TONE = poolTone(POOL.id);
const DAILY = (AMOUNT * POOL.apy) / 100 / 365;
/** Ethereum: 225 epochs a day, one every 6.4 minutes */
const EPOCHS_PER_DAY = 225;
const PER_EPOCH = DAILY / EPOCHS_PER_DAY;
const FIRST_EPOCH = 318_442;
const eth = (v: number, digits = 4) => formatToken(v, POOL.ticker, digits);

type SceneProps = { play: boolean };

/**
 * A scene's clock: `tick` counts from 0 each time its turn starts and holds when the turn ends (null before the
 * first turn, the still frame); `total` counts every tick so far, for figures that keep growing across turns.
 */
function useSceneClock(play: boolean, ms: number) {
  const [clock, setClock] = useState<{ tick: number | null; total: number }>({ tick: null, total: 0 });
  useEffect(() => {
    if (!play) return;
    let n = 0;
    const step = () => setClock((c) => ({ tick: n++, total: c.total + 1 }));
    const first = window.setTimeout(step, 0);
    const id = window.setInterval(step, ms);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [play, ms]);
  return clock;
}

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden inert className={cn("relative size-full overflow-hidden bg-surface-2 p-3 sm:p-4", className)}>
      {children}
    </div>
  );
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-field border border-rule bg-surface p-3 text-caption", className)}>{children}</div>
  );
}

function Logo({ className = "size-5" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, decorative
  return <img src={`/logos/networks/${POOL.id}.svg`} alt="" className={className} />;
}

/* 01 Stake: the amount is typed, the terms appear, the stake is confirmed */
const TYPED = "2.5";
const STAKE_MS = 380;
const STAKE_FRAMES = 13;
export function StakeScene({ play }: SceneProps) {
  const { tick } = useSceneClock(play, STAKE_MS);
  /* Still frame: filled in, about to confirm */
  const f = tick === null ? 7 : Math.min(tick, STAKE_FRAMES - 1);
  const typed = TYPED.slice(0, Math.max(0, f));
  const done = f >= 9;
  return (
    <Frame>
      <div className="flex h-full flex-col justify-center">
        <Panel className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="flex-1 font-medium text-text">{POOL.name}</span>
            <span className="font-mono text-muted">{POOL.apy}% APY</span>
          </div>
          <div
            className={cn(
              "flex h-8 items-center rounded-sm border px-2 font-mono text-small transition-colors duration-base",
              f < 5 ? "border-accent" : "border-rule",
            )}
          >
            <span className="text-text">{typed}</span>
            {f < 5 && <span className="ml-px h-4 w-px animate-pulse bg-accent" />}
            <span className="ml-auto text-muted">{POOL.ticker}</span>
          </div>
          <dl
            className={cn(
              "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 transition-opacity duration-base",
              f >= 5 ? "opacity-100" : "opacity-0",
            )}
          >
            <dt className="text-muted">Fee</dt>
            <dd className="text-right">{POOL.feePercent}% of rewards</dd>
            <dt className="text-muted">Unbonding</dt>
            <dd className="text-right">{formatUnbonding(POOL.unbondingDays)}</dd>
          </dl>
          {done ? (
            <span className="alert-in flex h-8 items-center justify-center gap-1.5 rounded-field tint-success text-small font-medium text-success">
              <Check className="size-4" /> Stake confirmed
            </span>
          ) : (
            <span
              className={cn(buttonClasses({ size: "sm" }), "w-full", f === 8 && "preview-press", f < 5 && "opacity-50")}
            >
              Stake {TYPED} {POOL.ticker}
            </span>
          )}
        </Panel>
      </div>
    </Frame>
  );
}

/* 02 Delegate: the stake spreads across validators in several regions */
const VALIDATORS = PERF.regions
  .flatMap((region, i) => [
    { region, client: PERF.clients[i % PERF.clients.length] },
    { region, client: PERF.clients[(i + 1) % PERF.clients.length] },
  ])
  .slice(0, 4);
const DELEGATE_MS = 320;
const DELEGATE_FRAMES = 15;
export function DelegateScene({ play }: SceneProps) {
  const { tick } = useSceneClock(play, DELEGATE_MS);
  const f = tick === null ? DELEGATE_FRAMES : Math.min(tick, DELEGATE_FRAMES);
  const share = AMOUNT / POOL.validators;
  return (
    <Frame>
      <div className="flex h-full flex-col justify-center">
        <Panel className="flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <Logo className="size-4" />
            <span className="font-medium text-text">{eth(AMOUNT, 1)}</span>
            <span className="text-muted">across {POOL.validators} validators</span>
          </p>
          <ul className="flex flex-col gap-1.5">
            {VALIDATORS.map((v, i) => {
              const on = f >= 2 + i * 2;
              return (
                <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-pill transition-colors duration-base",
                        on ? "bg-success" : "bg-rule-strong",
                      )}
                    />
                    <span className="truncate">
                      {v.region} · {v.client}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "font-mono text-muted transition-opacity duration-base",
                      on ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {PERF.uptime30d}%
                  </span>
                  <span className="col-span-2 h-1 overflow-hidden rounded-pill bg-surface-2">
                    <span
                      className={cn(
                        "block h-full origin-left rounded-pill transition-transform duration-slow ease-brand",
                        TONE_FILL[TONE],
                        on ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
          <p
            className={cn(
              "flex justify-between text-muted transition-opacity duration-base",
              f >= 10 ? "opacity-100" : "opacity-0",
            )}
          >
            <span>+ {POOL.validators - VALIDATORS.length} more</span>
            <span className="font-mono">{eth(share, 3)} each</span>
          </p>
        </Panel>
      </div>
    </Frame>
  );
}

/* 03 Earn each epoch: epochs tick by, each one adds its reward to today's total */
const EPOCH_MS = 1700;
const BARS = 14;
/* A steady reward with small differences between epochs, the same on server and client */
const barHeight = (epoch: number) => 55 + ((epoch * 37) % 41);
const EARN_EPOCHS = 3;
export function EarnScene({ play }: SceneProps) {
  const { total: n } = useSceneClock(play, EPOCH_MS);
  const epoch = FIRST_EPOCH + n;
  const today = PER_EPOCH * (96 + n);
  return (
    <Frame>
      <div className="flex h-full flex-col justify-center">
        <Panel className="flex flex-col gap-2">
          <p className="flex items-baseline gap-2">
            <span className="text-muted">Epoch</span>
            <span className="font-mono text-small text-text">{formatNumber(epoch)}</span>
            {/* The epoch's reward, rising as it is recorded */}
            {play && (
              <span key={epoch} className="scene-pop ml-auto font-mono text-success">
                +{eth(PER_EPOCH, 7)}
              </span>
            )}
          </p>
          <span className="h-1 overflow-hidden rounded-pill bg-surface-2">
            <span
              key={epoch}
              className={cn("block h-full origin-left rounded-pill", TONE_FILL[TONE], play && "scene-epoch")}
              style={{ animationDuration: `${EPOCH_MS}ms` }}
            />
          </span>
          {/* The last epochs, newest on the right */}
          <div className="flex h-10 items-end gap-0.5">
            {Array.from({ length: BARS }, (_, i) => {
              const e = epoch - (BARS - 1 - i);
              return (
                <span
                  key={e}
                  className={cn("flex-1 rounded-t-sm", i === BARS - 1 ? "bg-accent" : "tint-accent")}
                  style={{ height: `${barHeight(e)}%` }}
                />
              );
            })}
          </div>
          <p className="flex items-baseline justify-between">
            <span className="text-muted">Earned today</span>
            <span className="font-mono text-small text-text">
              +<AnimatedNumber value={today} format={(v) => eth(v, 6)} />
            </span>
          </p>
        </Panel>
      </div>
    </Frame>
  );
}

/* 04 Get paid daily: the day's rewards land in the wallet */
const PAY_MS = 2800;
const WALLET = 1.2483;
export function PaidScene({ play }: SceneProps) {
  const { total: n } = useSceneClock(play, PAY_MS);
  const day = addDays(DEMO_TODAY, n);
  return (
    <Frame>
      <div className="flex h-full flex-col justify-center">
        <Panel className="flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <IconChip icon={Wallet} tone={TONE} size="sm" className="size-6 [&_svg]:size-3" />
            <span className="flex-1 text-muted">Wallet</span>
            <span className="font-mono text-small text-text">
              <AnimatedNumber value={WALLET + n * DAILY} format={(v) => eth(v, 5)} />
            </span>
          </p>
          <ul className="flex flex-col gap-1 overflow-hidden">
            {[0, 1, 2].map((k) => {
              const date = addDays(day, -k);
              return (
                <li
                  key={date}
                  className={cn("flex items-center gap-2 border-t border-rule pt-1", k === 0 && n > 0 && "alert-in")}
                >
                  <IconChip icon={Coins} tone="amber" size="sm" className="size-5 [&_svg]:size-3" />
                  <span className="flex-1">Daily rewards</span>
                  <span className="text-muted">{formatDateShort(date)}</span>
                  <span className="font-mono text-success">+{DAILY.toFixed(5)}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
        {play && (
          <div
            key={day}
            className="scene-toast absolute right-3 bottom-3 flex items-center gap-1.5 rounded-field border border-rule bg-surface px-2.5 py-1.5 text-caption shadow-float"
          >
            <Check className="size-3.5 text-success" />
            Rewards paid
          </div>
        )}
      </div>
    </Frame>
  );
}

/** How long each scene acts, in order; the ticking ones end just before a tick would start a new beat */
const TURNS = [STAKE_MS * STAKE_FRAMES, DELEGATE_MS * DELEGATE_FRAMES, EPOCH_MS * EARN_EPOCHS - 100, PAY_MS - 100];
/** After acting, a scene holds its last frame this long, still marked, so it can be read before the next one starts */
const HOLD_MS = 1400;
const SCENES = [StakeScene, DelegateScene, EarnScene, PaidScene];

/**
 * The four steps with their scenes, which take turns while the list is on screen (never with reduced motion). The
 * step whose turn it is gets an accent frame and a bar under its scene that fills over the turn.
 */
export function StakeStepsLive({ steps }: { steps: readonly { title: string; body: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState(false);
  const [turn, setTurn] = useState(0);
  const [acting, setActing] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -15% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = acting
      ? window.setTimeout(() => setActing(false), TURNS[turn])
      : window.setTimeout(() => {
          setTurn((t) => (t + 1) % SCENES.length);
          setActing(true);
        }, HOLD_MS);
    return () => window.clearTimeout(id);
  }, [visible, turn, acting]);

  return (
    <ol ref={ref} className="grid gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
      {steps.map((step, i) => {
        const Scene = SCENES[i];
        const current = visible && turn === i;
        return (
          <li key={step.title} className="flex flex-col">
            <div
              className={cn(
                "relative h-52 overflow-hidden rounded-card border transition-[border-color,box-shadow] duration-slow",
                current ? "border-accent shadow-float" : "border-rule",
              )}
            >
              <Scene play={current && acting} />
              {current && (
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-rule">
                  <span
                    key={turn}
                    className="block size-full origin-left animate-fill-x bg-accent"
                    style={{ animationDuration: `${TURNS[i] + HOLD_MS}ms` }}
                  />
                </span>
              )}
            </div>
            <p
              className={cn(
                "mt-5 font-mono text-caption transition-colors duration-slow",
                current ? "text-accent-text" : "text-muted",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 text-h4">{step.title}</h3>
            <p className="mt-2 max-w-[34ch] text-body text-muted">{step.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
