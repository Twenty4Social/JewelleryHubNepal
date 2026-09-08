"use client";
import Image from "next/image";
import Link from "next/link";
import { shops, waLink } from "@/lib/data";
import { pick, useLang } from "@/lib/i18n";
import { trackLead } from "@/lib/track";
import Categories from "./categories";

export default function ShopDetail({ shopId }: { shopId: string }) {
  const { lang, t } = useLang();
  const shop = shops.find((s) => s.id === shopId)!;
  return <>
    <section className="bg-burgundy text-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-10 md:grid-cols-[1.15fr_0.85fr]">
        <div><Link href="/shops" className="inline-flex min-h-12 items-center text-cream hover:underline">← {lang === "np" ? "सबै पसल" : "All shops"}</Link>
          <p className="mt-4 text-base text-cream">✓ {t("shops.verified")}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{pick(lang, shop.name)}</h1>
          <p className="mt-5 max-w-xl text-lg text-cream">{pick(lang, shop.blurb)}</p>
          <a href={waLink(shop.whatsapp, `Namaste! I would like to ask about ${shop.name.en}'s collection on Jewellery Hub Nepal.`)} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ kind: "whatsapp_click", shopId: shop.id, source: "shop_detail" })} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-paper px-6 py-3 font-semibold text-burgundy">{lang === "np" ? "WhatsApp मा सोध्नुहोस्" : "Ask this shop on WhatsApp"} ↗</a>
          <p className="mt-4 text-sm text-cream">{lang === "np" ? "नमुना प्रोफाइल र सम्पर्क नम्बर। ठेगाना र समय पुष्टि गर्न बाँकी।" : "Sample profile and contact number. Address and opening hours await confirmation."}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-full border border-gold-light"><Image src={shop.image} alt={lang === "np" ? "नमुना सङ्ग्रह" : "Sample jewellery collection"} fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" /></div>
      </div>
    </section>
    <Categories shopId={shop.id} />
    <div className="mx-auto max-w-6xl px-6 pb-8 text-center"><Link href="/know-your-jewellery" className="inline-flex min-h-12 items-center font-semibold text-burgundy underline underline-offset-4">{lang === "np" ? "आफ्नो गहनाबारे प्रश्न छ?" : "Have a question about jewellery you own?"} →</Link></div>
  </>;
}
