import { localSearch } from "@/lib/catalog-search";
import { products, shops } from "@/lib/data";
import { isRateLimited } from "@/lib/rate-limit";
import type { Lang } from "@/lib/i18n";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(`search:${ip}`, 12)) return Response.json({ error: "Too many searches" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return Response.json({ error: "Expected a search request" }, { status: 400 });
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const lang: Lang = body.lang === "np" ? "np" : "en";
  if (!query || query.length > 300) return Response.json({ error: "Query must be 1–300 characters" }, { status: 400 });

  const rawHistory = body.history ?? [];
  if (!Array.isArray(rawHistory) || rawHistory.length > 12 || rawHistory.some(item => !item || typeof item !== "object" || !["user", "assistant"].includes(item.role) || typeof item.text !== "string" || !item.text.trim() || item.text.length > 1500)) {
    return Response.json({ error: "Invalid conversation history" }, { status: 400 });
  }
  const history = rawHistory as { role: "user" | "assistant"; text: string }[];
  const fallback = () => localSearch(query, lang, history.filter(item => item.role === "user").map(item => item.text), history.findLast(item => item.role === "assistant")?.text.split("Suggested designs:")[1]?.match(/\bp\d+\b/g) ?? []);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ ...fallback(), source: "catalog" });
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
        collection: product.collection,
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
          parts: [{ text: `You are Jewellery Hub Nepal's helpful, unbiased jewellery shopping companion. Continue the conversation: remember the buyer's preferences, resolve references to earlier suggestions, and let newer preferences override older ones. Answer in two short sentences followed by one useful follow-up question. Do not repeat the same question if already answered. Rank only by relevance to the shopper. Never favor a shop. This is a sample catalogue containing owner-supplied photos and stock reference photos. Collection names describe sample design themes, not verified materials. Null prices and To confirm materials are unknown: never claim a design meets a budget or has a particular purity, and never invent availability or specifications. Return nearest honest alternatives when there is no exact match. Reply in ${lang === "np" ? "Nepali" : "English"}.` }],
        },
        contents: [...history.map(item => ({ role: item.role === "assistant" ? "model" : "user", parts: [{ text: item.text }] })), {
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
      message: typeof parsed.message === "string" && parsed.message.trim() ? parsed.message.slice(0, 1500) : fallback().message,
      source: "gemini",
    });
  } catch (error) {
    console.error("Gemini catalog search failed", error);
    return Response.json({ ...fallback(), source: "catalog" });
  }
}
