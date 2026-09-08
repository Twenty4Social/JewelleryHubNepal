"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import {
  MAX_CLINIC_MEDIA_BYTES,
  readClinicRequests,
  writeClinicRequests,
  type ClinicMedia,
  type ClinicRequest,
} from "@/lib/clinic";
import { Reveal } from "./reveal";

const copy = {
  en: {
    kicker: "Know your jewellery",
    title: "Questions about a piece you own?",
    body: "Care, repairs or purity questions. A jeweller’s physical inspection confirms authenticity.",
    one: "Share a clear photo or short video",
    two: "Explain it by text or voice",
    three: "A verified house accepts your case",
    upload: "Add photo or video",
    voice: "Record voice note",
    stop: "Stop recording",
    name: "Your name (required)",
    phone: "WhatsApp or phone (required)",
    message: "What happened, or what would you like checked?",
    submit: "Ask the clinic",
    required: "Add a message, attachment, or voice note so a jeweller can assess the request.",
    tooLarge: "Keep demo attachments under 2.5 MB.",
    saved: "Demo request saved in this browser. No request has been sent to a shop.",
    privacy: "Demo only: requests stay in this browser. Use sample contact details. Photos cannot confirm authenticity; a jeweller must physically inspect the piece.",
    admin: "Open Aabhushan admin demo",
  },
  np: {
    kicker: "आफ्नो गहना चिन्नुहोस्",
    title: "आफ्नो गहनाबारे प्रश्न छ?",
    body: "हेरचाह, मर्मत वा शुद्धताबारे सोध्नुहोस्। वास्तविकता पुष्टि गर्न पसलमा भौतिक जाँच आवश्यक छ।",
    one: "स्पष्ट फोटो वा छोटो भिडियो पठाउनुहोस्",
    two: "लेखेर वा आवाजमा समस्या भन्नुहोस्",
    three: "प्रमाणित पसलले केस स्वीकार्छ",
    upload: "फोटो वा भिडियो थप्नुहोस्",
    voice: "आवाज रेकर्ड गर्नुहोस्",
    stop: "रेकर्ड रोक्नुहोस्",
    name: "तपाईंको नाम (अनिवार्य)",
    phone: "WhatsApp वा फोन (अनिवार्य)",
    message: "के भयो वा के जाँच गर्न चाहनुहुन्छ?",
    submit: "क्लिनिकलाई सोध्नुहोस्",
    required: "पसलले बुझ्न सन्देश, फाइल वा आवाजमध्ये एउटा थप्नुहोस्।",
    tooLarge: "डेमो फाइल २.५ MB भन्दा सानो राख्नुहोस्।",
    saved: "डेमो अनुरोध यस ब्राउजरमा सुरक्षित भयो। पसलमा पठाइएको छैन।",
    privacy: "यो डेमो हो: अनुरोध यसै ब्राउजरमा रहन्छ। नमुना सम्पर्क विवरण प्रयोग गर्नुहोस्। फोटोबाट वास्तविकता पुष्टि हुँदैन; पसलमा भौतिक जाँच आवश्यक छ।",
    admin: "आभूषण एडमिन डेमो खोल्नुहोस्",
  },
};

function toDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function JewelleryClinic() {
  const { lang } = useLang();
  const c = copy[lang];
  const [media, setMedia] = useState<ClinicMedia>();
  const [voice, setVoice] = useState<ClinicMedia>();
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);

  useEffect(() => () => stream.current?.getTracks().forEach((track) => track.stop()), []);

  const chooseMedia = async (file?: File) => {
    setError("");
    if (!file) return;
    if (file.size > MAX_CLINIC_MEDIA_BYTES) return setError(c.tooLarge);
    setMedia({
      kind: file.type.startsWith("video/") ? "video" : "image",
      name: file.name,
      type: file.type,
      src: await toDataUrl(file),
    });
  };

  const startVoice = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Voice recording is not supported in this browser.");
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      recorder.current = new MediaRecorder(stream.current);
      recorder.current.ondataavailable = (event) => event.data.size && chunks.push(event.data);
      recorder.current.onstop = async () => {
        const blob = new Blob(chunks, { type: recorder.current?.mimeType || "audio/webm" });
        stream.current?.getTracks().forEach((track) => track.stop());
        if (blob.size > MAX_CLINIC_MEDIA_BYTES) setError(c.tooLarge);
        else setVoice({ kind: "voice", name: "voice-note.webm", type: blob.type, src: await toDataUrl(blob) });
      };
      recorder.current.start();
      setRecording(true);
    } catch {
      setError("Microphone permission is needed to record a voice note.");
    }
  };

  const stopVoice = () => {
    recorder.current?.stop();
    setRecording(false);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const message = String(form.get("message") ?? "").trim();
    if (!message && !media && !voice) return setError(c.required);

    const id = `request-${crypto.randomUUID()}`;
    const request: ClinicRequest = {
      id,
      customerName: String(form.get("name") ?? "").trim(),
      contact: String(form.get("contact") ?? "").trim(),
      message,
      media,
      voice,
      createdAt: new Date().toISOString(),
      status: "open",
    };
    if (!writeClinicRequests([request, ...readClinicRequests()])) return setError(c.tooLarge);

    event.currentTarget.reset();
    setMedia(undefined);
    setVoice(undefined);
    setConfirmation(id.slice(-8).toUpperCase());
  };

  return (
    <section id="clinic" className="mx-auto max-w-3xl px-6 py-10">
      <div className="overflow-hidden rounded-[2rem] border border-gold-light bg-paper shadow-[0_30px_90px_rgba(94,31,38,0.09)]">
        <div className="grid">
          <Reveal delay={0.08} className="flex flex-col justify-center p-6 md:p-10">
            <details open className="group" onToggle={(event) => { if (!event.currentTarget.open && recording) stopVoice(); }}>
              <summary className="cursor-pointer rounded-xl border border-burgundy px-5 py-4 text-lg font-semibold text-burgundy">{lang === "np" ? "गहनाबारे सोध्नुहोस् — डेमो" : "Get jewellery advice — demo"}</summary>
            <form onSubmit={submit} className="mt-6 space-y-5">
              <p className="rounded-xl border border-gold-light bg-cream p-4 text-base leading-7 text-muted">{c.privacy}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-muted">{c.name}</span>
                  <input name="name" autoComplete="name" required className="w-full rounded-xl border border-gold-light bg-pure px-4 py-3 text-base outline-none transition focus:border-burgundy" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-muted">{c.phone}</span>
                  <input name="contact" type="tel" autoComplete="tel" required inputMode="tel" className="w-full rounded-xl border border-gold-light bg-pure px-4 py-3 text-base outline-none transition focus:border-burgundy" />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-muted">{c.message}</span>
                <textarea name="message" rows={4} className="w-full resize-y rounded-xl border border-gold-light bg-pure px-4 py-3 text-base leading-6 outline-none transition focus:border-burgundy" />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="group flex cursor-pointer focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-burgundy items-center justify-center gap-3 rounded-xl border border-dashed border-gold bg-gold/5 px-4 py-4 text-sm font-semibold text-burgundy transition hover:bg-gold/10">
                  <span aria-hidden className="text-lg">＋</span>{c.upload}
                  <input type="file" accept="image/*,video/*" className="sr-only" onChange={(event) => void chooseMedia(event.target.files?.[0])} />
                </label>
                <button
                  type="button"
                  onClick={recording ? stopVoice : () => void startVoice()}
                  className={`flex items-center justify-center gap-3 rounded-xl border px-4 py-4 text-sm font-semibold transition ${recording ? "border-fall bg-fall text-pure" : "border-gold-light bg-pure text-burgundy hover:border-gold"}`}
                >
                  <span aria-hidden>{recording ? "■" : "●"}</span>{recording ? c.stop : c.voice}
                </button>
              </div>

              {(media || voice) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {media && (
                    <div className="relative overflow-hidden rounded-xl border border-gold-light bg-pure p-2">
                      {media.kind === "image" ? (
                        <div className="relative aspect-video overflow-hidden rounded-lg"><Image src={media.src} alt="Jewellery attachment preview" fill unoptimized className="object-cover" /></div>
                      ) : (
                        <video src={media.src} controls className="aspect-video w-full rounded-lg object-cover" />
                      )}
                      <button type="button" onClick={() => setMedia(undefined)} aria-label="Remove attachment" className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-ink text-pure">×</button>
                    </div>
                  )}
                  {voice && <div className="flex items-center rounded-xl border border-gold-light bg-pure p-4"><audio src={voice.src} controls className="w-full" /></div>}
                </div>
              )}

              {error && <p role="alert" className="text-base text-fall">{error}</p>}
              {confirmation && (
                <motion.p role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-rise/10 px-4 py-3 text-base text-rise">
                  {c.saved} <b>Request {confirmation}</b>
                </motion.p>
              )}

              <button type="submit" className="w-full rounded-full bg-ink px-6 py-4 text-sm font-semibold text-pure transition hover:bg-burgundy">
                {c.submit} <span aria-hidden>↗</span>
              </button>
              <div className="flex flex-col justify-between gap-2 text-sm leading-5 text-muted sm:flex-row">
                <p className="max-w-md">{c.tooLarge}</p>
                <Link href="/admin/aabhushan" className="shrink-0 font-semibold text-burgundy underline-offset-4 hover:underline">{c.admin} →</Link>
              </div>
            </form>
            </details>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
