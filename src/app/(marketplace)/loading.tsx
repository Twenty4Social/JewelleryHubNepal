"use client";
import { useLang } from "@/lib/i18n";
export default function Loading() {
  const { lang } = useLang();
  return <div role="status" className="mx-auto min-h-[60svh] max-w-6xl px-6 py-16 text-burgundy"><p className="font-display text-2xl">{lang === "np" ? "पृष्ठ खुल्दैछ…" : "Opening your next page…"}</p><div aria-hidden className="mt-8 h-px w-full bg-burgundy/20" /></div>;
}
