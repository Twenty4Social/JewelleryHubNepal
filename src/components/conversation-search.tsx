"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang, pick } from "@/lib/i18n";
import { products, shops, productPrice } from "@/lib/data";
import { trackLead } from "@/lib/track";

type Turn = { query: string; message: string; productIds: string[]; status: "pending" | "done" | "error"; source?: "gemini" | "catalog" };

export default function ConversationSearch() {
  const { t, lang } = useLang();
  const np = lang === "np";
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const latestTurn = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLInputElement>(null);
  const active = useRef<AbortController | null>(null);
  const busy = turns.at(-1)?.status === "pending";

  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (log.current && latestTurn.current) {
      log.current.scrollTop += latestTurn.current.getBoundingClientRect().top - log.current.getBoundingClientRect().top - 20;
    }
  }, [turns]);

  const open = () => { if (!dialog.current?.open) dialog.current?.showModal(); composer.current?.focus(); };
  const ask = async (text: string, retry = false) => {
    const question = text.trim();
    if (!question || question.length > 300 || busy) return;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    const previous = retry ? turns.slice(0, -1) : turns;
    const history = previous.filter(turn => turn.status === "done").slice(-6).flatMap(turn => [
      { role: "user", text: turn.query },
      { role: "assistant", text: `${turn.message}\nSuggested designs: ${turn.productIds.map(id => `${id}: ${products.find(p => p.id === id)?.title.en ?? ""}`).join(", ")}`.slice(0, 1500) },
    ]);
    setTurns([...previous, { query: question, message: "", productIds: [], status: "pending" }]);
    setReply(""); open();
    try {
      const response = await fetch("/api/search", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: question, history, lang }), signal: controller.signal });
      if (!response.ok) throw new Error(String(response.status));
      const result = await response.json() as { message: string; productIds: string[]; source: "gemini" | "catalog" };
      if (active.current !== controller) return;
      setTurns([...previous, { query: question, ...result, status: "done" }]);
      trackLead({ kind: "search", query: question, source: result.source });
    } catch (error) {
      if ((error as Error).name === "AbortError" || active.current !== controller) return;
      setTurns([...previous, { query: question, message: np ? "खोज पूरा भएन। फेरि प्रयास गर्नुहोस्।" : "That search didn’t finish. Your conversation is still here—please try again.", productIds: [], status: "error" }]);
    }
  };

  return <>
    <form className="mt-7 flex items-center gap-2 rounded-2xl bg-cream p-2" onSubmit={event => { event.preventDefault(); void ask(query); }}>
      <label htmlFor="jewellery-search" className="sr-only">{np ? "गहना खोज्नुहोस्" : "Search jewellery"}</label>
      <input id="jewellery-search" required maxLength={300} value={query} onChange={event => setQuery(event.target.value)} placeholder={t("hero.placeholder")} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-burgundy placeholder:text-burgundy" />
      <button disabled={busy} className="min-h-12 rounded-xl bg-burgundy px-4 font-semibold text-cream disabled:opacity-60">{t("hero.ask")}</button>
    </form>
    <div className="mt-3 flex flex-wrap gap-2">
      {[t("chip.1"), t("chip.2")].map(chip => <button key={chip} disabled={busy} onClick={() => void ask(chip)} className="rounded-full border border-cream/40 px-4 py-2 text-sm text-cream disabled:opacity-60">{chip}</button>)}
      {!!turns.length && <button onClick={open} className="px-2 py-2 text-base text-cream underline underline-offset-4">{np ? "कुराकानी जारी राख्नुहोस्" : "Continue your conversation"} →</button>}
    </div>

    <dialog ref={dialog} aria-labelledby="search-title" className="search-dialog fixed inset-0 m-auto h-[94dvh] max-h-[94dvh] w-[calc(100%-1rem)] max-w-5xl overflow-hidden rounded-2xl border border-burgundy bg-cream p-0 text-burgundy open:flex open:flex-col md:h-[86dvh] md:w-[calc(100%-3rem)]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-burgundy/20 px-4 py-3 md:px-6">
        <div><h2 id="search-title" className="font-display text-xl md:text-3xl">{np ? "तपाईंको गहना खोजौँ" : "Let’s find your jewellery"}</h2><p className="hidden text-sm sm:block">{np ? "आफ्नो कुरा भन्नुहोस्। सँगै विकल्प छानौँ।" : "Tell us what you have in mind. We’ll explore it together."}</p></div>
        <button onClick={() => dialog.current?.close()} className="shrink-0 rounded-full border border-burgundy px-4 text-base">{np ? "बन्द" : "Close"} ×</button>
      </div>
      <div ref={log} aria-label={np ? "गहना खोजको कुराकानी" : "Jewellery conversation"} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 md:px-8 md:py-6">
        <div className="mx-auto max-w-4xl">
          {!turns.length && <p className="text-lg leading-relaxed">{np ? "कस्तो गहना खोज्दै हुनुहुन्छ? प्रकार, अवसर वा मन पर्ने पसलबाट सुरु गर्नुहोस्।" : "What are you looking for? Start with a jewellery type, an occasion or a favourite shop."}</p>}
          {turns.map((turn, index) => {
            const designs = turn.productIds.flatMap(id => products.find(product => product.id === id) ?? []);
            const cards = (items: typeof designs) => items.map(product => <Link key={product.id} href={`/products/${product.id}`} onClick={() => dialog.current?.close()} className="group flex overflow-hidden rounded-xl border border-burgundy/25 md:flex-col">
              <div className="relative w-28 shrink-0 bg-cream md:aspect-[4/3] md:w-full"><Image src={product.image} alt={pick(lang, product.title)} fill sizes="(max-width: 768px) 112px, 280px" className="object-contain" /></div>
              <div className="min-w-0 flex-1 p-3 md:p-4"><h3 className="font-display text-lg leading-snug md:text-xl">{pick(lang, product.title)}</h3><p className="mt-1 text-sm">{pick(lang, shops.find(shop => shop.id === product.shopId)!.name)}</p><p className="mt-2 text-sm font-semibold">{productPrice(product, lang)}</p><span className="inline-flex min-h-12 items-center text-base font-semibold underline underline-offset-4">{np ? "विवरण हेर्नुहोस्" : "View details"} →</span></div>
            </Link>);
            return <div key={index} ref={index === turns.length - 1 ? latestTurn : undefined} className="mb-8 space-y-4 md:mb-10">
              <div className="flex justify-end"><p className="max-w-[90%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-burgundy px-4 py-3 text-base text-cream"><span className="sr-only">{np ? "तपाईं: " : "You: "}</span>{turn.query}</p></div>
              <div className="max-w-2xl text-base leading-relaxed"><p className="mb-1 text-sm font-semibold">Jewellery Hub</p><p aria-live="polite" className="whitespace-pre-wrap break-words">{turn.status === "pending" ? (np ? "तपाईंका लागि डिजाइन खोज्दैछौँ…" : "Looking through the collections for you…") : turn.message}</p>
                {turn.status === "error" && index === turns.length - 1 && <button className="mt-2 underline" onClick={() => void ask(turn.query, true)}>{np ? "फेरि प्रयास" : "Try again"}</button>}
              </div>
              {!!designs.length && <div aria-label={np ? "सुझाइएका डिजाइन" : `Designs for: ${turn.query}`}>
                <div className="grid gap-3 md:grid-cols-3">{cards(designs.slice(0, 3))}</div>
                {designs.length > 3 && <details className="mt-3"><summary className="flex min-h-12 cursor-pointer items-center font-semibold underline underline-offset-4">{np ? `थप ${designs.length - 3} डिजाइन हेर्नुहोस्` : `Show ${designs.length - 3} more designs`} +</summary><div className="mt-3 grid gap-3 md:grid-cols-3">{cards(designs.slice(3))}</div></details>}
              </div>}
            </div>;
          })}
        </div>
      </div>
      <div className="shrink-0 border-t border-burgundy/20 bg-cream p-3 md:px-6 md:py-4">
        <form className="flex items-center gap-2 rounded-xl border border-burgundy p-1.5" onSubmit={event => { event.preventDefault(); void ask(reply); }}>
          <label htmlFor="search-reply" className="sr-only">{np ? "आफ्नो कुरा थप्नुहोस्" : "Refine your search"}</label>
          <input ref={composer} id="search-reply" required maxLength={300} value={reply} onChange={event => setReply(event.target.value)} placeholder={np ? "मन पर्ने शैली वा अर्को प्रश्न…" : "A different style, a favourite shop…"} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-base placeholder:text-burgundy/75" />
          <button disabled={busy} className="rounded-lg bg-burgundy px-5 text-base font-semibold text-cream disabled:opacity-60">{np ? "पठाउनुहोस्" : "Send"}</button>
        </form>
        <div className="mt-1 flex items-center justify-between gap-2 text-sm"><span>{np ? "कुराकानीसँगै विकल्प बदलिन्छन्।" : "Ask a follow-up to refine these designs."}</span><button onClick={() => { active.current?.abort(); active.current = null; setTurns([]); setReply(""); setQuery(""); composer.current?.focus(); }} className="shrink-0 underline">{np ? "नयाँ खोज" : "Start over"}</button></div>
      </div>
    </dialog>
  </>;
}
