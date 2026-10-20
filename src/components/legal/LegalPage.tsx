import { Info } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Prose } from "@/components/blocks/Prose";
import { TableOfContents } from "@/components/blocks/ArticleOutline";
import { Link } from "@/components/Link";
import { LEGAL_DOCS, getLegalDoc } from "@/data/legal";
import { formatDate } from "@/lib/format";

/** Shared layout for terms, privacy and risk disclosure. */
export function LegalPage({ slug }: { slug: string }) {
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  const others = LEGAL_DOCS.filter((d) => d.slug !== slug);

  return (
    <article
      aria-labelledby={`legal-title-${slug}`}
      className="container-page pt-6 pb-14 sm:pt-12 sm:pb-24 md:pt-16 md:pb-32"
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: doc.title }]} />
      <header data-intro className="mt-8 max-w-[52rem]">
        <h1 id={`legal-title-${slug}`} className="text-h1">
          {doc.title}
        </h1>
        <p className="mt-4 font-serif text-lead text-muted">{doc.summary}</p>
        <p className="mt-4 text-small text-muted">
          Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
        </p>
      </header>

      <div
        role="note"
        className="mt-8 sm:mt-10 flex max-w-[52rem] items-start gap-3 rounded-card bg-surface-2 p-4 text-small text-text"
      >
        <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
        Template text for the prototype, not legal advice. It doesn’t describe a real company, licence or jurisdiction.
      </div>

      <div className="mt-8 sm:mt-12 grid gap-8 sm:gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <div className="max-lg:hidden">
          <TableOfContents blocks={doc.body} idPrefix={`${slug}-`} />
        </div>
        <div className="min-w-0">
          <Prose blocks={doc.body} lead={false} idPrefix={`${slug}-`} />
          <nav aria-label="Other legal documents" className="mt-10 sm:mt-16 border-t border-rule pt-8">
            <p className="text-small font-medium">Other documents</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-small">
              {others.map((d) => (
                <li key={d.slug}>
                  <Link href={`/legal/${d.slug}`} className="rounded-sm text-accent-text hover:underline">
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </article>
  );
}
