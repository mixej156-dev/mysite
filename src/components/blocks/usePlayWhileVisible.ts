"use client";

import { useEffect, useRef, useState } from "react";

/**
 * For small self-running scenes: `playing` is true while the element is on screen, never with reduced motion.
 * `tick` counts up every `ms` while playing and holds while not; it is null until the first tick, so the server
 * and a reduced-motion visitor get one still frame.
 */
export function usePlayWhileVisible<T extends Element>(ms: number) {
  const ref = useRef<T>(null);
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTick((t) => (t === null ? 0 : t + 1)), ms);
    return () => window.clearInterval(id);
  }, [playing, ms]);

  return { ref, playing, tick };
}
