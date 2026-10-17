/** Structured long-form content, rendered by <Prose>. Used by blog posts, docs and legal pages. */
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "steps"; items: string[] }
  | { type: "note"; title?: string; text: string }
  | { type: "code"; code: string; label?: string };

/** "Why APY moves" -> "why-apy-moves", for heading anchors */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
