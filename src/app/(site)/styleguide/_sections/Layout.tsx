"use client";

import { Logo, LogoMark } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Example, Section } from "../_components/Section";
import { ThemePair } from "../_components/ThemePair";

export function LayoutSection() {
  return (
    <Section
      id="layout"
      description="The header and footer on this page are the live site layout. The header pill turns solid once the page scrolls or a menu opens; below 1024px navigation moves into a full-screen menu. The footer carries the demo-data notice on every public page."
    >
      <ThemePair>
        {() => (
          <>
            <Example label="Logo and mark (placeholder)">
              <div className="flex items-center gap-6">
                <Logo />
                <LogoMark className="size-10" />
              </div>
            </Example>
            <Example label="Theme toggle">
              <div>
                <ThemeToggle />
              </div>
            </Example>
          </>
        )}
      </ThemePair>
    </Section>
  );
}
