"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "./reveal";
import { useLang, pick } from "@/lib/i18n";
import { shops, products } from "@/lib/data";

export function ShopCards({ preview = false }: { preview?: boolean }) {
  const { t, lang } = useLang();
  return <section id="jewellers" className="mx-auto max-w-6xl px-6 py-12">
    {preview && <SectionHead kicker={t("shops.kicker")} title={t("shops.title")} />}
    <div id="shop-results" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(preview ? shops.slice(0, 3) : shops).map((shop) => <Link key={shop.id} href={`/shops/${shop.id}`} className="group flex flex-col overflow-hidden rounded-xl border border-burgundy/25 bg-paper transition-colors hover:border-burgundy">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream"><Image src={shop.image} alt={lang === "np" ? `${shop.name.np} को नमुना सङ्ग्रह` : `Sample collection for ${shop.name.en}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" /></div>
        <div className="flex grow flex-col p-5">
          <p className="text-sm font-semibold text-burgundy">✓ {t("shops.verified")}</p>
          <h2 className="mt-2 font-display text-2xl leading-snug text-burgundy">{pick(lang, shop.name)}</h2>
          <p className="mt-3 text-base text-muted">{products.filter((p) => p.shopId === shop.id).length} {lang === "np" ? "नमुना डिजाइन" : "designs to explore"}</p>
          <span className="mt-auto pt-5 inline-flex min-h-12 items-center font-semibold text-burgundy underline underline-offset-4">{lang === "np" ? "पसल हेर्नुहोस्" : "Visit shop"} →</span>
        </div>
      </Link>)}
    </div>
    <div className="mt-8 text-center">
      {preview && <Link href="/shops" className="inline-flex min-h-12 items-center rounded-full border border-burgundy bg-paper px-7 py-3 font-semibold text-burgundy hover:bg-cream">{lang === "np" ? "सबै ५ पसल हेर्नुहोस्" : "View all 5 shops"} →</Link>}
      <p className="mt-4 text-sm text-muted">{lang === "np" ? "प्रस्तुतीकरणका लागि नमुना प्रोफाइल र फोटो। उपलब्धता पसलसँग पुष्टि गर्नुहोस्।" : "Sample profiles and photos for demonstration. Confirm availability with the shop."}</p>
    </div>
  </section>;
}
