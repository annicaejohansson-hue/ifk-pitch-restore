import {
  formatOfferPriceWithVat,
  formatPtProductName,
  formatPtReceiptName,
  getFocusLabel,
  getGiftLayout,
  needsFriskvardPersonalId,
  OFFER_BOOKABLE_HOURS,
  OFFER_CONTACT_EMAIL,
  OFFER_FIRST_VISIT_END_LABEL,
  OFFER_NO_TIME_LINE,
  OFFER_PATHS,
  OFFER_PLACE,
  OFFER_PRODUCTS,
  type FriskvardFocusId,
  type GiftLayoutId,
  type OfferProductId,
} from "./erbjudanden.js";

const BOOKING_PAGE = "https://www.caseloidrottsmedicin.se/erbjudanden/boka";

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
  giftRecipientName?: string;
  giftInscription?: string;
  participantName?: string;
  focusId?: FriskvardFocusId;
  focusLabel?: string;
  wellnessReceipt?: boolean;
  receiptCustomerName?: string;
  personalId?: string;
  receiptName?: string;
};

export { getFocusLabel };

function wellnessChecklistLines(ctx: FulfillmentContext): string[] {
  if (!ctx.wellnessReceipt) {
    return ["Kunden har inte begärt särskilt kvitto för friskvårdsbidrag."];
  }
  const specified =
    ctx.receiptName ||
    (ctx.quantity
      ? formatPtReceiptName(ctx.quantity)
      : OFFER_PRODUCTS[ctx.productId].receiptName);
  const lines = [
    `Kunden har begärt kvitto för friskvårdsbidrag. Kund på kvitto: ${ctx.receiptCustomerName || "ej angiven"}.`,
  ];
  if (ctx.personalId) {
    lines.push(`Personnummer på kvitto: ${ctx.personalId}.`);
  } else if (needsFriskvardPersonalId(ctx.amountSek)) {
    lines.push(
      "Personnummer saknas. Det krävs på kvittot när beloppet överstiger 4 000 kr.",
    );
  }
  lines.push(
    `Kvittot ska innehålla: företagsnamn, organisationsnummer, produktnamn (${specified})${ctx.amountSek > 1000 ? ", antal tillfällen eller period" : ""}, moms, belopp inklusive moms, datum och kund.`,
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
    `Företagsuppgifter på kvitto: komplettera med Caselos officiella uppgifter. Hitta inte på organisationsnummer eller momssats.`,
  ];

  if (ctx.productId === "snabbhet") {
    const layout = ctx.giftLayout ? getGiftLayout(ctx.giftLayout) : null;
    const recipient = ctx.gift
      ? `Presentkortet mejlas till köparen. Utformning: ${layout?.label || "ej angiven"}. Text på kortet: ${ctx.giftInscription || ctx.giftRecipientName || "ej angiven"}.`
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
  const giftLine = ctx.gift
    ? `Presentkort. Utformning: ${layout?.label || "ej angiven"}. Text på kortet: ${ctx.giftInscription || ctx.giftRecipientName || "ej angiven"}.`
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
      ? `Detta är ett presentkort för snabbhetspaketet${ctx.giftInscription ? `, med texten “${ctx.giftInscription}”` : ctx.giftRecipientName ? ` till ${ctx.giftRecipientName}` : ""}${layout ? `, utformning ${layout.label.toLowerCase()}` : ""}. Presentkortet skickas till köparens e-postadress.`
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
