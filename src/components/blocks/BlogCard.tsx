import { Link } from "@/components/Link";
import type { PostSummary } from "@/data/posts-meta";
import { formatDate } from "@/lib/format";
import { PostCover } from "./PostCover";

export function BlogCard({ post, showExcerpt = true }: { post: PostSummary; showExcerpt?: boolean }) {
  return (
    /* Phones: small square cover beside the text, so a list of posts stays short */
    <article className="group relative grid grid-cols-[6.5rem_minmax(0,1fr)] content-start gap-x-4 gap-y-1.5 sm:flex sm:flex-col sm:gap-5">
      <div className="row-span-3 aspect-square overflow-hidden rounded-card border border-rule sm:aspect-[16/10]">
        <div className="size-full transition-transform duration-slow group-hover:scale-[1.03] motion-reduce:transition-none">
          <PostCover slug={post.slug} category={post.category} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
        <span className="font-medium text-accent-text">{post.category}</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{post.readingMinutes} min read</span>
      </div>
      <h3 className="text-body font-medium sm:text-h3 sm:font-normal">
        <Link
          href={`/blog/${post.slug}`}
          className="stretched-link transition-colors duration-fast group-hover:text-accent-text"
        >
          {post.title}
        </Link>
      </h3>
      {showExcerpt && (
        <p className="line-clamp-2 text-small text-muted sm:-mt-2 sm:line-clamp-none sm:text-body">{post.excerpt}</p>
      )}
    </article>
  );
}

/** Wide card for the newest post at the top of the blog. */
export function FeaturedPostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative grid gap-5 sm:gap-8 md:grid-cols-2 md:items-center md:gap-12">
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
        <h2 className="mt-3 text-h2 sm:mt-4">
          <Link
            href={`/blog/${post.slug}`}
            className="stretched-link transition-colors duration-fast group-hover:text-accent-text"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-[48ch] text-lead text-muted sm:mt-4">{post.excerpt}</p>
        <p className="mt-4 text-small text-muted sm:mt-6">By {post.author}</p>
      </div>
    </article>
  );
}
