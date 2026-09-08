"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./reveal";
import { useLang, pick } from "@/lib/i18n";
import { formatPrice, type MarketAsset } from "@/lib/data";

function Sparkline({ points, label }: { points: number[]; label: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const W = 300;
  const H = 100;

  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * W,
    H - ((p - min) / range) * (H - 6) - 3,
  ]);
  const path = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const color = "var(--color-burgundy)";
  const last = coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-28 w-full overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }
        }
      />
      <circle cx={last[0]} cy={last[1]} r={3} fill={color} />
    </svg>
  );
}

export default function Predictions({ market }: { market: MarketAsset[] }) {
  const { t, lang } = useLang();

  const badge = (d: string) =>
    d === "rising" ? t("pred.badge.rising") : d === "cooling" ? t("pred.badge.cooling") : t("pred.badge.steady");

  const badgeCls = (d: string) =>
    d === "rising"
      ? "border-rise/40 bg-pure text-rise"
      : d === "cooling"
        ? "border-fall/40 bg-pure text-fall"
        : "border-gold-light bg-pure text-muted";

  return (
    <section id="predictions" className="mx-auto max-w-4xl px-6 py-16">
      <SectionHead kicker={t("pred.kicker")} title={t("pred.title")} sub={t("pred.sub")} />

      {!market.length ? (
        <p className="border border-gold-light bg-paper p-6 text-center text-base text-muted">
          {t("market.unavailable")}
        </p>
      ) : (
      <div className="grid gap-5 sm:grid-cols-2">
        {market.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.07}>
            <div className="flex h-full flex-col justify-between border border-gold-light bg-paper p-5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg leading-snug text-burgundy">
                    {pick(lang, p.label)}
                  </h3>
                  <span
                    className={`shrink-0 border px-2 py-0.5 text-sm font-semibold ${badgeCls(p.direction)}`}
                  >
                    {badge(p.direction)}
                  </span>
                </div>
                <p className="mt-3 text-xl font-semibold leading-relaxed text-ink">
                  {formatPrice(p.price)}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <Sparkline points={p.spark} label={lang === "np" ? "प्रकाशित दरको इतिहास" : "Published rate history"} />
                <div className="text-right">
                  <p
                    className={`font-display text-xl ${
                      p.direction === "rising"
                        ? "text-rise"
                        : p.direction === "cooling"
                          ? "text-fall"
                          : "text-muted"
                    }`}
                  >
                    {p.previousPrice > 0 ? `${p.price >= p.previousPrice ? "+" : "−"}${formatPrice(Math.abs(p.price - p.previousPrice))}` : "—"}
                  </p>
                  <p className="mt-1 text-sm text-muted">{p.previousPrice > 0 ? `${p.delta > 0 ? "+" : ""}${p.delta.toFixed(2)}% · ${t("pred.previous")}` : (lang === "np" ? "अघिल्लो दर उपलब्ध छैन" : "Previous rate unavailable")}</p>
                  <p className="text-sm text-muted">
                    {new Date(p.updatedAt).toLocaleDateString(lang === "np" ? "ne-NP" : "en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Kathmandu",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      )}

      {!!market.length && <div className="mt-8 rounded-2xl border border-gold-light bg-paper p-6">
        <h2 className="font-display text-2xl text-burgundy">{lang === "np" ? "दर बदलिँदा कस्तो फरक पर्छ?" : "What if the rate changes?"}</h2>
        <p className="mt-3 text-base text-muted">{lang === "np" ? "यी ±५% का उदाहरण मात्र हुन्, भविष्यको दरको भविष्यवाणी होइनन्। प्रति तोला धातुको मूल्य; ज्याला र ढुङ्गा समावेश छैनन्।" : "Illustrative ±5% scenarios, not price forecasts. Metal value per tola; making charges and stones are excluded."}</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">{market.map((asset) => <div key={asset.id}>
          <h3 className="font-semibold text-burgundy">{pick(lang, asset.label)}</h3>
          <dl className="mt-3 divide-y divide-gold-light">{[-5, 0, 5].map((change) => <div key={change} className="flex items-center justify-between gap-3 py-3"><dt>{change === 0 ? (lang === "np" ? "प्रकाशित दर" : "Published") : `${change > 0 ? "+" : ""}${change}%`}</dt><dd className="font-semibold tabular-nums">{formatPrice(Math.round(asset.price * (1 + change / 100)))}</dd></div>)}</dl>
        </div>)}</div>
      </div>}
      <Reveal className="mt-6 text-center">
        <p className="text-sm italic text-muted">
          ✦ {t("pred.disclaimer")} {" "}
          <a className="underline hover:text-burgundy" href="https://www.fenegosida.org/" target="_blank" rel="noopener noreferrer">
            FENEGOSIDA ↗
          </a>
        </p>
      </Reveal>
      <div className="mt-6 text-center"><Link href="/shops" className="inline-flex min-h-12 items-center rounded-full border border-burgundy px-6 py-3 text-base font-semibold text-burgundy hover:bg-paper">{lang === "np" ? "पसलसँग अन्तिम मूल्य सोध्नुहोस्" : "Find a shop and ask for a full quote"} →</Link></div>
    </section>
  );
}
