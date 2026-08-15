import { getVisitorType, type VisitorType } from "@/lib/visitor";

/** Ordinary Caselo booking destination — swap here when the URL changes. */
export const GENERAL_BOOKING_URL = "/boka";

/** IFK Stocksund booking destination — same layout as /boka, partner prices. */
export const IFK_STOCKSUND_BOOKING_URL = "/boka?partner=ifk-stocksund";

/** External Kaddio calendar used when an IFK visitor opens booking in a new window. */
export const IFK_STOCKSUND_KADDIO_URL =
  "https://caseloidrottsmedicin.kaddio.com/booking/ifk-stocksund";

export function getBookingUrl(visitorType: VisitorType = getVisitorType()): string {
  return visitorType === "ifk-stocksund"
    ? IFK_STOCKSUND_BOOKING_URL
    : GENERAL_BOOKING_URL;
}

export function isExternalBookingUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
