"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "en" | "np";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.discover": "Discover",
  "nav.jewellers": "Jewellers",
  "nav.collections": "Collections",
  "nav.predictions": "Market",
  "nav.news": "Newsroom",
  "nav.forJewellers": "For Jewellers",

  "hero.eyebrow": "Est. 2026 · Kathmandu · Every jeweller under one roof",
  "hero.title.a": "Every jeweller in Nepal,",
  "hero.title.b": "one conversation.",
  "hero.sub":
    "Describe the piece you’re dreaming of. Our AI searches every verified shop in the hub — then connects you straight to the jeweller.",
  "hero.placeholder":
    "Try: “a 925 silver bracelet for a wedding under Rs 15,000…”",
  "hero.ask": "Ask ✦",
  "hero.trust": "Verified jewellers only · No on-site payments · Direct WhatsApp",
  "hero.searching": "Searching every verified house with Gemini… ✦",
  "hero.error": "Search is temporarily unavailable. Please try again.",
  "hero.powered": "Ranked by Gemini 3.6 Flash · Organic relevance only",
  "hero.fallback": "Catalog fallback · Add GEMINI_API_KEY to enable AI ranking",

  "chip.1": "Antique-finish Lakshmi coin pendant in gold plate",
  "chip.2": "Jhumkas for Teej under Rs 5,000",
  "chip.3": "Minimal silver ring for daily office wear",
  "chip.4": "Custom name pendant handcrafted in Patan",
  "chip.5": "Bridal tilhari set with matching earrings",
  "chip.6": "Rose gold tennis bracelet for a gift",

  "cats.kicker": "Browse by category",
  "cats.title": "The Catalogue",
  "cats.piece": "piece",
  "cats.pieces": "pieces",

  "shops.kicker": "Verified houses of the hub",
  "shops.title": "Featured Jewellers",
  "shops.chat": "Chat on WhatsApp",
  "shops.viewAll": "Become a verified house",
  "shops.verified": "Verified House",
  "shops.founding": "Founding House",

  "edit.kicker": "The Collection Edit · № 01",
  "edit.title": "The Wedding Edit",
  "edit.npTitle": "शुभ अवसर",
  "edit.body":
    "Curated pieces for the season’s ceremonies, chosen from every house in the hub — from tilhari sets to groom’s chains.",
  "edit.cta": "Explore the Edit",

  "pred.kicker": "Official Nepal market rates",
  "pred.title": "Gold & Silver Market Pulse",
  "pred.sub":
    "Latest published per-tola rates and recent movement from Nepal's trade federation.",
  "pred.previous": "versus previous published rate",
  "pred.badge.rising": "Up",
  "pred.badge.cooling": "Down",
  "pred.badge.steady": "Unchanged",
  "pred.disclaimer":
    "Official reference rates; jewellery prices may include labour, stones and shop margins. Source:",
  "market.unavailable": "Live rates are temporarily unavailable",
  "market.source": "Rates supplied by FENEGOSIDA",

  "news.kicker": "From the world of jewellery",
  "news.title": "Global Newsroom",
  "news.sub":
    "Latest publisher-original headlines, refreshed hourly from live RSS feeds.",
  "news.readMore": "Read at source",
  "news.disclaimer": "Live publisher feeds; each card opens the original article.",
  "news.unavailable": "Live headlines are temporarily unavailable.",

  "how.kicker": "Three steps to the perfect piece",
  "how.title": "How It Works",
  "how.1.t": "Describe It",
  "how.1.d":
    "Tell the AI the occasion, metal, budget and mood — as you’d tell a friend.",
  "how.2.t": "Discover It",
  "how.2.d":
    "We search every verified jeweller in the hub. Fair results — never pay-to-win.",
  "how.3.t": "Claim It",
  "how.3.d":
    "One tap opens WhatsApp with the jeweller directly. No middlemen, no markup.",

  "join.kicker": "For Jewellers",
  "join.title": "Bring your craft to the capital of discovery.",
  "join.body":
    "Join Aabhushan Crafts and Nepal's next verified houses. List free and keep selling through WhatsApp exactly as you do today.",
  "join.cta": "List Your Shop ✦",

  "footer.tagline": "Every jeweller, one conversation.",
  "footer.rights": "© 2026 Jewellery Hub Nepal · Concept build",
};

const np: Dict = {
  "nav.discover": "खोज्नुहोस्",
  "nav.jewellers": "गहना घर",
  "nav.collections": "सङ्ग्रह",
  "nav.predictions": "बजार",
  "nav.news": "समाचार",
  "nav.forJewellers": "पसलका लागि",

  "hero.eyebrow": "स्था. २०२६ · काठमाडौँ · सबै गहना घर एकै छतमुनि",
  "hero.title.a": "नेपालका सबै गहना घर,",
  "hero.title.b": "एकै कुराकानीमा।",
  "hero.sub":
    "आफ्नो मनको गहना वर्णन गर्नुहोस्। हाम्रो AI ले हबका सबै प्रमाणित पसल खोज्छ — अनि तपाईंलाई सिधै पसलसँग जोड्छ।",
  "hero.placeholder":
    "उदाहरण: “विवाहका लागि रु. १५,००० भित्रको ९२५ चाँदीको ब्रेसलेट…”",
  "hero.ask": "सोध्नुहोस् ✦",
  "hero.trust": "प्रमाणित पसल मात्र · साइटमा भुक्तानी छैन · सिधै WhatsApp",
  "hero.searching": "Gemini ले सबै प्रमाणित पसल खोज्दैछ… ✦",
  "hero.error": "खोजी अहिले उपलब्ध छैन। फेरि प्रयास गर्नुहोस्।",
  "hero.powered": "Gemini 3.6 Flash द्वारा क्रमबद्ध · निष्पक्ष नतिजा मात्र",
  "hero.fallback": "क्याटलग खोजी · AI का लागि GEMINI_API_KEY थप्नुहोस्",

  "chip.1": "सुनको प्लेटमा पुरानो शैलीको लक्ष्मी लोकेट",
  "chip.2": "तीजका लागि रु. ५,००० भित्रका झुम्का",
  "chip.3": "दैनिक लगाउन मिल्ने सानो चाँदीको औंठी",
  "chip.4": "पाटनमा हस्तनिर्मित नामको लोकेट",
  "chip.5": "बुटीसहितको दुलही तिलहरी सेट",
  "chip.6": "उपहारका लागि रोज गोल्ड टेनिस ब्रेसलेट",

  "cats.kicker": "वर्ग अनुसार खोज्नुहोस्",
  "cats.title": "सूची",
  "cats.piece": "गहना",
  "cats.pieces": "गहना",

  "shops.kicker": "हबका प्रमाणित घरहरू",
  "shops.title": "विशेष गहना घर",
  "shops.chat": "WhatsApp मा कुरा गर्नुहोस्",
  "shops.viewAll": "प्रमाणित गहना घर बन्नुहोस्",
  "shops.verified": "प्रमाणित घर",
  "shops.founding": "संस्थापक घर",

  "edit.kicker": "सङ्ग्रह · № ०१",
  "edit.title": "द वेडिङ एडिट",
  "edit.npTitle": "शुभ अवसर",
  "edit.body":
    "यस सिजनका ठूला अवसरका लागि हबका सबै घरबाट छानिएका गहना — तिलहरी सेटदेखि बूढाको चेनसम्म।",
  "edit.cta": "सङ्ग्रह हेर्नुहोस्",

  "pred.kicker": "नेपालको आधिकारिक बजार दर",
  "pred.title": "सुन र चाँदी बजार पल्स",
  "pred.sub":
    "नेपालको व्यापार महासङ्घले प्रकाशित गरेको प्रति तोला दर र पछिल्लो परिवर्तन।",
  "pred.previous": "अघिल्लो प्रकाशित दरको तुलनामा",
  "pred.badge.rising": "उकालो",
  "pred.badge.cooling": "ओरालो",
  "pred.badge.steady": "स्थिर",
  "pred.disclaimer": "आधिकारिक सन्दर्भ दर; ज्याला, रत्न र पसलको मार्जिन थपिन सक्छ। स्रोत:",
  "market.unavailable": "प्रत्यक्ष बजार दर अहिले उपलब्ध छैन",
  "market.source": "FENEGOSIDA बाट प्राप्त बजार दर",

  "news.kicker": "गहना संसारका कुरा",
  "news.title": "विश्व समाचार",
  "news.sub":
    "प्रकाशकका मौलिक शीर्षकहरू, प्रत्यक्ष RSS फिडबाट हरेक घण्टा अद्यावधिक।",
  "news.readMore": "स्रोतमा पढ्नुहोस्",
  "news.disclaimer": "प्रत्यक्ष प्रकाशक फिड; कार्डले मूल लेख खोल्छ।",
  "news.unavailable": "प्रत्यक्ष समाचार अहिले उपलब्ध छैन।",

  "how.kicker": "राम्रो गहनाका तीन चरण",
  "how.title": "कसरी काम गर्छ?",
  "how.1.t": "वर्णन गर्नुहोस्",
  "how.1.d": "अवसर, धातु, बजेट र स्वाद साथीलाई भनेझैं AI लाई भन्नुहोस्।",
  "how.2.t": "खोज्नुहोस्",
  "how.2.d":
    "हबका सबै प्रमाणित पसल खोजिन्छ। निष्पक्ष नतिजा — पैसाले किनिएको होइन।",
  "how.3.t": "पाउनुहोस्",
  "how.3.d": "एक क्लिकमा पसलसँग सिधै WhatsApp खुल्छ। न दलाल, न थप भाउ।",

  "join.kicker": "पसलका लागि",
  "join.title": "आफ्नो कलालाई खोज्ने राजधानीमा ल्याउनुहोस्।",
  "join.body":
    "आभूषण क्राफ्ट्स र नेपालका आगामी प्रमाणित घरहरूसँग जोडिनुहोस्। निःशुल्क सूची र आजकै झैं WhatsApp बिक्री।",
  "join.cta": "पसल दर्ता गर्नुहोस् ✦",

  "footer.tagline": "सबै गहना घर, एकै कुराकानीमा।",
  "footer.rights": "© २०२६ ज्वेलरी हब नेपाल · कन्सेप्ट",
};

const dicts: Record<Lang, Dict> = { en, np };

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = "jhn-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let timer = 0;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "np" || saved === "en") timer = window.setTimeout(() => setLangState(saved), 0);
    } catch {
      /* private mode */
    }
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "np" ? "ne" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (k: string) => dicts[lang][k] ?? dicts.en[k] ?? k,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

/** Pick a localized field from a data record shaped { en, np } */
export function pick(lang: Lang, field: { en: string; np: string }): string {
  return lang === "np" ? field.np : field.en;
}
