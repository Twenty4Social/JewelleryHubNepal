"use client";

import { Reveal } from "./reveal";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export function JoinCTA() {
  const { t, lang } = useLang();

  return (
    <section id="join" className="mx-auto max-w-6xl px-6 pb-8 pt-4">
      <Reveal>
        <div className="flex flex-col items-center justify-between gap-8 border-t border-burgundy/25 bg-paper px-0 py-10 text-center md:flex-row md:text-left">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-gold">
              {t("join.kicker")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium text-burgundy">
              {t("join.title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{t("join.body")}</p>
          </div>
          <Link href="/connect"
            className="shrink-0 border border-burgundy bg-burgundy px-9 py-4 text-base font-semibold text-paper transition-colors hover:bg-transparent hover:text-burgundy"
          >
            {lang === "np" ? "पसलको डेमो हेर्नुहोस्" : "Explore the partner demo"} →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
