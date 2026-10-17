import { type ContentBlock, slugify } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Long-form reading text. The first paragraph is set as a lead unless `lead` is off; h2s get anchor ids for tables of contents.
 */
export function Prose({
  blocks,
  lead = true,
  idPrefix = "",
  className,
}: {
  blocks: ContentBlock[];
  /** Set the first paragraph larger. Turn off when the page already has a lead above. */
  lead?: boolean;
  /** Prepended to heading ids so they stay unique when Next keeps a previous page in the DOM */
  idPrefix?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[68ch] font-serif text-body text-text", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className={cn("mt-5 first:mt-0", lead && i === 0 && "text-lead")}>
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                id={`${idPrefix}${block.id ?? slugify(block.text)}`}
                className="mt-12 scroll-mt-24 text-h3 text-text first:mt-0"
              >
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={i} className="mt-5 flex list-disc flex-col gap-2 pl-6 marker:text-rule-strong">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="mt-5 flex list-decimal flex-col gap-2 pl-6 marker:font-mono marker:text-muted">
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "note":
            return (
              <div
                key={i}
                role="note"
                className="mt-6 rounded-field border border-rule bg-surface-2 px-5 py-4 font-display text-small"
              >
                {block.title && <p className="font-medium text-text">{block.title}</p>}
                <p className={cn("text-muted", block.title && "mt-1")}>{block.text}</p>
              </div>
            );
          case "code":
            return (
              <figure key={i} className="mt-6 overflow-hidden rounded-field border border-rule bg-surface">
                {block.label && (
                  <figcaption className="border-b border-rule px-4 py-2 font-mono text-caption text-muted">
                    {block.label}
                  </figcaption>
                )}
                <pre className="overflow-x-auto px-4 py-3 font-mono text-caption leading-relaxed text-text">
                  <code>{block.code}</code>
                </pre>
              </figure>
            );
          case "quote":
            return (
              <figure key={i} className="my-10 border-l-2 border-accent pl-6">
                <blockquote className="text-lead text-text">“{block.text}”</blockquote>
                {block.cite && (
                  <figcaption className="mt-3 font-display text-small text-muted">{block.cite}</figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
