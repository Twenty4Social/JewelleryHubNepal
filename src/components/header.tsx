"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { formatPrice, type MarketAsset } from "@/lib/data";

function Ticker({ rates }: { rates: MarketAsset[] }) {
  const { lang, t } = useLang();
  const items = rates.map((rate) => ({
    k: rate.label[lang],
    v: formatPrice(rate.price),
    d: `${rate.delta > 0 ? "▲" : rate.delta < 0 ? "▼" : "•"} ${Math.abs(rate.delta).toFixed(2)}%`,
  }));

  return (
    <div className="overflow-hidden bg-burgundy-deep py-2 text-paper">
      {!items.length ? (
        <p className="text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-gold-light">
          {t("market.unavailable")}
        </p>
      ) : (
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap px-6 text-[10.5px] font-semibold uppercase tracking-[0.18em]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items, ...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-gold-light">{it.k}</span>
            <span>{it.v}</span>
            <span
              className={
                it.d.startsWith("▲")
                  ? "text-emerald-300"
                  : it.d.startsWith("▼")
                    ? "text-rose-300"
                    : "text-gold-light"
              }
            >
              {it.d}
            </span>
          </span>
        ))}
      </motion.div>
      )}
      <span className="sr-only">{t("market.source")}</span>
    </div>
  );
}

export default function Header({ rates }: { rates: MarketAsset[] }) {
  const { lang, setLang, t } = useLang();

  const links = [
    { href: "#jewellers", label: t("nav.jewellers") },
    { href: "#collections", label: t("nav.collections") },
    { href: "#predictions", label: t("nav.predictions") },
    { href: "#news", label: t("nav.news") },
  ];

  return (
    <header className="sticky top-0 z-50">
      <Ticker rates={rates} />
      <div className="border-b border-gold-light bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-display text-xl font-medium text-burgundy">
            Jewellery Hub <span className="italic text-gold">Nepāl</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:text-burgundy"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#join"
              className="border border-gold px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-burgundy transition-colors hover:bg-gold hover:text-paper"
            >
              {t("nav.forJewellers")}
            </a>

            {/* Language toggle */}
            <div className="ml-2 flex overflow-hidden border border-gold">
              {(["en", "np"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                    lang === l
                      ? "bg-burgundy text-paper"
                      : "bg-transparent text-muted hover:text-burgundy"
                  }`}
                >
                  {l === "en" ? "EN" : "ने"}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile: just the toggle for now */}
          <div className="flex overflow-hidden border border-gold md:hidden">
            {(["en", "np"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-2 text-[11px] font-semibold uppercase ${
                  lang === l ? "bg-burgundy text-paper" : "bg-transparent text-muted"
                }`}
              >
                {l === "en" ? "EN" : "ने"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
