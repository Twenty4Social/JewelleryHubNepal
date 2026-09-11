"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

// Traditional associations; styling ideas are editorial, not catalogue availability.
const signs = [
  ["Aries · Mesh", "मेष", "Red coral", "रातो मुगा", "A coral-coloured pendant on a simple chain.", "सादा सिक्रीमा मुगा रङको लकेट।"],
  ["Taurus · Vrishabh", "वृष", "Diamond", "हीरा", "Small diamond studs for an understated everyday look.", "दैनिक पहिरनका लागि साना हीराका टप।"],
  ["Gemini · Mithun", "मिथुन", "Emerald", "पन्ना", "An emerald pendant with a clean, simple setting.", "सरल डिजाइनमा पन्नाको लकेट।"],
  ["Cancer · Karkat", "कर्कट", "Pearl", "मोती", "Pearl earrings or a single-strand necklace.", "मोतीका झुम्का वा एक लहरको माला।"],
  ["Leo · Simha", "सिंह", "Ruby", "माणिक", "A ruby centrepiece in a ring or pendant.", "बीचमा माणिक जडिएको औँठी वा लकेट।"],
  ["Virgo · Kanya", "कन्या", "Emerald", "पन्ना", "Small emerald earrings with a delicate outline.", "नाजुक डिजाइनका साना पन्नाका टप।"],
  ["Libra · Tula", "तुला", "Diamond", "हीरा", "A fine diamond pendant that layers with your favourite chain.", "मनपर्ने सिक्रीसँग लगाउन मिल्ने सानो हीराको लकेट।"],
  ["Scorpio · Vrishchik", "वृश्चिक", "Red coral", "रातो मुगा", "Coral-coloured beads as an accent in a necklace.", "मालामा आकर्षण थप्ने मुगा रङका दाना।"],
  ["Sagittarius · Dhanu", "धनु", "Yellow sapphire", "पुखराज", "A yellow sapphire pendant with a warm gold setting.", "सुनको डिजाइनमा पुखराजको लकेट।"],
  ["Capricorn · Makar", "मकर", "Blue sapphire", "नीलम", "A blue sapphire ring with a simple band.", "सादा ब्यान्डमा नीलम जडिएको औँठी।"],
  ["Aquarius · Kumbha", "कुम्भ", "Blue sapphire", "नीलम", "A geometric blue sapphire pendant for a distinctive detail.", "फरक शैलीका लागि ज्यामितीय आकारको नीलम लकेट।"],
  ["Pisces · Meen", "मीन", "Yellow sapphire", "पुखराज", "Small yellow sapphire earrings for a soft touch of colour.", "हल्का रङ थप्न साना पुखराजका टप।"],
];

export default function RashiJewellery() {
  const { lang } = useLang();
  const np = lang === "np";
  const [selected, setSelected] = useState(0);
  const sign = signs[selected];

  return <section id="rashi" aria-labelledby="rashi-title" className="mx-auto max-w-6xl px-6 py-12">
    <div className="grid overflow-hidden rounded-2xl border border-burgundy/25 md:grid-cols-2">
      <div className="bg-burgundy p-6 text-cream md:p-10">
        <p className="text-sm font-semibold text-champagne">{np ? "परम्पराबाट प्रेरित" : "Inspired by tradition"}</p>
        <h2 id="rashi-title" className="mt-3 font-display text-3xl leading-tight md:text-4xl">{np ? "तपाईंको राशि, तपाईंको गहना" : "Your Rashi. Your jewellery."}</h2>
        <p className="mt-4 text-lg">{np ? "आफ्नो राशिसँग जोडिएको रत्न र लगाउने शैली हेर्नुहोस्।" : "Discover a gemstone associated with your sign, and a way to wear it."}</p>
        <label htmlFor="rashi-sign" className="mt-7 block font-semibold">{np ? "आफ्नो राशि छान्नुहोस्" : "Choose your Rashi"}</label>
        <select id="rashi-sign" value={selected} onChange={event => setSelected(Number(event.target.value))} className="mt-2 min-h-12 w-full rounded-lg border border-cream bg-cream px-4 py-3 text-base text-burgundy">
          {signs.map((item, index) => <option key={item[0]} value={index}>{np ? item[1] : `${item[0]} · ${item[1]}`}</option>)}
        </select>
        <p className="mt-3 text-sm">{np ? "कुण्डलीमा भएको राशि रोज्नुहोस्। यहाँ जन्ममितिबाट राशि गणना गरिँदैन।" : "Use the Rashi in your birth chart. This guide does not calculate it from your birthday."}</p>
      </div>
      <div className="flex flex-col justify-center p-6 text-burgundy md:p-10">
        <div role="status" aria-atomic="true">
          <p className="text-sm font-semibold">{np ? `${sign[1]} · परम्परागत रत्न` : `${sign[0]} · Traditional gemstone`}</p>
          <h3 className="mt-3 font-display text-4xl">{np ? sign[3] : sign[2]}</h3>
          <p className="mt-5 text-sm font-semibold">{np ? "लगाउने शैलीको सुझाव" : "A styling idea"}</p>
          <p className="mt-2 text-lg leading-relaxed">{np ? sign[5] : sign[4]}</p>
        </div>
        <Link href="/shops" className="mt-6 inline-flex min-h-12 items-center self-start rounded-full border border-burgundy px-6 py-3 font-semibold">{np ? "पसलसँग विकल्प बुझ्नुहोस्" : "Explore options with a shop"} →</Link>
        <p className="mt-4 text-sm">{np ? "नमुना शैलीका सुझाव। रत्नको उपलब्धता पसलसँग बुझ्नुहोस्।" : "Sample styling ideas. Confirm gemstone availability with the shop."}</p>
      </div>
    </div>
    <p className="mt-4 max-w-4xl text-sm leading-relaxed text-burgundy">{np ? "यी सांस्कृतिक मान्यता हुन्, स्वास्थ्य वा भाग्य बदल्ने वैज्ञानिक प्रमाण होइनन्। परम्पराअनुसार सुझाव फरक हुन सक्छन्; यो व्यक्तिगत ज्योतिषीय सल्लाह होइन।" : "These are cultural associations, not scientifically proven effects on health or luck. Traditions vary; this is not a personal astrological recommendation."}</p>
    <p className="mt-2 text-sm text-burgundy">{np ? "सन्दर्भ: " : "References: "}<a href="https://www.gemstoneuniverse.com/luckygemsbyrashi.html" className="underline underline-offset-4">{np ? "परम्परागत राशि–रत्न सम्बन्ध" : "Traditional Rashi associations"}</a> · <a href="https://4cs.gia.edu/en-us/blog/zodiac-inspired-jewelry/" className="underline underline-offset-4">{np ? "GIA: राशिबाट प्रेरित गहना" : "GIA: Zodiac-inspired jewellery"}</a></p>
  </section>;
}
