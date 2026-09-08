"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang, pick } from "@/lib/i18n";
import { productPrice, products, shops, type Product } from "@/lib/data";
import { trackLead } from "@/lib/track";

type SearchResponse = {
  productIds: string[];
  message: string;
  source: "gemini" | "catalog";
};

export default function Hero() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
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
    setSubmittedQuery(queryText);
    setState("thinking");
    setResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: queryText, lang }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Search returned ${response.status}`);

      const data = await response.json() as SearchResponse;
      setResults(data.productIds.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product)));
      setAnswer(data.message);
      setSource(data.source);
      setState("done");
      trackLead({ kind: "search", query: queryText, source: data.source });
    } catch (error) {
      if ((error as Error).name !== "AbortError") setState("error");
    }
  };

  const facets = Array.from(new Set(results.flatMap((product) => [product.metal, product.category, pick(lang, product.occasion)]))).slice(0, 7);

  return (
    <section id="top" className="bg-burgundy px-4 py-12 text-cream md:px-6 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold text-cream">{t("hero.eyebrow")}</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,6.75vw,5.4rem)] font-medium leading-[1.2]">
            {t("hero.title.a")} <em className="jewellery-word">{t("hero.title.b")}</em> {t("hero.title.c")}
          </h1>
          <p className="mt-4 text-lg leading-7 text-cream">{t("hero.sub")}</p>
          <form className="mt-7 flex flex-wrap items-center gap-2 rounded-2xl bg-paper p-2" onSubmit={(event) => { event.preventDefault(); void ask(); }}>
            <label htmlFor="jewellery-search" className="sr-only">{lang === "np" ? "गहना खोज्नुहोस्" : "Search jewellery"}</label>
            <input id="jewellery-search" required value={query} onChange={(event) => { setQuery(event.target.value); if (state === "error") setState("idle"); }} placeholder={t("hero.placeholder")} className="min-w-[120px] flex-1 bg-transparent px-3 py-3 text-base text-ink placeholder:text-muted" />
            <button type="submit" disabled={state === "thinking"} className="min-h-12 rounded-xl bg-burgundy px-4 text-base font-semibold text-paper disabled:cursor-wait disabled:opacity-60">{t("hero.ask")}</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.slice(0, 2).map((chip) => <button key={chip} type="button" onClick={() => void ask(chip)} className="min-h-12 rounded-full border border-paper/40 px-4 py-2 text-sm text-paper hover:bg-burgundy-deep">{chip}</button>)}
          </div>
        </div>
        <Link href="/products" aria-label={lang === "np" ? "गहनाको सङ्ग्रह हेर्नुहोस्" : "Explore the jewellery collection"} className="relative hidden aspect-[4/5] overflow-hidden rounded-t-full border border-cream/40 lg:block">
          <Image src={products.find((product) => product.id === "p4")!.image} alt={lang === "np" ? "गहनाको विवरण" : "Jewellery detail"} fill priority sizes="40vw" className="object-cover" />
        </Link>
      </div>

      {state !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-7xl rounded-[2rem] border border-gold-light bg-paper p-4 text-left text-ink shadow-[0_35px_100px_rgba(94,31,38,0.08)] backdrop-blur md:p-7"
          aria-live="polite"
        >
          <div className="flex justify-end"><span className="max-w-full break-words rounded-2xl bg-ink px-5 py-3 text-base text-pure">{submittedQuery}</span></div>

          {state === "thinking" && (
            <div className="py-8">
              <p className="font-display text-xl italic text-muted"><span className="mr-3 text-gold">✦</span>{t("hero.searching")}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="aspect-[3/4] animate-pulse rounded-2xl bg-cream" />)}</div>
            </div>
          )}

          {state === "error" && <p className="py-8 text-center text-base text-fall">{t("hero.error")}</p>}

          {state === "done" && (
            <div className="pt-7">
              <div className="max-w-4xl rounded-[1.5rem] bg-cream/70 px-5 py-5 md:px-7">
                <p className="font-display text-lg leading-8 text-ink md:text-2xl"><span className="mr-3 text-gold">✦</span>{answer}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">{facets.map((facet) => <span key={facet} className="rounded-full bg-cream px-4 py-2 text-sm capitalize text-ink">{facet}</span>)}</div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((product, index) => {
                  const shop = shops.find((item) => item.id === product.shopId)!;
                  const price = productPrice(product, lang);
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.06 }}>
                      <Link href={`/products/${product.id}`} className="group block overflow-hidden rounded-2xl border border-gold-light bg-paper transition hover:-translate-y-1 hover:border-gold hover:shadow-[0_18px_45px_rgba(94,31,38,0.11)]">
                        <div className="relative aspect-square overflow-hidden bg-cream">
                          <Image src={product.image} alt={pick(lang, product.title)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
                          <span className="absolute bottom-3 left-3 rounded-full bg-pure/90 px-3 py-2 text-sm font-semibold text-burgundy backdrop-blur">{lang === "np" ? "विवरण हेर्नुहोस्" : "View details"} ↗</span>
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-semibold text-muted">{pick(lang, shop.name)}</p>
                          <h2 className="mt-1 font-display text-lg leading-tight text-burgundy">{pick(lang, product.title)}</h2>
                          <div className="mt-3 flex flex-wrap items-end justify-between gap-3"><span className="text-sm text-muted">{product.metal}</span><span className="text-right text-sm font-semibold text-ink">{price}</span></div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <p className="mt-5 text-sm italic text-muted">{source === "gemini" ? t("hero.powered") : t("hero.fallback")}</p>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
