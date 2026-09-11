import { products, shops } from "./data.ts";
import type { Lang } from "./i18n";

const devanagariDigits = "०१२३४५६७८९";

const normalize = (value: string) =>
  value
    .replace(/[०-९]/g, (digit) => String(devanagariDigits.indexOf(digit)))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export function localSearch(query: string, lang: Lang = "en", previousQueries: string[] = [], previousIds: string[] = []) {
  const ordinal = [/\bfirst\b|पहिलो/i, /\bsecond\b|दोस्रो/i, /\bthird\b|तेस्रो/i, /\bfourth\b|चौथो/i, /\bfifth\b|पाँचौँ/i].findIndex(pattern => pattern.test(query));
  const selected = products.find(product => product.id === previousIds[/\blast\b|अन्तिम/i.test(query) ? previousIds.length - 1 : ordinal]);
  if (selected) {
    const shop = shops.find(item => item.id === selected.shopId)!;
    return { productIds: [selected.id], message: lang === "np" ? `${selected.title.np}, ${shop.name.np} को नमुना डिजाइन हो। मूल्य, तौल र शुद्धता पसलसँग पुष्टि गर्नुपर्छ। यस्तै अरू डिजाइन हेर्नुहुन्छ?` : `${selected.title.en} is a sample design from ${shop.name.en}. The shop needs to confirm its price, weight and purity. Would you like to compare similar designs?` };
  }
  const conversation = [...previousQueries, query];
  const categoryPatterns: [string, RegExp][] = [
    ["rings", /\bring(s)?\b|औंठी|औँठी/i], ["earrings", /earring|jhumka|झुम्का|झुम्के|कानको/i],
    ["necklaces", /necklace|choker|mala|हार|माला/i], ["bracelets", /bracelet|bangle|चुरा|बाला/i], ["sets", /\bsets?\b|सेट/i],
  ];
  const category = [...conversation].reverse().map(text => categoryPatterns.find(([, pattern]) => pattern.test(text))?.[0]).find(Boolean);
  const collection = [...conversation].reverse().map(text => /silver|चाँदी|चांदी/i.test(text) ? "silver" : /diamond|हीरा|हिरा/i.test(text) ? "diamond" : undefined).find(Boolean);
  const shopMention = [...conversation].reverse().map(text => /any shop|all shops|सबै पसल|जुनसुकै पसल/i.test(text) ? "all" : shops.find(shop => normalize(text).includes(normalize(shop.name.en)) || normalize(text).includes(normalize(shop.name.np)))?.id).find(Boolean);
  const shopId = shopMention === "all" ? undefined : shopMention;
  const normalized = normalize(conversation.join(" "));
  const tokens = normalized.split(" ").filter((token) => token.length > 1);
  const numbers = normalized.match(/\d[\d,]*/g)?.map((value) => Number(value.replaceAll(",", ""))) ?? [];
  const budget = /(under|below|within|less than|भित्र|सम्म)/i.test(query)
    ? Math.max(0, ...numbers.filter((value) => value >= 1000))
    : 0;

  const ranked = products.filter(product => (!collection || product.collection === collection) && (!category || product.category === category) && (!shopId || product.shopId === shopId)).map((product) => {
    const shop = shops.find((item) => item.id === product.shopId);
    const haystack = normalize([
      product.title.en,
      product.title.np,
      product.metal,
      product.collection,
      product.category,
      product.occasion.en,
      product.occasion.np,
      shop?.name.en,
      shop?.name.np,
      shop?.city.en,
      shop?.city.np,
      shop?.specialty.en,
      shop?.specialty.np,
    ].filter(Boolean).join(" "));
    const matches = tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
    const budgetScore = budget && product.priceMin > 0 ? (product.priceMin <= budget ? 3 : -4) : 0;
    return { id: product.id, score: matches + budgetScore };
  }).sort((a, b) => b.score - a.score);

  const positive = ranked.filter((item) => item.score > 0).slice(0, 5);
  const question = /everyday|daily|wedding|bridal|gift|दैनिक|विवाह|उपहार/i.test(query)
    ? (lang === "np" ? "मन पर्ने पसल छ?" : "Is there a shop you’d like to explore?")
    : (lang === "np" ? "दैनिक लगाउन वा विशेष अवसरका लागि खोज्दै हुनुहुन्छ?" : "Is this for everyday wear or a special occasion?");
  return {
    productIds: (positive.length ? positive : ranked.slice(0, 5)).map((item) => item.id),
    message: !ranked.length ? (lang === "np" ? "यो संयोजनसँग मिल्ने नमुना डिजाइन भेटिएन। अर्को पसल वा गहनाको प्रकार रोज्नुहुन्छ?" : "No sample designs match that combination. Would you like to try another shop or jewellery type?") : lang === "np"
      ? `${previousQueries.length ? "तपाईंको नयाँ रोजाइअनुसार विकल्प मिलाएँ।" : "तपाईंको कुराअनुसार यी नमुना डिजाइन हेर्नुहोस्।"} मूल्य र सामग्री पसलसँग पुष्टि गर्नुपर्छ। ${question}`
      : `${previousQueries.length ? "I’ve updated the shortlist with your latest preference" : "Here are sample designs to start with"}${category ? ` — ${category}` : ""}${shopId ? ` from ${shops.find(shop => shop.id === shopId)!.name.en}` : ""}. Prices and materials need the shop’s confirmation. ${question}`,
  };
}
