"use client";

import { Link2 } from "lucide-react";
import { Button, useToast } from "@/design-system";

/** Copies the current page URL. Nothing is posted anywhere. */
export function ShareButton() {
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        tone: "success",
        title: "Link copied",
        description: "Paste it wherever you’d like to share the article.",
      });
    } catch {
      toast({
        tone: "error",
        title: "Couldn’t copy the link",
        description: "Copy the address from your browser bar instead.",
      });
    }
  };

  return (
    <Button variant="secondary" size="sm" iconLeft={<Link2 aria-hidden />} onClick={copy}>
      Copy link
    </Button>
  );
}
