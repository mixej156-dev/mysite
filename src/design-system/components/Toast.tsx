"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { transition } from "../motion";

export type ToastTone = "success" | "error" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** ms; 0 keeps the toast until dismissed. */
  duration?: number;
};

type ToastEntry = ToastInput & { id: number };

type ToastApi = { toast: (input: ToastInput) => number; dismiss: (id: number) => void };

const ToastContext = createContext<ToastApi | null>(null);

const icons = { success: CircleCheck, error: CircleAlert, info: Info } as const;
const iconTones = { success: "text-success", error: "text-danger", info: "text-accent-text" } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(1);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ duration = 4500, tone = "info", ...input }: ToastInput) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-2), { ...input, tone, duration, id }]);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ol
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-toast flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map(({ id, title, description, tone = "info" }) => {
            const Icon = icons[tone];
            return (
              <motion.li
                key={id}
                layout={!reduceMotion}
                role={tone === "error" ? "alert" : "status"}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
                transition={transition.base}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border border-rule bg-surface p-4 text-text shadow-overlay"
              >
                <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconTones[tone])} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-small font-medium">{title}</p>
                  {description && <p className="text-small text-muted">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(id)}
                  aria-label="Dismiss notification"
                  className="-m-1 grid size-7 shrink-0 place-items-center rounded-field text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-text"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
