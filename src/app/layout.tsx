import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import SmoothScroll from "@/components/smooth-scroll";

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
  title: "Jewellery Hub Nepal — Every jeweller, one conversation",
  description:
    "Nepal's jewellery ecosystem: discover every verified jeweller through AI-powered search, explore collections, price predictions and jewellery news — then chat directly on WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${notoDeva.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LangProvider>
          <SmoothScroll />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
