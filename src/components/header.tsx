"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { rateMovement, formatPrice, type MarketAsset } from "@/lib/data";

export default function Header({ rates }: { rates: MarketAsset[] }) {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);
  const links = [
    { href: "/shops", label: lang === "np" ? "पसल" : "Shops" },
    { href: "/products", label: lang === "np" ? "गहना" : "Jewellery" },
    { href: "/know-your-jewellery", label: lang === "np" ? "गहना बुझ्नुहोस्" : "Know your jewellery" },
    { href: "/rates", label: lang === "np" ? "दर र सम्भावना" : "Rates & outlook" },
    { href: "/news", label: lang === "np" ? "समाचार" : "News" },
    { href: "/connect", label: lang === "np" ? "पसलका लागि" : "For jewellers" },
  ];

  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const root = document.documentElement;
    const resize = new ResizeObserver(() => root.style.setProperty("--header-height", `${element.getBoundingClientRect().height}px`));
    const scroll = () => {
      const progress = Math.max(0, 1 - window.scrollY / 240);
      element.style.setProperty("--header-scale", String(1 + progress * 0.35));
      element.style.setProperty("--rate-scale", String(1 + progress * 0.8225));
    };
    resize.observe(element);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", scroll);
      root.style.removeProperty("--header-height");
    };
  }, [pathname]);

  const languages = <div role="group" aria-label="Language / भाषा" className="flex overflow-hidden rounded-lg border border-burgundy">
    {(["en", "np"] as const).map((language) => <button key={language} type="button" lang={language === "np" ? "ne" : "en"} aria-pressed={lang === language} onClick={() => setLang(language)} className={`header-language min-h-12 flex-1 px-3 font-semibold ${lang === language ? "bg-burgundy text-cream" : "bg-cream text-burgundy"}`}>{language === "en" ? "English" : "नेपाली"}</button>)}
  </div>;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return <>
    <div id="page-top" tabIndex={-1} />
    <header ref={header} className="site-header sticky top-0 z-50 border-b border-burgundy/20 bg-cream">
      <a href="#main-content" className="skip-link">{lang === "np" ? "मुख्य सामग्रीमा जानुहोस्" : "Skip to content"}</a>
      <div className="bg-burgundy text-cream">
        <div className="rate-strip relative mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4">
          <Link href="/rates" className="rate-caption absolute left-6 top-1/2 hidden -translate-y-1/2 underline underline-offset-4 xl:block">{lang === "np" ? "पछिल्लो प्रकाशित दर" : "Latest published rates"} ↗</Link>
          {rates.length ? rates.map((rate) => <Link key={rate.id} aria-label={`${rate.label[lang]} ${formatPrice(rate.price)}. ${rateMovement(rate.price, rate.previousPrice) === "unknown" ? (lang === "np" ? "अघिल्लो दर उपलब्ध छैन" : "Previous record unavailable") : `${lang === "np" ? "अघिल्लो प्रकाशित दरको तुलनामा" : "Since the previous published record"}: ${rate.price > rate.previousPrice ? "+" : rate.price < rate.previousPrice ? "−" : ""}${formatPrice(Math.abs(rate.price - rate.previousPrice))}`}`} href="/rates" className="rate-item flex flex-col items-center justify-center text-center">
            <span className="rate-label">{lang === "np" ? `${rate.id === "gold" ? "सुन" : "चाँदी"} / तोला` : `${rate.id === "gold" ? "Gold" : "Silver"} / tola`}</span>
            <strong className="rate-price tabular-nums">{formatPrice(rate.price)}</strong>
            <span className={`text-sm font-semibold tabular-nums ${rateMovement(rate.price, rate.previousPrice) === "up" ? "text-[#6ed59b]" : rateMovement(rate.price, rate.previousPrice) === "down" ? "text-[#ff9292]" : "text-cream"}`} aria-hidden="true">
              {rateMovement(rate.price, rate.previousPrice) === "unknown" ? (lang === "np" ? "अघिल्लो दर छैन" : "Previous unavailable") : rateMovement(rate.price, rate.previousPrice) === "unchanged" ? (lang === "np" ? "— परिवर्तन छैन" : "— No change") : `${rate.price > rate.previousPrice ? "↑ +" : "↓ −"}${formatPrice(Math.abs(rate.price - rate.previousPrice))}`}
            </span>
          </Link>) : <p className="py-2 text-base">{t("market.unavailable")}</p>}
        </div>
      </div>
      <div className="header-nav mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="header-brand shrink-0 font-display font-medium leading-tight text-burgundy">Jewellery Hub <span className="block italic 2xl:inline">Nepāl</span></Link>
        <nav aria-label={lang === "np" ? "मुख्य नेभिगेसन" : "Main navigation"} className="hidden items-center gap-1 xl:flex">
          {links.map((link) => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className="header-link inline-flex min-h-12 items-center rounded-lg px-3 py-2 font-semibold text-burgundy hover:underline aria-[current=page]:bg-burgundy aria-[current=page]:text-cream">{link.label}</Link>)}
        </nav>
        <div className="hidden xl:block">{languages}</div>
        <details ref={menu} key={pathname} className="group xl:hidden" onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); }
        }}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-lg border border-burgundy px-3 py-2 text-base font-semibold text-burgundy [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 group-open:hidden" aria-hidden><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden h-6 w-6 group-open:block" aria-hidden><path d="m6 6 12 12M6 18 18 6" /></svg>
            <span className="group-open:hidden">{lang === "np" ? "मेनु" : "Menu"}</span><span className="hidden group-open:inline">{lang === "np" ? "बन्द" : "Close"}</span>
          </summary>
          <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-height))] overflow-y-auto overscroll-contain border-b border-burgundy bg-cream px-6 pb-6 pt-3">
            <nav aria-label={lang === "np" ? "मोबाइल नेभिगेसन" : "Mobile navigation"} className="mb-5 grid divide-y divide-burgundy/20">
              {links.map((link) => <Link key={link.href} href={link.href} onClick={() => { if (menu.current) menu.current.open = false; }} aria-current={isActive(link.href) ? "page" : undefined} className="flex min-h-14 items-center justify-between px-3 py-3 text-lg font-semibold text-burgundy aria-[current=page]:bg-burgundy aria-[current=page]:text-cream">{link.label}<span aria-hidden>→</span></Link>)}
            </nav>
            {languages}
          </div>
        </details>
      </div>
    </header>
  </>;
}
