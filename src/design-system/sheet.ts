"use client";

import type { PanInfo, Transition } from "framer-motion";
import { useSyncExternalStore } from "react";

/*
 * Bottom sheets on touch screens (mobile menu, modals on phones): they slide up on a spring over the blurred
 * page and close when pulled down by the handle past CLOSE_OFFSET or flicked.
 */
export const SHEET_SPRING: Transition = { type: "spring", damping: 34, stiffness: 340 };
export const SHEET_OVERLAY = "bg-scrim/60 backdrop-blur-md";

const CLOSE_OFFSET = 96;
const CLOSE_VELOCITY = 500;

export const closesSheet = (info: PanInfo) => info.offset.y > CLOSE_OFFSET || info.velocity.y > CLOSE_VELOCITY;

/* Phones: below the sm breakpoint (40rem). The server and the first render assume a larger screen. */
const PHONE = "(max-width: 39.99rem)";
const subscribePhone = (onChange: () => void) => {
  const query = window.matchMedia(PHONE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export const useIsPhone = () =>
  useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(PHONE).matches,
    () => false,
  );
