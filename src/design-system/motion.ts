import type { Transition } from "framer-motion";

/* Mirrors the motion tokens in src/styles/tokens.css */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.16,
  base: 0.28,
  slow: 0.48,
} as const;

export const transition = {
  fast: { duration: duration.fast, ease },
  base: { duration: duration.base, ease },
  slow: { duration: duration.slow, ease },
} satisfies Record<keyof typeof duration, Transition>;
