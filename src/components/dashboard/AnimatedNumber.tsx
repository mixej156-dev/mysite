"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { duration } from "@/design-system/motion";

const COUNT_MS = duration.slow * 1000 * 2.5;

/**
 * A figure that counts up from zero when it mounts and glides to a new value when it changes (after a stake or a
 * deposit). Screen readers get the final value only.
 */
export function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const reduceMotion = useReducedMotion();
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
