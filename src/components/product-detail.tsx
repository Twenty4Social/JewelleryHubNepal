"use client";

import Image from "next/image";
import Link from "next/link";
import { productPrice, getProductDetails, products, shops, waLink } from "@/lib/data";
import { pick, useLang } from "@/lib/i18n";
import { trackLead } from "@/lib/track";
import { Reveal } from "./reveal";

export default function ProductDetail({ productId }: { productId: string }) {
  const { lang } = useLang();
  const product = products.find((item) => item.id === productId)!;
  const shop = shops.find((item) => item.id === product.shopId)!;
  const details = getProductDetails(product);
  const price = productPrice(product, lang);
  const related = products.filter((item) => item.id !== product.id && (item.category === product.category || item.shopId === product.shopId)).slice(0, 3);
  const labels = lang === "np" ? {
    back: "गहनामा फर्कनुहोस्", available: "यहाँ उपलब्ध", contact: "WhatsApp मा पसललाई सोध्नुहोस्", clinic: "यो गहना जाँच्न क्लिनिकलाई सोध्नुहोस्",
    specs: "गहनाको विवरण", note: "यी नमुना फोटोबाट सामग्री, तौल वा प्रामाणिकता पुष्टि हुँदैन। पुष्टि भएको विवरण पसलसँग माग्नुहोस्।", related: "सम्बन्धित गहना",
    type: "प्रकार", karat: "क्यारेट", purity: "शुद्धता", weight: "तौल", stone: "ढुङ्गा", stoneWeight: "ढुङ्गाको तौल", finish: "फिनिस", sku: "SKU",
  } : {
    back: "Back to jewellery", available: "Available from", contact: "Ask this shop on WhatsApp", clinic: "Ask the clinic about this piece",
    specs: "Jewellery specifications", note: "These sample photos do not establish material, weight or authenticity. Ask the shop for confirmed specifications.", related: "You may also like",
    type: "Type", karat: "Karat", purity: "Purity", weight: "Weight", stone: "Stone", stoneWeight: "Stone weight", finish: "Finish", sku: "SKU",
  };
  const specs = [
    [labels.type, details.type], [labels.karat, details.karat], [labels.purity, details.purity], [labels.weight, details.weight],
    [labels.stone, details.stone], [labels.stoneWeight, details.stoneWeight], [labels.finish, details.finish], [labels.sku, details.sku],
  ];

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-14">
        <Link href="/products" className="inline-flex min-h-12 items-center gap-2 text-base font-semibold text-muted transition hover:text-burgundy">← {labels.back}</Link>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-gold-light bg-cream">
              <Image src={product.image} alt={pick(lang, product.title)} fill priority sizes="(max-width: 1024px) 100vw, 52vw" className="object-contain transition duration-1000 hover:scale-[1.025]" />
              <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-4 py-2 text-sm font-semibold text-burgundy backdrop-blur">{lang === "np" ? "नमुना डिजाइन" : "Sample design"}</span>
            </div>
            {product.photoCredit && <p className="mt-3 text-sm text-muted">
              {lang === "np" ? "सन्दर्भ फोटो: " : "Reference photo: "}<a href={product.photoCredit.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{product.photoCredit.name} / Pexels</a>
            </p>}
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col justify-center">
            <Link href={`/shops/${shop.id}`} className="text-sm font-semibold text-muted transition hover:text-burgundy">{pick(lang, shop.name)} ↗</Link>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] text-burgundy md:text-6xl">{pick(lang, product.title)}</h1>
            <p className="mt-5 text-base text-muted">{lang === "np" ? "मूल्य पसलसँग पुष्टि गर्नुहोस्" : "Price confirmed by the shop"}</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{price}</p>
            <p className="mt-3 text-base leading-7 text-muted">{lang === "np" ? "अन्तिम मूल्य, तौल, ज्याला र ढुङ्गाको मूल्य पसलसँग पुष्टि गर्नुहोस्।" : "Ask the shop to confirm the final price, weight, making charges and stone costs."}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[details.type, pick(lang, product.occasion), pick(lang, shop.city)].map((tag) => <span key={tag} className="rounded-full border border-gold-light px-4 py-2 text-sm text-muted">{tag}</span>)}
            </div>
            <p className="mt-7 font-display text-lg leading-8 text-ink/80">{pick(lang, details.description)}</p>

            <div className="mt-8 rounded-[1.5rem] border border-gold-light bg-cream/60 p-5">
              <p className="text-sm font-semibold text-muted">{product.photoCredit ? (lang === "np" ? "यस्तै डिजाइनबारे सोध्नुहोस्" : "Ask about similar designs") : labels.available}</p>
              <div className="mt-3 flex items-center justify-between gap-5">
                <div>
                  <p className="font-display text-xl text-burgundy">{pick(lang, shop.name)}</p>
                  <p className="mt-1 text-sm text-muted">{pick(lang, shop.city)} · {pick(lang, shop.specialty)} · {shop.verified ? (lang === "np" ? "✓ प्रमाणित" : "✓ Verified") : ""}</p>
                </div>
                <span aria-hidden className="text-2xl text-gold">↗</span>
              </div>
            </div>

            <a
              href={waLink(shop.whatsapp, lang === "np" ? `नमस्ते! Jewellery Hub Nepal मा “${product.title.np}” (${price}) हेरेँ। उपलब्ध छ?` : `Hello! I viewed “${product.title.en}” (${price}) on Jewellery Hub Nepal. Is it available?`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLead({ kind: "whatsapp_click", shopId: shop.id, productId: product.id, source: "product_detail" })}
              className="mt-5 flex items-center justify-between rounded-full bg-ink px-6 py-4 text-base font-semibold text-pure transition hover:bg-burgundy"
            >
              {labels.contact}<span aria-hidden>↗</span>
            </a>
            <p className="mt-3 text-base leading-6 text-muted">{lang === "np" ? "WhatsApp खुल्छ। यो खरिद वा बुकिङ होइन। सम्पर्क नम्बर डेमोका लागि हो।" : "Opens WhatsApp. This does not place an order or reserve the piece. Contact number is for demonstration."}</p>
            <details className="mt-5 rounded-xl border border-gold-light p-4 text-base leading-7">
              <summary className="cursor-pointer font-semibold text-burgundy">{lang === "np" ? "किन्नुअघि के सोध्ने?" : "What should I ask before buying?"}</summary>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                {(lang === "np" ? ["यो गहना पसलमा हेर्न मिल्छ? ठेगाना र खुल्ने समय के हो?", "शुद्धता र तौल कसरी पुष्टि हुन्छ?", "ज्याला र ढुङ्गासहित जम्मा मूल्य कति हो?", "बिल पाइन्छ? मर्मत र साट्ने नियम के छन्?"] : ["Can I see this piece in the shop? What are the address and opening hours?", "How are purity and weight confirmed?", "What is the total price, including making charges and stones?", "Will I receive a bill? What are the repair and exchange policies?"]).map((question) => <li key={question}>{question}</li>)}
              </ul>
            </details>
            <Link href="/know-your-jewellery" className="mt-3 inline-flex min-h-12 items-center justify-center text-center text-base font-semibold text-burgundy underline-offset-4 hover:underline">{labels.clinic} →</Link>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-gold-light bg-cream/70">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Reveal>
            <p className="text-sm font-semibold text-muted">{labels.specs}</p>
            <div className="mt-6 grid grid-cols-1 gap-px sm:grid-cols-2 overflow-hidden rounded-2xl border border-gold-light bg-gold-light md:grid-cols-4">
              {specs.map(([label, value]) => (
                <div key={label} className="bg-paper p-5">
                  <p className="text-sm font-semibold text-muted">{label}</p>
                  <p className="mt-2 font-display text-base text-burgundy">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm italic text-muted">{labels.note}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal><h2 className="font-display text-3xl text-burgundy">{labels.related}</h2></Reveal>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {related.map((item, index) => {
            const relatedShop = shops.find((entry) => entry.id === item.shopId)!;
            return (
              <Reveal key={item.id} delay={index * 0.06}>
                <Link href={`/products/${item.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold-light bg-cream">
                    <Image src={item.image} alt={pick(lang, item.title)} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 font-display text-lg text-burgundy">{pick(lang, item.title)}</p>
                  <p className="mt-1 text-sm text-muted">{pick(lang, relatedShop.name)} · {productPrice(item, lang)}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
