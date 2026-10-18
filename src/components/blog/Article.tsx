import { Newsletter } from "@/components/blocks/Newsletter";
import { Link } from "@/components/Link";
import { Skeleton, buttonClasses } from "@/design-system";
import { relatedPosts, type Post } from "@/data/posts";
import { TEAM } from "@/data/team";
import { formatDate } from "@/lib/format";
import { BlogCard } from "../blocks/BlogCard";
import { Breadcrumbs } from "../blocks/Breadcrumbs";
import { PostCover } from "../blocks/PostCover";
import { Prose } from "../blocks/Prose";
import { Section, SectionHeader } from "../blocks/Section";
import { ShareButton } from "./ShareButton";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

export function Article({ post }: { post: Post }) {
  const author = TEAM.find((m) => m.name === post.author);
  const related = relatedPosts(post);

  return (
    <>
      <article aria-labelledby={`article-title-${post.slug}`}>
        <header className="container-page pt-12 pb-12 md:pt-16">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.category }]}
          />
          <div className="mt-8 sm:mt-10 max-w-[52rem]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
              <span className="font-medium text-accent-text">{post.category}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h1 id={`article-title-${post.slug}`} className="mt-4 text-h1">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[52ch] font-serif text-lead text-muted">{post.excerpt}</p>
          </div>
        </header>

        <div className="container-page">
          <div className="aspect-[16/9] overflow-hidden rounded-card border border-rule md:aspect-[21/9]">
            <PostCover slug={post.slug} category={post.category} fit="contain" />
          </div>
        </div>

        <div className="container-page grid gap-8 pt-6 pb-14 sm:gap-10 sm:pt-12 sm:pb-24 md:pb-32 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <div className="flex flex-col gap-6 lg:col-span-3">
            <div className="flex items-center gap-3 lg:sticky lg:top-24">
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-pill tint-accent font-display text-small font-semibold text-accent-text"
              >
                {initials(post.author)}
              </span>
              <div>
                <p className="text-small font-medium">{post.author}</p>
                {author && <p className="text-caption text-muted">{author.role}</p>}
              </div>
            </div>
            <div className="lg:sticky lg:top-44">
              <ShareButton />
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <Prose blocks={post.body} idPrefix={`${post.slug}-`} />
            <div className="mt-10 sm:mt-16 border-t border-rule pt-8">
              <Link href="/blog" className={buttonClasses({ variant: "secondary" })}>
                All articles
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Section tone="inverse" labelledBy={`related-title-${post.slug}`}>
        <SectionHeader id={`related-title-${post.slug}`} title="Keep reading" />
        <ul className="grid gap-x-8 gap-y-6 sm:gap-y-14 md:grid-cols-3">
          {related.map((p) => (
            <li key={p.slug}>
              <BlogCard post={p} />
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy={`newsletter-title-${post.slug}`}>
        <h2 id={`newsletter-title-${post.slug}`} className="sr-only">
          Newsletter
        </h2>
        <Newsletter />
      </Section>
    </>
  );
}

export function ArticleSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading article" className="container-page pt-6 pb-14 sm:pt-12 sm:pb-24 md:pt-16">
      <Skeleton className="h-4 w-40" />
      <div className="mt-8 sm:mt-10 flex max-w-[52rem] flex-col gap-4">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="mt-2 h-6 w-1/2" />
      </div>
      <Skeleton className="mt-8 sm:mt-12 aspect-[21/9] rounded-card" />
    </div>
  );
}
