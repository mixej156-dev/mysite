import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/*
 * Link-preview cards (Open Graph / Twitter), rendered at build time with next/og.
 * Satori can't read CSS variables, so the light-theme token values are mirrored here;
 * keep them in step with src/styles/tokens.css.
 */
export const OG_THEME = {
  bg: "#ffffff",
  surface2: "#f1f3f6",
  rule: "#d5d8de",
  text: "#121316",
  muted: "#5d616c",
  accent: "#335cf0",
  accentText: "#2b51d8",
  topic: {
    blue: "#335cf0",
    green: "#1a9a6a",
    teal: "#16919f",
    orange: "#e0622c",
    amber: "#d39418",
    violet: "#7a5ae0",
    rose: "#d64d68",
  },
} as const;

export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = join(process.cwd(), "src/app/_og/fonts");

async function fonts() {
  const [semibold, regular, mono] = await Promise.all(
    ["Geist-SemiBold.ttf", "Geist-Regular.ttf", "GeistMono-Medium.ttf"].map((f) => readFile(join(FONT_DIR, f))),
  );
  return [
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

export type OgFigure = { value: string; label: string };

export type OgCardProps = {
  /** Small label above the title: the kind of page */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Up to three key figures along the bottom, in mono */
  figures?: OgFigure[];
  /** Colour of the bottom band and the eyebrow dot */
  color?: string;
};

export async function renderOgCard({ eyebrow, title, subtitle, figures = [], color = OG_THEME.accent }: OgCardProps) {
  const host = new URL(SITE_URL).host;
  const titleSize = title.length > 60 ? 60 : title.length > 36 ? 70 : 84;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: OG_THEME.bg,
        color: OG_THEME.text,
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 72px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10.25" stroke={OG_THEME.text} strokeWidth="1.5" />
              <path d="M6.75 9h10.5M6.75 12h10.5" stroke={OG_THEME.text} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6.75 15h5.5" stroke={OG_THEME.accentText} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {SITE_NAME}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: OG_THEME.muted }}>{host}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderRadius: 999,
              background: OG_THEME.surface2,
              fontSize: 24,
              color: OG_THEME.text,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: color }} />
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: OG_THEME.muted, maxWidth: 1000 }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", gap: 64 }}>
            {figures.slice(0, 3).map((f) => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 40, letterSpacing: "-0.02em" }}>
                  {f.value}
                </div>
                <div style={{ display: "flex", fontSize: 22, color: OG_THEME.muted }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", height: 14, background: color }} />
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}
