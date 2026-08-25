"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./reveal";
import { useLang, pick } from "@/lib/i18n";
import { categories } from "@/lib/data";

export default function Categories() {
  const { t, lang } = useLang();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHead kicker={t("cats.kicker")} title={t("cats.title")} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.05}>
            <motion.a
              href="#top"
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center border border-gold-light bg-paper px-4 py-7 text-center transition-colors hover:border-gold"
            >
              <span
                aria-hidden
                className="font-display text-[1.7rem] leading-none text-gold transition-transform duration-300 group-hover:scale-110"
              >
                {c.glyph}
              </span>
              <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                {pick(lang, c.name)}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-widest text-muted">
                {c.count} {t(c.count === 1 ? "cats.piece" : "cats.pieces")}
              </span>
            </motion.a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
