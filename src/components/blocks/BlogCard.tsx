import { Link } from "@/components/Link";
import type { PostSummary } from "@/data/posts-meta";
import { formatDate } from "@/lib/format";
import { PostCover } from "./PostCover";

export function BlogCard({ post, showExcerpt = true }: { post: PostSummary; showExcerpt?: boolean }) {
  return (
    <article className="group relative flex flex-col gap-5">
      <div className="aspect-[16/10] overflow-hidden rounded-card border border-rule">
        <div className="size-full transition-transform duration-slow group-hover:scale-[1.03] motion-reduce:transition-none">
          <PostCover slug={post.slug} category={post.category} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
        <span className="font-medium text-accent-text">{post.category}</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{post.readingMinutes} min read</span>
      </div>
      <h3 className="text-h3">
        <Link
          href={`/blog/${post.slug}`}
          className="stretched-link transition-colors duration-fast group-hover:text-accent-text"
        >
          {post.title}
        </Link>
      </h3>
      {showExcerpt && <p className="-mt-2 font-serif text-body text-muted">{post.excerpt}</p>}
    </article>
  );
}

/** Wide card for the newest post at the top of the blog. */
export function FeaturedPostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
      <div className="aspect-[16/10] overflow-hidden rounded-card border border-rule">
        <div className="size-full transition-transform duration-slow group-hover:scale-[1.03] motion-reduce:transition-none">
          <PostCover slug={post.slug} category={post.category} />
        </div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
          <span className="font-medium text-accent-text">{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h2 className="mt-4 text-h2">
          <Link
            href={`/blog/${post.slug}`}
            className="stretched-link transition-colors duration-fast group-hover:text-accent-text"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 max-w-[48ch] font-serif text-lead text-muted">{post.excerpt}</p>
        <p className="mt-6 text-small text-muted">By {post.author}</p>
      </div>
    </article>
  );
}
