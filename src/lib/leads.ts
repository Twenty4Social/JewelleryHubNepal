export type LeadEvent = {
  kind: "search" | "whatsapp_click" | "jeweller_signup";
  sessionId: string;
  shopId?: string;
  productId?: string;
  query?: string;
  source?: string;
};

export async function recordLead(event: LeadEvent): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        kind: event.kind,
        session_id: event.sessionId,
        shop_id: event.shopId ?? null,
        product_id: event.productId ?? null,
        query: event.query ?? null,
        source: event.source ?? null,
      }),
      cache: "no-store",
    });

    if (!response.ok) console.error("Lead event insert failed", response.status);
    return response.ok;
  } catch (error) {
    console.error("Lead event insert failed", error);
    return false;
  }
}
