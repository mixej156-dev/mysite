import NextLink from "next/link";
import type { ComponentProps } from "react";

const NAV_TRANSITION = ["nav"];

/**
 * next/link that tags navigations with the "nav" transition type, so the page cross-fade in
 * (site)/layout.tsx runs for real navigations only, not for background router updates.
 */
export function Link({ transitionTypes = NAV_TRANSITION, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink transitionTypes={transitionTypes} {...props} />;
}
