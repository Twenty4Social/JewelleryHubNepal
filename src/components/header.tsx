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

  const datedRates = rates.filter(rate => Number.isFinite(Date.parse(rate.updatedAt)));
  const sameDate = datedRates.length === rates.length && new Set(datedRates.map(rate => rate.updatedAt.slice(0, 10))).size === 1;
  const publishedDates = sameDate ? datedRates.slice(0, 1) : datedRates;

  const languages = <div role="group" aria-label="Language / भाषा" className="flex items-center gap-1 rounded-full border border-burgundy/20 p-1">
    {(["en", "np"] as const).map((language) => <button key={language} type="button" lang={language === "np" ? "ne" : "en"} aria-pressed={lang === language} onClick={() => setLang(language)} className={`header-language min-h-12 flex-1 rounded-full px-3 font-medium ${lang === language ? "bg-burgundy text-cream" : "bg-cream text-burgundy"}`}>{language === "en" ? "English" : "नेपाली"}</button>)}
  </div>;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return <>
    <div id="page-top" tabIndex={-1} />
    <header ref={header} className="site-header sticky top-0 z-50 border-b border-burgundy/15 bg-cream shadow-[0_3px_16px_rgba(94,31,38,0.04)]">
      <a href="#main-content" className="skip-link">{lang === "np" ? "मुख्य सामग्रीमा जानुहोस्" : "Skip to content"}</a>
      <div className="border-b border-champagne/30 bg-burgundy text-cream">
        <div className="rate-strip mx-auto grid max-w-[1440px] items-center gap-3 px-4 md:px-6 xl:grid-cols-[1fr_auto_1fr] xl:gap-8">
          <Link href="/rates" className="hidden justify-self-start xl:block">
            <span className="font-display text-2xl text-champagne">{lang === "np" ? "सुन र चाँदीको दर" : "Gold & silver"}</span>
            <span className="mt-1 block text-sm">{lang === "np" ? "महासंघको प्रकाशित दर" : "Published by FENEGOSIDA"} <span aria-hidden>↗</span></span>
          </Link>
          <div className="grid grid-cols-2 divide-x divide-champagne/30">
            {rates.length ? rates.map(rate => {
              const movement = rateMovement(rate.price, rate.previousPrice);
              const change = movement === "unknown" ? (lang === "np" ? "अघिल्लो दर छैन" : "Previous unavailable") : movement === "unchanged" ? (lang === "np" ? "— परिवर्तन छैन" : "— No change") : `${movement === "up" ? "↑ +" : "↓ −"}${formatPrice(Math.abs(rate.price - rate.previousPrice))}`;
              return <Link key={rate.id} aria-describedby="rate-published-date" aria-label={`${rate.label[lang]} ${formatPrice(rate.price)}. ${lang === "np" ? "अघिल्लो दरको तुलनामा" : "Since previous record"}: ${change}`} href="/rates" className="rate-item flex min-w-0 flex-col items-center justify-center px-3 text-center sm:px-8 xl:min-w-56">
                <span className="rate-label text-champagne">{lang === "np" ? (rate.id === "gold" ? "सुन" : "चाँदी") : rate.id === "gold" ? "Gold" : "Silver"}<span className="ml-2 text-sm text-cream">/ {lang === "np" ? "तोला" : "tola"}</span></span>
                <strong className="rate-price font-semibold tracking-tight tabular-nums">{formatPrice(rate.price)}</strong>
                <span className={`mt-1 text-sm font-medium tabular-nums ${movement === "up" ? "text-[#6ed59b]" : movement === "down" ? "text-[#ff9292]" : "text-cream"}`} aria-hidden="true">{change}</span>
              </Link>;
            }) : <p className="col-span-2 py-3 text-center text-base">{t("market.unavailable")}</p>}
          </div>
          <div id="rate-published-date" className="text-center text-sm xl:justify-self-end xl:text-right">
            {publishedDates.map(rate => <p key={rate.id}>
              {!sameDate && <span>{rate.id === "gold" ? (lang === "np" ? "सुन · " : "Gold · ") : (lang === "np" ? "चाँदी · " : "Silver · ")}</span>}
              <span>{lang === "np" ? "अद्यावधिक:" : "Updated on"} </span><time className="font-medium text-champagne" dateTime={rate.updatedAt}>{new Date(rate.updatedAt).toLocaleDateString(lang === "np" ? "ne-NP" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kathmandu" })}</time>
            </p>)}
            <p className="mt-1 hidden text-sm xl:block">{lang === "np" ? "परिवर्तन अघिल्लो दरको तुलनामा" : "Changes since the previous record"}</p>
          </div>
        </div>
      </div>
      <div className="header-nav mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="header-brand shrink-0 font-display font-medium leading-tight text-burgundy">Jewellery Hub <span className="mt-0.5 block text-[.8em] italic">Nepāl</span></Link>
        <nav aria-label={lang === "np" ? "मुख्य नेभिगेसन" : "Main navigation"} className="hidden items-center gap-1 xl:flex">
          {links.map((link) => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className="header-link inline-flex min-h-12 items-center border-b-2 border-transparent px-2 py-2 font-medium text-burgundy transition-colors hover:border-burgundy/30 aria-[current=page]:border-burgundy">{link.label}</Link>)}
        </nav>
        <div className="hidden xl:block">{languages}</div>
        <details ref={menu} key={pathname} className="group xl:hidden" onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); }
        }}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-full border border-burgundy/30 px-4 py-2 text-base font-medium text-burgundy [&::-webkit-details-marker]:hidden">
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
