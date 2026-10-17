"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useThemeScope } from "../theme-scope";

export const Dropdown = Menu.Root;
export const DropdownTrigger = Menu.Trigger;
export const DropdownGroup = Menu.Group;

export function DropdownContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: ComponentPropsWithRef<typeof Menu.Content>) {
  const scopedTheme = useThemeScope();
  return (
    <Menu.Portal>
      <Menu.Content
        data-theme={scopedTheme}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-dropdown min-w-48 rounded-field border border-rule bg-surface p-1 text-text shadow-overlay",
          "origin-(--radix-dropdown-menu-content-transform-origin) data-[state=open]:animate-pop-in",
          className,
        )}
        {...props}
      />
    </Menu.Portal>
  );
}

export type DropdownItemProps = ComponentPropsWithRef<typeof Menu.Item> & {
  icon?: ReactNode;
  shortcut?: string;
  tone?: "default" | "danger";
};

export function DropdownItem({ icon, shortcut, tone = "default", className, children, ...props }: DropdownItemProps) {
  return (
    <Menu.Item
      className={cn(
        "flex h-9 cursor-default select-none items-center gap-2.5 rounded-sm px-2.5 text-small outline-none",
        "data-highlighted:bg-surface-2 data-disabled:opacity-45 [&_svg]:size-4 [&_svg]:text-muted",
        tone === "danger" && "text-danger [&_svg]:text-danger",
        className,
      )}
      {...props}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {shortcut && <span className="font-mono text-caption text-muted">{shortcut}</span>}
    </Menu.Item>
  );
}

export function DropdownLabel({ className, ...props }: ComponentPropsWithRef<typeof Menu.Label>) {
  return <Menu.Label className={cn("px-2.5 pt-2 pb-1 text-caption text-muted", className)} {...props} />;
}

export function DropdownSeparator({ className, ...props }: ComponentPropsWithRef<typeof Menu.Separator>) {
  return <Menu.Separator className={cn("my-1 h-px bg-rule", className)} {...props} />;
}
