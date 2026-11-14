import {
  OFFER_BOOKING_TYPES,
  type OfferBookingTypeId,
} from "@/data/erbjudanden";

const trimEnv = (value: string | undefined) => value?.trim() ?? "";

export const OFFER_KADDIO_URLS: Record<OfferBookingTypeId, string> = {
  "snabbhet-forsta": trimEnv(import.meta.env.VITE_KADDIO_SNABBHET_FORSTA),
  "snabbhet-atertest": trimEnv(import.meta.env.VITE_KADDIO_SNABBHET_ATERTEST),
  friskvard: trimEnv(import.meta.env.VITE_KADDIO_FRISKVARD),
};

export function getOfferKaddioUrl(typeId: OfferBookingTypeId): string {
  return OFFER_KADDIO_URLS[typeId];
}

export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function isKaddioEmbedUrl(value: string): boolean {
  return isHttpUrl(value) && /kaddio\.com/i.test(value) && /iframe/i.test(value);
}

export const OFFER_BOOKING_CARDS = OFFER_BOOKING_TYPES.map((item) => ({
  ...item,
  url: OFFER_KADDIO_URLS[item.id],
}));
