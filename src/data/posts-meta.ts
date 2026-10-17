/* Blog categories and the card-sized view of a post. Kept apart from post bodies so client components stay small. */

export type PostCategory = "Research" | "Product" | "Security" | "Guides";

export const POST_CATEGORIES: PostCategory[] = ["Research", "Product", "Security", "Guides"];

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  /** ISO date */
  date: string;
  readingMinutes: number;
  author: string;
};
