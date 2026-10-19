import { ArrowRight } from "lucide-react";
import { Link } from "@/components/Link";
import { Accordion, buttonClasses } from "@/design-system";
import { FAQ, FAQ_COUNT } from "@/data/faq";
import { Section } from "../blocks/Section";

/* The questions marked popular in the FAQ data, in the order they appear there */
const POPULAR = FAQ.flatMap((c) => c.items).filter((item) => item.popular);

/** The handful of questions most people ask before staking, with the full FAQ one click away. */
export function HomeFaq() {
  return (
    <Section labelledBy="faq-title" className="pt-0 sm:pt-0 md:pt-0">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="faq-title" className="text-h1">
            Questions, answered
          </h2>
          <p className="mt-3 max-w-[36ch] font-serif text-lead text-muted sm:mt-5">
            What people ask most before their first stake.
          </p>
          <Link href="/faq" className={buttonClasses({ variant: "secondary", className: "mt-6 sm:mt-8" })}>
            All {FAQ_COUNT} questions
            <ArrowRight aria-hidden />
          </Link>
        </div>
        <div className="lg:col-span-8">
          <Accordion
            items={POPULAR.map((item) => ({
              id: item.id,
              title: item.question,
              content: (
                <>
                  <p>{item.answer}</p>
                  {item.links && (
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-display text-small">
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-sm font-medium text-accent-text hover:underline"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </p>
                  )}
                </>
              ),
            }))}
          />
        </div>
      </div>
    </Section>
  );
}
