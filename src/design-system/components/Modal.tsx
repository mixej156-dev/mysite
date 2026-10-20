"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m, useDragControls, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { transition } from "../motion";
import { SHEET_OVERLAY, SHEET_SPRING, closesSheet, useIsPhone } from "../sheet";
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
  /* Phones get a bottom sheet (like the mobile menu) that can be pulled down by its handle; larger screens a centred card */
  const sheet = useIsPhone() && !reduceMotion;
  const drag = useDragControls();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                data-theme={scopedTheme}
                className={cn("fixed inset-0 z-overlay", sheet ? SHEET_OVERLAY : "bg-scrim")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.base}
              />
            </Dialog.Overlay>
            <div
              data-theme={scopedTheme}
              className={cn(
                "pointer-events-none fixed inset-0 z-modal grid",
                sheet ? "items-end" : "place-items-center p-4",
              )}
            >
              <Dialog.Content asChild forceMount>
                <m.div
                  className={cn(
                    "pointer-events-auto flex w-full flex-col overflow-hidden",
                    "border border-rule bg-surface text-text shadow-overlay outline-none",
                    sheet
                      ? "max-h-[90dvh] rounded-t-card border-b-0 pb-[env(safe-area-inset-bottom)]"
                      : cn("max-h-[calc(100dvh-2rem)] rounded-card", widths[size]),
                  )}
                  initial={sheet ? { y: "100%" } : reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                  animate={sheet ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={sheet ? { y: "100%" } : reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                  transition={sheet ? SHEET_SPRING : transition.base}
                  drag={sheet ? "y" : false}
                  dragControls={drag}
                  dragListener={false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDragEnd={(_, info) => closesSheet(info) && onOpenChange(false)}
                >
                  {sheet && (
                    <div
                      aria-hidden
                      onPointerDown={(e) => drag.start(e)}
                      className="flex shrink-0 cursor-grab touch-none justify-center pt-2 pb-1"
                    >
                      <span className="h-1.5 w-10 rounded-pill bg-rule-strong" />
                    </div>
                  )}
                  <div className={cn("flex items-start justify-between gap-4 px-6", sheet ? "pt-2" : "pt-6")}>
                    <div className="flex flex-col gap-1.5">
                      <Dialog.Title className="text-h4 font-semibold">{title}</Dialog.Title>
                      {description ? (
                        <Dialog.Description className="font-serif text-body text-muted">
                          {description}
                        </Dialog.Description>
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
                </m.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
