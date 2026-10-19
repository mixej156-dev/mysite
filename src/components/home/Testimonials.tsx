import { testimonials } from "@/data/testimonials";
import { Section } from "../blocks/Section";
import { TestimonialSlider } from "../blocks/TestimonialSlider";

export function Testimonials() {
  return (
    <Section labelledBy="quotes-title">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
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
