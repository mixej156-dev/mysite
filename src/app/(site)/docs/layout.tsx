import { DocsNav } from "@/components/docs/DocsNav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="container-page grid gap-10 pt-12 pb-24 md:pt-16 md:pb-32 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <DocsNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
