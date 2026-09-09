"use client";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export default function HomeLinks() {
  const { lang } = useLang();
  const nepali = lang === "np";
  return <section aria-label={nepali ? "किन्नुअघि बुझ्नुहोस्" : "Before you buy"} className="mt-4">
    <div className="bg-burgundy text-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-10 md:grid-cols-[.7fr_1fr] md:gap-16 md:py-14">
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl md:aspect-square md:max-h-80">
          <Image src={products[10].image} alt={nepali ? "गहनाको नजिकको विवरण" : "A closer look at a jewellery design"} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold">{nepali ? "किन्नुअघि बुझ्नुहोस्" : "A little advice. More confidence."}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">{nepali ? "आफ्नो गहना बुझ्नुहोस्" : "Know your jewellery"}</h2>
          <p className="mt-4 max-w-lg text-lg">{nepali ? "हेरचाह, मर्मत वा शुद्धताबारे प्रश्न? फोटो वा आवाजमा आफ्नो कुरा राख्नुहोस्।" : "Care, repairs or purity? Share a photo or ask your question in your own words."}</p>
          <Link href="/know-your-jewellery" className="mt-6 inline-flex min-h-12 items-center gap-6 rounded-full bg-cream px-6 py-3 font-semibold text-burgundy">{nepali ? "सल्लाह लिनुहोस्" : "Ask about your jewellery"}<span aria-hidden>→</span></Link>
        </div>
      </div>
    </div>
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-2 md:gap-12">
      {[
        { href: "/rates", en: "Today's rates. A clearer outlook.", np: "आजको दर र सम्भावना", body: "See published gold and silver prices, recent changes and price scenarios.", bodyNp: "सुन र चाँदीको प्रकाशित दर, पछिल्लो परिवर्तन र सम्भावित दर हेर्नुहोस्।", action: "View rates & outlook", actionNp: "दर र सम्भावना हेर्नुहोस्" },
        { href: "/news", en: "News from the jewellery world", np: "गहना जगतका समाचार", body: "Read the latest industry stories, with links to the original publishers.", bodyNp: "मूल प्रकाशकको लिङ्कसहित गहना व्यवसायका ताजा समाचार पढ्नुहोस्।", action: "Read the latest news", actionNp: "ताजा समाचार पढ्नुहोस्" },
      ].map(item => <Link key={item.href} href={item.href} className="group border-t border-burgundy/25 pt-6 text-burgundy">
        <h2 className="font-display text-2xl md:text-3xl">{nepali ? item.np : item.en}</h2>
        <p className="mt-3 max-w-md text-base">{nepali ? item.bodyNp : item.body}</p>
        <span className="mt-4 inline-flex min-h-12 items-center gap-4 font-semibold underline underline-offset-4">{nepali ? item.actionNp : item.action}<span aria-hidden>→</span></span>
      </Link>)}
    </div>
  </section>;
}
