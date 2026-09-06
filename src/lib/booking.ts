import { getVisitorType, type VisitorType } from "@/lib/visitor";

/** Ordinary Caselo booking destination — swap here when the URL changes. */
export const GENERAL_BOOKING_URL = "/boka";

/** IFK Stocksund booking destination — same layout as /boka, partner prices. */
export const IFK_STOCKSUND_BOOKING_URL = "/boka?partner=ifk-stocksund";

/** External Kaddio calendar used when an IFK visitor opens booking in a new window. */
export const IFK_STOCKSUND_KADDIO_URL =
  "https://caseloidrottsmedicin.kaddio.com/booking/ifk-stocksund";

/** First visit for custom heel cups, children under 18. Matches `/boka` service id. */
export const CHILD_HEEL_CUP_BOOKING_ID = "halkopp-barn-nybesok";

export const SITE_ORIGIN = "https://www.caseloidrottsmedicin.se";

export function getBookingUrl(visitorType: VisitorType = getVisitorType()): string {
  return visitorType === "ifk-stocksund"
    ? IFK_STOCKSUND_BOOKING_URL
    : GENERAL_BOOKING_URL;
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
