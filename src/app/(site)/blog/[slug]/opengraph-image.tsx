import { getPost, posts } from "@/data/posts";
import type { PostCategory } from "@/data/posts-meta";
import { formatDate } from "@/lib/format";
import { OG_SIZE, OG_THEME, renderOgCard } from "../../../_og/card";

export const alt = "Article on the LONAR ECO. blog";
export const size = OG_SIZE;
export const contentType = "image/png";

/* Same category colours as the generated post covers (PostCover) */
const CATEGORY_COLOR: Record<PostCategory, keyof typeof OG_THEME.topic> = {
  Research: "blue",
  Product: "violet",
  Security: "green",
  Guides: "orange",
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug) ?? posts[0];
  return renderOgCard({
    eyebrow: `Blog · ${post.category}`,
    title: post.title,
    color: OG_THEME.topic[CATEGORY_COLOR[post.category]],
    figures: [
      { value: formatDate(post.date), label: "Published" },
      { value: `${post.readingMinutes} min`, label: "Read" },
    ],
  });
}
