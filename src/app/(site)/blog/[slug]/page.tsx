import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Article, ArticleSkeleton } from "@/components/blog/Article";
import { getPost, posts } from "@/data/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

/* params are URL data: read them inside Suspense so navigations show the skeleton instantly */
async function ArticleContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <Article post={post} />;
}

export default function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}
