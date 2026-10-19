"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* What counts as a block: section-level children, grid cells, table rows, or anything marked by hand */
const CANDIDATES = ".container-page > *, section > *, [class~='grid'] > *, tbody > tr, [data-reveal-item]";
const SCOPE = "[data-reveal-scope]";
/* Blocks that enter the viewport together rise one after another */
const STAGGER_MS = 80;
const MAX_STAGGER = 5;

/** Innermost candidates only: a block whose children are blocks themselves lets them rise on their own */
function leaves(root: Element): HTMLElement[] {
  const found = new Set<Element>(root.querySelectorAll(`${SCOPE} :is(${CANDIDATES})`));
  if (root.matches(`${SCOPE} :is(${CANDIDATES})`)) found.add(root);
  for (const el of [...found]) {
    for (let p = el.parentElement; p && !p.matches(SCOPE); p = p.parentElement) found.delete(p);
  }
  return [...found].filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement &&
      /* Intro items have their own load animation */
      !el.parentElement?.hasAttribute("data-intro") &&
      !el.closest("[data-no-reveal], .sr-only") &&
      el.dataset.reveal !== "shown",
  );
}

/**
 * Site-wide scroll reveal: every block below the fold waits, then rises into place as it scrolls into view
 * (the "rise" keyframes in globals.css). Content already on screen is left alone so nothing flickers on load;
 * headers have their own CSS intro instead. Runs again for content added later (route changes, streamed sections).
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const show = (entering: HTMLElement[]) => {
      entering.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        return Math.round(ra.top - rb.top) || ra.left - rb.left;
      });
      entering.forEach((el, i) => {
        el.style.setProperty("--reveal-delay", `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`);
        el.dataset.reveal = "shown";
        io.unobserve(el);
      });
    };

    const io = new IntersectionObserver(
      (entries) => show(entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)),
      { rootMargin: "0px 0px -8% 0px" },
    );

    /* The last lines of a page never cross the trigger line: at the very bottom, show whatever is left */
    const onScroll = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 2) return;
      show([...document.querySelectorAll<HTMLElement>('[data-reveal="hidden"]')]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const arm = (root: Element) => {
      const fold = window.innerHeight * 0.92;
      for (const el of leaves(root)) {
        /* Armed by a previous run (before a route change): keep waiting under the new observer */
        if (el.dataset.reveal === "hidden") {
          io.observe(el);
          continue;
        }
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 || rect.top < fold) continue;
        el.dataset.reveal = "hidden";
        io.observe(el);
      }
    };

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
    };
  }, [pathname]);

  return null;
}
