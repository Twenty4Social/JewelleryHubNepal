import { localSearch } from "@/lib/catalog-search";
import { products, shops } from "@/lib/data";
import { isRateLimited } from "@/lib/rate-limit";
import type { Lang } from "@/lib/i18n";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(`search:${ip}`, 12)) return Response.json({ error: "Too many searches" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const lang: Lang = body.lang === "np" ? "np" : "en";
  if (!query || query.length > 300) return Response.json({ error: "Query must be 1–300 characters" }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ ...localSearch(query, lang), source: "catalog" });
  }

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const catalog = products.map((product) => {
      const shop = shops.find((item) => item.id === product.shopId)!;
      return {
        id: product.id,
        title: product.title,
        shop: shop.name,
        city: shop.city,
        category: product.category,
        metal: product.metal,
        occasion: product.occasion,
        priceMin: product.priceMin || null,
        priceMax: product.priceMax ?? (product.priceMin || null),
      };
    });
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `You are Jewellery Hub Nepal's unbiased catalog search. Rank only by relevance to the shopper. Never favor a shop. This is a sample photo collection. Null prices and To confirm materials are unknown: never claim a design meets a budget or has a particular purity, and never invent availability or specifications. Return nearest honest alternatives when there is no exact match. Reply in ${lang === "np" ? "Nepali" : "English"}.` }],
        },
        contents: [{
          role: "user",
          parts: [{ text: `Shopper query: ${query}\n\nCatalog: ${JSON.stringify(catalog)}` }],
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              productIds: { type: "ARRAY", items: { type: "STRING" }, maxItems: 5 },
              message: { type: "STRING" },
            },
            required: ["productIds", "message"],
          },
        },
      }),
      signal: AbortSignal.timeout(9_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Gemini returned ${response.status}`);

    const result = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    const parsed = JSON.parse(text) as { productIds?: unknown; message?: unknown };
    const validIds = new Set(products.map((product) => product.id));
    const productIds = Array.isArray(parsed.productIds)
      ? parsed.productIds.filter((id): id is string => typeof id === "string" && validIds.has(id)).slice(0, 5)
      : [];
    if (!productIds.length) throw new Error("Gemini returned no valid catalog IDs");

    return Response.json({
      productIds,
      message: typeof parsed.message === "string" ? parsed.message : localSearch(query, lang).message,
      source: "gemini",
    });
  } catch (error) {
    console.error("Gemini catalog search failed", error);
    return Response.json({ ...localSearch(query, lang), source: "catalog" });
  }
}
