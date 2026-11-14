export const OFFER_CONTACT_EMAIL = "henrik@caseloidrottsmedicin.se";
/** Caselos Swish-nummer. Offentligt, och ligger i koden så att det följer med vid publicering. */
export const OFFER_SWISH_NUMBER = "123 510 34 11";
/** Caselos bankgironummer. Offentligt, och ligger i koden så att det följer med vid publicering. */
export const OFFER_BANKGIRO_NUMBER = "5173-2006";
export const OFFER_PLACE = "Danderyd Arena";
export const OFFER_BOOKABLE_HOURS = "vardagar kl. 09.30–15.00";
export const OFFER_SALES_END_ISO = "2026-12-31T23:59:59.999+01:00";
export const OFFER_FIRST_VISIT_END_ISO = "2027-12-31T23:59:59.999+01:00";
export const OFFER_SALES_END_LABEL = "31 december 2026";
export const OFFER_FIRST_VISIT_END_LABEL = "31 december 2027";
export const OFFER_TIME_ZONE = "Europe/Stockholm";

export const OFFER_PLACE_LINE = `Plats: ${OFFER_PLACE}.`;
export const OFFER_HOURS_LINE = `Bokningsbara tider är ${OFFER_BOOKABLE_HOURS}.`;
export const OFFER_NO_TIME_LINE =
  "Tid för träningstillfällena behöver inte bokas vid köpet.";
export const OFFER_CONFIRMATION_LINE =
  "Bekräftelse, kvitto och bokningsinformation mejlas inom 24 timmar efter betalning. Bara hör av dig ifall du behöver det tidigare än så!";
export const OFFER_SALES_UNTIL_LINE = `Erbjudandet gäller till och med ${OFFER_SALES_END_LABEL}.`;
export const OFFER_FIRST_VISIT_LINE = `Första besöket ska genomföras senast ${OFFER_FIRST_VISIT_END_LABEL}.`;
export const OFFER_WEATHER_LINE =
  "Om delar av träningen sker utomhus anpassas genomförandet efter väder och underlag.";
export const OFFER_SURFACE_LINE =
  "Testerna förutsätter lämpligt underlag. Vid exempelvis snö eller is kan tiden behöva bokas om.";

/** Numrerade punkter under "I paketet ingår:" på kortet för Snabbhetspaketet. */
export const SNABBHET_OVERVIEW_POINTS = [
  "Du värmer upp med instruktör och testar din snabbhet med laserportar. Du får ett individuellt träningsprogram och provar övningarna med vägledning.",
  "Du kommer tillbaka efter cirka åtta veckor för uppföljande snabbhetstest.",
] as const;

/** Första punkterna i listan under "Läs mer" för Snabbhetspaketet. */
export const SNABBHET_DETAIL_POINTS = [
  "Du testar på 10, 20 och 30 meter.",
  "Du får startövningar och vägledning för hur du ökar träningen.",
  "Första besöket tar ca 75 min och återbesöket tar ca 45 min.",
] as const;

export type OfferProductId = "snabbhet" | "friskvard-pass" | "friskvard";

export type OfferProduct = {
  id: OfferProductId;
  name: string;
  receiptName: string;
  priceSek: number;
  /** Visningspris före kampanj. Påverkar inte beloppet som tas ut. */
  ordinaryPriceSek?: number;
  vatIncluded: true;
  refPrefix: string;
  path: string;
  durationNote: string;
};

export const OFFER_PRODUCTS: Record<OfferProductId, OfferProduct> = {
  snabbhet: {
    id: "snabbhet",
    name: "Snabbhetspaket",
    receiptName:
      "Snabbhetstest med laserportar, individuellt träningsprogram och återtest",
    priceSek: 1000,
    ordinaryPriceSek: 2685,
    vatIncluded: true,
    refPrefix: "SN",
    path: "/erbjudanden/friskvard",
    durationNote: "Första besöket ca 75 minuter, återtest ca 45 minuter",
  },
  "friskvard-pass": {
    id: "friskvard-pass",
    name: "Personlig träning",
    receiptName:
      "Individuella träningspass à 60 minuter med personlig återkoppling och övningar att fortsätta med",
    priceSek: 990,
    vatIncluded: true,
    refPrefix: "PT",
    path: "/erbjudanden/friskvard",
    durationNote: "60 minuter per pass",
  },
  friskvard: {
    id: "friskvard",
    name: "Träningspaket tre pass",
    receiptName:
      "Personligt träningspaket: 3 individuella träningspass à 60 minuter och personligt träningsprogram",
    priceSek: 2700,
    vatIncluded: true,
    refPrefix: "TP",
    path: "/erbjudanden/friskvard",
    durationNote: "3 individuella träningspass à 60 minuter",
  },
};

/** Styckpris för 1 pass. Rabattstegen finns i PT_SESSION_LADDER. */
export const PT_SESSION_LIST_PRICE_SEK = 990;
export const PT_SESSION_MIN_QUANTITY = 1;
export const PT_SESSION_FLOOR_QUANTITY = 10;
export const PT_SESSION_MAX_QUANTITY = 30;
export const PT_SESSION_DEFAULT_QUANTITY = 0;

const PT_SESSION_LADDER: Record<
  number,
  { totalSek: number; unitPriceSek: number; discountPercent: number }
> = {
  1: { totalSek: 990, unitPriceSek: 990, discountPercent: 0 },
  2: { totalSek: 1880, unitPriceSek: 940, discountPercent: 5 },
  3: { totalSek: 2700, unitPriceSek: 900, discountPercent: 9 },
  4: { totalSek: 3480, unitPriceSek: 870, discountPercent: 12 },
  5: { totalSek: 4200, unitPriceSek: 840, discountPercent: 15 },
  6: { totalSek: 4860, unitPriceSek: 810, discountPercent: 18 },
  7: { totalSek: 5460, unitPriceSek: 780, discountPercent: 21 },
  8: { totalSek: 6000, unitPriceSek: 750, discountPercent: 24 },
  9: { totalSek: 6480, unitPriceSek: 720, discountPercent: 27 },
  10: { totalSek: 6930, unitPriceSek: 693, discountPercent: 30 },
};

export type PtSessionQuote = {
  quantity: number;
  unitPriceSek: number;
  listUnitPriceSek: number;
  totalSek: number;
  listTotalSek: number;
  discountPerSessionSek: number;
  discountTotalSek: number;
  discountPercent: number;
  atFloor: boolean;
};

export function sanitizePtQuantityDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 2);
}

export function sanitizePtAmountDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function parsePtAmount(value: unknown): number | null {
  const digits = sanitizePtAmountDigits(String(value ?? ""));
  if (!digits) return null;
  const amount = Number(digits);
  if (!Number.isInteger(amount) || amount < 0) return null;
  return amount;
}

export type PtBudgetQuote = {
  quantity: number;
  quote: PtSessionQuote;
  leftoverSek: number;
  amountSek: number;
  toNextSessionSek: number | null;
};

export function getPtSessionsForBudget(amountSek: number): PtBudgetQuote | null {
  if (!Number.isInteger(amountSek) || amountSek < PT_SESSION_LIST_PRICE_SEK) {
    return null;
  }
  let quantity = PT_SESSION_MIN_QUANTITY;
  for (let q = PT_SESSION_MIN_QUANTITY; q <= PT_SESSION_MAX_QUANTITY; q++) {
    if (getPtSessionQuote(q).totalSek <= amountSek) {
      quantity = q;
    } else {
      break;
    }
  }
  const quote = getPtSessionQuote(quantity);
  const toNextSessionSek =
    quantity < PT_SESSION_MAX_QUANTITY
      ? getPtSessionQuote(quantity + 1).totalSek - amountSek
      : null;
  return {
    quantity,
    quote,
    leftoverSek: amountSek - quote.totalSek,
    amountSek,
    toNextSessionSek,
  };
}

export function parsePtQuantity(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) {
    if (
      value >= PT_SESSION_MIN_QUANTITY &&
      value <= PT_SESSION_MAX_QUANTITY
    ) {
      return value;
    }
    return null;
  }
  const digits = sanitizePtQuantityDigits(String(value ?? ""));
  if (!digits) return null;
  const quantity = Number(digits);
  if (
    !Number.isInteger(quantity) ||
    quantity < PT_SESSION_MIN_QUANTITY ||
    quantity > PT_SESSION_MAX_QUANTITY
  ) {
    return null;
  }
  return quantity;
}

export function getPtSessionQuote(quantity: number): PtSessionQuote {
  const safeQuantity = Math.min(
    PT_SESSION_MAX_QUANTITY,
    Math.max(PT_SESSION_MIN_QUANTITY, quantity),
  );
  const floor = PT_SESSION_LADDER[PT_SESSION_FLOOR_QUANTITY];
  const step = PT_SESSION_LADDER[safeQuantity] ?? {
    totalSek: floor.unitPriceSek * safeQuantity,
    unitPriceSek: floor.unitPriceSek,
    discountPercent: floor.discountPercent,
  };
  const listTotalSek = PT_SESSION_LIST_PRICE_SEK * safeQuantity;
  const discountTotalSek = listTotalSek - step.totalSek;
  return {
    quantity: safeQuantity,
    unitPriceSek: step.unitPriceSek,
    listUnitPriceSek: PT_SESSION_LIST_PRICE_SEK,
    totalSek: step.totalSek,
    listTotalSek,
    discountPerSessionSek: PT_SESSION_LIST_PRICE_SEK - step.unitPriceSek,
    discountTotalSek,
    discountPercent: step.discountPercent,
    atFloor: safeQuantity >= PT_SESSION_FLOOR_QUANTITY,
  };
}

export function formatPtProductName(quantity: number): string {
  return quantity === 1
    ? "1 träningspass"
    : `${quantity} träningspass`;
}

export function formatPtReceiptName(quantity: number): string {
  if (quantity === 1) {
    return "Individuellt träningspass à 60 minuter med personlig återkoppling och övningar att fortsätta med";
  }
  return `${quantity} individuella träningspass à 60 minuter med personlig återkoppling och övningar att fortsätta med`;
}

export type FriskvardSelectableFocusId =
  | "fotbollsfys"
  | "lopteknik-snabbhet"
  | "fys-idrott";

export type FriskvardLegacyFocusId =
  | "kom-igang"
  | "styrka-rorlighet"
  | "fys-sport"
  | "hjalp-mig-valja";

export type FriskvardFocusId =
  | FriskvardSelectableFocusId
  | FriskvardLegacyFocusId;

export const FRISKVARD_FOCUS_OPTIONS: {
  id: FriskvardSelectableFocusId;
  label: string;
  summary: string;
  text: string;
  detail: string;
}[] = [
  {
    id: "fotbollsfys",
    label: "Fotbollsfys",
    summary: "Acceleration, inbromsningar och vändningar.",
    text: "Träna acceleration, inbromsningar och riktningsförändringar. Passet anpassas efter din nivå och det du vill utveckla på fotbollsplanen.",
    detail: "Fotbollsfys: acceleration, inbromsningar och vändningar.",
  },
  {
    id: "lopteknik-snabbhet",
    label: "Löpteknik och snabbhet",
    summary: "Löpsteget och att springa snabbare.",
    text: "Jobba med ditt löpsteg eller träna på att accelerera och springa snabbare. Du får personlig återkoppling och konkreta löpövningar att fortsätta med.",
    detail: "Löpteknik och snabbhet: löpsteget och att springa snabbare.",
  },
  {
    id: "fys-idrott",
    label: "Fys för din idrott/motionsform",
    summary: "Anpassas efter din idrott och nivå.",
    text: "Vill du bli starkare i skidspåret, explosivare på isen eller stabilare i snabba vändningar på padelbanan? Vi utgår från din idrott och anpassar passet efter din nivå och det du vill utveckla.",
    detail: "Fys för din idrott/motionsform: anpassas efter din idrott och nivå.",
  },
];

export const FRISKVARD_FOCUS_LABELS: Record<FriskvardFocusId, string> = {
  fotbollsfys: "Fotbollsfys",
  "lopteknik-snabbhet": "Löpteknik och snabbhet",
  "fys-idrott": "Fys för din idrott/motionsform",
  "kom-igang": "Kom igång",
  "styrka-rorlighet": "Styrka och rörlighet",
  "fys-sport": "Fys för din sport",
  "hjalp-mig-valja": "Hjälp mig välja",
};

const SELECTABLE_FOCUS_IDS = new Set(
  FRISKVARD_FOCUS_OPTIONS.map((item) => item.id),
);

export function isFriskvardProduct(
  id: string | null | undefined,
): id is "friskvard" | "friskvard-pass" {
  return id === "friskvard" || id === "friskvard-pass";
}

export function isSelectableFriskvardFocusId(
  value: string | null | undefined,
): value is FriskvardSelectableFocusId {
  return Boolean(value && SELECTABLE_FOCUS_IDS.has(value as FriskvardSelectableFocusId));
}

export function parseFriskvardFocusId(
  value: string | null | undefined,
): FriskvardSelectableFocusId | null {
  if (!value) return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replaceAll("ö", "o")
    .replaceAll("ä", "a");
  if (normalized === "fotbollsfys" || normalized === "fotboll") {
    return "fotbollsfys";
  }
  if (
    normalized === "lopteknik-snabbhet" ||
    normalized === "lopteknik"
  ) {
    return "lopteknik-snabbhet";
  }
  if (
    normalized === "fys-idrott" ||
    normalized === "fys-sport" ||
    normalized === "idrott"
  ) {
    return "fys-idrott";
  }
  return isSelectableFriskvardFocusId(normalized) ? normalized : null;
}

export function getFocusLabel(id: string | null | undefined): string {
  if (!id) return "";
  return FRISKVARD_FOCUS_LABELS[id as FriskvardFocusId] ?? "";
}

export function parseFriskvardFocusIds(
  value: string | null | undefined,
): FriskvardSelectableFocusId[] {
  if (!value) return [];
  const seen = new Set<FriskvardSelectableFocusId>();
  for (const part of value.split(/[,;]/)) {
    const parsed = parseFriskvardFocusId(part);
    if (parsed) seen.add(parsed);
  }
  return FRISKVARD_FOCUS_OPTIONS.map((item) => item.id).filter((id) =>
    seen.has(id),
  );
}

export function formatFocusLabels(
  ids: string[] | null | undefined,
  sportName?: string,
): string {
  const sport = (sportName ?? "").trim();
  return (ids ?? [])
    .map((id) => {
      const label = getFocusLabel(id);
      if (!label) return "";
      if (id === "fys-idrott" && sport) return `${label} (${sport})`;
      return label;
    })
    .filter(Boolean)
    .join(", ");
}

export type OfferBookingTypeId =
  | "snabbhet-forsta"
  | "snabbhet-atertest"
  | "friskvard";

export const OFFER_BOOKING_TYPES: {
  id: OfferBookingTypeId;
  title: string;
  duration: string;
  description: string;
}[] = [
  {
    id: "snabbhet-forsta",
    title: "Första snabbhetsbesöket",
    duration: "ca 75 minuter",
    description:
      "Samtal, snabbhetstest med laserportar och genomgång av ett individuellt träningsprogram.",
  },
  {
    id: "snabbhet-atertest",
    title: "Återtest snabbhet",
    duration: "45 minuter",
    description:
      "Bokas 8–10 veckor efter första besöket. Återbesöket omfattar själva testet.",
  },
  {
    id: "friskvard",
    title: "Personlig träning / friskvård",
    duration: "60 minuter",
    description:
      "Individuellt träningspass à 60 minuter. Boka tillfällen från ditt köp.",
  },
];

export type GiftLayoutId =
  | "neutral"
  | "julklapp-gron"
  | "julklapp-rod"
  | "fodelsedag";

export const DEFAULT_GIFT_LAYOUT: GiftLayoutId = "neutral";

export const GIFT_PRODUCT_LABEL = {
  snabbhet: "Snabbhetsträning",
  friskvard: "Personlig träning",
} as const;

export function defaultGiftInscription(
  productId: "snabbhet" | "friskvard" | "friskvard-pass",
): string {
  const label =
    productId === "snabbhet"
      ? GIFT_PRODUCT_LABEL.snabbhet
      : GIFT_PRODUCT_LABEL.friskvard;
  return `Presentkort på ${label}`;
}

export const GIFT_LAYOUT_OPTIONS: {
  id: GiftLayoutId;
  label: string;
  shortLabel: string;
  description: string;
  isGift: boolean;
}[] = [
  {
    id: "julklapp-gron",
    label: "Grön",
    shortLabel: "Grön",
    description: "En återhållen julhälsning i mörk grön och guld.",
    isGift: true,
  },
  {
    id: "julklapp-rod",
    label: "Röd",
    shortLabel: "Röd",
    description: "En återhållen julhälsning i mörk röd och guld.",
    isGift: true,
  },
  {
    id: "fodelsedag",
    label: "Beige",
    shortLabel: "Beige",
    description: "En lugn födelsedagshälsning i champagne och guld.",
    isGift: true,
  },
  {
    id: "neutral",
    label: "Mörkblå",
    shortLabel: "Mörkblå",
    description: "En stilren utformning i mörkblått.",
    isGift: true,
  },
];

const GIFT_LAYOUT_IDS = new Set(GIFT_LAYOUT_OPTIONS.map((item) => item.id));

export function isGiftLayoutId(value: string | null | undefined): value is GiftLayoutId {
  return Boolean(value && GIFT_LAYOUT_IDS.has(value as GiftLayoutId));
}

export function parseGiftLayoutId(value: string | null | undefined): GiftLayoutId | null {
  if (!value) return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replaceAll("ö", "o")
    .replaceAll("ä", "a");
  if (normalized === "neutral") return "neutral";
  if (
    normalized === "julklapp-gron" ||
    normalized === "julklappgron" ||
    normalized === "gron" ||
    normalized === "green" ||
    normalized === "julklapp" ||
    normalized === "christmas" ||
    normalized === "jul"
  ) {
    return "julklapp-gron";
  }
  if (
    normalized === "julklapp-rod" ||
    normalized === "julklapprod" ||
    normalized === "rod" ||
    normalized === "red"
  ) {
    return "julklapp-rod";
  }
  if (
    normalized === "fodelsedag" ||
    normalized === "birthday"
  ) {
    return "fodelsedag";
  }
  return null;
}

export function getGiftLayout(id: GiftLayoutId | string) {
  const parsed = parseGiftLayoutId(String(id));
  return (
    GIFT_LAYOUT_OPTIONS.find((item) => item.id === parsed) ??
    GIFT_LAYOUT_OPTIONS.find((item) => item.id === DEFAULT_GIFT_LAYOUT)!
  );
}

export const OFFER_PATHS = {
  snabbhet: "/erbjudanden/friskvard",
  friskvard: "/erbjudanden/friskvard",
  kassa: "/erbjudanden/kassa",
  boka: "/erbjudanden/boka",
  kontakt: "/kontakt",
} as const;

export const OFFER_PAYMENT_HASH = "betalning";

export function offerCheckoutPath(
  product: "snabbhet" | "pass",
  options?: { quantity?: string },
): string {
  const params = new URLSearchParams();
  params.set("produkt", product);
  if (product === "pass" && options?.quantity && options.quantity !== "0") {
    params.set("antal", options.quantity);
  }
  return `${OFFER_PATHS.kassa}?${params.toString()}`;
}

export function formatOfferPrice(priceSek: number): string {
  return `${new Intl.NumberFormat("sv-SE").format(priceSek)} kr`;
}

export function formatOfferPriceWithVat(priceSek: number): string {
  return `${formatOfferPrice(priceSek)} inklusive moms`;
}

/** Skatteverket: namn eller personnummer krävs på kvittot över denna gräns. */
export const FRISKVARD_RECEIPT_ID_THRESHOLD_SEK = 4000;

export function needsFriskvardPersonalId(amountSek: number): boolean {
  return Number.isFinite(amountSek) && amountSek > FRISKVARD_RECEIPT_ID_THRESHOLD_SEK;
}

export function parseSwedishPersonalId(
  value: string | null | undefined,
): string | null {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 12) {
    return `${digits.slice(0, 8)}-${digits.slice(8)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  }
  return null;
}

export function isOfferSalesOpen(nowMs: number = Date.now()): boolean {
  const end = Date.parse(OFFER_SALES_END_ISO);
  return Number.isFinite(end) && nowMs <= end;
}

export function getOfferProduct(id: string): OfferProduct | null {
  if (id === "snabbhet" || id === "friskvard" || id === "friskvard-pass") {
    return OFFER_PRODUCTS[id];
  }
  return null;
}
