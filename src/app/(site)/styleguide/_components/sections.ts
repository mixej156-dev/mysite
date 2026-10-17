export const SECTIONS = [
  { id: "colors", title: "Colour" },
  { id: "typography", title: "Typography" },
  { id: "space", title: "Space, radius, depth" },
  { id: "motion", title: "Motion" },
  { id: "button", title: "Button" },
  { id: "input", title: "Input" },
  { id: "select", title: "Select" },
  { id: "checkbox", title: "Checkbox & Toggle" },
  { id: "tabs", title: "Tabs" },
  { id: "modal", title: "Modal" },
  { id: "dropdown", title: "Dropdown" },
  { id: "tooltip", title: "Tooltip" },
  { id: "badge", title: "Badge & Tag" },
  { id: "card", title: "Card" },
  { id: "table", title: "Table" },
  { id: "accordion", title: "Accordion" },
  { id: "progress", title: "Progress & Skeleton" },
  { id: "toast", title: "Toast" },
  { id: "pagination", title: "Pagination" },
  { id: "layout", title: "Layout" },
  { id: "blocks", title: "Blocks" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export function sectionTitle(id: SectionId): string {
  return SECTIONS.find((s) => s.id === id)?.title ?? id;
}
