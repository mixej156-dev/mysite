import { IBM_Plex_Mono, Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";

export const fontDisplay = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

export const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = [fontDisplay.variable, fontSerif.variable, fontMono.variable].join(" ");
