"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Divider } from "./reveal";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const start = document.getElementById("top") ?? document.getElementById("page-top");
    if (!start) return;
    const observer = new IntersectionObserver(([entry]) => setShowTop(!entry.isIntersecting));
    observer.observe(start);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <Divider />
      <footer className="px-6 pb-28 pt-2 text-center text-muted">
        <nav aria-label={lang === "np" ? "थप पृष्ठहरू" : "Explore Jewellery Hub"} className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[["/shops", "Shops", "पसल"], ["/products", "Jewellery", "गहना"], ["/know-your-jewellery", "Know your jewellery", "गहना बुझ्नुहोस्"], ["/rates", "Rates & outlook", "दर"], ["/news", "News", "समाचार"], ["/connect", "For jewellers", "पसलका लागि"]].map(([href, en, np]) => <Link key={href} href={href} className="inline-flex min-h-12 items-center text-base text-burgundy hover:underline">{lang === "np" ? np : en}</Link>)}
        </nav>
        <p className="mb-2 font-display text-lg text-gold">✦ ❦ ✦</p>
        <p className="font-display italic">{t("footer.tagline")}</p>
        <p className="mt-2 text-sm">{t("footer.rights")}</p>
        <a href="#page-top" className={`${showTop ? "fixed bottom-5 right-4 z-40" : "mt-5"} inline-flex min-h-12 items-center gap-2 rounded-full border border-burgundy bg-paper px-5 py-3 text-base font-semibold text-burgundy shadow-sm hover:bg-cream`}>
          <span aria-hidden>↑</span>{lang === "np" ? "माथि जानुहोस्" : "Back to top"}
        </a>
      </footer>
    </>
  );
}
