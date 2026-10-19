"use client";

import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { Button, Input, Pagination, Tag } from "@/design-system";
import { POST_CATEGORIES, type PostCategory, type PostSummary } from "@/data/posts-meta";
import { BlogCard, FeaturedPostCard } from "../blocks/BlogCard";
import { EmptyState } from "../blocks/EmptyState";

const PAGE_SIZE = 6;

/** Takes summaries, newest first, from the server page so post bodies stay out of the browser bundle. */
export function BlogIndex({ posts: sortedPosts }: { posts: PostSummary[] }) {
  const [category, setCategory] = useState<PostCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const listTop = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = sortedPosts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!q || [p.title, p.excerpt, p.author].some((v) => v.toLowerCase().includes(q))),
  );

  /* The newest post is featured only on the unfiltered first page */
  const showFeatured = category === "All" && !q && page === 1;
  const featured = sortedPosts[0];
  const pool = category === "All" && !q ? filtered.filter((p) => p.slug !== featured.slug) : filtered;
  const pageCount = Math.max(1, Math.ceil(pool.length / PAGE_SIZE));
  const visible = pool.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeCategory = (c: PostCategory | "All") => {
    setCategory(c);
    setPage(1);
  };
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const changePage = (p: number) => {
    setPage(p);
    listTop.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-16">
      {showFeatured && <FeaturedPostCard post={featured} />}

      <div ref={listTop} className="flex scroll-mt-24 flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-4 border-t border-rule pt-10 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
            <Tag selected={category === "All"} onClick={() => changeCategory("All")} count={sortedPosts.length}>
              All
            </Tag>
            {POST_CATEGORIES.map((c) => (
              <Tag
                key={c}
                selected={category === c}
                onClick={() => changeCategory(c)}
                count={sortedPosts.filter((p) => p.category === c).length}
              >
                {c}
              </Tag>
            ))}
          </div>
          <Input
            label="Search articles"
            placeholder="Search articles"
            prefix={<Search aria-hidden />}
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            className="md:w-72 [&_label]:sr-only"
          />
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length === 1 ? "1 article" : `${filtered.length} articles`}
        </p>

        {visible.length === 0 ? (
          <EmptyState
            art="search"
            title="No articles match"
            body="Try another word, or show every category."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  changeQuery("");
                  changeCategory("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-x-8 gap-y-6 sm:gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}

        <Pagination page={page} pageCount={pageCount} onPageChange={changePage} className="self-center" />
      </div>
    </div>
  );
}
