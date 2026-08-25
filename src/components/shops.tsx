"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./reveal";
import { useLang, pick } from "@/lib/i18n";
import {
  shops,
  products,
  editRailIds,
  waLink,
  formatPrice,
} from "@/lib/data";
import { trackLead } from "@/lib/track";

export function ShopCards() {
  const { t, lang } = useLang();

  return (
    <section id="jewellers" className="mx-auto max-w-6xl px-6 py-16">
      <SectionHead kicker={t("shops.kicker")} title={t("shops.title")} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shops.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.08}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative flex h-full flex-col border border-gold-light bg-paper"
            >
              {s.verified && (
                <span className="seal absolute right-3 top-3 z-10 flex h-[58px] w-[58px] rotate-[-8deg] items-center justify-center text-center text-paper">
                  <b className="text-[8.5px] font-semibold uppercase leading-[1.5] tracking-[0.14em]">
                    {s.foundingPartner ? t("shops.founding") : t("shops.verified")}
                  </b>
                </span>
              )}

              {/* arch-masked cover */}
              <div className="relative mx-3 mt-3 h-52 overflow-hidden rounded-t-full border border-gold-light">
                <Image
                  src={s.image}
                  alt={s.name.en}
                  fill
                  sizes="(max-width: 640px) 90vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex grow flex-col p-5 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {pick(lang, s.city)} · {pick(lang, s.specialty)}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-medium text-burgundy">
                  {pick(lang, s.name)}
                </h3>
                <p className="mt-2 grow text-[13px] leading-relaxed text-muted">
                  {pick(lang, s.blurb)}
                </p>
                <a
                  href={waLink(
                    s.whatsapp,
                    lang === "np"
                      ? "नमस्ते! तपाईंको सङ्ग्रहबारे जान्न चाहन्छु।"
                      : "Hello! I'd love to know more about your collection."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackLead({ kind: "whatsapp_click", shopId: s.id, source: "shop_card" });
                  }}
                  className="mt-5 inline-flex items-center justify-center gap-2 border border-burgundy bg-burgundy px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-transparent hover:text-burgundy"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
                    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5 13.9c-.2.6-1.2 1.1-1.7 1.1-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.8-5c-.4-.7-.7-1.5-.7-2.2 0-.8.5-1.4.8-1.7.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7a9.6 9.6 0 0 0 4.4 3.8c.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.2.1.4.2.4.4z" />
                  </svg>
                  {t("shops.chat")}
                </a>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 text-center">
        <a
          href="#join"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold underline-offset-4 hover:underline"
        >
          {t("shops.viewAll")} →
        </a>
      </Reveal>
    </section>
  );
}

export function EditRail() {
  const { t, lang } = useLang();
  const rail = editRailIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <section id="collections" className="py-16">
      <div className="rule-double bg-burgundy py-16 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">
              ✦ {t("edit.kicker")} ✦
            </p>
            <h2 className="mt-4 font-display text-4xl font-normal text-cream md:text-5xl">
              {t("edit.title")}
              <span className="ml-3 font-body text-xl font-normal italic text-gold-light">
                {t("edit.npTitle")}
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[#e9ddc6]">
              {t("edit.body")}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {rail.map((p, i) => {
              const shop = shops.find((s) => s.id === p.shopId)!;
              return (
                <Reveal key={p.id} delay={i * 0.07}>
                  <motion.a
                    whileHover={{ y: -6 }}
                    href={waLink(
                      shop.whatsapp,
                      lang === "np"
                        ? `नमस्ते! “${p.title.np}” उपलब्ध छ?`
                        : `Hello! Is the “${p.title.en}” available?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackLead({
                      kind: "whatsapp_click",
                      shopId: shop.id,
                      productId: p.id,
                      source: "wedding_edit",
                    })}
                    className="group block bg-paper/95 p-3 text-left"
                  >
                    <div className="relative aspect-square overflow-hidden border border-gold-light">
                      <Image
                        src={p.image}
                        alt={p.title.en}
                        fill
                        sizes="(max-width: 768px) 45vw, 22vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 bg-pure/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-burgundy">
                        {p.metal}
                      </span>
                    </div>
                    <h3 className="mt-3 truncate font-display text-base text-burgundy">
                      {pick(lang, p.title)}
                    </h3>
                    <p className="text-xs text-muted">
                      {pick(lang, shop.name)} ·{" "}
                      {p.priceMax
                        ? `${formatPrice(p.priceMin)} – ${formatPrice(p.priceMax)}`
                        : formatPrice(p.priceMin)}
                    </p>
                  </motion.a>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-10">
            <a
              href="#top"
              className="inline-block border border-gold-light px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold hover:text-burgundy-deep"
            >
              {t("edit.cta")}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
