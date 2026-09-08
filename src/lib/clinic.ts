export type ClinicMedia = {
  kind: "image" | "video" | "voice";
  name: string;
  type: string;
  src: string;
};

export type ClinicRequest = {
  id: string;
  customerName: string;
  contact: string;
  message: string;
  createdAt: string;
  status: "open" | "accepted" | "resolved";
  media?: ClinicMedia;
  voice?: ClinicMedia;
  assignedShopId?: string;
  ticketId?: string;
  acceptedAt?: string;
};

export const MAX_CLINIC_MEDIA_BYTES = 2_500_000;
const STORAGE_KEY = "jhn-clinic-requests-v1";

export const clinicSeedRequests: ClinicRequest[] = [
  {
    id: "request-seed-01",
    customerName: "Anisha K.",
    contact: "98•••••214",
    message: "This ring has started leaving a dark mark. Is it likely silver, and can it be restored?",
    createdAt: "2026-08-29T09:15:00+05:45",
    status: "open",
    media: {
      kind: "image",
      name: "silver-ring.jpg",
      type: "image/jpeg",
      src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "request-seed-02",
    customerName: "Pratiksha S.",
    contact: "97•••••880",
    message: "The clasp on my wedding necklace is loose. I would like a repair estimate before bringing it in.",
    createdAt: "2026-08-29T12:40:00+05:45",
    status: "open",
    media: {
      kind: "image",
      name: "wedding-necklace.jpg",
      type: "image/jpeg",
      src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
    },
  },
];

export function readClinicRequests(): ClinicRequest[] {
  if (typeof window === "undefined") return clinicSeedRequests;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as ClinicRequest[];
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clinicSeedRequests));
  } catch {
    // ponytail: demo-only browser persistence; replace with Supabase Storage before public intake.
  }
  return clinicSeedRequests;
}

export function writeClinicRequests(requests: ClinicRequest[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return true;
  } catch {
    return false;
  }
}

export function acceptClinicRequest(
  requests: ClinicRequest[],
  requestId: string,
  shopId: string,
  acceptedAt = new Date().toISOString(),
): ClinicRequest[] {
  const ticketId = `JHN-${acceptedAt.slice(2, 10).replaceAll("-", "")}-${requestId.slice(-4).toUpperCase()}`;
  return requests.map((request) => request.id === requestId && request.status === "open"
    ? { ...request, status: "accepted", assignedShopId: shopId, ticketId, acceptedAt }
    : request);
}

export function resolveClinicRequest(requests: ClinicRequest[], requestId: string): ClinicRequest[] {
  return requests.map((request) => request.id === requestId && request.status === "accepted"
    ? { ...request, status: "resolved" }
    : request);
}
