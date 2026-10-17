"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { createContext, useContext, useEffect, useRef, type ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type TabsVariant = "underline" | "segmented";

const VariantContext = createContext<TabsVariant>("underline");

export type TabsProps = ComponentPropsWithRef<typeof RadixTabs.Root> & { variant?: TabsVariant };

export function Tabs({ variant = "underline", ...props }: TabsProps) {
  return (
    <VariantContext.Provider value={variant}>
      <RadixTabs.Root {...props} />
    </VariantContext.Provider>
  );
}

const listStyles: Record<TabsVariant, string> = {
  underline: "flex gap-6 overflow-x-auto border-b border-rule",
  segmented: "inline-flex max-w-full gap-1 overflow-x-auto rounded-pill bg-surface-2 p-1",
};

const triggerStyles: Record<TabsVariant, string> = {
  underline:
    "relative -mb-px whitespace-nowrap border-b-2 border-transparent pt-1 pb-3 text-small font-medium text-muted " +
    "transition-colors duration-fast hover:text-text data-[state=active]:border-accent data-[state=active]:text-text",
  segmented:
    "h-8 whitespace-nowrap rounded-pill px-4 text-small font-medium text-muted transition-colors duration-fast " +
    "hover:text-text data-[state=active]:bg-surface data-[state=active]:text-text data-[state=active]:shadow-float",
};

export function TabsList({ className, ...props }: ComponentPropsWithRef<typeof RadixTabs.List>) {
  const variant = useContext(VariantContext);
  return <RadixTabs.List className={cn(listStyles[variant], className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ComponentPropsWithRef<typeof RadixTabs.Trigger>) {
  const variant = useContext(VariantContext);
  const ref = useRef<HTMLButtonElement>(null);

  // Radix always points aria-controls at a panel; segmented controls and inactive tabs have none mounted.
  useEffect(() => {
    const el = ref.current;
    const id = el?.getAttribute("aria-controls");
    if (el && id && !document.getElementById(id)) el.removeAttribute("aria-controls");
  });

  return (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(triggerStyles[variant], "disabled:cursor-not-allowed disabled:opacity-45", className)}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentPropsWithRef<typeof RadixTabs.Content>) {
  return <RadixTabs.Content className={cn("pt-6 outline-none", className)} {...props} />;
}
