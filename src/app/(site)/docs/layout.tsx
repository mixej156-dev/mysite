import { DocsNav } from "@/components/docs/DocsNav";
import { DOC_SECTIONS } from "@/data/docs";

const NAV = DOC_SECTIONS.map((s) => ({
  title: s.title,
  articles: s.articles.map(({ slug, title }) => ({ slug, title })),
}));

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="container-page grid gap-10 pt-12 pb-24 md:pt-16 md:pb-32 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <DocsNav sections={NAV} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
