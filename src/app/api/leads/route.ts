import { recordLead, type LeadEvent } from "@/lib/leads";
import { isRateLimited } from "@/lib/rate-limit";

const kinds = new Set<LeadEvent["kind"]>(["search", "whatsapp_click", "jeweller_signup"]);

const optional = (value: unknown, max: number) =>
  typeof value === "string" && value.length <= max ? value : undefined;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(`lead:${ip}`, 60)) return Response.json({ error: "Too many events" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!kinds.has(body.kind as LeadEvent["kind"]) || typeof body.sessionId !== "string" || body.sessionId.length > 100) {
    return Response.json({ error: "Invalid lead event" }, { status: 400 });
  }

  await recordLead({
    kind: body.kind as LeadEvent["kind"],
    sessionId: body.sessionId,
    shopId: optional(body.shopId, 80),
    productId: optional(body.productId, 80),
    query: optional(body.query, 300),
    source: optional(body.source, 80),
  });

  return new Response(null, { status: 204 });
}
