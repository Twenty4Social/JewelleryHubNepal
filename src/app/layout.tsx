import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoDeva = Noto_Serif_Devanagari({
  variable: "--font-noto-deva",
  weight: ["400", "500", "600"],
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  title: "Jewellery Hub Nepal — Shops, jewellery & daily rates",
  description:
    "Explore Nepal's jewellery shops and collections, ask about your jewellery, and follow published gold and silver rates and industry news.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} ${notoDeva.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
