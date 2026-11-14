import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  OFFER_CONTACT_EMAIL,
  OFFER_PATHS,
} from "@/data/erbjudanden";
import {
  submitPaymentClaim,
  type PaymentMethod,
  type PaymentState,
} from "@/lib/erbjudanden/api";
import { cn } from "@/lib/utils";
import { offerGoldCtaClass, offerOutlineCtaClass } from "./offerUi";

type PaymentPanelProps = {
  payment: PaymentState;
  onClaimed: (next: PaymentState) => void;
  onBack: () => void;
};

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "swish", label: "Swish" },
  { id: "bankgiro", label: "Bankgiro" },
];

const methodKey = (orderRef: string) => `caselo-offer-method:${orderRef}`;

/** Valt betalsätt följer beställningen, så att det står kvar efter Föregående eller omladdning. */
const readStoredMethod = (orderRef: string): PaymentMethod | null => {
  try {
    const stored = window.sessionStorage.getItem(methodKey(orderRef));
    return stored === "swish" || stored === "bankgiro" ? stored : null;
  } catch {
    return null;
  }
};

const writeStoredMethod = (orderRef: string, method: PaymentMethod) => {
  try {
    window.sessionStorage.setItem(methodKey(orderRef), method);
  } catch {
    // Utan sessionStorage börjar valet om på Swish, vilket är ofarligt.
  }
};

const CopyField = ({
  label,
  value,
  displayValue,
}: {
  label: string;
  value: string;
  displayValue?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-background px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <p className="min-w-0 text-base font-semibold text-foreground sm:text-lg">
          {displayValue || value}
        </p>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full shrink-0 px-3 sm:w-auto"
          onClick={() => void copy()}
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? "Kopierat" : "Kopiera"}
        </Button>
      </div>
    </div>
  );
};

const PaymentPanel = ({ payment, onClaimed, onBack }: PaymentPanelProps) => {
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const hasBankgiro = Boolean(payment.bankgiroNumber);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    () =>
      payment.reportedPaymentMethod ??
      readStoredMethod(payment.orderRef) ??
      "swish",
  );
  const method: PaymentMethod =
    hasBankgiro && selectedMethod === "bankgiro" ? "bankgiro" : "swish";
  const isBankgiro = method === "bankgiro";
  const showSwishLink = !isBankgiro && Boolean(payment.swishAppUrl);

  const selectMethod = (next: PaymentMethod) => {
    setSelectedMethod(next);
    writeStoredMethod(payment.orderRef, next);
    setClaimError(null);
  };

  const claim = async () => {
    setClaiming(true);
    setClaimError(null);
    try {
      const next = await submitPaymentClaim(payment.orderRef, method);
      onClaimed(next);
    } catch (error) {
      setClaimError(
        error instanceof Error
          ? error.message
          : "Vi kunde inte registrera din uppgift just nu. Behåll din referens.",
      );
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-w-0">
      <h3 className="text-xl font-bold text-foreground md:text-2xl">
        {hasBankgiro
          ? "Betala med Swish eller bankgiro"
          : "Betala med Swish"}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
        {isBankgiro
          ? "Beställningen är sparad med status Inväntar betalning. Betala till bankgirot i din internetbank eller bankapp och ange referensen som meddelande. Caselo kontrollerar betalningen manuellt. Ett klick här eller en skickad beställning är inte ett kvitto."
          : "Beställningen är sparad med status Inväntar betalning. Ange referensen i meddelandefältet i Swish. Caselo kontrollerar betalningen manuellt. Ett klick här, en öppnad Swish-app eller en skickad beställning är inte ett kvitto."}
      </p>

      {hasBankgiro ? (
        <div className="mt-6">
          <p
            id="payment-method-label"
            className="mb-2 text-sm font-medium text-muted-foreground md:text-base"
          >
            Välj betalsätt
          </p>
          <div
            role="group"
            aria-labelledby="payment-method-label"
            className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:max-w-sm"
          >
            {PAYMENT_METHODS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={method === option.id}
                className={cn(
                  "min-h-11 min-w-0 rounded-lg px-3 py-2 text-base leading-snug",
                  method === option.id
                    ? "bg-secondary font-semibold text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background hover:text-foreground",
                )}
                onClick={() => selectMethod(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "mt-6 grid min-w-0 grid-cols-1 items-start gap-4 md:gap-6",
          showSwishLink && "md:grid-cols-[minmax(0,1fr)_auto]",
        )}
      >
        <div className="min-w-0 space-y-3">
          <CopyField label="Upplägg" value={payment.productName} />
          {payment.quantity ? (
            <CopyField label="Antal pass" value={String(payment.quantity)} />
          ) : null}
          {payment.focusLabel ? (
            <CopyField label="Fokus" value={payment.focusLabel} />
          ) : null}
          <CopyField
            label="Belopp"
            value={String(payment.amountSek)}
            displayValue={payment.amountLabel}
          />
          {isBankgiro ? (
            <CopyField
              label="Bankgironummer"
              value={payment.bankgiroNumber ?? ""}
              displayValue={payment.bankgiroNumberDisplay}
            />
          ) : (
            <CopyField
              label="Swish-nummer"
              value={payment.swishNumber}
              displayValue={payment.swishNumberDisplay}
            />
          )}
          <CopyField
            label="Betalningsreferens / meddelande"
            value={payment.orderRef}
          />
        </div>
        {showSwishLink ? (
          <figure className="order-first mx-auto flex w-full max-w-[15.5rem] min-w-0 flex-col items-center rounded-xl border border-border/70 bg-white px-4 py-4 md:sticky md:top-6 md:order-none md:mx-0">
            <QRCodeSVG
              value={payment.swishAppUrl}
              size={184}
              level="M"
              marginSize={4}
              className="h-auto w-full max-w-[184px]"
              title="QR-kod till Swish med belopp och referens ifyllda"
            />
            <figcaption className="mt-3 text-center text-sm leading-snug text-muted-foreground">
              Skanna med Swish-appen
            </figcaption>
          </figure>
        ) : null}
      </div>

      <p className="mt-5 text-base leading-relaxed text-foreground md:text-lg">
        Skriv referensen <span className="font-semibold">{payment.orderRef}</span>{" "}
        {isBankgiro
          ? "som meddelande till mottagaren, inte som OCR-nummer, så att vi kan matcha betalningen."
          : "i meddelandet när du swishar, så att vi kan matcha betalningen."}
      </p>

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {showSwishLink ? (
          <Button asChild variant="secondary" className={offerGoldCtaClass}>
            <a href={payment.swishAppUrl}>Öppna Swish</a>
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className={offerOutlineCtaClass}
          onClick={() => void claim()}
          disabled={claiming || payment.customerReportedPayment}
        >
          {claiming ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {payment.customerReportedPayment
            ? "Tack, vi kontrollerar betalningen"
            : "Jag har betalat"}
        </Button>
      </div>

      {showSwishLink ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Skanna QR-koden med Swish-appen, eller öppna Swish på mobilen.
          Belopp och referens fylls i automatiskt. Du kan också swisha
          manuellt med numret och referensen ovan. Öppnad Swish-app betyder
          inte att betalningen är mottagen.
        </p>
      ) : null}

      {isBankgiro ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          En bankgirobetalning når normalt Caselo efter 1–2 bankdagar. Vill
          du ha underlagen snabbare går det fortare med Swish.
        </p>
      ) : null}

      {claimError ? (
        <p className="mt-4 text-sm leading-relaxed text-destructive" role="alert">
          {claimError}
        </p>
      ) : null}

      {payment.customerReportedPayment ? (
        <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground md:text-base">
          {payment.message} Underlagen skickas till din e-post när Caselo har
          sett betalningen.
        </p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          När betalningen syns hos Caselo skickas underlagen inom 24 timmar.
        </p>
      )}

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Frågor? Mejla{" "}
        <a
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          href={`mailto:${OFFER_CONTACT_EMAIL}`}
        >
          {OFFER_CONTACT_EMAIL}
        </a>
        . Boka tid när du har fått bekräftelsen, via{" "}
        <Link
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          to={OFFER_PATHS.boka}
        >
          bokningssidan för erbjudanden
        </Link>
        .
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="outline"
          className={offerOutlineCtaClass}
          onClick={onBack}
        >
          Föregående
        </Button>
      </div>
    </div>
  );
};

export default PaymentPanel;
