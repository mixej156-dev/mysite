"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/* Wait until the browser is idle after load, so the engine never competes with the page itself */
const whenIdle = () =>
  new Promise<void>((resolve) => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 2000 });
    else setTimeout(resolve, 200);
  });
const loadFeatures = () =>
  whenIdle()
    .then(() => import("./motion-features"))
    .then((mod) => mod.default);

/**
 * Lets components use the light `m.*` elements: the animation engine (layout animations included) arrives as a
 * separate chunk after the page loads instead of with every page. `strict` makes a stray `motion.*` an error.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
