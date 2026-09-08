import { products, shops } from "./data.ts";
import type { Lang } from "./i18n";

const devanagariDigits = "०१२३४५६७८९";

const normalize = (value: string) =>
  value
    .replace(/[०-९]/g, (digit) => String(devanagariDigits.indexOf(digit)))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export function localSearch(query: string, lang: Lang = "en") {
  const normalized = normalize(query);
  const tokens = normalized.split(" ").filter((token) => token.length > 1);
  const numbers = normalized.match(/\d[\d,]*/g)?.map((value) => Number(value.replaceAll(",", ""))) ?? [];
  const budget = /(under|below|within|less than|भित्र|सम्म)/i.test(query)
    ? Math.max(0, ...numbers.filter((value) => value >= 1000))
    : 0;

  const ranked = products.map((product) => {
    const shop = shops.find((item) => item.id === product.shopId);
    const haystack = normalize([
      product.title.en,
      product.title.np,
      product.metal,
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
  return {
    productIds: (positive.length ? positive : ranked.slice(0, 5)).map((item) => item.id),
    message: lang === "np"
      ? "तपाईंको विवरणसँग मिल्ने क्याटलगका नजिकका विकल्पहरू।"
      : "Closest sample designs for your description. Ask the shop to confirm price and materials.",
  };
}
