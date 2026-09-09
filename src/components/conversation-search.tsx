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
  const [tab, setTab] = useState<"chat" | "designs">("chat");
  const dialog = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLInputElement>(null);
  const active = useRef<AbortController | null>(null);
  const busy = turns.at(-1)?.status === "pending";
  const latest = turns.findLast(turn => turn.status === "done");
  const results = (latest?.productIds ?? []).flatMap(id => products.find(p => p.id === id) ?? []);

  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [turns, tab]);

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
    setReply(""); setTab("chat"); open();
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

    <dialog ref={dialog} aria-labelledby="search-title" className="search-dialog fixed inset-0 m-auto h-[94dvh] max-h-[94dvh] w-[calc(100%-1rem)] max-w-6xl overflow-hidden rounded-2xl border border-burgundy bg-cream p-0 text-burgundy open:flex open:flex-col md:h-[86dvh] md:w-[calc(100%-3rem)]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-burgundy/20 px-4 py-3 md:px-6">
        <div><h2 id="search-title" className="font-display text-xl md:text-3xl">{np ? "तपाईंको गहना खोजौँ" : "Let’s find your jewellery"}</h2><p className="hidden text-sm sm:block">{np ? "आफ्नो कुरा भन्नुहोस्। सँगै विकल्प छानौँ।" : "Tell us what you have in mind. We’ll explore it together."}</p></div>
        <button onClick={() => dialog.current?.close()} className="shrink-0 rounded-full border border-burgundy px-4 text-base">{np ? "बन्द" : "Close"} ×</button>
      </div>
      <div className="grid shrink-0 grid-cols-2 border-b border-burgundy/20 md:hidden" aria-label={np ? "खोजको दृश्य" : "Search view"}>
        <button aria-pressed={tab === "chat"} onClick={() => setTab("chat")} className={tab === "chat" ? "bg-burgundy text-cream" : ""}>{np ? "कुराकानी" : "Conversation"}</button>
        <button aria-pressed={tab === "designs"} onClick={() => setTab("designs")} className={tab === "designs" ? "bg-burgundy text-cream" : ""}>{np ? "डिजाइन" : "Designs"} ({results.length})</button>
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[.9fr_1.1fr]">
        <div ref={log} role="log" aria-label={np ? "गहना खोजको कुराकानी" : "Jewellery conversation"} aria-live="polite" className={`${tab === "chat" ? "block" : "hidden"} min-h-0 overflow-y-auto overscroll-contain p-4 md:block md:border-r md:border-burgundy/20 md:p-6`}>
          {!turns.length && <p className="text-lg leading-relaxed">{np ? "कस्तो गहना खोज्दै हुनुहुन्छ? प्रकार, अवसर वा मन पर्ने पसलबाट सुरु गर्नुहोस्।" : "What are you looking for? Start with a jewellery type, an occasion or a favourite shop."}</p>}
          {turns.map((turn, index) => <div key={index} className="mb-6 space-y-4">
            <p className="ml-6 whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-burgundy px-4 py-3 text-base text-cream"><span className="sr-only">{np ? "तपाईं: " : "You: "}</span>{turn.query}</p>
            <div className="pr-4 text-base leading-relaxed"><p className="mb-1 text-sm font-semibold">Jewellery Hub</p><p className="whitespace-pre-wrap break-words">{turn.status === "pending" ? (np ? "तपाईंका लागि डिजाइन खोज्दैछौँ…" : "Looking through the collections for you…") : turn.message}</p>
              {turn.status === "error" && index === turns.length - 1 && <button className="mt-2 underline" onClick={() => void ask(turn.query, true)}>{np ? "फेरि प्रयास" : "Try again"}</button>}
            </div>
          </div>)}
          {!!results.length && <button onClick={() => setTab("designs")} className="rounded-full border border-burgundy px-5 py-2 font-semibold md:hidden">{np ? `${results.length} डिजाइन हेर्नुहोस्` : `See ${results.length} ${results.length === 1 ? "design" : "designs"}`} →</button>}
        </div>
        <section aria-label={np ? "छानिएका डिजाइन" : "Your design shortlist"} className={`${tab === "designs" ? "block" : "hidden"} min-h-0 overflow-y-auto overscroll-contain p-4 md:block md:p-6`} aria-busy={busy}>
          <div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-display text-2xl">{np ? "तपाईंका लागि डिजाइन" : "Your design shortlist"}</h3><span className="text-sm">{results.length} {np ? "विकल्प" : results.length === 1 ? "design" : "designs"}</span></div>
          {busy && <p role="status" className="mb-4 text-base">{np ? "विकल्प मिलाउँदैछौँ…" : "Refining your shortlist…"}</p>}
          {!results.length && !busy && <p>{np ? "अर्को शैली वा गहनाको प्रकार भन्नुहोस्।" : "Try another style or jewellery type to find more options."}</p>}
          <div className="grid grid-cols-2 gap-3">
            {results.map(product => <Link key={product.id} href={`/products/${product.id}`} className="overflow-hidden rounded-xl border border-burgundy/25" onClick={() => dialog.current?.close()}>
              <div className="relative aspect-square"><Image src={product.image} alt={pick(lang, product.title)} fill sizes="(max-width: 768px) 45vw, 25vw" className="object-contain" /></div>
              <div className="p-3"><p className="text-sm">{pick(lang, shops.find(shop => shop.id === product.shopId)!.name)}</p><h4 className="mt-1 font-display text-lg leading-snug">{pick(lang, product.title)}</h4><p className="mt-2 text-sm font-semibold">{productPrice(product, lang)}</p><span className="mt-3 inline-flex min-h-12 items-center text-sm underline">{np ? "विवरण हेर्नुहोस्" : "View details"} →</span></div>
            </Link>)}
          </div>
          {latest && <p className="mt-4 text-sm">{latest.source === "catalog" ? (np ? "क्याटलगबाट मिलाइएका विकल्प।" : "Matched from the catalogue.") : (np ? "AI को सहयोगमा छानिएका विकल्प।" : "Selected with AI assistance.")} {np ? "मूल्य र शुद्धता पसलसँग पुष्टि गर्नुहोस्।" : "Confirm price and purity with the shop."}</p>}
        </section>
      </div>
      <div className="shrink-0 border-t border-burgundy/20 bg-cream p-3 md:px-6 md:py-4">
        <form className="flex items-center gap-2 rounded-xl border border-burgundy p-1.5" onSubmit={event => { event.preventDefault(); void ask(reply); }}>
          <label htmlFor="search-reply" className="sr-only">{np ? "आफ्नो कुरा थप्नुहोस्" : "Refine your search"}</label>
          <input ref={composer} id="search-reply" required maxLength={300} value={reply} onChange={event => setReply(event.target.value)} placeholder={np ? "मन पर्ने शैली वा अर्को प्रश्न…" : "A different style, a favourite shop…"} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-base placeholder:text-burgundy/75" />
          <button disabled={busy} className="rounded-lg bg-burgundy px-5 text-base font-semibold text-cream disabled:opacity-60">{np ? "पठाउनुहोस्" : "Send"}</button>
        </form>
        <div className="mt-1 flex items-center justify-between gap-2 text-sm"><span>{np ? "कुराकानीसँगै विकल्प बदलिन्छन्।" : "Your shortlist follows the conversation."}</span><button onClick={() => { active.current?.abort(); active.current = null; setTurns([]); setReply(""); setQuery(""); setTab("chat"); composer.current?.focus(); }} className="shrink-0 underline">{np ? "नयाँ खोज" : "Start over"}</button></div>
      </div>
    </dialog>
  </>;
}
