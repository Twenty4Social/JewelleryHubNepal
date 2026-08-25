"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./reveal";
import { useLang } from "@/lib/i18n";
import { trackLead } from "@/lib/track";

export function HowItWorks() {
  const { t } = useLang();

  const steps = [
    { n: "i.", title: t("how.1.t"), desc: t("how.1.d") },
    { n: "ii.", title: t("how.2.t"), desc: t("how.2.d") },
    { n: "iii.", title: t("how.3.t"), desc: t("how.3.d") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHead kicker={t("how.kicker")} title={t("how.title")} />

      <div className="grid gap-10 text-center md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col items-center"
            >
              <span className="font-display text-5xl italic text-gold">{s.n}</span>
              <h3 className="mt-3 font-display text-xl font-medium text-burgundy">
                {s.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted">
                {s.desc}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function JoinCTA() {
  const { t } = useLang();

  return (
    <section id="join" className="mx-auto max-w-6xl px-6 pb-8 pt-4">
      <Reveal>
        <div className="gold-frame flex flex-col items-center justify-between gap-8 bg-paper px-8 py-12 text-center md:flex-row md:text-left">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              ✦ {t("join.kicker")} ✦
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium text-burgundy">
              {t("join.title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("join.body")}</p>
          </div>
          <a
            href="https://wa.me/9779800000000?text=Namaste!%20I%20want%20to%20list%20my%20jewellery%20shop%20on%20Jewellery%20Hub%20Nepal."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLead({ kind: "jeweller_signup", source: "join_cta" })}
            className="shrink-0 border border-burgundy bg-burgundy px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-burgundy"
          >
            {t("join.cta")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
