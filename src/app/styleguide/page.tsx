import type { Metadata } from "next";
import { SECTIONS } from "./_components/sections";
import { ThemeSwitch } from "./_components/ThemeSwitch";
import { AccordionSection, BadgeSection, CardSection, PaginationSection, ProgressSection, TableSection } from "./_sections/Display";
import { ButtonSection, CheckboxSection, InputSection, SelectSection, TabsSection } from "./_sections/Forms";
import { ColorSection, MotionSection, SpaceSection, TypographySection } from "./_sections/Foundations";
import { DropdownSection, ModalSection, ToastSection, TooltipSection } from "./_sections/Overlays";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens and base components of the {BRAND_NAME} interface, in light and dark themes.",
};

export default function StyleguidePage() {
  return (
    <>
      <header className="sticky top-0 z-header border-b border-rule bg-bg/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <p className="text-small">
            <span className="font-semibold">{"{BRAND_NAME}"}</span>
            <span className="text-muted"> / Design system</span>
          </p>
          <ThemeSwitch />
        </div>
      </header>

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

        <main className="min-w-0">
          <div className="mb-14 max-w-[62ch]">
            <h1 className="text-h1">Design system</h1>
            <p className="mt-4 font-serif text-lead text-muted">
              Tokens and base components, each shown in the light and dark theme. The switch in the top bar changes the
              page theme; previews keep their own.
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
        </main>
      </div>
    </>
  );
}
