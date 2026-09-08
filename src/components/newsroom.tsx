"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./reveal";
import { useLang } from "@/lib/i18n";
import type { LiveNewsItem } from "@/lib/data";

export default function Newsroom({ items }: { items: LiveNewsItem[] }) {
  const { t, lang } = useLang();

  return (
    <section id="news" className="mx-auto max-w-6xl px-6 py-16">
      <SectionHead kicker={t("news.kicker")} title={t("news.title")} />

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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="border border-gold-light px-2 py-0.5 text-sm font-semibold text-burgundy">
                  {n.tag}
                </span>
                <span className="text-sm text-muted">
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


              <span className="mt-5 text-base font-semibold text-burgundy underline-offset-4 group-hover:underline">
                {t("news.readMore")} →
              </span>
            </motion.a>
          </Reveal>
        ))}
      </div>
      )}

      <Reveal className="mt-6 text-center">
        <p className="text-sm text-muted">✦ {t("news.disclaimer")}</p>
      </Reveal>
    </section>
  );
}
