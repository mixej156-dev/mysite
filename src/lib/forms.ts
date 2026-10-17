"use client";

import { useEffect, type RefObject } from "react";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * After a failed submit, move focus to the first field marked aria-invalid.
 * Pass a counter that increments on every failed attempt.
 */
export function useFocusFirstError(form: RefObject<HTMLFormElement | null>, attempt: number) {
  useEffect(() => {
    if (attempt === 0) return;
    form.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [form, attempt]);
}
