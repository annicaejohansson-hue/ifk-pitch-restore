import type { GiftLayoutId, OfferProductId } from "@/data/erbjudanden";

export type CheckoutState = {
  ok: boolean;
  purchaseEnabled: boolean;
  salesOpen: boolean;
  reason: string;
  message: string;
  contactEmail: string;
  packages: Record<
    OfferProductId,
    { id: OfferProductId; name: string; priceSek: number; priceLabel: string }
  >;
};

export type PaymentMethod = "swish" | "bankgiro";

export type PaymentState = {
  ok: boolean;
  orderRef: string;
  status: "awaiting_payment";
  customerReportedPayment: boolean;
  productId: OfferProductId;
  productName: string;
  amountSek: number;
  amountLabel: string;
  quantity?: number;
  focusLabel?: string;
  swishNumber: string;
  swishNumberDisplay: string;
  swishAppUrl: string;
  /** Tomt eller saknas när bankgiro inte erbjuds (även i äldre sparade betalningar). */
  bankgiroNumber?: string;
  bankgiroNumberDisplay?: string;
  reportedPaymentMethod?: PaymentMethod;
  paymentVerifiedAutomatically: false;
  message: string;
};

export type OrderPayload = {
  productId: OfferProductId;
  buyerName: string;
  buyerEmail: string;
  buyerEmailConfirm: string;
  recipient?: "self" | "gift";
  giftLayout?: GiftLayoutId;
  giftRecipientName?: string;
  giftInscription?: string;
  participantName?: string;
  focus?: string;
  sportName?: string;
  quantity?: number;
  wellnessReceipt?: "yes" | "no";
  receiptCustomerName?: string;
  personalId?: string;
  website?: string;
};

const parseJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export async function fetchCheckoutState(): Promise<CheckoutState> {
  const response = await fetch("/api/erbjudanden-checkout", {
    headers: { Accept: "application/json" },
  });
  const data = await parseJson(response);
  if (!response.ok || !data?.packages) {
    throw new Error("checkout-unavailable");
  }
  return data as CheckoutState;
}

export async function submitOfferOrder(
  payload: OrderPayload,
): Promise<PaymentState> {
  const response = await fetch("/api/erbjudanden-order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(response);
  if (!response.ok || !data?.orderRef) {
    const error = new Error(data?.message || "submit-failed") as Error & {
      fields?: Record<string, string>;
    };
    error.fields = data?.fields;
    throw error;
  }
  return data as PaymentState;
}

export async function submitPaymentClaim(
  orderRef: string,
  paymentMethod: PaymentMethod,
): Promise<PaymentState> {
  const response = await fetch("/api/erbjudanden-payment-claim", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderRef, paymentMethod }),
  });
  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || "claim-failed");
  }
  return data as PaymentState;
}
