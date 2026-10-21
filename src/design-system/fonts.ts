import { Geist, Geist_Mono } from "next/font/google";

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = [fontSans.variable, fontMono.variable].join(" ");
