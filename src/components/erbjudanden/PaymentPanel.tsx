import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDown, Copy, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  OFFER_CONTACT_EMAIL,
  OFFER_PATHS,
  formatOfferPrice,
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

const CLAIM_BUTTON_LABEL = "Jag har betalat – Slutför";

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

const TOUCH_QUERY = "(pointer: coarse)";

/**
 * Pekskärm (mobil eller surfplatta). Där öppnas Swish på samma enhet med en
 * knapp; på dator skannar man i stället en QR-kod med mobilen.
 */
const useTouchDevice = () => {
  const [touch, setTouch] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(TOUCH_QUERY).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(TOUCH_QUERY);
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return touch;
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

/** Ett numrerat steg i betalningsinstruktionen. */
const PayStep = ({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) => (
  <li className="min-w-0">
    <div className="flex items-center gap-3">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground"
        aria-hidden="true"
      >
        {step}
      </span>
      <p className="min-w-0 text-base font-semibold leading-snug text-foreground md:text-lg">
        {title}
      </p>
    </div>
    {/* Under rubriken; indraget i linje med rubriken från sm och uppåt. */}
    <div className="mt-2 min-w-0 space-y-3 text-base leading-relaxed text-foreground sm:pl-10">
      {children}
    </div>
  </li>
);

const nowrapClass = "whitespace-nowrap font-semibold";

const PaymentPanel = ({ payment, onClaimed, onBack }: PaymentPanelProps) => {
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [manualSwishOpen, setManualSwishOpen] = useState(false);
  const touchDevice = useTouchDevice();

  const hasBankgiro = Boolean(payment.bankgiroNumber);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    () =>
      payment.reportedPaymentMethod ??
      readStoredMethod(payment.orderRef) ??
      payment.chosenPaymentMethod ??
      "swish",
  );
  const method: PaymentMethod =
    hasBankgiro && selectedMethod === "bankgiro" ? "bankgiro" : "swish";
  const isBankgiro = method === "bankgiro";
  const hasSwishLink = Boolean(payment.swishAppUrl);
  const reportedBankgiro =
    (payment.reportedPaymentMethod ?? method) === "bankgiro";

  const amount = (
    <span className={nowrapClass}>{formatOfferPrice(payment.amountSek)}</span>
  );
  const reference = <span className={nowrapClass}>{payment.orderRef}</span>;
  const claimLabel = (
    <span className="font-semibold">{CLAIM_BUTTON_LABEL}</span>
  );

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

  /** Uppgifterna för att swisha för hand, utan knapp eller QR-kod. */
  const manualSwishFields = (
    <>
      <p>
        Öppna Swish-appen i mobilen, välj att swisha och fyll i numret och
        meddelandet nedan. Beloppet är {amount}.
      </p>
      <CopyField
        label="Swish-nummer"
        value={payment.swishNumber}
        displayValue={payment.swishNumberDisplay}
      />
      <CopyField label="Meddelande" value={payment.orderRef} />
    </>
  );

  /** Reservväg för Swish, dold tills den behövs. */
  const manualSwishDisclosure = (
    <div className="min-w-0">
      <button
        type="button"
        aria-expanded={manualSwishOpen}
        aria-controls="payment-manual-swish"
        className="min-h-11 py-2 text-left text-base font-medium leading-snug text-primary hover:text-primary/80"
        onClick={() => setManualSwishOpen((open) => !open)}
      >
        <span className="underline underline-offset-4">
          Fungerar det inte? Swisha
        </span>{" "}
        {/* Pilen hålls ihop med sista ordet när texten radbryts. */}
        <span className="whitespace-nowrap">
          <span className="underline underline-offset-4">manuellt</span>
          <ChevronDown
            className={cn(
              "ml-1.5 inline h-4 w-4 align-[-0.15em] transition-transform",
              manualSwishOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>
      <div
        id="payment-manual-swish"
        hidden={!manualSwishOpen}
        className="mt-2 min-w-0 space-y-3 text-base leading-relaxed text-foreground"
      >
        {manualSwishFields}
      </div>
    </div>
  );

  const finishStep = (step: number) => (
    <PayStep step={step} title="Slutför här">
      <p>
        När betalningen är godkänd klickar du på {claimLabel} här nedanför.
      </p>
    </PayStep>
  );

  return (
    <div className="min-w-0">
      <h3 className="text-xl font-bold text-foreground md:text-2xl">
        {hasBankgiro
          ? "Betala med Swish eller bankgiro"
          : "Betala med Swish"}
      </h3>

      {/* Samma orderöversikt som i steget före betalningen. Ligger ovanför
          valet av betalsätt, så att den är densamma för Swish och bankgiro. */}
      <div className="mt-6 rounded-xl border border-border/70 bg-muted/50 px-4 py-3">
        <p className="text-sm font-semibold text-foreground md:text-base">
          Orderöversikt
        </p>
        <ul className="mt-2 space-y-1 break-words text-sm leading-snug text-foreground md:text-base">
          <li>Upplägg: {payment.productName}</li>
          {payment.focusLabel ? <li>Fokus: {payment.focusLabel}</li> : null}
          <li>Totalt: {payment.amountLabel}</li>
          {payment.wellnessReceipt ? (
            <li>Kvitto för friskvårdsbidrag</li>
          ) : null}
        </ul>
      </div>

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

      {/* Steg för steg: varje uppgift står i det steg där den behövs. */}
      <h4 className="mt-8 text-lg font-bold text-foreground md:text-xl">
        {isBankgiro
          ? "Så betalar du med bankgiro"
          : "Så betalar du med Swish"}
      </h4>

      {isBankgiro ? (
        <ol role="list" className="mt-5 space-y-6">
          <PayStep step={1} title="Logga in på din bank">
            <p>
              Öppna din internetbank eller bankapp och välj att betala till
              ett bankgiro.
            </p>
          </PayStep>
          <PayStep step={2} title="Fyll i betalningen">
            <p>
              Beloppet är {amount}. Skriv referensen som meddelande till
              mottagaren, inte som OCR-nummer.
            </p>
            <CopyField
              label="Bankgironummer"
              value={payment.bankgiroNumber ?? ""}
              displayValue={payment.bankgiroNumberDisplay}
            />
            <CopyField label="Meddelande" value={payment.orderRef} />
          </PayStep>
          <PayStep step={3} title="Godkänn betalningen">
            <p>
              Signera betalningen hos din bank, så att den skickas iväg.
            </p>
          </PayStep>
          {finishStep(4)}
        </ol>
      ) : hasSwishLink ? (
        <ol role="list" className="mt-5 space-y-6">
          {touchDevice ? (
            <PayStep step={1} title="Öppna Swish">
              <p>
                Tryck på knappen. Belopp och meddelande är redan ifyllda.
              </p>
              <Button
                asChild
                variant="secondary"
                className={offerGoldCtaClass}
              >
                <a href={payment.swishAppUrl}>Öppna Swish</a>
              </Button>
              {manualSwishDisclosure}
            </PayStep>
          ) : (
            <PayStep step={1} title="Skanna QR-koden">
              <p>
                Öppna Swish-appen i mobilen och skanna QR-koden. Belopp och
                meddelande är redan ifyllda.
              </p>
              <figure className="flex w-full max-w-[13.5rem] min-w-0 flex-col items-center rounded-xl border border-border/70 bg-white px-3 py-3">
                <QRCodeSVG
                  value={payment.swishAppUrl}
                  size={184}
                  level="M"
                  marginSize={4}
                  className="h-auto w-full max-w-[184px]"
                  title="QR-kod till Swish med belopp och meddelande ifyllda"
                />
              </figure>
              {manualSwishDisclosure}
            </PayStep>
          )}
          <PayStep step={2} title="Godkänn betalningen">
            <p>
              Kontrollera att beloppet är {amount} och att meddelandet är{" "}
              {reference}. Godkänn sedan betalningen i Swish.
            </p>
          </PayStep>
          {finishStep(3)}
        </ol>
      ) : (
        <ol role="list" className="mt-5 space-y-6">
          <PayStep step={1} title="Swisha beloppet">
            {manualSwishFields}
          </PayStep>
          <PayStep step={2} title="Godkänn betalningen">
            <p>
              Kontrollera att beloppet är {amount} och att meddelandet är{" "}
              {reference}. Godkänn sedan betalningen i Swish.
            </p>
          </PayStep>
          {finishStep(3)}
        </ol>
      )}

      {/* Sist i steget, som Föregående/Nästa i stegen före. */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="outline"
          className={offerOutlineCtaClass}
          onClick={onBack}
        >
          Föregående
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={offerGoldCtaClass}
          onClick={() => void claim()}
          disabled={claiming || payment.customerReportedPayment}
        >
          {claiming ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {payment.customerReportedPayment
            ? "Tack, vi kontrollerar betalningen"
            : CLAIM_BUTTON_LABEL}
        </Button>
      </div>

      <div aria-live="polite">
        {claimError ? (
          <p
            className="mt-4 text-sm leading-relaxed text-destructive"
            role="alert"
          >
            {claimError}
          </p>
        ) : null}

        {/* Visas först när kunden har klickat på Jag har betalat – Slutför. */}
        {payment.customerReportedPayment ? (
          <>
            <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground md:text-base">
              När betalningen syns hos Caselo skickas underlagen inom 24
              timmar.
              {reportedBankgiro
                ? " En bankgirobetalning syns normalt hos Caselo efter 1–2 bankdagar."
                : null}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentPanel;
