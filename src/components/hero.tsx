"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { products } from "@/lib/data";
import ConversationSearch from "./conversation-search";

export default function Hero() {
  const { t, lang } = useLang();
  return (
    <section id="top" className="bg-burgundy px-4 py-12 text-cream md:px-6 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold text-cream">{t("hero.eyebrow")}</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,6.75vw,5.4rem)] font-medium leading-[1.2]">
            {t("hero.title.a")} <em className="jewellery-word">{t("hero.title.b")}</em> {t("hero.title.c")}
          </h1>
          <p className="mt-4 text-lg leading-7 text-cream">{t("hero.sub")}</p>
          <ConversationSearch />
        </div>
        <Link href="/products" aria-label={lang === "np" ? "गहनाको सङ्ग्रह हेर्नुहोस्" : "Explore the jewellery collection"} className="relative hidden aspect-[4/5] overflow-hidden rounded-t-full border border-cream/40 lg:block">
          <Image src={products.find((product) => product.id === "p4")!.image} alt={lang === "np" ? "गहनाको विवरण" : "Jewellery detail"} fill priority sizes="40vw" className="object-cover" />
        </Link>
      </div>

    </section>
  );
}
