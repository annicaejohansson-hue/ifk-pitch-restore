import { getPartner, PARTNERS } from "@/lib/partners";
import { getVisitorType, type VisitorType } from "@/lib/visitor";
import type { LocationId } from "@/data/locations";

/** Ordinary Caselo booking destination — swap here when the URL changes. */
export const GENERAL_BOOKING_URL = "/boka";

/** IFK Stocksund booking destination — same layout as /boka, partner prices. */
export const IFK_STOCKSUND_BOOKING_URL = PARTNERS["ifk-stocksund"].bookingUrl;

/** Enebybergs IF booking destination — same layout as /boka, partner prices. */
export const ENEBYBERGS_IF_BOOKING_URL = PARTNERS["enebybergs-if"].bookingUrl;

/** FC Djursholm booking destination — same layout as /boka, partner prices. */
export const FC_DJURSHOLM_BOOKING_URL = PARTNERS["fc-djursholm"].bookingUrl;

/** Parsian IF booking destination — Danderyd partner prices. */
export const PARSIAN_IF_BOOKING_URL = PARTNERS["parsian-if"].bookingUrl;

/** IFK Mariefred booking destination — Mariefred partner prices. */
export const IFK_MARIEFRED_BOOKING_URL = PARTNERS["ifk-mariefred"].bookingUrl;

/** External Kaddio calendar used when an IFK visitor opens booking in a new window. */
export const IFK_STOCKSUND_KADDIO_URL = PARTNERS["ifk-stocksund"].kaddioBookingUrl;

/** First visit for custom heel cups, children under 18. Matches `/boka` service id. */
export const CHILD_HEEL_CUP_BOOKING_ID = "halkopp-barn-nybesok";

/** Column "Personlig träning" on `/boka` (PT-pass, Snabbhetspaketet). Matches `/boka` category id. */
export const TRAINING_BOOKING_CATEGORY_ID = "traning-och-motion";

/** Query key for booking location (`danderyd` | `mariefred`). */
export const BOOKING_LOCATION_PARAM = "ort";

export const SITE_ORIGIN = "https://www.caseloidrottsmedicin.se";

export function getBookingUrl(visitorType: VisitorType = getVisitorType()): string {
  return getPartner(visitorType)?.bookingUrl ?? GENERAL_BOOKING_URL;
}

export function isExternalBookingUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Append `?tjanst=` to an internal booking path. External URLs are left unchanged. */
export function withBookingService(url: string, serviceId?: string): string {
  if (!serviceId || isExternalBookingUrl(url)) return url;
  const parsed = new URL(url, SITE_ORIGIN);
  parsed.searchParams.set("tjanst", serviceId);
  return `${parsed.pathname}${parsed.search}`;
}

/** Append `?kategori=` to an internal booking path, so that column opens on `/boka`. External URLs are left unchanged. */
export function withBookingCategory(url: string, categoryId?: string): string {
  if (!categoryId || isExternalBookingUrl(url)) return url;
  const parsed = new URL(url, SITE_ORIGIN);
  parsed.searchParams.set("kategori", categoryId);
  return `${parsed.pathname}${parsed.search}`;
}

/** Append `?ort=` so `/boka` can pre-mark a location (still requires confirm). */
export function withBookingLocation(
  url: string,
  locationId?: LocationId,
): string {
  if (!locationId || isExternalBookingUrl(url)) return url;
  const parsed = new URL(url, SITE_ORIGIN);
  parsed.searchParams.set(BOOKING_LOCATION_PARAM, locationId);
  return `${parsed.pathname}${parsed.search}`;
}
