"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./reveal";
import { useLang } from "@/lib/i18n";
import type { LiveNewsItem } from "@/lib/data";

export default function Newsroom({ items }: { items: LiveNewsItem[] }) {
  const { t, lang } = useLang();

  return (
    <section id="news" className="mx-auto max-w-6xl px-6 py-16">
      <SectionHead kicker={t("news.kicker")} title={t("news.title")} sub={t("news.sub")} />

      {!items.length ? (
        <p className="border border-gold-light bg-paper p-6 text-center text-sm text-muted">
          {t("news.unavailable")}
        </p>
      ) : (
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((n, i) => (
          <Reveal key={n.id} delay={(i % 2) * 0.08}>
            <motion.a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group flex h-full flex-col border border-gold-light bg-paper p-6 transition-colors hover:border-gold"
            >
              <div className="flex items-center justify-between">
                <span className="border border-gold-light px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-gold">
                  {n.tag}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted">
                  {n.source} · {new Date(n.date).toLocaleDateString(lang === "np" ? "ne-NP" : "en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl leading-snug text-burgundy transition-colors group-hover:text-gold">
                {n.title}
              </h3>
              <p className="mt-2 grow text-[13px] leading-relaxed text-muted">
                {n.summary}
              </p>

              <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold underline-offset-4 group-hover:underline">
                {t("news.readMore")} →
              </span>
            </motion.a>
          </Reveal>
        ))}
      </div>
      )}

      <Reveal className="mt-6 text-center">
        <p className="text-[10.5px] italic text-muted/80">✦ {t("news.disclaimer")}</p>
      </Reveal>
    </section>
  );
}
