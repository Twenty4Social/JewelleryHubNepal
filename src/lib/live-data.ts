import type { LiveNewsItem, MarketAsset } from "./data.ts";

const FENEGOSIDA = "https://api.fenegosida.org/api/website/v1/Dashboard";
const NEWS_FEEDS = [
  { source: "Rapaport", url: "https://rapaport.com/feed/" },
  { source: "Jewellery Business", url: "https://www.jewellerybusiness.com/feed/" },
];

type TodayRate = {
  todayDate: string;
  rateType: string;
  todayBaseRatePerGram: number;
  yestardayBaseRatePerGram: number;
};

type HistoricalRate = {
  todayDate: string;
  rateType: string;
  baseRatePerGram: number;
};

const decodeXml = (value: string) => {
  const entities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };

  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => entities[name.toLowerCase()] ?? match);
};

const tag = (item: string, name: string) =>
  item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] ?? "";

const plain = (value: string) =>
  decodeXml(decodeXml(value)).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function parseRss(xml: string, source: string): LiveNewsItem[] {
  return (xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? []).map((item) => {
    const url = plain(tag(item, "link"));
    const summary = plain(tag(item, "description"))
      .replace(/\s*The post [\s\S]*? appeared first on [\s\S]*$/i, "")
      .trim();
    const date = new Date(plain(tag(item, "pubDate")));

    return {
      id: url,
      title: plain(tag(item, "title")),
      source,
      date: Number.isNaN(date.valueOf()) ? "" : date.toISOString(),
      summary: summary.length > 190 ? `${summary.slice(0, 187).trimEnd()}…` : summary,
      tag: plain(tag(item, "category")) || "Industry",
      url,
    };
  }).filter((item) => item.title && item.url);
}

const kathmanduDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

export async function getMarketData(): Promise<MarketAsset[]> {
  try {
    const date = kathmanduDate();
    const [todayResponse, historyResponse] = await Promise.all([
      fetch(`${FENEGOSIDA}/today`, { next: { revalidate: 1800 } }),
      fetch(`${FENEGOSIDA}/monthwisehistory?date=${date}`, { next: { revalidate: 1800 } }),
    ]);
    if (!todayResponse.ok) throw new Error(`FENEGOSIDA returned ${todayResponse.status}`);

    const today = (await todayResponse.json()) as TodayRate[];
    const history = historyResponse.ok ? (await historyResponse.json()) as HistoricalRate[] : [];

    const asset = (id: "gold" | "silver", needle: string, label: MarketAsset["label"]) => {
      const current = today.find((rate) => rate.rateType.includes(needle) && rate.rateType.includes("१ तोला"));
      if (!current) return null;

      const spark = history
        .filter((rate) => rate.rateType.includes(needle) && rate.rateType.includes("१ तोला"))
        .sort((a, b) => a.todayDate.localeCompare(b.todayDate))
        .slice(-8)
        .map((rate) => rate.baseRatePerGram);
      const delta = current.yestardayBaseRatePerGram
        ? ((current.todayBaseRatePerGram - current.yestardayBaseRatePerGram) / current.yestardayBaseRatePerGram) * 100
        : 0;

      return {
        id,
        label,
        price: current.todayBaseRatePerGram,
        previousPrice: current.yestardayBaseRatePerGram,
        direction: delta > 0 ? "rising" as const : delta < 0 ? "cooling" as const : "steady" as const,
        delta,
        spark: spark.length > 1 ? spark : [current.yestardayBaseRatePerGram, current.todayBaseRatePerGram],
        updatedAt: current.todayDate,
      };
    };

    return [
      asset("gold", "सुन", { en: "Hallmark gold (per tola)", np: "छापावाल सुन (प्रति तोला)" }),
      asset("silver", "चाँदी", { en: "Fine silver (per tola)", np: "असली चाँदी (प्रति तोला)" }),
    ].filter((item) => item !== null);
  } catch (error) {
    console.error("Unable to load FENEGOSIDA rates", error);
    return [];
  }
}

export async function getLiveNews(): Promise<LiveNewsItem[]> {
  const feeds = await Promise.allSettled(
    NEWS_FEEDS.map(async ({ source, url }) => {
      const response = await fetch(url, { next: { revalidate: 3600 } });
      if (!response.ok) throw new Error(`${source} returned ${response.status}`);
      return parseRss(await response.text(), source);
    })
  );

  return feeds
    .flatMap((feed) => feed.status === "fulfilled" ? feed.value : [])
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
}
