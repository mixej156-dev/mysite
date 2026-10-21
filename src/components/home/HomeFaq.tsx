import { ArrowRight } from "lucide-react";
import { Link } from "@/components/Link";
import { Accordion, buttonClasses } from "@/design-system";
import { FAQ, FAQ_COUNT } from "@/data/faq";
import { FAQ_CATEGORY_ICONS } from "../faq/categories";
import { MenuIcon } from "../layout/MenuIcon";
import { PlayOnView } from "../layout/PlayOnView";

/* The questions marked popular on /faq, in the same order */
const POPULAR = FAQ.flatMap((c) => c.items.filter((i) => i.popular).map((i) => ({ ...i, uid: `${c.id}-${i.id}` })));

/** End of the home page: the most asked questions, answered in place, and the way to the full FAQ. */
export function HomeFaq() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <h3 id="home-faq-title" className="text-h3">
          Common questions
        </h3>
        <p className="mt-2 max-w-[40ch] text-body text-muted">
          What people ask first. All {FAQ_COUNT} answers, across {FAQ.length} topics, are in the full FAQ.
        </p>
        {/* One chip per FAQ topic, acting out its meaning as the block comes into view */}
        <div className="mt-6">
          <PlayOnView className="flex-wrap gap-2">
            {FAQ.map((c) => (
              <MenuIcon key={c.id} icon={FAQ_CATEGORY_ICONS[c.id].icon} tone={FAQ_CATEGORY_ICONS[c.id].tone} colored />
            ))}
          </PlayOnView>
        </div>
        <div className="mt-6 max-lg:hidden">
          <Link href="/faq" className={buttonClasses({ variant: "secondary" })}>
            All questions
            <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
      <div className="lg:col-span-8">
        <Accordion
          items={POPULAR.map((q) => ({
            id: q.uid,
            title: q.question,
            content: (
              <div className="flex flex-col gap-3">
                <p>{q.answer}</p>
                <Link
                  href={`/faq#q-${q.uid}`}
                  className="inline-flex items-center gap-1 self-start rounded-sm font-display text-small font-medium text-accent-text hover:underline"
                >
                  More in the FAQ
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </div>
            ),
          }))}
        />
        <div className="mt-8 lg:hidden">
          <Link href="/faq" className={buttonClasses({ variant: "secondary" })}>
            All questions
            <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
