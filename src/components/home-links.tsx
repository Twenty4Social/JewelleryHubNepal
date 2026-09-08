"use client";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export default function HomeLinks() {
  const { lang } = useLang();
  const items = [
    { href: "/know-your-jewellery", image: products[10].image, en: "Know your jewellery", np: "आफ्नो गहना बुझ्नुहोस्", body: "Questions about care, repairs or purity? Start here.", bodyNp: "हेरचाह, मर्मत वा शुद्धताबारे प्रश्न? यहाँ सोध्नुहोस्।" },
    { href: "/rates", image: products[16].image, en: "Rates & outlook", np: "दर र सम्भावना", body: "Check published gold and silver rates before you visit.", bodyNp: "पसल जानुअघि सुन र चाँदीको प्रकाशित दर हेर्नुहोस्।" },
    { href: "/news", image: products[27].image, en: "News & stories", np: "समाचार र कथा", body: "Keep up with the world of jewellery.", bodyNp: "गहनासम्बन्धी नयाँ समाचार पढ्नुहोस्।" },
  ];
  return <section aria-label={lang === "np" ? "थप जानकारी" : "Plan your next step"} className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
    {items.map((item) => <Link key={item.href} href={item.href} className="overflow-hidden rounded-2xl border border-gold-light bg-paper hover:border-burgundy">
      <div className="relative h-44"><Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>
      <div className="p-6"><h2 className="font-display text-2xl text-burgundy">{lang === "np" ? item.np : item.en} →</h2><p className="mt-3 text-base text-muted">{lang === "np" ? item.bodyNp : item.body}</p></div>
    </Link>)}
  </section>;
}
