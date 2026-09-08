"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    return <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream"><Image src={media.src} alt={media.name} fill unoptimized={media.src.startsWith("data:")} className="object-cover" /></div>;
  }
  return <video src={media.src} controls className="aspect-[4/3] w-full rounded-2xl bg-ink object-cover" />;
}

export default function AabhushanAdminPage() {
  const [requests, setRequests] = useState<ClinicRequest[] | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setRequests(readClinicRequests()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const update = (next: ClinicRequest[]) => {
    if (writeClinicRequests(next)) setRequests(next);
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
                {request.status === "accepted" && (
                  <button onClick={() => update(resolveClinicRequest(requests ?? [], request.id))} className="shrink-0 rounded-full border border-burgundy px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-burgundy transition hover:bg-burgundy hover:text-paper">Mark resolved</button>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
