import type { Metadata } from "next";
import { SECTIONS } from "./_components/sections";
import {
  AccordionSection,
  BadgeSection,
  CardSection,
  PaginationSection,
  ProgressSection,
  TableSection,
} from "./_sections/Display";
import {
  ButtonSection,
  CheckboxSection,
  InputSection,
  SelectSection,
  SliderSection,
  TabsSection,
} from "./_sections/Forms";
import { ColorSection, MotionSection, SpaceSection, TypographySection } from "./_sections/Foundations";
import { LayoutSection } from "./_sections/Layout";
import { BlocksSection } from "./_sections/Blocks";
import { ContentSection } from "./_sections/Content";
import { DashboardSection } from "./_sections/Dashboard";
import { DropdownSection, ModalSection, ToastSection, TooltipSection } from "./_sections/Overlays";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens, base components and content blocks of the LONAR ECO. interface.",
  robots: { index: false },
};

export default function StyleguidePage() {
  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-16">
      <nav aria-label="Styleguide sections" className="hidden lg:block">
        <ul className="sticky top-28 flex flex-col gap-1 text-small">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block rounded-sm py-1 text-muted transition-colors duration-fast hover:text-text"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0">
        <div className="mb-14 max-w-[62ch]">
          <h1 className="text-h1">Design system</h1>
          <p className="mt-4 text-lead text-muted">
            Tokens, base components and the blocks pages are built from. The site uses one light theme; dark surfaces
            appear only inside inverse sections.
          </p>
        </div>

        <ColorSection />
        <TypographySection />
        <SpaceSection />
        <MotionSection />
        <ButtonSection />
        <InputSection />
        <SelectSection />
        <CheckboxSection />
        <SliderSection />
        <TabsSection />
        <ModalSection />
        <DropdownSection />
        <TooltipSection />
        <BadgeSection />
        <CardSection />
        <TableSection />
        <AccordionSection />
        <ProgressSection />
        <ToastSection />
        <PaginationSection />
        <LayoutSection />
        <BlocksSection />
        <ContentSection />
        <DashboardSection />
      </div>
    </div>
  );
}
