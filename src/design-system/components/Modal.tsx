"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { transition } from "../motion";
import { useThemeScope } from "../theme-scope";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Element that opens the modal; optional when open state is driven elsewhere. */
  trigger?: ReactNode;
  /** Action row, usually Buttons. */
  footer?: ReactNode;
  size?: "sm" | "md";
  children?: ReactNode;
};

const widths = { sm: "max-w-md", md: "max-w-xl" } as const;

export function Modal({ open, onOpenChange, title, description, trigger, footer, size = "sm", children }: ModalProps) {
  const reduceMotion = useReducedMotion();
  const scopedTheme = useThemeScope();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                data-theme={scopedTheme}
                className="fixed inset-0 z-overlay bg-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.base}
              />
            </Dialog.Overlay>
            <div data-theme={scopedTheme} className="pointer-events-none fixed inset-0 z-modal grid place-items-center p-4">
              <Dialog.Content asChild forceMount>
                <motion.div
                  className={cn(
                    "pointer-events-auto flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden",
                    "rounded-card border border-rule bg-surface text-text shadow-overlay outline-none",
                    widths[size],
                  )}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                  transition={transition.base}
                >
                  <div className="flex items-start justify-between gap-4 px-6 pt-6">
                    <div className="flex flex-col gap-1.5">
                      <Dialog.Title className="text-h4 font-semibold">{title}</Dialog.Title>
                      {description ? (
                        <Dialog.Description className="font-serif text-body text-muted">{description}</Dialog.Description>
                      ) : (
                        <Dialog.Description className="sr-only">{title}</Dialog.Description>
                      )}
                    </div>
                    <Dialog.Close
                      aria-label="Close"
                      className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-field text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-text"
                    >
                      <X aria-hidden className="size-5" />
                    </Dialog.Close>
                  </div>
                  {children && <div className="overflow-y-auto px-6 pt-5">{children}</div>}
                  {footer && (
                    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-rule px-6 py-4 sm:flex-row sm:justify-end">
                      {footer}
                    </div>
                  )}
                  {!footer && <div className="pb-6" />}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
