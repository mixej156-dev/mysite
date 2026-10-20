"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

/* The palette and its index load on first open (or when the pointer heads for the button), not with the page */
const loadDialog = () => import("./SearchDialog");
const SearchDialog = dynamic(loadDialog, { ssr: false });

/* The shortcut as the visitor's keyboard writes it; the server assumes a Mac */
const noSubscribe = () => () => {};
const useIsMac = () =>
  useSyncExternalStore(
    noSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/**
 * Opens the site search: ⌘K / Ctrl+K anywhere, or "/" when not typing in a field. An icon button, and from xl up
 * a field-like button with the shortcut. One per page (each listens for the shortcut).
 */
export function SearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);
  const mac = useIsMac();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (combo || (e.key === "/" && !isTyping(e.target))) {
        e.preventDefault();
        setUsed(true);
        setOpen((o) => (combo ? !o : true));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const show = () => {
    setUsed(true);
    setOpen(true);
  };
  const warm = () => void loadDialog();

  return (
    <>
      <button
        type="button"
        onClick={show}
        onPointerEnter={warm}
        onFocus={warm}
        aria-label="Search"
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          "flex size-10 items-center justify-center gap-2 rounded-field text-text transition-colors duration-fast hover:bg-surface-2",
          "xl:w-48 xl:justify-start xl:border xl:border-rule xl:bg-surface xl:px-3 xl:text-muted xl:hover:border-rule-strong xl:hover:bg-surface xl:hover:text-text",
          className,
        )}
      >
        <Search aria-hidden className="size-5 shrink-0 xl:size-4" />
        <span className="text-small max-xl:hidden">Search</span>
        <kbd aria-hidden className="ml-auto rounded-sm border border-rule px-1.5 font-mono text-caption max-xl:hidden">
          {mac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
      {used && <SearchDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
