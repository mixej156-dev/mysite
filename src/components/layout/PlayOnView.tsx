"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Plays the icon animations inside (the [data-menu-icon] rules in globals.css) once, shortly after it scrolls into
 * view, so the icon acts out its meaning as its block finishes rising in.
 */
export function PlayOnView({
  children,
  className,
  delay = 350,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => setPlay(true), delay);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay]);

  return (
    <span ref={ref} data-icon-play={play || undefined} className={cn("inline-flex shrink-0", className)}>
      {children}
    </span>
  );
}
