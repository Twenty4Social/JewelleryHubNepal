"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function PartnerDemo() {
  const { lang } = useLang();
  const steps = lang === "np" ? [
    ["आफ्नो पसल चिनाउनुहोस्", "आफ्नै पृष्ठमा डिजाइन देखाउनुहोस्। ग्राहकले तपाईंको पसल र सङ्ग्रह सजिलै भेट्छन्।"],
    ["ग्राहकसँग सिधै कुरा गर्नुहोस्", "ग्राहकले मनपरेको डिजाइन छानेर उपलब्धता र पूरा मूल्य सोध्छन्।"],
    ["सेवाका अनुरोध सम्हाल्नुहोस्", "गहना क्लिनिकका प्रश्न स्वीकार गर्नुहोस्, टिकट बनाउनुहोस् र समाधानको स्थिति राख्नुहोस्।"],
  ] : [
    ["A home for your shop", "Show your designs on a dedicated page. Help customers discover your shop and collection."],
    ["Direct customer conversations", "Customers choose a design and ask your shop about availability and the full price."],
    ["A clear service queue", "Accept jewellery-care questions, raise a ticket and keep track of the resolution."],
  ];
  return <section className="mx-auto max-w-6xl px-6 py-12">
    <div className="grid gap-8 md:grid-cols-3">{steps.map(([title, body], i) => <article key={title} className="border-t border-burgundy/30 pt-5"><p className="font-display text-3xl text-burgundy">0{i + 1}</p><h2 className="mt-4 font-display text-2xl text-burgundy">{title}</h2><p className="mt-3 text-base leading-7">{body}</p></article>)}</div>
    <div className="mt-12 rounded-2xl border border-burgundy/30 p-6 md:p-8">
      <h2 className="font-display text-3xl text-burgundy">{lang === "np" ? "आफैँ डेमो चलाएर हेर्नुहोस्" : "Try the experience yourself"}</h2>
      <p className="mt-3 max-w-2xl text-base">{lang === "np" ? "ग्राहकको नजरबाट पसल हेर्नुहोस्, वा आभूषणको नमुना सेवा डेस्क खोल्नुहोस्।" : "See a shop through a customer’s eyes, then open the sample Aabhushan service desk."}</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/shops/aabhushan" className="inline-flex min-h-12 items-center rounded-full bg-burgundy px-6 py-3 font-semibold text-cream">{lang === "np" ? "पसलको अनुभव हेर्नुहोस्" : "View a shop experience"} →</Link><Link href="/admin/aabhushan" className="inline-flex min-h-12 items-center rounded-full border border-burgundy px-6 py-3 font-semibold text-burgundy">{lang === "np" ? "पसलको सेवा डेस्क खोल्नुहोस्" : "Open the jeweller demo desk"} →</Link></div>
      <p className="mt-5 text-sm">{lang === "np" ? "डेमोमा नमुना प्रोफाइल र सम्पर्क विवरण छन्। क्लिनिकका अनुरोध यही ब्राउजरमा मात्र सुरक्षित हुन्छन्।" : "Demo profiles and contact details. Clinic requests are saved only in this browser."}</p>
      <Link href="/know-your-jewellery" className="mt-3 inline-flex min-h-12 items-center font-semibold text-burgundy underline underline-offset-4">{lang === "np" ? "पहिले नमुना क्लिनिक प्रश्न पठाउनुहोस्" : "Start with a sample clinic question"} →</Link>
    </div>
  </section>;
}
