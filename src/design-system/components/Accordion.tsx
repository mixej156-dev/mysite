"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AccordionItemData = { id: string; title: string; content: ReactNode };

export type AccordionProps = {
  items: AccordionItemData[];
  /** Allow several panels open at once. */
  multiple?: boolean;
  defaultOpen?: string[];
  /** Controlled open panel for single mode, so several accordions can share one open item. */
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  value,
  onValueChange,
  className,
}: AccordionProps) {
  const rootClass = cn("border-t border-rule", className);
  const children = items.map((item) => (
    <RadixAccordion.Item key={item.id} value={item.id} className="border-b border-rule">
      <RadixAccordion.Header>
        <RadixAccordion.Trigger
          className={cn(
            "group flex w-full items-center justify-between gap-4 py-4 text-left text-body font-medium text-text sm:gap-6 sm:py-5 sm:text-h4",
            "transition-colors duration-fast hover:text-accent-text",
          )}
        >
          {item.title}
          <Plus
            aria-hidden
            className="size-5 shrink-0 text-muted transition-transform duration-base group-data-[state=open]:rotate-45"
          />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="max-w-[68ch] pb-5 font-serif text-body text-muted sm:pb-6">{item.content}</div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  ));

  return multiple ? (
    <RadixAccordion.Root type="multiple" defaultValue={defaultOpen} className={rootClass}>
      {children}
    </RadixAccordion.Root>
  ) : (
    <RadixAccordion.Root
      type="single"
      collapsible
      {...(onValueChange ? { value, onValueChange } : { defaultValue: defaultOpen[0] })}
      className={rootClass}
    >
      {children}
    </RadixAccordion.Root>
  );
}
