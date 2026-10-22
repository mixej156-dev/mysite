import type { MetadataRoute } from "next";
import { getContentIndex, getPools } from "@/lib/api/catalog";
import { SITE_URL } from "@/lib/site";

/* Public pages only: the dashboard, sign-in flows and the styleguide stay out */
const STATIC_ROUTES = [
  "",
  "/staking",
  "/portfolio",
  "/tools",
  "/tools/calculator",
  "/tools/compare",
  "/swap",
  "/validators",
  "/fees",
  "/learn",
  "/about",
  "/team",
  "/security",
  "/blog",
  "/docs",
  "/faq",
  "/contact",
  "/legal/terms",
  "/legal/privacy",
  "/legal/risk-disclosure",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pools, { posts, guides, docs }] = await Promise.all([getPools(), getContentIndex()]);
  const entry = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    priority,
    ...(lastModified && { lastModified }),
  });

  return [
    ...STATIC_ROUTES.map((path) => entry(path, path === "" ? 1 : path.split("/").length === 2 ? 0.8 : 0.6)),
    ...pools.map((pool) => entry(`/staking/${pool.id}`, 0.8)),
    ...posts.map((post) => entry(`/blog/${post.slug}`, 0.5, post.date)),
    ...guides.map((guide) => entry(`/learn/${guide.slug}`, 0.5)),
    ...docs.map((doc) => entry(`/docs/${doc.slug}`, 0.4)),
  ];
}
