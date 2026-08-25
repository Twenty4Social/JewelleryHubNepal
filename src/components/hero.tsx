"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang, pick } from "@/lib/i18n";
import { formatPrice, products, shops, waLink, type Product } from "@/lib/data";
import { getSessionId, trackLead } from "@/lib/track";

type SearchResponse = {
  productIds: string[];
  message: string;
  source: "gemini" | "catalog";
};

export default function Hero() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"idle" | "thinking" | "done" | "error">("idle");
  const [results, setResults] = useState<Product[]>([]);
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState<SearchResponse["source"]>("catalog");
  const activeSearch = useRef<AbortController | null>(null);

  const chips = [t("chip.1"), t("chip.2"), t("chip.3"), t("chip.4"), t("chip.5"), t("chip.6")];

  const ask = async (suggestion?: string) => {
    const queryText = (suggestion ?? query).trim();
    if (!queryText) return;

    activeSearch.current?.abort();
    const controller = new AbortController();
    activeSearch.current = controller;
    setQuery(queryText);
    setState("thinking");
    setResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: queryText, lang, sessionId: getSessionId() }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Search returned ${response.status}`);

      const data = await response.json() as SearchResponse;
      setResults(data.productIds.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product)));
      setAnswer(data.message);
      setSource(data.source);
      setState("done");
    } catch (error) {
      if ((error as Error).name !== "AbortError") setState("error");
    }
  };

  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[440px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(176,141,62,0.16),transparent)]"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted"
      >
        {t("hero.eyebrow")}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-5 max-w-3xl font-display text-4xl font-medium leading-tight text-burgundy md:text-6xl"
      >
        {t("hero.title.a")} <em className="text-gold">{t("hero.title.b")}</em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.16 }}
        className="mx-auto mt-4 max-w-xl text-[15px] text-muted"
      >
        {t("hero.sub")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.24 }}
        className="mx-auto mt-10 max-w-2xl"
      >
        <div className="gold-frame bg-paper p-2">
          <form
            className="flex border border-gold"
            onSubmit={(event) => {
              event.preventDefault();
              void ask();
            }}
          >
            <label htmlFor="jewellery-search" className="sr-only">{t("hero.placeholder")}</label>
            <input
              id="jewellery-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (state !== "idle") setState("idle");
              }}
              placeholder={t("hero.placeholder")}
              className="min-w-0 flex-1 bg-transparent px-5 py-4 font-display text-base italic text-ink outline-none placeholder:text-muted/60"
            />
            <button
              type="submit"
              disabled={state === "thinking"}
              className="shrink-0 bg-burgundy px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-burgundy-deep disabled:cursor-wait disabled:opacity-70"
            >
              {t("hero.ask")}
            </button>
          </form>

          {state !== "idle" && (
            <div className="border-t border-gold-light text-left" aria-live="polite">
              {state === "thinking" && (
                <div className="px-5 py-4 font-display italic text-muted">{t("hero.searching")}</div>
              )}
              {state === "error" && (
                <div className="px-5 py-4 text-sm text-fall">{t("hero.error")}</div>
              )}
              {state === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-3 p-4"
                >
                  <p className="text-xs leading-relaxed text-muted">{answer}</p>
                  {results.map((product) => {
                    const shop = shops.find((item) => item.id === product.shopId)!;
                    const price = product.priceMax
                      ? `${formatPrice(product.priceMin)} – ${formatPrice(product.priceMax)}`
                      : formatPrice(product.priceMin);
                    return (
                      <a
                        key={product.id}
                        href={waLink(
                          shop.whatsapp,
                          lang === "np"
                            ? `नमस्ते! Jewellery Hub Nepal मा “${product.title.np}” (${price}) भेटें। उपलब्ध छ?`
                            : `Hello! I found “${product.title.en}” (${price}) on Jewellery Hub Nepal. Is it available?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackLead({
                          kind: "whatsapp_click",
                          shopId: shop.id,
                          productId: product.id,
                          query,
                          source: "search_result",
                        })}
                        className="group flex items-center gap-4 border border-gold-light bg-pure p-3 transition-colors hover:border-gold"
                      >
                        <Image
                          src={product.image}
                          alt={pick(lang, product.title)}
                          width={64}
                          height={64}
                          className="h-16 w-16 shrink-0 border border-gold-light object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-burgundy">{pick(lang, product.title)}</span>
                          <span className="block text-xs text-muted">{pick(lang, shop.name)} · {price}</span>
                        </span>
                        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-widest text-burgundy group-hover:underline sm:block">
                          WhatsApp →
                        </span>
                      </a>
                    );
                  })}
                  <p className="text-[10px] italic text-muted/80">
                    {source === "gemini" ? t("hero.powered") : t("hero.fallback")}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {chips.map((chip) => (
            <motion.button
              key={chip}
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => void ask(chip)}
              className="rounded-full border border-gold-light bg-pure/70 px-4 py-2 font-display text-[13px] italic text-muted transition-colors hover:border-gold hover:text-burgundy"
            >
              “{chip}”
            </motion.button>
          ))}
        </div>

        <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-muted/80">{t("hero.trust")}</p>
      </motion.div>
    </section>
  );
}
