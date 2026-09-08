"use client";

import { motion } from "framer-motion";
import { Reveal } from "./reveal";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export function HowItWorks() {
  const { t } = useLang();

  const steps = [
    { n: "1", title: t("how.1.t"), desc: t("how.1.d") },
    { n: "2", title: t("how.2.t"), desc: t("how.2.d") },
    { n: "3", title: t("how.3.t"), desc: t("how.3.d") },
  ];

  return (
    <section aria-labelledby="buying-steps" className="mx-auto max-w-6xl border-y border-gold-light px-6 py-8">
      <details>
      <summary id="buying-steps" className="cursor-pointer font-display text-2xl text-burgundy">{t("how.title")}</summary>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className="grid grid-cols-[2rem_1fr] gap-x-3"
            >
              <span className="row-span-2 font-display text-3xl text-burgundy">{s.n}</span>
              <h3 className="font-display text-xl font-medium text-burgundy">
                {s.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted">
                {s.desc}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
      </details>
    </section>
  );
}

export function JoinCTA() {
  const { t, lang } = useLang();

  return (
    <section id="join" className="mx-auto max-w-6xl px-6 pb-8 pt-4">
      <Reveal>
        <div className="gold-frame flex flex-col items-center justify-between gap-8 bg-paper px-8 py-12 text-center md:flex-row md:text-left">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-gold">
              ✦ {t("join.kicker")} ✦
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium text-burgundy">
              {t("join.title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{t("join.body")}</p>
          </div>
          <Link href="/connect"
            className="shrink-0 border border-burgundy bg-burgundy px-9 py-4 text-sm font-semibold text-paper transition-colors hover:bg-transparent hover:text-burgundy"
          >
            {lang === "np" ? "पसलको डेमो हेर्नुहोस्" : "Explore the partner demo"} →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
