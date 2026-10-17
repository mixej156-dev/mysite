import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Prose } from "@/components/blocks/Prose";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { Link } from "@/components/Link";
import { Skeleton } from "@/design-system";
import { DOC_ARTICLES, getDoc } from "@/data/docs";

export function generateStaticParams() {
  return DOC_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const doc = getDoc((await params).slug);
  if (!doc) return { title: "Article not found" };
  return { title: `${doc.title} · Docs`, description: doc.description };
}

async function DocContent({ params }: { params: PageProps<"/docs/[slug]">["params"] }) {
  const slug = (await params).slug;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const index = DOC_ARTICLES.findIndex((a) => a.slug === slug);
  const prev = DOC_ARTICLES[index - 1];
  const next = DOC_ARTICLES[index + 1];

  return (
    <article aria-labelledby={`doc-title-${slug}`} className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-12">
      <div className="min-w-0">
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: doc.section }, { label: doc.title }]} />
        <h1 id={`doc-title-${slug}`} className="mt-8 text-h1">
          {doc.title}
        </h1>
        <p className="mt-4 max-w-[56ch] font-serif text-lead text-muted">{doc.description}</p>
        <Prose blocks={doc.body} lead={false} idPrefix={`${slug}-`} className="mt-10" />
        <nav
          aria-label="Previous and next article"
          className="mt-16 grid gap-4 border-t border-rule pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="group rounded-field border border-rule p-4 transition-colors duration-fast hover:border-rule-strong"
            >
              <span className="flex items-center gap-1.5 text-caption text-muted">
                <ArrowLeft aria-hidden className="size-3.5" /> Previous
              </span>
              <span className="mt-1 block text-small font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/docs/${next.slug}`}
              className="group rounded-field border border-rule p-4 text-right transition-colors duration-fast hover:border-rule-strong"
            >
              <span className="flex items-center justify-end gap-1.5 text-caption text-muted">
                Next <ArrowRight aria-hidden className="size-3.5" />
              </span>
              <span className="mt-1 block text-small font-medium">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
      <aside className="max-xl:hidden">
        <TableOfContents blocks={doc.body} idPrefix={`${slug}-`} />
      </aside>
    </article>
  );
}

function DocSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading article" className="flex flex-col gap-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-4 h-12 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="mt-6 h-40 w-full max-w-[68ch]" />
    </div>
  );
}

export default function DocPage({ params }: PageProps<"/docs/[slug]">) {
  return (
    <Suspense fallback={<DocSkeleton />}>
      <DocContent params={params} />
    </Suspense>
  );
}
