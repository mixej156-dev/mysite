import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";
import { latestPosts } from "@/data/posts";
import { testimonials } from "@/data/testimonials";
import { BlogCard } from "../blocks/BlogCard";
import { CTASection } from "../blocks/CTASection";
import { Section, SectionHeader } from "../blocks/Section";
import { TestimonialSlider } from "../blocks/TestimonialSlider";
import { HomeFaq } from "./HomeFaq";

export function Testimonials() {
  return (
    <Section labelledBy="quotes-title" className="pt-0 sm:pt-0 md:pt-0">
      <div className="grid gap-8 border-t border-rule pt-14 sm:gap-10 sm:pt-24 md:pt-32 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="quotes-title" className="text-h2">
            What early users say
          </h2>
          <p className="mt-3 text-small text-muted">Illustrative quotes for the prototype.</p>
        </div>
        <div className="lg:col-span-8">
          <TestimonialSlider items={testimonials} label="Quotes from users" />
        </div>
      </div>
    </Section>
  );
}

export function LatestPosts() {
  return (
    <Section tone="inverse" labelledBy="blog-title">
      <SectionHeader
        id="blog-title"
        title="From the blog"
        action={
          <Link href="/blog" className={buttonClasses({ variant: "secondary" })}>
            All articles
          </Link>
        }
      />
      <ul className="grid gap-6 sm:gap-12 md:grid-cols-3 md:gap-8">
        {latestPosts(3).map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Closing() {
  return (
    <Section labelledBy="cta-title">
      <CTASection
        id="cta-title"
        title="Start with 0.1 ETH."
        lead="Create an account, pick a pool and see your first reward recorded within a day."
        actions={
          <>
            <Link href="/register" className={buttonClasses({ size: "lg" })}>
              Start staking
            </Link>
            <Link href="/contact" className={buttonClasses({ size: "lg", variant: "secondary" })}>
              Talk to us
            </Link>
          </>
        }
      />
      <div className="mt-12 sm:mt-20 border-t border-rule pt-12 md:mt-28">
        <HomeFaq />
      </div>
    </Section>
  );
}
