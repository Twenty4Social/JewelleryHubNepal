"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "./reveal";
import { useLang, pick } from "@/lib/i18n";
import { categories, products, shops, productPrice } from "@/lib/data";

export default function Categories({ preview = false, shopId }: { preview?: boolean; shopId?: string }) {
  const { t, lang } = useLang();
  const [category, setCategory] = useState("all");
  const [shopFilter, setShopFilter] = useState("all");
  const [limit, setLimit] = useState(9);
  const collection = products.filter((p) => !shopId || p.shopId === shopId);
  const visible = collection.filter((p) => (category === "all" || p.category === category) && (shopFilter === "all" || p.shopId === shopFilter));
  const shown = preview ? [products[3], products[21], products[23]] : visible.slice(0, limit);

  return <section id="catalogue" className="mx-auto max-w-6xl px-6 py-12">
    {(preview || shopId) && <SectionHead kicker={t("cats.kicker")} title={shopId ? (lang === "np" ? "यो पसलको सङ्ग्रह" : "Explore this collection") : t("cats.title")} />}
    {!preview && <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gold-light bg-paper p-4">
      <label className="flex min-w-40 flex-1 flex-col gap-2 font-semibold text-burgundy">{lang === "np" ? "गहनाको प्रकार" : "Jewellery type"}
        <select value={category} onChange={(e) => { setCategory(e.target.value); setLimit(9); }} className="rounded-lg border border-gold-light bg-paper px-3 py-3 text-base text-ink">
          <option value="all">{lang === "np" ? "सबै गहना" : "All jewellery"}</option>
          {categories.filter((c) => collection.some((p) => p.category === c.id)).map((c) => <option key={c.id} value={c.id}>{pick(lang, c.name)}</option>)}
        </select>
      </label>
      {!shopId && <label className="flex min-w-40 flex-1 flex-col gap-2 font-semibold text-burgundy">{lang === "np" ? "पसल" : "Shop"}
        <select value={shopFilter} onChange={(e) => { setShopFilter(e.target.value); setLimit(9); }} className="w-full rounded-lg border border-gold-light bg-paper px-3 py-3 text-base text-ink">
          <option value="all">{lang === "np" ? "सबै पसल" : "All shops"}</option>{shops.map((s) => <option key={s.id} value={s.id}>{pick(lang, s.name)}</option>)}
        </select>
      </label>}
    </div>}
    {!preview && <p role="status" className="mt-5 text-base text-muted">{lang === "np" ? `${visible.length} मध्ये ${shown.length} डिजाइन` : `Showing ${shown.length} of ${visible.length} designs`}</p>}
    <div id="catalogue-results" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((product) => {
        const shop = shops.find((s) => s.id === product.shopId)!;
        return <Link key={product.id} href={`/products/${product.id}`} className="group overflow-hidden rounded-xl border border-burgundy/25 bg-paper transition-colors hover:border-burgundy">
          <div className="relative aspect-square overflow-hidden bg-cream"><Image src={product.image} alt={pick(lang, product.title)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain" /></div>
          <div className="p-5"><p className="text-sm text-muted">{pick(lang, shop.name)}</p><h3 className="mt-2 font-display text-2xl leading-snug text-burgundy">{pick(lang, product.title)}</h3>
            <p className="mt-3 font-semibold">{productPrice(product, lang)}</p><span className="mt-3 inline-flex min-h-12 items-center font-semibold text-burgundy underline underline-offset-4">{lang === "np" ? "विवरण हेर्नुहोस्" : "View jewellery details"} →</span>
          </div>
        </Link>;
      })}
    </div>
    {!visible.length && <p className="py-8 text-center">{lang === "np" ? "यो प्रकारको डिजाइन भेटिएन। अर्को प्रकार रोज्नुहोस्।" : "No designs match these filters. Try another jewellery type or shop."}</p>}
    <div className="mt-8 text-center">
      {preview ? <Link href="/products" className="inline-flex min-h-12 items-center rounded-full border border-burgundy bg-paper px-7 py-3 font-semibold text-burgundy">{lang === "np" ? "सबै गहना हेर्नुहोस्" : "View more jewellery"} →</Link> : limit < visible.length && <button type="button" onClick={() => setLimit(limit + 9)} className="min-h-12 rounded-full border border-burgundy bg-paper px-7 py-3 font-semibold text-burgundy">{lang === "np" ? "थप डिजाइन हेर्नुहोस्" : "View more designs"} (+{Math.min(9, visible.length - limit)})</button>}
      <p className="mt-4 text-sm text-muted">{lang === "np" ? "नमुना सङ्ग्रह। फोटोबाट शुद्धता वा तौल पुष्टि हुँदैन।" : "Sample collection. Photos do not confirm purity or weight."}</p>
    </div>
  </section>;
}
