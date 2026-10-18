import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { sortedPosts, toPostSummary } from "@/data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Research, validator performance reports, product notes and staking guides from the LONAR ECO. team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Blog"
        lead="Research, validator reports, product notes and plain-language guides to staking."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section aria-label="Articles" className="container-page pb-14 sm:pb-24 md:pb-32">
        <BlogIndex posts={sortedPosts.map(toPostSummary)} />
      </section>
    </>
  );
}
