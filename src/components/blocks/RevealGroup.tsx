"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades each direct child up the first time it scrolls into view.
 * Children already on screen at mount (and everything under reduced motion) are left alone, so there is no flash.
 */
export function RevealGroup({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    for (const child of Array.from(root.children) as HTMLElement[]) {
      if (child.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      child.dataset.reveal = "hidden";
      observer.observe(child);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
