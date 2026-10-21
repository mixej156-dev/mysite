"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { duration } from "@/design-system/motion";

const COUNT_MS = duration.slow * 1000 * 2.5;

/* The visitor's reduced-motion setting, false on the server and in the first render, so hydration matches what the
   server sent (framer-motion's hook reads it straight away, which made the figure differ from the server's 0) */
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useReduceMotion = () =>
  useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );

/**
 * A figure that counts up from zero when it mounts and glides to a new value when it changes (after a stake or a
 * deposit). Screen readers get the final value only.
 */
export function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const reduceMotion = useReduceMotion();
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      from.current = value;
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const next = origin + (value - origin) * (1 - (1 - t) ** 4);
      from.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);

  return (
    <>
      <span aria-hidden>{format(reduceMotion ? value : shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
