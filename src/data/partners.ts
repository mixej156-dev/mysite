/* Fictional infrastructure partners. Placeholder wordmarks, not real companies. */

export type PartnerGlyph = "ring" | "square" | "triangle" | "bars" | "dot-grid" | "arc" | "diamond" | "slash";

export type Partner = { name: string; glyph: PartnerGlyph };

export const partners: Partner[] = [
  { name: "Halvard Custody", glyph: "square" },
  { name: "Northpine", glyph: "triangle" },
  { name: "Corvel Labs", glyph: "ring" },
  { name: "Strata Nine", glyph: "bars" },
  { name: "Tidewell", glyph: "arc" },
  { name: "Okapi Node", glyph: "dot-grid" },
  { name: "Fenwick Row", glyph: "diamond" },
  { name: "Lumen & Vale", glyph: "slash" },
];
