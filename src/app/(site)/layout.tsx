import { ViewTransition } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SkipLink />
      <Header />
      <ViewTransition default="none" update={{ nav: "page", default: "none" }}>
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </ViewTransition>
      <Footer />
    </>
  );
}
