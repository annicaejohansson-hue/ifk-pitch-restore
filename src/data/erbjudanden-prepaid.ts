import {
  getPtSessionQuote,
  parsePtQuantity,
  PT_SESSION_LIST_PRICE_SEK,
  formatOfferPrice,
} from "./erbjudanden";

/** Betalningsreferens för personlig träning (nya och äldre format). */
export const PT_ORDER_REF_PATTERN =
  /^(?:PT-[2-9A-HJKMNP-Z]{6}|CASELO-FRP-[A-Z0-9]{6,12})$/i;

export type PtPrepaidDisplay = {
  orderRef: string;
  quantity: number;
  unitPriceSek: number;
  listUnitPriceSek: number;
  /** true = signerad länk/kod från Caselo */
  verified: boolean;
};

export function normalizePtOrderRef(value: string): string {
  return value.trim().toUpperCase();
}

export function isPtOrderRef(value: string): boolean {
  return PT_ORDER_REF_PATTERN.test(normalizePtOrderRef(value));
}

export function ptPrepaidFromRefAndQuantity(
  orderRefRaw: string,
  quantityRaw: unknown,
): PtPrepaidDisplay | null {
  const orderRef = normalizePtOrderRef(orderRefRaw);
  const quantity = parsePtQuantity(quantityRaw);
  if (!isPtOrderRef(orderRef) || !quantity) return null;
  const quote = getPtSessionQuote(quantity);
  return {
    orderRef,
    quantity: quote.quantity,
    unitPriceSek: quote.unitPriceSek,
    listUnitPriceSek: PT_SESSION_LIST_PRICE_SEK,
    verified: false,
  };
}

export function buildPtPrepaidBookingPathFromParams(input: {
  orderRef: string;
  quantity: number;
  token?: string;
}): string {
  const params = new URLSearchParams({ tjanst: "pt-pass" });
  if (input.token?.trim()) {
    params.set("forbetalt", input.token.trim());
  } else {
    params.set("ref", normalizePtOrderRef(input.orderRef));
    params.set("antal", String(input.quantity));
  }
  return `/boka?${params.toString()}`;
}

export function formatPtPrepaidUnitLabel(unitPriceSek: number): string {
  return `${formatOfferPrice(unitPriceSek)}/pass`;
}
