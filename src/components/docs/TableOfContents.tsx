import { type ContentBlock, slugify } from "@/lib/content";

/** In-page links to each h2 of an article. Hidden when there are fewer than two headings. */
export function TableOfContents({ blocks, idPrefix = "" }: { blocks: ContentBlock[]; idPrefix?: string }) {
  const headings = blocks.filter((b): b is Extract<ContentBlock, { type: "h2" }> => b.type === "h2");
  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="text-caption font-medium">On this page</p>
      <ul className="mt-3 flex flex-col gap-2 text-small">
        {headings.map((h) => (
          <li key={h.text}>
            <a
              href={`#${idPrefix}${h.id ?? slugify(h.text)}`}
              className="rounded-sm text-muted transition-colors duration-fast hover:text-text"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
