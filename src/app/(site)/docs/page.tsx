import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Link } from "@/components/Link";
import { Card } from "@/design-system";
import { DOC_SECTIONS } from "@/data/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description: "How staking on LONAR ECO. works: accounts, staking and unstaking, rewards, and security.",
};

export default function DocsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Docs" }]} />
      <h1 className="mt-8 text-h1">Documentation</h1>
      <p className="mt-5 max-w-[56ch] text-lead text-muted">
        How the platform works, from your first stake to reading the rewards ledger. Short articles, one task each.
      </p>
      <div className="mt-8 sm:mt-12 grid gap-4 md:grid-cols-2">
        {DOC_SECTIONS.map((section) => (
          <Card key={section.title} padding="lg" className="flex flex-col gap-4">
            <h2 className="text-h4 font-medium">{section.title}</h2>
            <ul className="flex flex-col gap-3">
              {section.articles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/docs/${a.slug}`}
                    className="rounded-sm text-small font-medium text-accent-text hover:underline"
                  >
                    {a.title}
                  </Link>
                  <p className="mt-0.5 text-small text-muted">{a.description}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="mt-8 sm:mt-10 text-small text-muted">
        Can’t find what you need?{" "}
        <Link href="/contact" className="rounded-sm font-medium text-accent-text hover:underline">
          Contact support
        </Link>
        .
      </p>
    </>
  );
}
