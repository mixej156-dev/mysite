import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SkipLink } from "@/components/layout/SkipLink";

export const metadata: Metadata = { title: "Page not found" };

/** Unmatched URLs render outside the (site) layout, so the page brings its own chrome. */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
