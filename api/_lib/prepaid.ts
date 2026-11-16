import { createHmac, timingSafeEqual } from "node:crypto";
import {
  getPtSessionQuote,
  parsePtQuantity,
  PT_SESSION_LIST_PRICE_SEK,
} from "../../src/data/erbjudanden.js";

/** Betalningsreferens för personlig träning (nya och äldre format). */
export const PT_ORDER_REF_PATTERN =
  /^(?:PT-[2-9A-HJKMNP-Z]{6}|CASELO-FRP-[A-Z0-9]{6,12})$/i;

export type PrepaidClaims = {
  orderRef: string;
  quantity: number;
  unitPriceSek: number;
};

export type PrepaidVerifyResult =
  | { ok: true; claims: PrepaidClaims }
  | { ok: false; error: string; message: string };

const SITE_ORIGIN = "https://www.caseloidrottsmedicin.se";

export function normalizePtOrderRef(value: string): string {
  return value.trim().toUpperCase();
}

export function isPtOrderRef(value: string): boolean {
  return PT_ORDER_REF_PATTERN.test(normalizePtOrderRef(value));
}

export function prepaidSigningSecret(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const dedicated =
    env.OFFER_PREPAID_SIGNING_SECRET?.trim() ||
    env.PREPAID_BOOKING_SECRET?.trim();
  if (dedicated) return dedicated;
  // Fallback så länkar fungerar även utan separat secret (dev / enklare drift).
  return (
    env.FORMSPREE_ORDERS_FORM_ID?.trim() ||
    env.VITE_FORMSPREE_FORM_ID?.trim() ||
    "caselo-prepaid-dev"
  );
}

export function claimsFromPtOrder(input: {
  orderRef: string;
  quantity: number;
}): PrepaidClaims | null {
  const orderRef = normalizePtOrderRef(input.orderRef);
  if (!isPtOrderRef(orderRef)) return null;
  const quantity = parsePtQuantity(input.quantity);
  if (!quantity) return null;
  const quote = getPtSessionQuote(quantity);
  return {
    orderRef,
    quantity: quote.quantity,
    unitPriceSek: quote.unitPriceSek,
  };
}

export function createPrepaidToken(
  claims: PrepaidClaims,
  secret: string,
): string {
  const body = Buffer.from(
    JSON.stringify({
      r: claims.orderRef,
      q: claims.quantity,
      u: claims.unitPriceSek,
    }),
    "utf8",
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyPrepaidToken(
  token: string,
  secret: string,
): PrepaidClaims | null {
  const trimmed = token.trim();
  const dot = trimmed.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = trimmed.slice(0, dot);
  const sig = trimmed.slice(dot + 1);
  if (!body || !sig) return null;

  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const raw = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      r?: unknown;
      q?: unknown;
      u?: unknown;
    };
    const orderRef = normalizePtOrderRef(String(raw.r ?? ""));
    const quantity = parsePtQuantity(raw.q);
    const unitPriceSek = Number(raw.u);
    if (!isPtOrderRef(orderRef) || !quantity) return null;
    if (!Number.isInteger(unitPriceSek) || unitPriceSek <= 0) return null;
    const quote = getPtSessionQuote(quantity);
    if (unitPriceSek !== quote.unitPriceSek) return null;
    return { orderRef, quantity: quote.quantity, unitPriceSek: quote.unitPriceSek };
  } catch {
    return null;
  }
}

export function buildPtPrepaidBookingPath(token: string): string {
  const params = new URLSearchParams({
    tjanst: "pt-pass",
    forbetalt: token,
  });
  return `/boka?${params.toString()}`;
}

export function buildPtPrepaidBookingUrl(
  claims: PrepaidClaims,
  secret: string,
  origin = SITE_ORIGIN,
): string {
  const token = createPrepaidToken(claims, secret);
  return `${origin}${buildPtPrepaidBookingPath(token)}`;
}

export function verifyPrepaidRequest(input: {
  token?: string | null;
  secret: string;
}): PrepaidVerifyResult {
  const token = input.token?.trim();
  if (!token) {
    return {
      ok: false,
      error: "missing-token",
      message: "Saknar förbetalningskod.",
    };
  }
  const claims = verifyPrepaidToken(token, input.secret);
  if (!claims) {
    return {
      ok: false,
      error: "invalid-token",
      message: "Länken eller koden är ogiltig. Kontrollera mejlet från Caselo.",
    };
  }
  return { ok: true, claims };
}

export const PT_LIST_PRICE_SEK = PT_SESSION_LIST_PRICE_SEK;
