import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GuideArticle, GuideSkeleton } from "@/components/learn/GuideArticle";
import { GUIDES, getGuide } from "@/data/learn";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return { title: "Guide not found" };
  return { title: guide.title, description: guide.excerpt };
}

/* params are URL data: read them inside Suspense so navigations show the skeleton instantly */
async function GuideContent({ params }: { params: PageProps<"/learn/[slug]">["params"] }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}

export default function GuidePage({ params }: PageProps<"/learn/[slug]">) {
  return (
    <Suspense fallback={<GuideSkeleton />}>
      <GuideContent params={params} />
    </Suspense>
  );
}
