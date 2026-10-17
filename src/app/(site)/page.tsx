import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/design-system";

export const metadata: Metadata = {
  title: { absolute: "{BRAND_NAME}" },
};

/* Placeholder until the home page is built in Stage 4. */
export default function HomePage() {
  return (
    <div className="container-page flex min-h-[70dvh] flex-col justify-center gap-6 py-24">
      <h1 className="max-w-[14ch] text-display">Staking, kept to account.</h1>
      <p className="max-w-[52ch] font-serif text-lead text-muted">
        Design prototype in progress. The home page arrives in Stage 4; the design system is ready to browse.
      </p>
      <div>
        <Link href="/styleguide" className={buttonClasses({ size: "lg" })}>
          Open design system
        </Link>
      </div>
    </div>
  );
}
