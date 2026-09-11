"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  acceptClinicRequest,
  readClinicRequests,
  resolveClinicRequest,
  writeClinicRequests,
  type ClinicMedia,
  type ClinicRequest,
} from "@/lib/clinic";

function MediaPreview({ media }: { media?: ClinicMedia }) {
  if (!media) return null;
  if (media.kind === "image") {
    return <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream"><Image src={media.src} alt={media.name} fill unoptimized={media.src.startsWith("data:")} className="object-contain" /></div>;
  }
  if (media.kind === "voice") return <audio src={media.src} controls preload="metadata" className="w-full" />;
  return <video src={media.src} controls preload="metadata" className="aspect-[4/3] w-full rounded-2xl bg-ink object-contain" />;
}

export default function AabhushanAdminPage() {
  const [requests, setRequests] = useState<ClinicRequest[] | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = requests?.find(request => request.id === selectedId);

  useEffect(() => { if (selectedId) dialog.current?.showModal(); }, [selectedId]);

  useEffect(() => {
    const timer = window.setTimeout(() => setRequests(readClinicRequests()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const update = (next: ClinicRequest[]) => {
    if (writeClinicRequests(next)) { setRequests(next); setSaveError(""); }
    else setSaveError("The change could not be saved in this browser. Please try again.");
  };

  const open = requests?.filter((request) => request.status === "open") ?? [];
  const owned = requests?.filter((request) => request.assignedShopId === "aabhushan") ?? [];

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-gold-light bg-burgundy text-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <div>
            <p className="text-sm font-semibold  text-cream">Jewellery Hub Nepal · Partner desk</p>
            <h1 className="mt-1 font-display text-2xl">Aabhushan Crafts</h1>
          </div>
          <Link href="/" className="rounded-full border border-paper/30 px-4 py-2 text-sm font-semibold  transition hover:bg-paper hover:text-burgundy">View marketplace ↗</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold  text-muted">Jewellery clinic · Shared queue</p>
            <h2 className="mt-2 font-display text-4xl text-burgundy">Your customer requests.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Review open requests from customers. The first verified house to accept becomes the case owner and receives the ticket.</p>
          </div>
          <span className="w-fit rounded-full bg-gold/15 px-4 py-2 text-sm font-semibold  text-burgundy">Demo mode · browser only</span>
        </div>

        {!selected && saveError && <p role="alert" className="mt-4 text-burgundy">{saveError}</p>}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Open clinic requests", open.length],
            ["Aabhushan tickets", owned.length],
            ["Resolved", owned.filter((request) => request.status === "resolved").length],
          ].map(([label, value]) => (
            <article key={String(label)} className="rounded-2xl border border-gold-light bg-paper p-5 shadow-[0_12px_35px_rgba(94,31,38,0.05)]">
              <p className="text-sm font-semibold  text-muted">{label}</p>
              <p className="mt-3 font-display text-4xl text-burgundy">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-burgundy">Open to verified jewellers</h3>
            <span className="text-sm text-muted">{open.length} waiting</span>
          </div>

          {!requests ? (
            <p className="mt-6 rounded-2xl border border-gold-light bg-paper p-8 text-sm text-muted">Loading clinic queue…</p>
          ) : open.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-gold-light bg-paper p-8 text-sm text-muted">The shared queue is clear.</p>
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {open.map((request) => (
                <article key={request.id} className={`grid gap-5 rounded-[1.5rem] border border-gold-light bg-paper p-4 shadow-[0_16px_45px_rgba(94,31,38,0.06)] ${request.media ? "sm:grid-cols-[160px_1fr]" : ""}`}>
                  <MediaPreview media={request.media} />
                  <div className="min-w-0 p-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{request.customerName}</p>
                        <p className="mt-1 text-sm text-muted">{request.contact} · {new Date(request.createdAt).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })}</p>
                      </div>
                      <span className="rounded-full bg-rise/10 px-3 py-1 text-sm font-semibold  text-rise">Open</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted">{request.message || "Voice or media assessment requested."}</p>
                    {request.voice && <audio src={request.voice.src} controls className="mt-4 h-9 w-full" />}
                    <button onClick={() => setSelectedId(request.id)} aria-haspopup="dialog" className="mt-4 inline-flex min-h-12 items-center rounded-full border border-burgundy px-5 py-2 text-base font-semibold text-burgundy">View request →</button>
                    <button onClick={() => update(acceptClinicRequest(requests ?? [], request.id, "aabhushan"))} className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold  text-pure transition hover:bg-burgundy">
                      Accept & raise ticket ↗
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-14 border-t border-gold-light pt-10">
          <h3 className="font-display text-2xl text-burgundy">Aabhushan tickets</h3>
          <div className="mt-5 space-y-3">
            {owned.length === 0 ? (
              <p className="rounded-2xl bg-paper p-6 text-sm text-muted">Accepted requests will appear here.</p>
            ) : owned.map((request) => (
              <article key={request.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-gold-light bg-paper p-5 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="font-display text-lg text-burgundy">{request.ticketId}</b>
                    <span className={`rounded-full px-2.5 py-1 text-sm font-semibold  ${request.status === "resolved" ? "bg-rise/10 text-rise" : "bg-gold/15 text-burgundy"}`}>{request.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink">{request.customerName} · {request.contact}</p>
                  <p className="mt-1 max-w-3xl text-sm leading-5 text-muted">{request.message}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button onClick={() => setSelectedId(request.id)} aria-haspopup="dialog" className="min-h-12 rounded-full border border-burgundy px-5 py-2 text-base font-semibold text-burgundy">View request →</button>
                {request.status === "accepted" && (
                  <button onClick={() => update(resolveClinicRequest(requests ?? [], request.id))} className="shrink-0 rounded-full border border-burgundy px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-burgundy transition hover:bg-burgundy hover:text-paper">Mark resolved</button>
                )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <dialog ref={dialog} aria-labelledby="request-title" onClose={() => setSelectedId(null)} className="request-dialog fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-2xl border border-burgundy bg-cream p-0 text-burgundy open:flex open:flex-col">
        {selected && <>
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-burgundy/20 p-5">
            <div><p className="text-sm">Customer request · {selected.status}</p><h2 id="request-title" className="mt-1 break-words font-display text-2xl">{selected.customerName}</h2></div>
            <button autoFocus onClick={() => dialog.current?.close()} className="shrink-0 rounded-full border border-burgundy px-4 py-2">Close ×</button>
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-contain p-5 md:p-7">
            <dl className="grid gap-4 text-base sm:grid-cols-2">
              <div><dt className="text-sm font-semibold">Customer contact</dt><dd className="break-words">{selected.contact}</dd></div>
              <div><dt className="text-sm font-semibold">Received</dt><dd>{new Date(selected.createdAt).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kathmandu" })}</dd></div>
              <div><dt className="text-sm font-semibold">Request ID</dt><dd className="break-all">{selected.id}</dd></div>
              {selected.ticketId && <div><dt className="text-sm font-semibold">Ticket</dt><dd>{selected.ticketId}</dd></div>}
              {selected.acceptedAt && <div><dt className="text-sm font-semibold">Accepted by Aabhushan Crafts</dt><dd>{new Date(selected.acceptedAt).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kathmandu" })}</dd></div>}
            </dl>
            <section className="mt-6"><h3 className="font-display text-xl">Customer’s enquiry</h3><p className="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed">{selected.message || "The customer provided an attachment instead of a written description."}</p></section>
            {selected.media && <section className="mt-6"><h3 className="mb-3 font-display text-xl">Attached photo or video</h3><MediaPreview media={selected.media} /><p className="mt-2 break-words text-sm">{selected.media.name}</p></section>}
            {selected.voice && <section className="mt-6"><h3 className="mb-3 font-display text-xl">Customer’s voice note</h3><audio src={selected.voice.src} controls preload="metadata" className="w-full" /></section>}
            {!selected.voice && <section className="mt-6"><h3 className="mb-2 font-display text-xl">Demo audio preview</h3><p className="mb-3 text-sm">A short sample chime to demonstrate audio playback. This is not a customer recording.</p><audio src="/audio/clinic-demo.wav" controls preload="metadata" className="w-full" aria-label="Play demo chime" /></section>}
            {!selected.media && !selected.voice && <p className="mt-5 text-sm">No attachments provided.</p>}
          </div>
          <div className="shrink-0 border-t border-burgundy/20 p-5">
            {saveError && <p role="alert" className="mb-3">{saveError}</p>}
            {selected.status === "open" && <button onClick={() => update(acceptClinicRequest(requests ?? [], selected.id, "aabhushan"))} className="min-h-12 w-full rounded-full bg-burgundy px-5 py-3 font-semibold text-cream">Accept & raise ticket ↗</button>}
            {selected.status === "accepted" && <button onClick={() => update(resolveClinicRequest(requests ?? [], selected.id))} className="min-h-12 w-full rounded-full bg-burgundy px-5 py-3 font-semibold text-cream">Mark resolved</button>}
            {selected.status === "resolved" && <p role="status" className="font-semibold">This request has been resolved.</p>}
          </div>
        </>}
      </dialog>
    </main>
  );
}
