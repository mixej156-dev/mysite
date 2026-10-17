"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { Testimonial } from "@/data/testimonials";
import { transition } from "@/design-system/motion";

const navButton =
  "grid size-11 place-items-center rounded-pill border border-rule text-text transition-colors duration-fast hover:border-rule-strong hover:bg-surface-2";

export function TestimonialSlider({ items, label }: { items: Testimonial[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const item = items[index];

  const go = (step: number) => {
    setDirection(step);
    setIndex((i) => (i + step + items.length) % items.length);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown}>
      <div className="grid min-h-[20rem] items-start sm:min-h-[15rem] lg:min-h-[13rem]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.figure
            key={item.id}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 * direction }}
            transition={transition.base}
            className="flex flex-col gap-10"
          >
            <blockquote className="max-w-[38ch] font-serif text-h2 leading-[1.3] font-normal tracking-[-0.01em] text-pretty">
              “{item.quote}”
            </blockquote>
            <figcaption className="flex flex-col gap-0.5 text-small">
              <span className="font-medium text-text">{item.name}</span>
              <span className="text-muted">
                {item.role}, {item.company}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-12 flex items-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous quote" className={navButton}>
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next quote" className={navButton}>
          <ChevronRight aria-hidden className="size-5" />
        </button>
        <p className="ml-3 font-mono text-small text-muted" aria-live="polite">
          {index + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
