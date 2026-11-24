import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDown, Copy, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  OFFER_CONTACT_EMAIL,
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
  /** Betalsättet som är valt i formuläret ovanför. */
  method: PaymentMethod;
  /** Id på rubriken, så att sidan kan rulla hit när instruktionen visas. */
  headingId?: string;
  onClaimed: (next: PaymentState) => void;
  onBack: () => void;
};

const CLAIM_BUTTON_LABEL = "Jag har betalat – Slutför";

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

/**
 * Steg-för-steg-instruktion för betalningen. Visas i kassans sista steg när
 * beställningen är skickad; betalsättet väljs i formuläret ovanför.
 */
const PaymentPanel = ({
  payment,
  method: chosenMethod,
  headingId,
  onClaimed,
  onBack,
}: PaymentPanelProps) => {
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [manualSwishOpen, setManualSwishOpen] = useState(false);
  const touchDevice = useTouchDevice();

  const hasBankgiro = Boolean(payment.bankgiroNumber);
  const method: PaymentMethod =
    hasBankgiro && chosenMethod === "bankgiro" ? "bankgiro" : "swish";
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

  // Ett felmeddelande hör till det betalsätt som var valt när det uppstod.
  useEffect(() => {
    setClaimError(null);
  }, [method]);

  const claim = async () => {
    setClaiming(true);
    setClaimError(null);
    try {
      const next = await submitPaymentClaim(
        payment.orderRef,
        method,
        payment.orderSnapshot,
      );
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
          Eller swisha{" "}
        </span>
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
    <div className="min-w-0 border-t border-border/70 pt-6">
      {/* Steg för steg: varje uppgift står i det steg där den behövs. */}
      <h4
        id={headingId}
        className="scroll-mt-28 text-lg font-bold text-foreground md:text-xl"
      >
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
        {!payment.customerReportedPayment ? (
          <Button
            type="button"
            variant="secondary"
            className={offerGoldCtaClass}
            onClick={() => void claim()}
            disabled={claiming}
          >
            {claiming ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            {CLAIM_BUTTON_LABEL}
          </Button>
        ) : null}
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
          <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground md:text-base">
            Tack, vi kontrollerar betalningen. När betalningen syns hos Caselo
            skickas köpbekräftelse, bokningslänk samt eventuellt kvitto och
            presentkort inom 24 timmar. Om du behöver kvitto eller presentkort
            tidigare, maila{" "}
            <a
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              href={`mailto:${OFFER_CONTACT_EMAIL}`}
            >
              {OFFER_CONTACT_EMAIL}
            </a>
            .
            {reportedBankgiro
              ? " En bankgirobetalning syns normalt hos Caselo efter 1–2 bankdagar."
              : null}
            {payment.prepaidBookingUrl ? (
              <>
                {" "}
                Boka dina pass via{" "}
                <a
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                  href={payment.prepaidBookingUrl}
                >
                  bokningssidan
                </a>{" "}
                – där syns ditt pris per pass.
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentPanel;
