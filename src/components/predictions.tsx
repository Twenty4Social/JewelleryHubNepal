"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./reveal";
import { useLang, pick } from "@/lib/i18n";
import { formatPrice, type MarketAsset } from "@/lib/data";

function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const W = 120;
  const H = 36;

  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * W,
    H - ((p - min) / range) * (H - 6) - 3,
  ]);
  const path = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const color = up ? "#3e6b4f" : "#a03b2e";
  const last = coords[coords.length - 1];

  return (
    <svg width={W} height={H} className="overflow-visible">
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
        <p className="border border-gold-light bg-paper p-6 text-center text-sm text-muted">
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
                    className={`shrink-0 border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${badgeCls(p.direction)}`}
                  >
                    {badge(p.direction)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {formatPrice(p.price)} · {t("pred.previous")}
                </p>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <Sparkline points={p.spark} up={p.direction !== "cooling"} />
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
                    {p.delta > 0 ? "+" : ""}{p.delta.toFixed(2)}%
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted">
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

      <Reveal className="mt-6 text-center">
        <p className="text-[10.5px] italic text-muted/80">
          ✦ {t("pred.disclaimer")} {" "}
          <a className="underline hover:text-burgundy" href="https://www.fenegosida.org/" target="_blank" rel="noopener noreferrer">
            FENEGOSIDA ↗
          </a>
        </p>
      </Reveal>
    </section>
  );
}
