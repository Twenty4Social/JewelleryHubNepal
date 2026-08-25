import type { LeadEvent } from "./leads";

const SESSION_KEY = "jhn-session";

export function getSessionId(): string {
  const id = crypto.randomUUID();
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    window.sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    // Storage can be unavailable in private browsing; the event still gets an ID.
  }
  return id;
}

export function trackLead(event: Omit<LeadEvent, "sessionId">) {
  void fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...event, sessionId: getSessionId() }),
    keepalive: true,
  });
}
