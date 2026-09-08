"use client";

import { MotionConfig } from "framer-motion";
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
  "nav.discover": "Browse jewellery",
  "nav.jewellers": "Find a shop",
  "nav.collections": "Collections",
  "nav.predictions": "Market",
  "nav.news": "Newsroom",
  "nav.clinic": "Jewellery help",
  "nav.admin": "Admin Demo",
  "nav.forJewellers": "For Jewellers",

  "hero.eyebrow": "From Nepal’s jewellers",
  "hero.title.a": "Nepal’s",
  "hero.title.b": "Jewellery",
  "hero.title.c": "in one place.",
  "hero.sub":
    "Local shops. Jewellery you’ll love.",
  "hero.placeholder":
    "Try “gold necklace” or “silver ring”",
  "hero.ask": "Search",
  "hero.trust": "Browse at your own pace · Ask the shop before buying",
  "hero.searching": "Finding jewellery for you…",
  "hero.error": "Search is temporarily unavailable. Please try again.",
  "hero.powered": "Suggested matches. Confirm price and availability with the shop.",
  "hero.fallback": "Matches from our catalogue. Confirm price and availability with the shop.",

  "chip.1": "Gold necklaces",
  "chip.2": "Jhumka earrings",
  "chip.3": "Silver rings",
  "chip.4": "Bridal jewellery",
  "chip.5": "Bridal tilhari set with matching earrings",
  "chip.6": "Rose gold tennis bracelet for a gift",

  "cats.kicker": "From the collections",
  "cats.title": "Discover jewellery",
  "cats.piece": "piece",
  "cats.pieces": "pieces",

  "shops.kicker": "Verified houses of the hub",
  "shops.title": "Featured shops",
  "shops.chat": "Chat on WhatsApp",
  "shops.viewAll": "Become a verified house",
  "shops.verified": "Verified House",

  "edit.kicker": "For your family’s celebrations",
  "edit.title": "Jewellery for the wedding",
  "edit.npTitle": "शुभ अवसर",
  "edit.body":
    "Explore tilhari, bridal sets and ceremonial pieces. Open a piece to check its details before speaking with the shop.",
  "edit.cta": "Check gold & silver rates",

  "pred.kicker": "Official Nepal market rates",
  "pred.title": "Gold & silver outlook",
  "pred.sub":
    "Recent movement per tola. Future prices are uncertain.",
  "pred.previous": "versus previous published rate",
  "pred.badge.rising": "Up",
  "pred.badge.cooling": "Down",
  "pred.badge.steady": "Unchanged",
  "pred.disclaimer":
    "Official reference rates; jewellery prices may include labour, stones and shop margins. Source:",
  "market.unavailable": "Live rates are temporarily unavailable",
  "market.source": "Rates supplied by FENEGOSIDA",

  "news.kicker": "From the world of jewellery",
  "news.title": "From the jewellery world",
  "news.sub":
    "Explore jewellery design, craftsmanship and market stories. Each headline opens the publisher’s full article.",
  "news.readMore": "Read at source",
  "news.disclaimer": "Live publisher feeds; each card opens the original article.",
  "news.unavailable": "Live headlines are temporarily unavailable.",

  "how.kicker": "Three steps to the perfect piece",
  "how.title": "How It Works",
  "how.1.t": "Choose a piece",
  "how.1.d":
    "Browse the photos or search by jewellery type. Open a piece to see its price, metal and weight.",
  "how.2.t": "Talk to the shop",
  "how.2.d":
    "Use the WhatsApp button to ask about availability, the final price and a visit to the shop.",
  "how.3.t": "Check before buying",
  "how.3.d":
    "Inspect the jewellery in person. Ask about purity, making charges, a bill and the exchange policy.",

  "join.kicker": "For Jewellers",
  "join.title": "Help more customers find your shop.",
  "join.body":
    "List your collection. Connect with customers directly.",
  "join.cta": "List Your Shop ✦",

  "footer.tagline": "Every jewellery story, one conversation.",
  "footer.rights": "© 2026 Jewellery Hub Nepal · Concept build",
};

const np: Dict = {
  "nav.discover": "गहना हेर्नुहोस्",
  "nav.jewellers": "पसल खोज्नुहोस्",
  "nav.collections": "सङ्ग्रह",
  "nav.predictions": "बजार",
  "nav.news": "समाचार",
  "nav.clinic": "गहनाबारे सहयोग",
  "nav.admin": "एडमिन डेमो",
  "nav.forJewellers": "पसलका लागि",

  "hero.eyebrow": "नेपालका गहना घरबाट",
  "hero.title.a": "नेपालका",
  "hero.title.b": "गहना",
  "hero.title.c": "एकै ठाउँमा।",
  "hero.sub":
    "स्थानीय पसल चिन्नुहोस्। मनपर्ने गहना छान्नुहोस्।",
  "hero.placeholder":
    "जस्तै: “सुनको माला” वा “चाँदीको औंठी”",
  "hero.ask": "खोज्नुहोस्",
  "hero.trust": "फुर्सदमा गहना छान्नुहोस् · किन्नुअघि पसललाई सोध्नुहोस्",
  "hero.searching": "तपाईंका लागि गहना खोज्दैछौँ…",
  "hero.error": "खोजी अहिले उपलब्ध छैन। फेरि प्रयास गर्नुहोस्।",
  "hero.powered": "मिल्दाजुल्दा गहना। मूल्य र उपलब्धता पसलसँग पुष्टि गर्नुहोस्।",
  "hero.fallback": "क्याटलगमा भेटिएका गहना। मूल्य र उपलब्धता पसलसँग पुष्टि गर्नुहोस्।",

  "chip.1": "सुनको माला",
  "chip.2": "झुम्का",
  "chip.3": "चाँदीको औंठी",
  "chip.4": "विवाहका गहना",
  "chip.5": "बुटीसहितको दुलही तिलहरी सेट",
  "chip.6": "उपहारका लागि रोज गोल्ड टेनिस ब्रेसलेट",

  "cats.kicker": "वर्ग अनुसार खोज्नुहोस्",
  "cats.title": "सूची",
  "cats.piece": "गहना",
  "cats.pieces": "गहना",

  "shops.kicker": "हबका प्रमाणित घरहरू",
  "shops.title": "विशेष पसलहरू",
  "shops.chat": "WhatsApp मा कुरा गर्नुहोस्",
  "shops.viewAll": "प्रमाणित गहना घर बन्नुहोस्",
  "shops.verified": "प्रमाणित घर",

  "edit.kicker": "परिवारका शुभ अवसरका लागि",
  "edit.title": "विवाहका लागि गहना",
  "edit.npTitle": "शुभ अवसर",
  "edit.body":
    "तिलहरी, दुलहीका सेट र शुभ अवसरका गहना हेर्नुहोस्। पसलसँग कुरा गर्नुअघि गहनाको विवरण खोल्नुहोस्।",
  "edit.cta": "सुन र चाँदीको दर हेर्नुहोस्",

  "pred.kicker": "नेपालको आधिकारिक बजार दर",
  "pred.title": "सुन र चाँदीको बजार अवस्था",
  "pred.sub":
    "प्रति तोला दरमा पछिल्लो परिवर्तन। भविष्यको मूल्य निश्चित हुँदैन।",
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
    "गहनाको डिजाइन, शिल्प र बजारका समाचार पढ्नुहोस्। शीर्षकमा थिच्दा प्रकाशकको पूरा लेख खुल्छ।",
  "news.readMore": "स्रोतमा पढ्नुहोस्",
  "news.disclaimer": "प्रत्यक्ष प्रकाशक फिड; कार्डले मूल लेख खोल्छ।",
  "news.unavailable": "प्रत्यक्ष समाचार अहिले उपलब्ध छैन।",

  "how.kicker": "राम्रो गहनाका तीन चरण",
  "how.title": "कसरी काम गर्छ?",
  "how.1.t": "गहना छान्नुहोस्",
  "how.1.d": "फोटो हेर्नुहोस् वा गहनाको प्रकार लेखेर खोज्नुहोस्। मूल्य, धातु र तौल हेर्न गहना खोल्नुहोस्।",
  "how.2.t": "पसलसँग कुरा गर्नुहोस्",
  "how.2.d":
    "WhatsApp बाट उपलब्धता, अन्तिम मूल्य र पसल जाने समय सोध्नुहोस्।",
  "how.3.t": "किन्नुअघि जाँच्नुहोस्",
  "how.3.d": "पसलमै गहना हेर्नुहोस्। शुद्धता, ज्याला, बिल र साट्ने नियमबारे सोध्नुहोस्।",

  "join.kicker": "पसलका लागि",
  "join.title": "आफ्नो पसललाई थप ग्राहकसम्म पुर्‍याउनुहोस्।",
  "join.body":
    "आफ्ना गहना देखाउनुहोस्। ग्राहकसँग सिधै जोडिनुहोस्।",
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

  return <Ctx.Provider value={value}><MotionConfig reducedMotion="user">{children}</MotionConfig></Ctx.Provider>;
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
