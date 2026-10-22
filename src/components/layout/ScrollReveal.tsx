"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Only the blocks marked by hand rise, each as one piece; the rest of the page is simply there */
const BLOCKS = "[data-reveal-scope] [data-reveal]";
const SCOPE = "[data-reveal-scope]";
/* Blocks that enter the viewport together rise one after another */
const STAGGER_MS = 80;
const MAX_STAGGER = 5;
/* Mirrors the "rise" keyframes and the brand easing in globals.css / tokens.css */
const RISE: Keyframe[] = [
  { opacity: 0, translate: "0 2.5rem" },
  { opacity: 1, translate: "0 0" },
];
const RISE_TIMING = { duration: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" } as const;

function blocks(root: Element): HTMLElement[] {
  const found = [...root.querySelectorAll(BLOCKS)];
  if (root.matches(BLOCKS)) found.push(root);
  return found.filter((el): el is HTMLElement => el instanceof HTMLElement && !el.closest(".sr-only"));
}

/**
 * Scroll reveal for a few key blocks (marked [data-reveal]): below the fold they wait, then rise into place as they
 * scroll into view. Content already on screen is left alone so nothing flickers on load; headers have their own CSS
 * intro instead.
 * Runs again for content added later (route changes, streamed sections).
 *
 * The waiting state is a held Web Animation, not an attribute or class: React never sees a DOM change, so
 * blocks can be armed before hydration has reached them.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Blocks waiting below the fold, with the animation holding them invisible */
    const waiting = new Map<HTMLElement, Animation>();
    const done = new WeakSet<Element>();

    const show = (entering: HTMLElement[]) => {
      entering.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        return Math.round(ra.top - rb.top) || ra.left - rb.left;
      });
      entering.forEach((el, i) => {
        waiting.get(el)?.cancel();
        waiting.delete(el);
        done.add(el);
        io.unobserve(el);
        el.animate(RISE, { ...RISE_TIMING, delay: Math.min(i, MAX_STAGGER) * STAGGER_MS });
      });
    };

    const io = new IntersectionObserver(
      (entries) => show(entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)),
      { rootMargin: "0px 0px -8% 0px" },
    );

    const arm = (root: Element) => {
      const fold = window.innerHeight * 0.92;
      for (const el of blocks(root)) {
        if (done.has(el) || waiting.has(el)) continue;
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 || rect.top < fold) {
          done.add(el);
          continue;
        }
        waiting.set(el, el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: "forwards" }));
        io.observe(el);
      }
    };

    /* The last lines of a page never cross the trigger line: at the very bottom, show whatever is left */
    const onScroll = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 2) return;
      show([...waiting.keys()]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    for (const scope of document.querySelectorAll(SCOPE)) arm(scope);

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element && node.closest(SCOPE)) arm(node);
        }
      }
    });
    for (const scope of document.querySelectorAll(SCOPE)) mo.observe(scope, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      mo.disconnect();
      /* Leaving the page (or route change): release anything still held, so nothing stays invisible */
      for (const hold of waiting.values()) hold.cancel();
    };
  }, [pathname]);

  return null;
}
