import {
  formatOfferPriceWithVat,
  formatPtProductName,
  formatPtReceiptName,
  getFocusLabel,
  getGiftDecoration,
  getGiftLayout,
  OFFER_BOOKABLE_HOURS,
  OFFER_CONTACT_EMAIL,
  OFFER_FIRST_VISIT_END_LABEL,
  OFFER_NO_TIME_LINE,
  OFFER_PATHS,
  OFFER_PLACE,
  OFFER_PRODUCTS,
  type FriskvardFocusId,
  type GiftDecorationId,
  type GiftLayoutId,
  type OfferProductId,
} from "./erbjudanden.js";
import {
  CASELO_LEGAL_NAME,
  CASELO_ORG_NUMBER,
  CASELO_VAT_PERCENT,
  WELLNESS_RECEIPT_PATH,
} from "./caseloCompany.js";

const BOOKING_PAGE = "https://www.caseloidrottsmedicin.se/erbjudanden/boka";
const RECEIPT_PAGE = `https://www.caseloidrottsmedicin.se${WELLNESS_RECEIPT_PATH}`;

export type FulfillmentContext = {
  productId: OfferProductId;
  orderRef: string;
  buyerName: string;
  buyerEmail: string;
  paidAtLabel?: string;
  amountSek: number;
  quantity?: number;
  gift?: boolean;
  giftLayout?: GiftLayoutId;
  giftDecoration?: GiftDecorationId;
  giftRecipientName?: string;
  giftInscription?: string;
  participantName?: string;
  focusId?: FriskvardFocusId;
  focusLabel?: string;
  wellnessReceipt?: boolean;
  receiptCustomerName?: string;
  personalId?: string;
  receiptName?: string;
  /** Kundens valda betalsätt i kassan; används i förifylld kvitto-länk. */
  chosenPaymentMethod?: "swish" | "bankgiro";
};

export { getFocusLabel };

function specifiedReceiptName(ctx: FulfillmentContext): string {
  return (
    ctx.receiptName ||
    (ctx.quantity
      ? formatPtReceiptName(ctx.quantity)
      : OFFER_PRODUCTS[ctx.productId].receiptName)
  );
}

/**
 * Förifylld intern länk till kvittosidan. Datum lämnas tomt så Caselo sätter
 * betalningsdatum när pengarna syns. Personnummer ingår – länken är avsedd
 * för Caselos inkorg, inte för kunden.
 */
export function buildWellnessReceiptPreviewUrl(
  ctx: Pick<
    FulfillmentContext,
    | "orderRef"
    | "amountSek"
    | "receiptCustomerName"
    | "personalId"
    | "receiptName"
    | "quantity"
    | "productId"
    | "chosenPaymentMethod"
    | "paidAtLabel"
  >,
): string {
  const params = new URLSearchParams();
  params.set("ref", ctx.orderRef);
  params.set("produkt", specifiedReceiptName(ctx));
  params.set("belopp", String(ctx.amountSek));
  if (ctx.receiptCustomerName?.trim()) {
    params.set("namn", ctx.receiptCustomerName.trim());
  }
  if (ctx.personalId?.trim()) {
    params.set("personnummer", ctx.personalId.trim());
  }
  if (ctx.chosenPaymentMethod === "bankgiro") {
    params.set("betalsatt", "bankgiro");
  } else if (ctx.chosenPaymentMethod === "swish") {
    params.set("betalsatt", "swish");
  }
  if (ctx.paidAtLabel?.trim()) {
    params.set("datum", ctx.paidAtLabel.trim());
  }
  return `${RECEIPT_PAGE}?${params.toString()}`;
}

function wellnessChecklistLines(ctx: FulfillmentContext): string[] {
  if (!ctx.wellnessReceipt) {
    return ["Kunden har inte begärt särskilt kvitto för friskvårdsbidrag."];
  }
  const specified = specifiedReceiptName(ctx);
  const previewUrl = buildWellnessReceiptPreviewUrl(ctx);
  const lines = [
    `Kunden har begärt kvitto för friskvårdsbidrag. Kund på kvitto: ${ctx.receiptCustomerName || "ej angiven"}.`,
  ];
  if (ctx.personalId) {
    lines.push(`Personnummer på kvitto: ${ctx.personalId}.`);
  } else {
    lines.push(
      "Personnummer saknas. Namn och personnummer ska båda stå på friskvårdskvittot.",
    );
  }
  lines.push(
    `När betalningen syns: öppna förifylld förhandsgranskning, kontrollera uppgifterna, sätt betalningsdatum och skriv ut/spara PDF: ${previewUrl}`,
  );
  lines.push(
    `Produkt på kvitto: ${specified}. Belopp: ${formatOfferPriceWithVat(ctx.amountSek)}.`,
  );
  return lines;
}

export function buildFulfillmentChecklist(ctx: FulfillmentContext): string {
  const product = OFFER_PRODUCTS[ctx.productId];
  const common = [
    `Kontrollera att inbetalningen stämmer med referens ${ctx.orderRef} och belopp ${formatOfferPriceWithVat(ctx.amountSek)}.`,
    "Markera beställningen som betald först när inbetalningen syns hos Caselo. Kundens uppgift om att hen har betalat räcker inte.",
    `Skicka underlagen till köparen: ${ctx.buyerName} <${ctx.buyerEmail}> inom 24 timmar efter bekräftad betalning.`,
    `Bokningsinformation: ${BOOKING_PAGE}`,
    `Plats: ${OFFER_PLACE}. Bokningsbara tider: ${OFFER_BOOKABLE_HOURS}.`,
    OFFER_NO_TIME_LINE,
    `Företagsuppgifter på kvitto: ${CASELO_LEGAL_NAME}, org.nr ${CASELO_ORG_NUMBER}, moms ${CASELO_VAT_PERCENT} %.`,
    ctx.wellnessReceipt
      ? `Förifylld kvittoförhandsgranskning: ${buildWellnessReceiptPreviewUrl(ctx)}`
      : `Skapa friskvårdskvitto (tom mall): ${RECEIPT_PAGE}`,
  ];

  if (ctx.productId === "snabbhet") {
    const layout = ctx.giftLayout ? getGiftLayout(ctx.giftLayout) : null;
    const decoration = ctx.giftDecoration
      ? getGiftDecoration(ctx.giftDecoration).label
      : "Ingen dekoration";
    const recipient = ctx.gift
      ? `Presentkortet mejlas till köparen. Färg: ${layout?.label || "ej angiven"}. Dekoration: ${decoration}. Text på kortet: ${ctx.giftInscription || ctx.giftRecipientName || "ej angiven"}.`
      : "Paketet är köpt till köparen själv. Ej presentkort.";
    return [
      ...common,
      ...wellnessChecklistLines(ctx),
      recipient,
      "Skicka: presentkort för det specificerade snabbhetspaketet, kvitto, bokningslänk för första besöket (ca 75 min) och instruktion att återtest (45 min) bokas 8–10 veckor efter första besöket.",
      `Första besöket ska genomföras senast ${OFFER_FIRST_VISIT_END_LABEL}. Återtestet får ske efter årsskiftet 2027/2028.`,
      "Marknadsför inte paketet som godkänt för friskvårdsbidrag.",
    ].join("\n");
  }

  const quantityLabel =
    ctx.quantity && ctx.quantity > 0
      ? formatPtProductName(ctx.quantity)
      : product.name;
  const layout = ctx.giftLayout ? getGiftLayout(ctx.giftLayout) : null;
  const decoration = ctx.giftDecoration
    ? getGiftDecoration(ctx.giftDecoration).label
    : "Ingen dekoration";
  const giftLine = ctx.gift
    ? `Presentkort. Färg: ${layout?.label || "ej angiven"}. Dekoration: ${decoration}. Text på kortet: ${ctx.giftInscription || ctx.giftRecipientName || "ej angiven"}.`
    : "Köpt till deltagaren, inte som presentkort.";
  const focusLine = `Deltagare: ${ctx.participantName || "ej angiven"}. Fokus: ${ctx.focusLabel || getFocusLabel(ctx.focusId) || "ej angiven"}. Upplägg: ${quantityLabel}.`;
  const specified = ctx.quantity
    ? formatPtReceiptName(ctx.quantity)
    : product.receiptName;
  const bookingLine = `Skicka: personlig bekräftelse med deltagarens namn, specificerad träning (${specified}), kvitto med aktivitet, betalningsdatum, belopp och Caselos företagsuppgifter, samt bokningslänk.`;

  return [
    ...common,
    ...wellnessChecklistLines(ctx),
    giftLine,
    focusLine,
    "Träningen är personlig och kan inte överlåtas eller bytas mot andra tjänster.",
    bookingLine,
    `Träningstillfällena ska genomföras senast ${OFFER_FIRST_VISIT_END_LABEL}.`,
    `Frågor: ${OFFER_CONTACT_EMAIL}`,
  ].join("\n");
}

export function buildCustomerFulfillmentDraft(ctx: FulfillmentContext): string {
  const product = OFFER_PRODUCTS[ctx.productId];
  const amount = formatOfferPriceWithVat(ctx.amountSek);
  const paid = ctx.paidAtLabel ? `Betalningsdatum: ${ctx.paidAtLabel}.` : "";

  if (ctx.productId === "snabbhet") {
    const layout = ctx.giftLayout ? getGiftLayout(ctx.giftLayout) : null;
    const giftLine = ctx.gift
      ? `Detta är ett presentkort för snabbhetspaketet${ctx.giftInscription ? `, med texten “${ctx.giftInscription}”` : ctx.giftRecipientName ? ` till ${ctx.giftRecipientName}` : ""}${layout ? `, färg ${layout.label.toLowerCase()}` : ""}. Presentkortet skickas till köparens e-postadress.`
      : "Detta bekräftar ditt snabbhetspaket.";
    return [
      `Hej ${ctx.buyerName},`,
      "",
      giftLine,
      `Ingår: ${product.receiptName}.`,
      `Belopp: ${amount}. Referens: ${ctx.orderRef}. ${paid}`.trim(),
      `Plats: ${OFFER_PLACE}.`,
      `Boka första besöket (ca 75 minuter) via ${BOOKING_PAGE}?typ=snabbhet-forsta`,
      "Boka återtestet (45 minuter) 8–10 veckor efter första besöket via samma sida.",
      "",
      "Välkommen,",
      "Caselo Idrottsmedicin",
    ].join("\n");
  }

  const specified = ctx.quantity
    ? formatPtReceiptName(ctx.quantity)
    : product.receiptName;
  const bookingCount =
    ctx.quantity && ctx.quantity > 1
      ? `Boka dina ${ctx.quantity} pass via ${BOOKING_PAGE}?typ=friskvard`
      : `Boka ditt pass via ${BOOKING_PAGE}?typ=friskvard`;

  return [
    `Hej ${ctx.buyerName},`,
    "",
    `Detta bekräftar ${product.name.toLowerCase()} för ${ctx.participantName || ctx.buyerName}.`,
    `Ingår: ${specified}.`,
    ctx.focusLabel || getFocusLabel(ctx.focusId)
      ? `Valt fokus: ${ctx.focusLabel || getFocusLabel(ctx.focusId)}.`
      : "",
    `Belopp: ${amount}. Referens: ${ctx.orderRef}. ${paid}`.trim(),
    "Träningen är personlig och kan inte överlåtas eller bytas mot andra tjänster.",
    bookingCount,
    "",
    "Välkommen,",
    "Caselo Idrottsmedicin",
  ]
    .filter(Boolean)
    .join("\n");
}

export const OFFER_TERMS_GAP =
  "Köpvillkor för återbetalning, avbokning och ångerrätt saknas i projektet och ska färdigställas före lansering.";

export { OFFER_PATHS };
