"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reports when an element first scrolls into view.
 * `startedVisible` is true when it was already on screen at mount, so callers can skip entrance effects.
 */
export function useInViewOnce<T extends Element>(rootMargin = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  const [state, setState] = useState<{ inView: boolean; startedVisible: boolean | null }>({
    inView: false,
    startedVisible: null,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          setState({ inView: entry.isIntersecting, startedVisible: entry.isIntersecting });
          if (entry.isIntersecting) observer.disconnect();
          return;
        }
        if (entry.isIntersecting) {
          setState((s) => ({ ...s, inView: true }));
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, ...state };
}
