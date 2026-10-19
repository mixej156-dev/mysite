"use client";

import { useLayoutEffect } from "react";

/* Kept in sync with the [data-enter-scope] rules in globals.css */
const ITEMS = ":is([data-enter], tbody > tr, :is(ul, ol) > li)";
const SELECTOR = `[data-enter-scope] ${ITEMS}`;
/* Later items share the last delay, so long tables don't trickle in */
const MAX_STEP = 12;

/** Numbers entering items in document order within each [data-enter-scope]: --enter-i drives the stagger delay. */
function number(items: Element[], seen: WeakSet<Element>) {
  const counters = new Map<Element, number>();
  const fresh = items.filter((el) => !seen.has(el));
  fresh.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  for (const el of fresh) {
    seen.add(el);
    const scope = el.closest("[data-enter-scope]");
    if (!scope || !(el instanceof HTMLElement)) continue;
    const i = counters.get(scope) ?? 0;
    el.style.setProperty("--enter-i", String(Math.min(i, MAX_STEP)));
    counters.set(scope, i + 1);
  }
}

/**
 * Staggers the dashboard entrance. Items that mount together (the shell on first load, a page when a section
 * opens, a tab, a filtered list) count from zero, before the browser paints them. Watches the whole body so the
 * navigation sheet, which is portalled, gets the same treatment.
 */
export function useEnterSequence() {
  useLayoutEffect(() => {
    const seen = new WeakSet<Element>();
    number([...document.querySelectorAll(SELECTOR)], seen);

    const observer = new MutationObserver((records) => {
      const added: Element[] = [];
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) added.push(node);
          added.push(...node.querySelectorAll(SELECTOR));
        }
      }
      if (added.length) number(added, seen);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
}
