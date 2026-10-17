import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

export const metadata: Metadata = { title: "Page not found" };

/** Rendered by notFound() inside the (site) layout, which already provides header and footer. */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
