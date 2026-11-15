import { randomInt } from "node:crypto";
import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  DEFAULT_GIFT_DECORATION,
  DEFAULT_GIFT_LAYOUT,
  defaultGiftInscription,
  OFFER_BANKGIRO_NUMBER,
  OFFER_CONTACT_EMAIL,
  OFFER_PRODUCTS,
  OFFER_SWISH_NUMBER,
  OFFER_TIME_ZONE,
  formatOfferPrice,
  formatOfferPriceWithVat,
  formatPtProductName,
  formatPtReceiptName,
  getFocusLabel,
  getGiftDecoration,
  getGiftLayout,
  getOfferProduct,
  getPtSessionQuote,
  getPtSessionsForBudget,
  isFriskvardProduct,
  isOfferSalesOpen,
  needsFriskvardPersonalId,
  parseFriskvardFocusIds,
  parseGiftDecorationId,
  parseGiftLayoutId,
  formatFocusLabels,
  parsePtQuantity,
  parseSwedishPersonalId,
  PT_SESSION_MAX_QUANTITY,
  PT_SESSION_MIN_QUANTITY,
  type FriskvardFocusId,
  type GiftDecorationId,
  type GiftLayoutId,
  type OfferProductId,
} from "../../src/data/erbjudanden.js";
import { buildFulfillmentChecklist } from "../../src/data/erbjudanden-fulfillment.js";

export type OrderStatus = "awaiting_payment";

export type PaymentMethod = "swish" | "bankgiro";

export type OfferOrder = {
  orderRef: string;
  status: OrderStatus;
  customerReportedPayment: boolean;
  customerReportedPaymentAt: string | null;
  /** Kundens egen uppgift om betalsätt. Saknas på äldre beställningar. */
  customerReportedPaymentMethod?: PaymentMethod | null;
  /** Betalsättet kunden valde i kassan, innan betalningen. Saknas på äldre beställningar. */
  chosenPaymentMethod?: PaymentMethod | null;
  createdAt: string;
  productId: OfferProductId;
  productName: string;
  receiptName: string;
  amountSek: number;
  quantity: number | null;
  buyerName: string;
  buyerEmail: string;
  gift: boolean;
  giftLayout: GiftLayoutId;
  giftDecoration: GiftDecorationId;
  giftRecipientName: string;
  giftInscription: string;
  participantName: string;
  focusId: FriskvardFocusId | "";
  focusLabel: string;
  sportName: string;
  wellnessReceipt: boolean;
  receiptCustomerName: string;
  personalId: string;
};

type CheckoutReason =
  | "ok"
  | "sales_ended"
  | "sales_disabled"
  | "missing_swish"
  | "missing_notify";

type ServerConfig = {
  swishNumber: string;
  /** Tom sträng när bankgiro inte är inställt eller numret är ogiltigt. */
  bankgiroNumber: string;
  formspreeId: string;
  notifyEmail: string;
  salesEnabledFlag: boolean;
  allowLocalStore: boolean;
  nowMs: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toPackageView = (product: (typeof OFFER_PRODUCTS)[OfferProductId]) => ({
  id: product.id,
  name: product.name,
  priceSek: product.priceSek,
  priceLabel: formatOfferPriceWithVat(product.priceSek),
});

const readEnv = (name: string, env: NodeJS.ProcessEnv): string =>
  (env[name] ?? "").trim();

export function normalizeSwishNumber(value: string): string {
  return value.replace(/[\s-]/g, "");
}

export function isValidSwishNumber(value: string): boolean {
  const digits = normalizeSwishNumber(value);
  if (!/^[0-9]{10,12}$/.test(digits)) return false;
  const placeholders = new Set([
    "0000000000",
    "1234567890",
    "1231231231",
    "1231181189",
  ]);
  return !placeholders.has(digits);
}

export function formatSwishNumber(value: string): string {
  const digits = normalizeSwishNumber(value);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }
  return digits;
}

export function normalizeBankgiroNumber(value: string): string {
  return value.replace(/[\s-]/g, "");
}

/** Bankgironummer har 7 eller 8 siffror, där den sista är en kontrollsiffra (modulus 10). */
export function isValidBankgiroNumber(value: string): boolean {
  const digits = normalizeBankgiroNumber(value);
  if (!/^[0-9]{7,8}$/.test(digits)) return false;
  if (/^0+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function formatBankgiroNumber(value: string): string {
  const digits = normalizeBankgiroNumber(value);
  if (digits.length < 7) return digits;
  return `${digits.slice(0, -4)}-${digits.slice(-4)}`;
}

/**
 * Tidpunkt i mejlen till Caselo, i svensk tid ("2026-11-14 21:45 (svensk tid)").
 * Lagrade tidpunkter är fortsatt ISO i UTC.
 */
export function formatMailTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const local = new Intl.DateTimeFormat("sv-SE", {
    timeZone: OFFER_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${local} (svensk tid)`;
}

/** Presentkortslayouten anges bara i mejlet när köpet är en gåva. */
export function giftLayoutMailLabel(
  order: Pick<OfferOrder, "gift" | "giftLayout">,
): string {
  return order.gift ? getGiftLayout(order.giftLayout).label : "";
}

const parsePaymentMethod = (value: unknown): PaymentMethod | null => {
  const method = String(value ?? "").trim().toLowerCase();
  return method === "swish" || method === "bankgiro" ? method : null;
};

export function loadServerConfig(
  env: NodeJS.ProcessEnv = process.env,
  nowMs = Date.now(),
): ServerConfig {
  // Numren i koden gäller. OFFERS_SWISH_NUMBER och OFFERS_BANKGIRO_NUMBER kan
  // ersätta dem, men ett felskrivet värde ignoreras så att kunden aldrig får
  // ett ogiltigt nummer.
  const swishNumber =
    [
      readEnv("OFFERS_SWISH_NUMBER", env),
      readEnv("SWISH_NUMBER", env),
      OFFER_SWISH_NUMBER,
    ]
      .map(normalizeSwishNumber)
      .find(isValidSwishNumber) ?? "";
  const bankgiroNumber =
    [readEnv("OFFERS_BANKGIRO_NUMBER", env), OFFER_BANKGIRO_NUMBER]
      .map(normalizeBankgiroNumber)
      .find(isValidBankgiroNumber) ?? "";
  const formspreeId =
    readEnv("FORMSPREE_ORDERS_FORM_ID", env) ||
    readEnv("VITE_FORMSPREE_FORM_ID", env);
  const notifyEmail =
    readEnv("OFFERS_NOTIFY_EMAIL", env) || OFFER_CONTACT_EMAIL;
  const flag = readEnv("OFFERS_SALES_ENABLED", env).toLowerCase();
  const salesEnabledFlag = flag === "" || flag === "true" || flag === "1";
  const nodeEnv = readEnv("NODE_ENV", env) || "development";
  const localFlag = readEnv("OFFERS_LOCAL_STORE", env);
  const allowLocalStore =
    localFlag === "1" || localFlag === "true" || nodeEnv !== "production";

  return {
    swishNumber,
    bankgiroNumber,
    formspreeId,
    notifyEmail,
    salesEnabledFlag,
    allowLocalStore,
    nowMs,
  };
}

export function getCheckoutState(config: ServerConfig) {
  const salesOpen = isOfferSalesOpen(config.nowMs);
  const swishOk = isValidSwishNumber(config.swishNumber);
  const notifyOk = Boolean(config.formspreeId) || config.allowLocalStore;

  let reason: CheckoutReason = "ok";
  if (!config.salesEnabledFlag) reason = "sales_disabled";
  else if (!salesOpen) reason = "sales_ended";
  else if (!swishOk) reason = "missing_swish";
  else if (!notifyOk) reason = "missing_notify";

  const purchaseEnabled = reason === "ok";

  const messages: Record<CheckoutReason, string> = {
    ok: "",
    sales_ended:
      "Försäljningen av erbjudandena avslutades 31 december 2026. Har du redan köpt kan du fortfarande boka din tid.",
    sales_disabled:
      "Köp är tillfälligt avstängt. Hör av dig om du har frågor.",
    missing_swish:
      "Köp är inte öppet ännu. Betalningsuppgifter saknas, så vi tar inte emot beställningar här. Mejla oss så hjälper vi dig.",
    missing_notify:
      "Köp är inte öppet ännu. Beställningar kan inte tas emot tillförlitligt förrän avisering är kopplad. Mejla oss så hjälper vi dig.",
  };

  return {
    purchaseEnabled,
    salesOpen,
    reason,
    message: messages[reason],
    contactEmail: OFFER_CONTACT_EMAIL,
    bankgiroAvailable: Boolean(config.bankgiroNumber),
    packages: {
      snabbhet: toPackageView(OFFER_PRODUCTS.snabbhet),
      "friskvard-pass": toPackageView(OFFER_PRODUCTS["friskvard-pass"]),
      friskvard: toPackageView(OFFER_PRODUCTS.friskvard),
    },
  };
}

const clip = (value: unknown, max: number) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

/** Utan 0/O, 1/I/L så att referensen går att läsa av och skriva in för hand. */
const ORDER_REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const ORDER_REF_TOKEN_LENGTH = 6;

const createOrderRef = (prefix: string) => {
  let token = "";
  for (let i = 0; i < ORDER_REF_TOKEN_LENGTH; i += 1) {
    token += ORDER_REF_ALPHABET[randomInt(ORDER_REF_ALPHABET.length)];
  }
  return `${prefix}-${token}`;
};

/** Nya referenser (PT-7K4Q2M) och äldre (CASELO-FRP-3D53AB78). */
const ORDER_REF_PATTERN =
  /^(?:(?:SN|PT|TP)-[A-Z0-9]{6}|CASELO-(?:SNB|FRV|FRP)-[A-Z0-9]{6,12})$/;

const productIdFromOrderRef = (orderRef: string): OfferProductId => {
  if (orderRef.startsWith("PT-") || orderRef.includes("-FRP-")) {
    return "friskvard-pass";
  }
  if (orderRef.startsWith("TP-") || orderRef.includes("-FRV-")) {
    return "friskvard";
  }
  return "snabbhet";
};

type CreateInput = {
  productId?: unknown;
  buyerName?: unknown;
  buyerEmail?: unknown;
  buyerEmailConfirm?: unknown;
  recipient?: unknown;
  giftLayout?: unknown;
  giftDecoration?: unknown;
  giftRecipientName?: unknown;
  giftInscription?: unknown;
  participantName?: unknown;
  focus?: unknown;
  sportName?: unknown;
  quantity?: unknown;
  wellnessReceipt?: unknown;
  receiptCustomerName?: unknown;
  personalId?: unknown;
  paymentMethod?: unknown;
  website?: unknown;
  amountSek?: unknown;
  price?: unknown;
  status?: unknown;
  paid?: unknown;
};

export type CreateOrderResult =
  | { ok: true; order: OfferOrder; payment: PaymentView }
  | {
      ok: false;
      status: number;
      error: string;
      message: string;
      fields?: Record<string, string>;
    };

export type PaymentView = {
  orderRef: string;
  status: OrderStatus;
  customerReportedPayment: boolean;
  productId: OfferProductId;
  productName: string;
  amountSek: number;
  amountLabel: string;
  quantity?: number;
  focusLabel?: string;
  /** Satt när kunden har bett om kvitto för friskvårdsbidrag; visas i orderöversikten. */
  wellnessReceipt?: boolean;
  swishNumber: string;
  swishNumberDisplay: string;
  swishAppUrl: string;
  /** Tomma strängar när bankgiro inte erbjuds. */
  bankgiroNumber: string;
  bankgiroNumberDisplay: string;
  /** Betalsättet kunden valde i kassan; förvalt på betalningssidan. */
  chosenPaymentMethod?: PaymentMethod;
  reportedPaymentMethod?: PaymentMethod;
  paymentVerifiedAutomatically: false;
};

const bankgiroView = (config: Pick<ServerConfig, "bankgiroNumber">) => ({
  bankgiroNumber: config.bankgiroNumber,
  bankgiroNumberDisplay: config.bankgiroNumber
    ? formatBankgiroNumber(config.bankgiroNumber)
    : "",
});

const paymentChannelsLabel = (config: Pick<ServerConfig, "bankgiroNumber">) =>
  config.bankgiroNumber ? "Swish eller på bankgirot" : "Swish";

/**
 * Rader om betalsätt i beställningsmejlet. Kunden väljer i kassan, före
 * betalningen, och kan byta på betalningssidan – därför är det en uppgift om
 * var Henrik ska titta först, inte ett besked om var pengarna finns.
 */
export function chosenPaymentMailInfo(
  order: Pick<OfferOrder, "orderRef" | "chosenPaymentMethod">,
  config: Pick<ServerConfig, "bankgiroNumber">,
) {
  const method = order.chosenPaymentMethod ?? null;
  const label = method === "bankgiro" ? "Bankgiro" : method === "swish" ? "Swish" : "";
  const tail = `Du får inget mejl när kunden klickar på Jag har betalat. Matcha inbetalningen mot referensen ${order.orderRef}.`;
  let warning = `Markera inte som betald förrän inbetalningen syns i ${paymentChannelsLabel(config)}. ${tail}`;
  if (method === "bankgiro") {
    warning = `Markera inte som betald förrän inbetalningen syns. Kunden har valt bankgiro, som kan ta 1–2 bankdagar. Syns den inte där, titta även i Swish. ${tail}`;
  } else if (method === "swish") {
    warning = config.bankgiroNumber
      ? `Markera inte som betald förrän inbetalningen syns. Kunden har valt Swish. Syns den inte där, titta även på bankgirot. ${tail}`
      : `Markera inte som betald förrän inbetalningen syns i Swish. ${tail}`;
  }
  return {
    subjectSuffix: label ? ` (${label})` : "",
    field: label
      ? config.bankgiroNumber
        ? `${label} (valt i kassan, kunden kan byta på betalningssidan)`
        : label
      : "Ej angivet",
    warning,
  };
}

const swishAppUrl = (number: string, amountSek: number, message: string) => {
  const params = new URLSearchParams({
    sw: number,
    amt: String(amountSek),
    cur: "SEK",
    msg: message,
  });
  return `https://app.swish.nu/1/p/sw/?${params.toString()}`;
};

export function toPaymentView(
  order: OfferOrder,
  config: Pick<ServerConfig, "swishNumber" | "bankgiroNumber">,
): PaymentView {
  const { swishNumber } = config;
  return {
    orderRef: order.orderRef,
    status: order.status,
    customerReportedPayment: order.customerReportedPayment,
    productId: order.productId,
    productName: order.productName,
    amountSek: order.amountSek,
    amountLabel: formatOfferPriceWithVat(order.amountSek),
    quantity: order.quantity || undefined,
    focusLabel: order.focusLabel || "",
    wellnessReceipt: order.wellnessReceipt || undefined,
    swishNumber,
    swishNumberDisplay: formatSwishNumber(swishNumber),
    swishAppUrl: swishAppUrl(swishNumber, order.amountSek, order.orderRef),
    ...bankgiroView(config),
    chosenPaymentMethod: order.chosenPaymentMethod ?? undefined,
    paymentVerifiedAutomatically: false,
  };
}

export async function createOfferOrder(
  input: CreateInput,
  config: ServerConfig,
  deps: PersistDeps = defaultPersistDeps,
): Promise<CreateOrderResult> {
  const checkout = getCheckoutState(config);
  if (!checkout.purchaseEnabled) {
    return {
      ok: false,
      status: 503,
      error: checkout.reason,
      message: checkout.message,
    };
  }

  if (clip(input.website, 200)) {
    return {
      ok: false,
      status: 400,
      error: "rejected",
      message: "Kunde inte ta emot beställningen. Försök igen eller mejla oss.",
    };
  }

  const product = getOfferProduct(String(input.productId ?? ""));
  if (!product || product.id === "friskvard") {
    return {
      ok: false,
      status: 400,
      error: "invalid-product",
      message:
        product?.id === "friskvard"
          ? "Trepasspaketet säljs inte längre. Välj antal träningspass."
          : "Välj ett giltigt paket.",
    };
  }

  const fields: Record<string, string> = {};
  const buyerName = clip(input.buyerName, 120);
  const buyerEmail = clip(input.buyerEmail, 254).toLowerCase();
  const buyerEmailConfirm = clip(input.buyerEmailConfirm, 254).toLowerCase();

  if (buyerName.length < 2) fields.buyerName = "Ange förnamn och efternamn på den som betalar.";
  if (!EMAIL_RE.test(buyerEmail)) fields.buyerEmail = "Ange en giltig e-postadress.";
  if (buyerEmail !== buyerEmailConfirm) {
    fields.buyerEmailConfirm = "E-postadresserna stämmer inte överens.";
  }

  let gift = false;
  let giftLayout: GiftLayoutId = DEFAULT_GIFT_LAYOUT;
  let giftDecoration: GiftDecorationId = DEFAULT_GIFT_DECORATION;
  let giftRecipientName = "";
  let giftInscription = "";
  let participantName = "";
  let focusId: FriskvardFocusId | "" = "";
  let focusLabel = "";
  let sportName = "";
  let quantity: number | null = null;
  let amountSek = product.priceSek;
  let productName = product.name;
  let receiptName = product.receiptName;

  const recipient = clip(input.recipient, 16).toLowerCase();
  gift = recipient === "gift";
  if (gift) {
    const parsedLayout = parseGiftLayoutId(clip(input.giftLayout, 32));
    if (parsedLayout) {
      giftLayout = parsedLayout;
    } else {
      fields.giftLayout = "Välj utformning.";
    }
    const parsedDecoration = parseGiftDecorationId(clip(input.giftDecoration, 32));
    giftDecoration = parsedDecoration ?? DEFAULT_GIFT_DECORATION;
    giftRecipientName = clip(input.giftRecipientName, 120);
    giftInscription =
      clip(input.giftInscription, 80) ||
      giftRecipientName ||
      defaultGiftInscription(product.id);
  }

  if (isFriskvardProduct(product.id)) {
    participantName = clip(input.participantName, 120);
    const parsedFocuses = parseFriskvardFocusIds(clip(input.focus, 80));
    if (participantName.length < 2) {
      fields.participantName = "Ange förnamn och efternamn på den som ska träna.";
    }
    if (parsedFocuses.length === 0) {
      fields.focus = "Välj fokus.";
    } else {
      focusId = parsedFocuses[0];
      if (parsedFocuses.includes("fys-idrott")) {
        sportName = clip(input.sportName, 80);
        if (sportName.length < 2) {
          fields.sportName =
            "Ange vilken idrott passen ska anpassas till.";
        }
      }
      focusLabel = formatFocusLabels(parsedFocuses, sportName);
    }
    const parsedQuantity =
      parsePtQuantity(input.quantity) ??
      (input.quantity == null || String(input.quantity).trim() === ""
        ? 1
        : null);
    if (!parsedQuantity) {
      fields.quantity = `Ange antal pass, ${PT_SESSION_MIN_QUANTITY}–${PT_SESSION_MAX_QUANTITY}.`;
    } else {
      quantity = parsedQuantity;
      const quote = getPtSessionQuote(parsedQuantity);
      amountSek = quote.totalSek;
      productName = formatPtProductName(parsedQuantity);
      receiptName = formatPtReceiptName(parsedQuantity);
    }
  }

  const wellnessReceipt =
    clip(input.wellnessReceipt, 8).toLowerCase() === "yes";
  let receiptCustomerName = "";
  let personalId = "";
  if (wellnessReceipt) {
    receiptCustomerName = clip(input.receiptCustomerName, 120);
    const parsedId = parseSwedishPersonalId(clip(input.personalId, 20));
    if (receiptCustomerName.length < 2) {
      fields.receiptCustomerName = "Ange namnet som ska stå på kvittot.";
    }
    if (!parsedId) {
      fields.personalId =
        "Ange ett giltigt personnummer. Namn och personnummer ska båda stå på kvittot.";
    } else {
      personalId = parsedId;
    }
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      status: 400,
      error: "validation",
      message: "Kontrollera formuläret och försök igen.",
      fields,
    };
  }

  // Kassan kräver ett val. Här är det frivilligt, så att en äldre inläst sida
  // utan frågan fortfarande kan beställa. Bankgiro räknas bara om det erbjuds.
  const requestedMethod = parsePaymentMethod(input.paymentMethod);
  const chosenPaymentMethod =
    requestedMethod === "bankgiro" && !config.bankgiroNumber
      ? null
      : requestedMethod;

  const order: OfferOrder = {
    orderRef: createOrderRef(product.refPrefix),
    status: "awaiting_payment",
    customerReportedPayment: false,
    customerReportedPaymentAt: null,
    chosenPaymentMethod,
    createdAt: new Date(config.nowMs).toISOString(),
    productId: product.id,
    productName,
    receiptName,
    amountSek,
    quantity,
    buyerName,
    buyerEmail,
    gift,
    giftLayout,
    giftDecoration,
    giftRecipientName,
    giftInscription,
    participantName,
    focusId,
    focusLabel: focusLabel || (focusId ? getFocusLabel(focusId) : ""),
    sportName,
    wellnessReceipt,
    receiptCustomerName,
    personalId,
  };

  try {
    await deps.persistOrder(order, config);
  } catch {
    return {
      ok: false,
      status: 503,
      error: "persist-failed",
      message:
        "Beställningen kunde inte sparas. Ingen betalning ska göras ännu. Försök igen eller mejla oss.",
    };
  }

  return {
    ok: true,
    order,
    payment: toPaymentView(order, config),
  };
}

type PaymentClaim = {
  orderRef: string;
  customerReportedPayment: true;
  customerReportedPaymentAt: string;
  customerReportedPaymentMethod: PaymentMethod | null;
  status: OrderStatus;
};

export async function claimOfferPayment(
  input: {
    orderRef?: unknown;
    paymentMethod?: unknown;
    status?: unknown;
    paid?: unknown;
  },
  config: ServerConfig,
  deps: PersistDeps = defaultPersistDeps,
): Promise<
  | { ok: true; payment: PaymentView }
  | { ok: false; status: number; error: string; message: string }
> {
  const checkout = getCheckoutState(config);
  if (!isValidSwishNumber(config.swishNumber) && !checkout.purchaseEnabled) {
    // Claims are allowed after sale if we can still notify, but never mark paid.
  }

  const orderRef = clip(input.orderRef, 40).toUpperCase();
  if (!ORDER_REF_PATTERN.test(orderRef)) {
    return {
      ok: false,
      status: 400,
      error: "invalid-ref",
      message: "Ogiltig betalningsreferens.",
    };
  }

  // Bankgiro räknas bara om det faktiskt erbjuds; annars lämnas betalsättet tomt.
  const requestedMethod = parsePaymentMethod(input.paymentMethod);
  const reportedMethod =
    requestedMethod === "bankgiro" && !config.bankgiroNumber
      ? null
      : requestedMethod;

  const claim: PaymentClaim = {
    orderRef,
    customerReportedPayment: true,
    customerReportedPaymentAt: new Date(config.nowMs).toISOString(),
    customerReportedPaymentMethod: reportedMethod,
    status: "awaiting_payment",
  };

  try {
    await deps.persistClaim(claim, config);
  } catch {
    return {
      ok: false,
      status: 503,
      error: "persist-failed",
      message:
        "Vi kunde inte registrera din uppgift just nu. Behåll din referens. Caselo matchar betalningen via referensen i meddelandet.",
    };
  }

  const productId = productIdFromOrderRef(orderRef);
  const product = OFFER_PRODUCTS[productId];
  const stored = deps.findOrder
    ? await deps.findOrder(orderRef, config)
    : null;
  const amountSek = stored?.amountSek ?? product.priceSek;
  const productName = stored?.productName ?? product.name;

  return {
    ok: true,
    payment: {
      orderRef,
      status: "awaiting_payment",
      customerReportedPayment: true,
      productId: stored?.productId ?? productId,
      productName,
      amountSek,
      amountLabel: formatOfferPriceWithVat(amountSek),
      quantity: stored?.quantity || undefined,
      focusLabel: stored?.focusLabel || "",
      swishNumber: config.swishNumber,
      swishNumberDisplay: config.swishNumber
        ? formatSwishNumber(config.swishNumber)
        : "",
      swishAppUrl: config.swishNumber
        ? swishAppUrl(config.swishNumber, amountSek, orderRef)
        : "",
      ...bankgiroView(config),
      reportedPaymentMethod: reportedMethod ?? undefined,
      paymentVerifiedAutomatically: false,
    },
  };
}

type PersistDeps = {
  persistOrder: (order: OfferOrder, config: ServerConfig) => Promise<void>;
  persistClaim: (claim: PaymentClaim, config: ServerConfig) => Promise<void>;
  findOrder?: (
    orderRef: string,
    config: ServerConfig,
  ) => Promise<OfferOrder | null>;
};

const dataDir = () => {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "..", "..", "data");
};

const ordersFile = () => join(dataDir(), "erbjudanden-orders.json");
const logFile = () => join(dataDir(), "erbjudanden-orders.jsonl");

async function readLocalOrders(): Promise<OfferOrder[]> {
  try {
    const raw = await readFile(ordersFile(), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalOrder(order: OfferOrder) {
  await mkdir(dataDir(), { recursive: true });
  const existing = await readLocalOrders();
  existing.push(order);
  await writeFile(ordersFile(), JSON.stringify(existing, null, 2), "utf8");
  await appendFile(logFile(), `${JSON.stringify(order)}\n`, "utf8");
}

async function writeLocalClaim(claim: PaymentClaim) {
  await mkdir(dataDir(), { recursive: true });
  const existing = await readLocalOrders();
  const index = existing.findIndex((item) => item.orderRef === claim.orderRef);
  if (index >= 0) {
    existing[index] = {
      ...existing[index],
      customerReportedPayment: true,
      customerReportedPaymentAt: claim.customerReportedPaymentAt,
      customerReportedPaymentMethod: claim.customerReportedPaymentMethod,
      status: "awaiting_payment",
    };
    await writeFile(ordersFile(), JSON.stringify(existing, null, 2), "utf8");
  }
  await appendFile(
    logFile(),
    `${JSON.stringify({ type: "payment_claim", ...claim })}\n`,
    "utf8",
  );
}

async function notifyFormspree(
  formId: string,
  payload: Record<string, unknown>,
) {
  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("formspree-failed");
  }
}

async function persistOrder(order: OfferOrder, config: ServerConfig) {
  const checklist = buildFulfillmentChecklist({
    productId: order.productId,
    orderRef: order.orderRef,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    amountSek: order.amountSek,
    quantity: order.quantity || undefined,
    gift: order.gift,
    giftLayout: order.giftLayout,
    giftDecoration: order.giftDecoration,
    giftRecipientName: order.giftRecipientName,
    giftInscription: order.giftInscription,
    participantName: order.participantName,
    focusId: order.focusId || undefined,
    focusLabel: order.focusLabel,
    wellnessReceipt: order.wellnessReceipt,
    receiptCustomerName: order.receiptCustomerName,
    personalId: order.personalId,
    receiptName: order.receiptName,
  });

  const hasFormspree = Boolean(config.formspreeId);
  const hasLocal = config.allowLocalStore;
  if (!hasFormspree && !hasLocal) {
    throw new Error("no-persist-channel");
  }

  let localOk = !hasLocal;
  let formspreeOk = !hasFormspree;

  if (hasLocal) {
    try {
      await writeLocalOrder(order);
      localOk = true;
    } catch {
      localOk = false;
    }
  }

  if (hasFormspree) {
    const paymentInfo = chosenPaymentMailInfo(order, config);
    try {
      await notifyFormspree(config.formspreeId, {
        _subject: `Ny beställning ${order.orderRef} – Inväntar betalning${paymentInfo.subjectSuffix}`,
        _replyto: order.buyerEmail,
        status: "Inväntar betalning",
        orderRef: order.orderRef,
        paket: order.productName,
        specificerat: order.receiptName,
        belopp: formatOfferPriceWithVat(order.amountSek),
        beloppSek: order.amountSek,
        betalsatt_enligt_kund: paymentInfo.field,
        antalPass: order.quantity || "",
        kopare: order.buyerName,
        epost: order.buyerEmail,
        gava: order.gift ? "Ja" : "Nej",
        presentkortslayout: giftLayoutMailLabel(order),
        presentkortsdekoration: order.gift
          ? getGiftDecoration(order.giftDecoration).label
          : "",
        mottagare: order.giftRecipientName || "",
        presentkortstext: order.giftInscription || "",
        deltagare: order.participantName || "",
        inriktning: order.focusLabel || "",
        idrott: order.sportName || "",
        friskvardskvitto: order.wellnessReceipt ? "Ja" : "Nej",
        kvittoNamn: order.receiptCustomerName || "",
        personnummer: order.personalId || "",
        skapad: formatMailTime(order.createdAt),
        betalning: config.bankgiroNumber
          ? `Swish eller bankgiro ${formatBankgiroNumber(config.bankgiroNumber)}. Caselo kontrollerar betalningen manuellt.`
          : "Swish. Caselo kontrollerar betalningen manuellt.",
        intern_checklista: checklist,
        varning: paymentInfo.warning,
      });
      formspreeOk = true;
    } catch {
      formspreeOk = false;
    }
  }

  if (!hasLocal && !formspreeOk) throw new Error("formspree-failed");
  if (!hasFormspree && !localOk) throw new Error("local-store-failed");
  if (!formspreeOk && !localOk) throw new Error("persist-failed");
}

/**
 * Kundens klick på Jag har betalat skickas inte vidare till Formspree: varje
 * beställning ska ge ett enda inskick (beställningsmejlet). Betalningen matchas
 * mot referensen i Swish eller på bankgirot. Lokalt sparas uppgiften i filen;
 * på den publicerade sajten finns ingen lagring och klicket bekräftas ändå.
 */
async function persistClaim(claim: PaymentClaim, config: ServerConfig) {
  if (!config.allowLocalStore) return;
  try {
    await writeLocalClaim(claim);
  } catch {
    throw new Error("persist-failed");
  }
}

async function findLocalOrder(orderRef: string): Promise<OfferOrder | null> {
  const existing = await readLocalOrders();
  return existing.find((item) => item.orderRef === orderRef) ?? null;
}

export const defaultPersistDeps: PersistDeps = {
  persistOrder,
  persistClaim,
  findOrder: async (orderRef) => findLocalOrder(orderRef),
};

type NodeReq = IncomingMessage & { body?: unknown };
type NodeRes = ServerResponse & {
  status?: (code: number) => NodeRes;
  json?: (body: unknown) => void;
};

const json = (res: NodeRes, status: number, body: unknown) => {
  if (typeof res.status === "function" && typeof res.json === "function") {
    res.status(status).json(body);
    return;
  }
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

async function readJsonBody(req: NodeReq): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  const raw = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      if (chunks.reduce((sum, item) => sum + item.length, 0) > 32_000) {
        reject(new Error("too-large"));
      }
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

const pathnameOf = (req: NodeReq) => {
  const url = req.url ?? "";
  return url.split("?")[0] ?? "";
};

export async function handleErbjudandenRequest(req: NodeReq, res: NodeRes) {
  const method = (req.method ?? "GET").toUpperCase();
  const path = pathnameOf(req);

  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const config = loadServerConfig();

  if (path.endsWith("/erbjudanden-checkout") && method === "GET") {
    const state = getCheckoutState(config);
    json(res, 200, { ok: true, ...state });
    return;
  }

  if (path.endsWith("/erbjudanden-order") && method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await readJsonBody(req);
    } catch {
      json(res, 400, {
        ok: false,
        error: "invalid-json",
        message: "Kunde inte läsa beställningen.",
      });
      return;
    }
    const result = await createOfferOrder(body, config);
    if (!result.ok) {
      json(res, result.status, {
        ok: false,
        error: result.error,
        message: result.message,
        fields: result.fields,
      });
      return;
    }
    json(res, 201, {
      ok: true,
      ...result.payment,
      message:
        "Beställningen är sparad med status Inväntar betalning. Ange referensen som meddelande när du betalar. Caselo kontrollerar betalningen manuellt och skickar underlagen inom 24 timmar efter att betalningen är bekräftad.",
    });
    return;
  }

  if (path.endsWith("/erbjudanden-payment-claim") && method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await readJsonBody(req);
    } catch {
      json(res, 400, {
        ok: false,
        error: "invalid-json",
        message: "Kunde inte läsa begäran.",
      });
      return;
    }
    const result = await claimOfferPayment(body, config);
    if (!result.ok) {
      json(res, result.status, {
        ok: false,
        error: result.error,
        message: result.message,
      });
      return;
    }
    json(res, 200, {
      ok: true,
      ...result.payment,
      message:
        "Tack. Caselo kontrollerar betalningen manuellt och skickar underlagen inom 24 timmar efter att betalningen syns hos oss. Detta är inte ett kvitto.",
    });
    return;
  }

  json(res, 404, { ok: false, error: "not-found" });
}

export { formatOfferPrice };

export async function runOfferOrderChecks() {
  const failures: string[] = [];
  const recorded: OfferOrder[] = [];
  const claims: string[] = [];

  const persist: PersistDeps = {
    persistOrder: async (order) => {
      recorded.push(order);
    },
    persistClaim: async (claim) => {
      claims.push(claim.orderRef);
    },
    findOrder: async (orderRef) =>
      recorded.find((item) => item.orderRef === orderRef) ?? null,
  };

  const enabledConfig = loadServerConfig(
    {
      OFFERS_SWISH_NUMBER: "1232593654",
      FORMSPREE_ORDERS_FORM_ID: "",
      OFFERS_SALES_ENABLED: "true",
      OFFERS_LOCAL_STORE: "1",
      NODE_ENV: "test",
    },
    Date.parse("2026-06-01T12:00:00+02:00"),
  );

  const created = await createOfferOrder(
    {
      productId: "snabbhet",
      buyerName: "Test Testsson",
      buyerEmail: "test@example.com",
      buyerEmailConfirm: "test@example.com",
      recipient: "self",
      amountSek: 1,
      price: 1,
      status: "paid",
      paid: true,
    },
    enabledConfig,
    persist,
  );

  // Mejlen till Caselo: svensk tid (vinter- och sommartid) och ingen
  // presentkortslayout när köpet inte är en gåva.
  const winterTime = formatMailTime("2026-11-14T20:45:07.981Z");
  if (winterTime !== "2026-11-14 21:45 (svensk tid)") {
    failures.push(`mail time winter: ${winterTime}`);
  }
  const summerTime = formatMailTime("2026-07-01T22:30:00.000Z");
  if (summerTime !== "2026-07-02 00:30 (svensk tid)") {
    failures.push(`mail time summer: ${summerTime}`);
  }
  if (formatMailTime("inte-ett-datum") !== "inte-ett-datum") {
    failures.push("mail time invalid input not passed through");
  }
  if (giftLayoutMailLabel({ gift: false, giftLayout: DEFAULT_GIFT_LAYOUT }) !== "") {
    failures.push("gift layout shown for non-gift order");
  }
  if (!giftLayoutMailLabel({ gift: true, giftLayout: DEFAULT_GIFT_LAYOUT })) {
    failures.push("gift layout missing for gift order");
  }

  if (!created.ok) failures.push(`create failed: ${created.message}`);
  else {
    if (created.order.amountSek !== 1000) {
      failures.push(`price not server-side: ${created.order.amountSek}`);
    }
    if (created.order.status !== "awaiting_payment") {
      failures.push(`status ${created.order.status}`);
    }
    if (created.payment.paymentVerifiedAutomatically !== false) {
      failures.push("payment marked verified");
    }
  }

  const defaultGift = await createOfferOrder(
    {
      productId: "snabbhet",
      buyerName: "Test Testsson",
      buyerEmail: "test@example.com",
      buyerEmailConfirm: "test@example.com",
      recipient: "gift",
    },
    enabledConfig,
    persist,
  );
  if (!defaultGift.ok) {
    failures.push(`default gift failed: ${defaultGift.message}`);
  } else if (defaultGift.order.giftLayout !== DEFAULT_GIFT_LAYOUT) {
    failures.push(`default gift layout ${defaultGift.order.giftLayout}`);
  } else if (
    defaultGift.order.giftInscription !==
    defaultGiftInscription("snabbhet")
  ) {
    failures.push(`default gift text ${defaultGift.order.giftInscription}`);
  }

  const customGift = await createOfferOrder(
    {
      productId: "friskvard-pass",
      buyerName: "Kim Karlsson",
      buyerEmail: "kim@example.com",
      buyerEmailConfirm: "kim@example.com",
      participantName: "Kim Karlsson",
      focus: "fotbollsfys",
      quantity: 1,
      recipient: "gift",
      giftLayout: "julklapp-gron",
      giftInscription: "God jul",
    },
    enabledConfig,
    persist,
  );
  if (!customGift.ok) {
    failures.push(`custom gift failed: ${customGift.message}`);
  } else if (customGift.order.giftLayout !== "julklapp-gron") {
    failures.push(`custom gift layout ${customGift.order.giftLayout}`);
  } else if (customGift.order.giftInscription !== "God jul") {
    failures.push(`custom gift text ${customGift.order.giftInscription}`);
  }

  const spoofedFriskvard = await createOfferOrder(
    {
      productId: "friskvard",
      buyerName: "Anna Andersson",
      buyerEmail: "anna@example.com",
      buyerEmailConfirm: "anna@example.com",
      participantName: "Anna Andersson",
      focus: "fotbollsfys",
      amountSek: 1,
    },
    enabledConfig,
    persist,
  );
  if (spoofedFriskvard.ok) {
    failures.push("accepted discontinued tre-pass product");
  }

  const combinations: Array<{
    focus: "fotbollsfys" | "lopteknik-snabbhet" | "fys-idrott";
    quantity: number;
    price: number;
  }> = [
    { focus: "fotbollsfys", quantity: 1, price: 990 },
    { focus: "lopteknik-snabbhet", quantity: 1, price: 990 },
    { focus: "fys-idrott", quantity: 3, price: 2700 },
    { focus: "fotbollsfys", quantity: 5, price: 4200 },
    { focus: "fys-idrott", quantity: 10, price: 6930 },
  ];
  for (const combo of combinations) {
    const result = await createOfferOrder(
      {
        productId: "friskvard-pass",
        buyerName: "Kim Karlsson",
        buyerEmail: "kim@example.com",
        buyerEmailConfirm: "kim@example.com",
        participantName: "Kim Karlsson",
        focus: combo.focus,
        sportName: combo.focus === "fys-idrott" ? "padel" : "",
        quantity: combo.quantity,
        amountSek: 9,
      },
      enabledConfig,
      persist,
    );
    if (!result.ok) {
      failures.push(
        `pass/${combo.focus}/${combo.quantity} failed: ${result.message}`,
      );
    } else {
      if (result.order.amountSek !== combo.price) {
        failures.push(
          `pass/${combo.focus}/${combo.quantity} price ${result.order.amountSek}`,
        );
      }
      if (result.order.quantity !== combo.quantity) {
        failures.push(
          `pass/${combo.focus}/${combo.quantity} stored qty ${result.order.quantity}`,
        );
      }
      if (result.order.focusId !== combo.focus) {
        failures.push(
          `pass/${combo.focus}/${combo.quantity} stored ${result.order.focusId}`,
        );
      }
      if (!result.order.focusLabel) {
        failures.push(
          `pass/${combo.focus}/${combo.quantity} missing focus label`,
        );
      }
      if (combo.focus === "fys-idrott") {
        if (result.order.sportName !== "padel") {
          failures.push(
            `pass/${combo.focus}/${combo.quantity} sport ${result.order.sportName}`,
          );
        }
        if (!result.order.focusLabel.includes("padel")) {
          failures.push(
            `pass/${combo.focus}/${combo.quantity} label missing sport`,
          );
        }
      }
    }
  }

  const sportMissing = await createOfferOrder(
    {
      productId: "friskvard-pass",
      buyerName: "Kim Karlsson",
      buyerEmail: "kim@example.com",
      buyerEmailConfirm: "kim@example.com",
      participantName: "Kim Karlsson",
      focus: "fys-idrott",
      quantity: 1,
    },
    enabledConfig,
    persist,
  );
  if (sportMissing.ok) {
    failures.push("accepted fys-idrott without sport name");
  }

  const floorSame = await createOfferOrder(
    {
      productId: "friskvard-pass",
      buyerName: "Kim Karlsson",
      buyerEmail: "kim@example.com",
      buyerEmailConfirm: "kim@example.com",
      participantName: "Kim Karlsson",
      focus: "fotbollsfys",
      quantity: 6,
      amountSek: 1,
    },
    enabledConfig,
    persist,
  );
  if (!floorSame.ok) {
    failures.push(`qty 6 failed: ${floorSame.message}`);
  } else if (floorSame.order.amountSek !== 4860) {
    failures.push(`qty 6 price ${floorSame.order.amountSek}`);
  }

  const tooMany = await createOfferOrder(
    {
      productId: "friskvard-pass",
      buyerName: "Kim Karlsson",
      buyerEmail: "kim@example.com",
      buyerEmailConfirm: "kim@example.com",
      participantName: "Kim Karlsson",
      focus: "fotbollsfys",
      quantity: PT_SESSION_MAX_QUANTITY + 1,
    },
    enabledConfig,
    persist,
  );
  if (tooMany.ok) {
    failures.push(`accepted more than ${PT_SESSION_MAX_QUANTITY} sessions`);
  }

  const legacyFocus = await createOfferOrder(
    {
      productId: "friskvard",
      buyerName: "Anna Andersson",
      buyerEmail: "anna@example.com",
      buyerEmailConfirm: "anna@example.com",
      participantName: "Anna Andersson",
      focus: "kom-igang",
    },
    enabledConfig,
    persist,
  );
  if (legacyFocus.ok) {
    failures.push("accepted legacy focus kom-igang for new order");
  }

  if (getFocusLabel("kom-igang") !== "Kom igång") {
    failures.push("legacy focus label missing");
  }
  if (getFocusLabel("") !== "" || getFocusLabel(undefined) !== "") {
    failures.push("empty focus should stay blank for old orders");
  }

  const expectedQuotes: Array<[number, number, number]> = [
    [1, 990, 990],
    [2, 940, 1880],
    [3, 900, 2700],
    [4, 870, 3480],
    [5, 840, 4200],
    [6, 810, 4860],
    [8, 750, 6000],
    [10, 693, 6930],
    [11, 693, 7623],
    [14, 693, 9702],
  ];
  for (const [quantity, unit, total] of expectedQuotes) {
    const quote = getPtSessionQuote(quantity);
    if (quote.unitPriceSek !== unit || quote.totalSek !== total) {
      failures.push(
        `quote ${quantity}: ${quote.unitPriceSek}/${quote.totalSek}`,
      );
    }
  }

  const budgetCases: Array<[number, number | null, number]> = [
    [500, null, 0],
    [990, 1, 0],
    [1000, 1, 10],
    [3000, 3, 300],
    [5000, 6, 140],
    [6930, 10, 0],
    [8000, 11, 377],
    [10000, 14, 298],
  ];
  for (const [amount, quantity, leftover] of budgetCases) {
    const result = getPtSessionsForBudget(amount);
    if (quantity === null) {
      if (result) failures.push(`budget ${amount} should be unaffordable`);
    } else if (!result) {
      failures.push(`budget ${amount} missing`);
    } else if (
      result.quantity !== quantity ||
      result.leftoverSek !== leftover
    ) {
      failures.push(
        `budget ${amount}: ${result.quantity} pass / leftover ${result.leftoverSek}`,
      );
    }
  }

  const nextSessionCases: Array<[number, number | null]> = [
    [1000, 880],
    [3000, 480],
    [5000, 460],
    [6930, 693],
    [8000, 316],
    [10000, 395],
  ];
  for (const [amount, addSek] of nextSessionCases) {
    const result = getPtSessionsForBudget(amount);
    if (!result) {
      failures.push(`next-session ${amount} missing`);
    } else if (result.toNextSessionSek !== addSek) {
      failures.push(
        `next-session ${amount}: ${result.toNextSessionSek}`,
      );
    }
  }

  if (parseSwedishPersonalId("19900101-1234") !== "19900101-1234") {
    failures.push("12-digit personal id not parsed");
  }
  if (parseSwedishPersonalId("900101-1234") !== "900101-1234") {
    failures.push("10-digit personal id not parsed");
  }
  if (parseSwedishPersonalId("abc") !== null) {
    failures.push("invalid personal id accepted");
  }
  if (!needsFriskvardPersonalId(1) || !needsFriskvardPersonalId(4000)) {
    failures.push("personal id should always be required for wellness receipts");
  }

  const wellnessNoId = await createOfferOrder(
    {
      productId: "friskvard-pass",
      buyerName: "Kim Karlsson",
      buyerEmail: "kim@example.com",
      buyerEmailConfirm: "kim@example.com",
      participantName: "Kim Karlsson",
      focus: "fotbollsfys",
      quantity: 5,
      wellnessReceipt: "yes",
      receiptCustomerName: "Kim Karlsson",
    },
    enabledConfig,
    persist,
  );
  if (wellnessNoId.ok) {
    failures.push("accepted 5-pass wellness receipt without personal id");
  }

  const wellnessLowAmountNoId = await createOfferOrder(
    {
      productId: "friskvard-pass",
      buyerName: "Kim Karlsson",
      buyerEmail: "kim@example.com",
      buyerEmailConfirm: "kim@example.com",
      participantName: "Kim Karlsson",
      focus: "fotbollsfys",
      quantity: 1,
      wellnessReceipt: "yes",
      receiptCustomerName: "Kim Karlsson",
    },
    enabledConfig,
    persist,
  );
  if (wellnessLowAmountNoId.ok) {
    failures.push("accepted 1-pass wellness receipt without personal id");
  }

  const wellnessWithId = await createOfferOrder(
    {
      productId: "friskvard-pass",
      buyerName: "Kim Karlsson",
      buyerEmail: "kim@example.com",
      buyerEmailConfirm: "kim@example.com",
      participantName: "Kim Karlsson",
      focus: "fotbollsfys",
      quantity: 5,
      wellnessReceipt: "yes",
      receiptCustomerName: "Kim Karlsson",
      personalId: "19900101-1234",
    },
    enabledConfig,
    persist,
  );
  if (!wellnessWithId.ok) {
    failures.push(`5-pass wellness with id failed: ${wellnessWithId.message}`);
  } else if (!wellnessWithId.order.wellnessReceipt) {
    failures.push("5-pass wellness not stored");
  } else if (wellnessWithId.order.personalId !== "19900101-1234") {
    failures.push(`stored personal id ${wellnessWithId.order.personalId}`);
  } else if (wellnessWithId.order.receiptCustomerName !== "Kim Karlsson") {
    failures.push("receipt customer name missing");
  } else {
    // Orderöversikten på betalningssidan visar kvittoraden utifrån svaret.
    if (toPaymentView(wellnessWithId.order, enabledConfig).wellnessReceipt !== true) {
      failures.push("payment view should carry wellnessReceipt");
    }
    const withoutReceipt = toPaymentView(
      { ...wellnessWithId.order, wellnessReceipt: false },
      enabledConfig,
    );
    if (withoutReceipt.wellnessReceipt !== undefined) {
      failures.push("payment view wellnessReceipt should be omitted when not requested");
    }
  }

  const wellnessSnabbhetNoId = await createOfferOrder(
    {
      productId: "snabbhet",
      buyerName: "Test Testsson",
      buyerEmail: "test@example.com",
      buyerEmailConfirm: "test@example.com",
      recipient: "self",
      wellnessReceipt: "yes",
      receiptCustomerName: "Test Testsson",
    },
    enabledConfig,
    persist,
  );
  if (wellnessSnabbhetNoId.ok) {
    failures.push("accepted snabbhet wellness receipt without personal id");
  }

  const wellnessSnabbhet = await createOfferOrder(
    {
      productId: "snabbhet",
      buyerName: "Test Testsson",
      buyerEmail: "test@example.com",
      buyerEmailConfirm: "test@example.com",
      recipient: "self",
      wellnessReceipt: "yes",
      receiptCustomerName: "Test Testsson",
      personalId: "19900101-1234",
    },
    enabledConfig,
    persist,
  );
  if (!wellnessSnabbhet.ok) {
    failures.push(`snabbhet wellness with id failed: ${wellnessSnabbhet.message}`);
  } else if (wellnessSnabbhet.order.personalId !== "19900101-1234") {
    failures.push("snabbhet should store personal id on wellness receipt");
  }

  const wellnessMissingName = await createOfferOrder(
    {
      productId: "snabbhet",
      buyerName: "Test Testsson",
      buyerEmail: "test@example.com",
      buyerEmailConfirm: "test@example.com",
      recipient: "self",
      wellnessReceipt: "yes",
    },
    enabledConfig,
    persist,
  );
  if (wellnessMissingName.ok) {
    failures.push("accepted wellness receipt without customer name");
  }

  if (created.ok && created.order.wellnessReceipt) {
    failures.push("default wellness receipt should be false");
  }

  const checkoutPackages = getCheckoutState(enabledConfig).packages;
  if (checkoutPackages["friskvard-pass"]?.priceSek !== 990) {
    failures.push("checkout missing pass list price");
  }
  if (checkoutPackages.friskvard?.priceSek !== 2700) {
    failures.push("checkout missing legacy tre-pass price");
  }

  const passOrder = recorded.find((item) => item.productId === "friskvard-pass");
  if (!passOrder) {
    failures.push("no enstaka pass order recorded");
  } else if (!/^PT-[2-9A-HJKMNP-Z]{6}$/.test(passOrder.orderRef)) {
    failures.push(`unexpected pass ref ${passOrder.orderRef}`);
  } else {
    const legacyClaim = await claimOfferPayment(
      { orderRef: "CASELO-FRP-3D53AB78", paid: true },
      enabledConfig,
      persist,
    );
    if (!legacyClaim.ok) {
      failures.push("legacy CASELO-FRP ref no longer accepted");
    } else if (legacyClaim.payment.productId !== "friskvard-pass") {
      failures.push(`legacy ref product ${legacyClaim.payment.productId}`);
    }
    const badClaim = await claimOfferPayment(
      { orderRef: "XX-ABCDEF", paid: true },
      enabledConfig,
      persist,
    );
    if (badClaim.ok) failures.push("accepted unknown ref prefix");

    // Publicerat läge: Jag har betalat ska bekräftas utan något inskick till Formspree.
    const publishedConfig = loadServerConfig(
      {
        OFFERS_SWISH_NUMBER: "1232593654",
        FORMSPREE_ORDERS_FORM_ID: "testform",
        OFFERS_SALES_ENABLED: "true",
        NODE_ENV: "production",
      },
      Date.parse("2026-06-01T12:00:00+02:00"),
    );
    const realFetch = globalThis.fetch;
    let claimFetchCalls = 0;
    const sentPayloads: Record<string, unknown>[] = [];
    globalThis.fetch = (async (_url: unknown, init?: { body?: unknown }) => {
      claimFetchCalls += 1;
      sentPayloads.push(JSON.parse(String(init?.body ?? "{}")));
      return new Response("{}");
    }) as typeof fetch;
    try {
      // En beställning ska ge exakt ett inskick, med kundens valda betalsätt.
      const publishedOrder = await createOfferOrder(
        {
          productId: "snabbhet",
          buyerName: "Test Testsson",
          buyerEmail: "test@example.com",
          buyerEmailConfirm: "test@example.com",
          recipient: "self",
          paymentMethod: "bankgiro",
        },
        publishedConfig,
      );
      if (!publishedOrder.ok) {
        failures.push(`published order failed: ${publishedOrder.message}`);
      } else if (sentPayloads.length !== 1) {
        failures.push(`order sent ${sentPayloads.length} Formspree submission(s)`);
      } else {
        const mail = sentPayloads[0];
        if (
          mail._subject !==
          `Ny beställning ${publishedOrder.order.orderRef} – Inväntar betalning (Bankgiro)`
        ) {
          failures.push(`order mail subject ${String(mail._subject)}`);
        }
        if (!String(mail.betalsatt_enligt_kund).startsWith("Bankgiro")) {
          failures.push(`order mail method ${String(mail.betalsatt_enligt_kund)}`);
        }
      }
      claimFetchCalls = 0;
      const publishedClaim = await claimOfferPayment(
        { orderRef: passOrder.orderRef, paymentMethod: "swish" },
        publishedConfig,
      );
      if (publishedConfig.allowLocalStore) {
        failures.push("published config unexpectedly allows local store");
      }
      if (!publishedClaim.ok) {
        failures.push("published claim failed without a notification channel");
      }
      if (claimFetchCalls !== 0) {
        failures.push(`payment claim sent ${claimFetchCalls} Formspree submission(s)`);
      }
    } finally {
      globalThis.fetch = realFetch;
    }
    const claimedPass = await claimOfferPayment(
      { orderRef: passOrder.orderRef, paid: true },
      enabledConfig,
      persist,
    );
    if (!claimedPass.ok) {
      failures.push(`FRP claim failed: ${claimedPass.message}`);
    } else if (claimedPass.payment.amountSek !== 990) {
      failures.push(`FRP claim price ${claimedPass.payment.amountSek}`);
    } else if (claimedPass.payment.status !== "awaiting_payment") {
      failures.push("FRP claim marked paid");
    }
  }

  const fivePassOrder = recorded.find((item) => item.quantity === 5);
  if (!fivePassOrder) {
    failures.push("no 5-pass order recorded");
  } else {
    const claimedFive = await claimOfferPayment(
      { orderRef: fivePassOrder.orderRef, paid: true },
      enabledConfig,
      persist,
    );
    if (!claimedFive.ok) {
      failures.push(`5-pass claim failed: ${claimedFive.message}`);
    } else if (claimedFive.payment.amountSek !== 4200) {
      failures.push(`5-pass claim price ${claimedFive.payment.amountSek}`);
    }
  }

  if (created.ok) {
    const claimed = await claimOfferPayment(
      { orderRef: created.order.orderRef, status: "paid", paid: true },
      enabledConfig,
      persist,
    );
    if (!claimed.ok) failures.push(`claim failed: ${claimed.message}`);
    else if (claimed.payment.status !== "awaiting_payment") {
      failures.push("claim changed status to paid");
    } else if (!claimed.payment.customerReportedPayment) {
      failures.push("claim did not record customer report");
    }
  }

  const missing = getCheckoutState(
    loadServerConfig(
      {
        OFFERS_SWISH_NUMBER: "",
        FORMSPREE_ORDERS_FORM_ID: "",
        NODE_ENV: "production",
        OFFERS_SALES_ENABLED: "true",
      },
      Date.parse("2026-06-01T12:00:00+02:00"),
    ),
  );
  // Swish-numret finns i koden, men utan aviseringskanal ska köp vara stängt.
  if (missing.purchaseEnabled) failures.push("purchase enabled without config");
  if (missing.reason !== "missing_notify") {
    failures.push(`production without Formspree gave ${missing.reason}`);
  }

  if (!isValidSwishNumber(OFFER_SWISH_NUMBER)) {
    failures.push("swish number in code is invalid");
  }
  const swishFromCode = loadServerConfig(
    { NODE_ENV: "test" },
    Date.parse("2026-06-01T12:00:00+02:00"),
  );
  if (swishFromCode.swishNumber !== normalizeSwishNumber(OFFER_SWISH_NUMBER)) {
    failures.push(`swish number not read from code: ${swishFromCode.swishNumber}`);
  }
  if (!getCheckoutState(swishFromCode).purchaseEnabled) {
    failures.push("purchase closed although swish number is in code");
  }
  const swishTypo = loadServerConfig(
    { NODE_ENV: "test", OFFERS_SWISH_NUMBER: "12345" },
    Date.parse("2026-06-01T12:00:00+02:00"),
  );
  if (swishTypo.swishNumber !== normalizeSwishNumber(OFFER_SWISH_NUMBER)) {
    failures.push("mistyped swish override should fall back to code number");
  }
  if (enabledConfig.swishNumber !== "1232593654") {
    failures.push("valid swish override not used");
  }
  if (
    getCheckoutState({ ...swishFromCode, swishNumber: "" }).reason !==
    "missing_swish"
  ) {
    failures.push("missing swish number should close purchases");
  }

  const ended = getCheckoutState(
    loadServerConfig(
      {
        OFFERS_SWISH_NUMBER: "1232593654",
        FORMSPREE_ORDERS_FORM_ID: "abc",
        NODE_ENV: "production",
        OFFERS_SALES_ENABLED: "true",
      },
      Date.parse("2027-01-01T00:00:00+01:00"),
    ),
  );
  if (ended.purchaseEnabled || ended.salesOpen) {
    failures.push("purchase still open after sales end");
  }

  const blocked = await createOfferOrder(
    {
      productId: "snabbhet",
      buyerName: "Test Testsson",
      buyerEmail: "test@example.com",
      buyerEmailConfirm: "test@example.com",
      recipient: "self",
    },
    loadServerConfig(
      { NODE_ENV: "production", OFFERS_SWISH_NUMBER: "" },
      Date.parse("2026-06-01T12:00:00+02:00"),
    ),
    persist,
  );
  if (blocked.ok) failures.push("created order without notify channel");

  // Bankgiro: testnumret 123-4566 är påhittat men har giltig kontrollsiffra.
  if (!isValidBankgiroNumber(OFFER_BANKGIRO_NUMBER)) {
    failures.push("bankgiro number in code is invalid");
  }
  if (created.ok) {
    // Utan inställning gäller numret i koden.
    if (
      created.payment.bankgiroNumber !==
        normalizeBankgiroNumber(OFFER_BANKGIRO_NUMBER) ||
      created.payment.bankgiroNumberDisplay !== OFFER_BANKGIRO_NUMBER
    ) {
      failures.push(
        `default bankgiro view ${created.payment.bankgiroNumberDisplay}`,
      );
    }
    const noBankgiroClaim = await claimOfferPayment(
      { orderRef: created.order.orderRef, paymentMethod: "bankgiro" },
      { ...enabledConfig, bankgiroNumber: "" },
      persist,
    );
    if (!noBankgiroClaim.ok) {
      failures.push("bankgiro claim without bankgiro failed");
    } else if (
      noBankgiroClaim.payment.reportedPaymentMethod ||
      noBankgiroClaim.payment.bankgiroNumber
    ) {
      failures.push("bankgiro method recorded without bankgiro");
    }
  }
  if (
    !isValidBankgiroNumber("123-4566") ||
    isValidBankgiroNumber("123-4567") ||
    isValidBankgiroNumber("12345") ||
    isValidBankgiroNumber("0000-0000")
  ) {
    failures.push("bankgiro validation wrong");
  }
  if (
    formatBankgiroNumber("1234566") !== "123-4566" ||
    formatBankgiroNumber("12345674") !== "1234-5674"
  ) {
    failures.push("bankgiro format wrong");
  }
  const bankgiroEnv = {
    OFFERS_SWISH_NUMBER: "1232593654",
    FORMSPREE_ORDERS_FORM_ID: "",
    OFFERS_SALES_ENABLED: "true",
    OFFERS_LOCAL_STORE: "1",
    NODE_ENV: "test",
  };
  const bankgiroNow = Date.parse("2026-06-01T12:00:00+02:00");
  const typoConfig = loadServerConfig(
    { ...bankgiroEnv, OFFERS_BANKGIRO_NUMBER: "123-4567" },
    bankgiroNow,
  );
  if (
    typoConfig.bankgiroNumber !== normalizeBankgiroNumber(OFFER_BANKGIRO_NUMBER)
  ) {
    failures.push("mistyped bankgiro override should fall back to code number");
  }
  if (!getCheckoutState(typoConfig).purchaseEnabled) {
    failures.push("mistyped bankgiro should not block Swish purchases");
  }
  const bankgiroConfig = loadServerConfig(
    { ...bankgiroEnv, OFFERS_BANKGIRO_NUMBER: "123-4566" },
    bankgiroNow,
  );
  const bankgiroOrder = await createOfferOrder(
    {
      productId: "snabbhet",
      buyerName: "Test Testsson",
      buyerEmail: "test@example.com",
      buyerEmailConfirm: "test@example.com",
      recipient: "self",
      paymentMethod: "bankgiro",
    },
    bankgiroConfig,
    persist,
  );
  if (!bankgiroOrder.ok) {
    failures.push(`bankgiro order failed: ${bankgiroOrder.message}`);
  } else {
    if (
      bankgiroOrder.order.chosenPaymentMethod !== "bankgiro" ||
      bankgiroOrder.payment.chosenPaymentMethod !== "bankgiro"
    ) {
      failures.push("chosen payment method bankgiro not kept on order");
    }
    const bankgiroMail = chosenPaymentMailInfo(bankgiroOrder.order, bankgiroConfig);
    if (
      bankgiroMail.subjectSuffix !== " (Bankgiro)" ||
      !bankgiroMail.field.startsWith("Bankgiro") ||
      !bankgiroMail.warning.includes("1–2 bankdagar") ||
      !bankgiroMail.warning.includes(bankgiroOrder.order.orderRef)
    ) {
      failures.push(`bankgiro mail info ${JSON.stringify(bankgiroMail)}`);
    }
    const swishMail = chosenPaymentMailInfo(
      { orderRef: "SN-ABC234", chosenPaymentMethod: "swish" },
      bankgiroConfig,
    );
    if (
      swishMail.subjectSuffix !== " (Swish)" ||
      !swishMail.warning.includes("titta även på bankgirot")
    ) {
      failures.push(`swish mail info ${JSON.stringify(swishMail)}`);
    }
    const unknownMail = chosenPaymentMailInfo(
      { orderRef: "SN-ABC234" },
      bankgiroConfig,
    );
    if (unknownMail.subjectSuffix !== "" || unknownMail.field !== "Ej angivet") {
      failures.push(`unknown mail info ${JSON.stringify(unknownMail)}`);
    }
    if (!getCheckoutState(bankgiroConfig).bankgiroAvailable) {
      failures.push("checkout state does not announce bankgiro");
    }
    const oddMethodOrder = await createOfferOrder(
      {
        productId: "snabbhet",
        buyerName: "Test Testsson",
        buyerEmail: "test@example.com",
        buyerEmailConfirm: "test@example.com",
        recipient: "self",
        paymentMethod: "kort",
      },
      bankgiroConfig,
      persist,
    );
    if (!oddMethodOrder.ok || oddMethodOrder.order.chosenPaymentMethod) {
      failures.push("unknown chosen payment method not ignored");
    }
    if (
      bankgiroOrder.payment.bankgiroNumber !== "1234566" ||
      bankgiroOrder.payment.bankgiroNumberDisplay !== "123-4566"
    ) {
      failures.push(
        `bankgiro view ${bankgiroOrder.payment.bankgiroNumberDisplay}`,
      );
    }
    if (!bankgiroOrder.payment.swishAppUrl) {
      failures.push("swish missing when bankgiro configured");
    }
    const bankgiroClaim = await claimOfferPayment(
      {
        orderRef: bankgiroOrder.order.orderRef,
        paymentMethod: "bankgiro",
        paid: true,
      },
      bankgiroConfig,
      persist,
    );
    if (!bankgiroClaim.ok) {
      failures.push(`bankgiro claim failed: ${bankgiroClaim.message}`);
    } else {
      if (bankgiroClaim.payment.reportedPaymentMethod !== "bankgiro") {
        failures.push("bankgiro claim method not recorded");
      }
      if (bankgiroClaim.payment.status !== "awaiting_payment") {
        failures.push("bankgiro claim marked paid");
      }
      if (bankgiroClaim.payment.bankgiroNumberDisplay !== "123-4566") {
        failures.push("bankgiro claim lost bankgiro number");
      }
    }
    const oddMethodClaim = await claimOfferPayment(
      { orderRef: bankgiroOrder.order.orderRef, paymentMethod: "kort" },
      bankgiroConfig,
      persist,
    );
    if (!oddMethodClaim.ok || oddMethodClaim.payment.reportedPaymentMethod) {
      failures.push("unknown payment method not ignored");
    }
  }

  return { ok: failures.length === 0, failures, recorded: recorded.length };
}
