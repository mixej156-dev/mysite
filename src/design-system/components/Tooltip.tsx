"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { useThemeScope } from "../theme-scope";

export type TooltipProps = {
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  /** A single focusable element. */
  children: ReactNode;
};

export function Tooltip({ content, side = "top", children }: TooltipProps) {
  const scopedTheme = useThemeScope();
  return (
    <RadixTooltip.Provider delayDuration={250} skipDelayDuration={150}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            data-theme={scopedTheme}
            side={side}
            sideOffset={6}
            collisionPadding={12}
            className="z-tooltip max-w-64 rounded-sm bg-text px-2.5 py-1.5 text-caption text-bg shadow-float data-[state=delayed-open]:animate-fade-in"
          >
            {content}
            <RadixTooltip.Arrow className="fill-text" width={10} height={5} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
