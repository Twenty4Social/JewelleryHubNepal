"use client";

import Image from "next/image";
import { pick, useLang } from "@/lib/i18n";
import type { L } from "@/lib/data";

export default function PageIntro({ title, description, image }: { title: L; description: L; image?: string }) {
  const { lang } = useLang();
  return <section className="bg-burgundy text-paper">
    <div className={`mx-auto grid max-w-6xl items-center gap-6 px-6 py-8 md:py-12 ${image ? "md:grid-cols-[1.4fr_0.6fr]" : ""}`}>
      <div>
        <h1 className="font-display text-3xl leading-tight md:text-5xl">{pick(lang, title)}</h1>
        <p className="mt-4 max-w-2xl text-lg text-cream">{pick(lang, description)}</p>
      </div>
      {image && <div className="relative hidden h-56 overflow-hidden rounded-t-full border border-gold-light md:block"><Image src={image} alt="" fill priority sizes="30vw" className="object-cover" /></div>}
    </div>
  </section>;
}
