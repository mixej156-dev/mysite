import type { Metadata } from "next";
import { CTASection } from "@/components/blocks/CTASection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section } from "@/components/blocks/Section";
import { FaqBrowser } from "@/components/faq/FaqBrowser";
import { Link } from "@/components/Link";
import { buttonClasses } from "@/design-system";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Short answers about staking, rewards, withdrawals and account security on LONAR ECO..",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="Questions and answers"
        lead="Short answers about staking, rewards, withdrawals and keeping your account safe."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section aria-label="Questions" className="container-page pb-24 md:pb-32">
        <FaqBrowser />
      </section>
      <Section tone="inverse" labelledBy="faq-cta-title">
        <CTASection
          id="faq-cta-title"
          title="Still have a question?"
          lead="Write to support and a person will reply, usually within one business day."
          actions={
            <>
              <Link href="/contact" className={buttonClasses({ size: "lg" })}>
                Contact support
              </Link>
              <Link href="/docs" className={buttonClasses({ size: "lg", variant: "secondary" })}>
                Read the docs
              </Link>
            </>
          }
        />
      </Section>
    </>
  );
}
