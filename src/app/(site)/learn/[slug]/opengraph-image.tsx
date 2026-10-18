import { GUIDES, getGuide } from "@/data/learn";
import { getTopic } from "@/data/learn-meta";
import { OG_SIZE, OG_THEME, renderOgCard } from "../../../_og/card";

export const alt = "Guide on ECO. LEARN";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug) ?? GUIDES[0];
  return renderOgCard({
    eyebrow: `ECO. LEARN · ${guide.topic}`,
    title: guide.title,
    color: OG_THEME.topic[getTopic(guide.topic).color],
    figures: [
      { value: guide.level, label: "Level" },
      { value: `${guide.minutes} min`, label: "Read" },
    ],
  });
}
