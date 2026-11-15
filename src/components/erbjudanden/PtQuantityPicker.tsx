import { useState } from "react";
import {
  PT_SESSION_LIST_PRICE_SEK,
  PT_SESSION_MAX_QUANTITY,
  formatOfferPrice,
  getPtSessionsForBudget,
  getPtSessionQuote,
  parsePtAmount,
  parsePtQuantity,
  sanitizePtAmountDigits,
  sanitizePtQuantityDigits,
} from "@/data/erbjudanden";
import { cn } from "@/lib/utils";
import { PaintbrushHighlight } from "./SnabbhetCampaignPrice";

type PtQuantityPickerProps = {
  id: string;
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  variant?: "checkout" | "offer";
};

const formatGroupedDigits = (digits: string): string => {
  const raw = digits === "" ? "0" : digits;
  const amount = Number(raw);
  if (!Number.isFinite(amount)) return raw;
  return new Intl.NumberFormat("sv-SE").format(amount).replace(/\s/g, " ");
};

const SuffixedNumberField = ({
  id,
  value,
  suffix,
  onDigitsChange,
  minCh,
  grouped = false,
  compact = false,
}: {
  id: string;
  value: string;
  suffix: string;
  onDigitsChange: (digits: string) => void;
  minCh: number;
  grouped?: boolean;
  /** Smalare ruta, där förklaringstexten ska få plats bredvid. */
  compact?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const isZero = value === "" || value === "0";
  const display =
    focused && isZero
      ? ""
      : grouped
        ? formatGroupedDigits(value)
        : value === ""
          ? "0"
          : value;
  const digitCount = display.replace(/\s/g, "").length;
  const spaceCount = display.length - digitCount;
  const widthCh = Math.max(digitCount + spaceCount * 0.3, minCh);
  return (
    <div
      className={cn(
        "inline-flex h-10 min-h-10 w-fit items-center justify-start gap-1 rounded-md border border-input bg-background px-2.5 text-base tabular-nums ring-offset-background",
        compact ? "min-w-[5.5rem]" : "min-w-[7rem]",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      )}
    >
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        className="max-w-[9ch] border-0 bg-transparent p-0 text-left text-base tabular-nums text-foreground outline-none"
        style={{ width: `${widthCh}ch` }}
        value={display}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => onDigitsChange(event.target.value)}
      />
      <span className="shrink-0 select-none text-base tabular-nums text-foreground">
        {suffix}
      </span>
    </div>
  );
};

/** Storlek och placering sätts av pt-calc-result i index.css. */
const resultTextClass = "pt-calc-result text-muted-foreground";

const offerLabelClass = "pt-calc-label text-sm leading-snug text-foreground";

const PtQuantityPicker = ({
  id,
  value,
  onChange,
  error,
  variant = "checkout",
}: PtQuantityPickerProps) => {
  const quantity = parsePtQuantity(value);
  const quote = quantity ? getPtSessionQuote(quantity) : null;
  const [amountDigits, setAmountDigits] = useState("0");
  const [source, setSource] = useState<"quantity" | "amount" | null>(null);
  // På erbjudandekortet är de två rutorna alternativ: den man inte skriver i
  // fylls aldrig i automatiskt. I kassan finns bara antalsrutan.
  const isOffer = variant === "offer";

  const amount = parsePtAmount(amountDigits);
  const budget = amount !== null ? getPtSessionsForBudget(amount) : null;
  const tooHigh =
    value !== "" &&
    /^\d+$/.test(value) &&
    Number(value) > PT_SESSION_MAX_QUANTITY;

  const setQuantityDigits = (digits: string) => {
    const next = sanitizePtQuantityDigits(digits) || "0";
    setSource("quantity");
    // Ett tidigare ifyllt belopp gäller inte längre när man anger antal.
    if (isOffer) setAmountDigits("0");
    onChange(next);
  };

  const setAmountValue = (digits: string) => {
    const next = sanitizePtAmountDigits(digits);
    setSource("amount");
    setAmountDigits(next || "0");
    const parsed = parsePtAmount(next);
    if (parsed === null) {
      onChange("0");
      return;
    }
    const result = getPtSessionsForBudget(parsed);
    onChange(result ? String(result.quantity) : "0");
  };

  // Erbjudandekortet: `value` är alltid det antal som köpknappen tar med sig,
  // men antalsrutan visar det bara när besökaren själv har skrivit det.
  const amountIsSource = source === "amount";
  const offerQuantityValue = amountIsSource ? "0" : value;
  const offerTooHigh = tooHigh && !amountIsSource;

  // Den rad man inte använder tonas ned, så att det syns vilken ruta som gäller.
  // Raden går fortfarande att klicka i, och då byter rutorna roll.
  const isFilled = (digits: string) => digits !== "" && digits !== "0";
  const dimAmountRow = !amountIsSource && isFilled(value);
  const dimQuantityRow = amountIsSource && isFilled(amountDigits);

  // Sammanfattningen längst ned i rutan utgår från den ruta man skrev i.
  const summaryQuote = amountIsSource ? (budget?.quote ?? null) : quote;
  const summaryText = !summaryQuote
    ? ""
    : amountIsSource && budget
      ? `${formatOfferPrice(budget.amountSek)} ger ${budget.quantity} pass à ${formatOfferPrice(summaryQuote.unitPriceSek)}/pass till ett totalpris om ${formatOfferPrice(summaryQuote.totalSek)}.`
      : summaryQuote.quantity === 1
        ? `1 pass kostar ${formatOfferPrice(summaryQuote.totalSek)}.`
        : `${summaryQuote.quantity} pass kostar totalt ${formatOfferPrice(summaryQuote.totalSek)}, alltså ${formatOfferPrice(summaryQuote.unitPriceSek)}/pass.`;
  const discountLabel =
    summaryQuote && summaryQuote.discountPercent > 0
      ? `${summaryQuote.discountPercent}% rabatt`
      : "";

  // Tipset om nästa pass följer direkt efter sammanfattningen och gäller bara
  // när man har skrivit ett belopp.
  const nextSessionTip =
    amountIsSource && budget && budget.toNextSessionSek !== null
      ? `Lägg till ${formatOfferPrice(budget.toNextSessionSek)} så får du ytterligare ett pass.`
      : "";
  // Ett för lågt belopp ger ingen sammanfattning, så det påpekas vid kr-rutan.
  const amountTooLowHint =
    amountIsSource && !budget && amount !== null && amount > 0
      ? `Minst ${formatOfferPrice(PT_SESSION_LIST_PRICE_SEK)} för 1 pass.`
      : "";

  if (isOffer) {
    // Layouten (pt-calc-*) ligger i index.css och följer kortets bredd.
    return (
      <div className="pt-calc min-w-0 rounded-xl border border-border/60 bg-muted/40 p-3">
        <p className="mb-3 text-sm font-semibold leading-snug text-foreground md:text-base">
          Beräkna din rabatt
        </p>
        <div className="pt-calc-grid">
          <label
            htmlFor={`${id}-antal`}
            className={cn(offerLabelClass, dimQuantityRow && "pt-calc-dim")}
          >
            Fyll i antal pass du vill köpa:
          </label>
          <div className={cn("pt-calc-field", dimQuantityRow && "pt-calc-dim")}>
            <SuffixedNumberField
              id={`${id}-antal`}
              value={offerQuantityValue}
              suffix="pass"
              minCh={1}
              compact
              onDigitsChange={setQuantityDigits}
            />
          </div>
          {offerTooHigh ? (
            <p className={resultTextClass} aria-live="polite">
              Du kan köpa högst {PT_SESSION_MAX_QUANTITY} pass.
            </p>
          ) : null}
          <label
            htmlFor={`${id}-summa`}
            className={cn(offerLabelClass, dimAmountRow && "pt-calc-dim")}
          >
            Eller fyll i önskat totalpris:
          </label>
          <div className={cn("pt-calc-field", dimAmountRow && "pt-calc-dim")}>
            <SuffixedNumberField
              id={`${id}-summa`}
              value={amountDigits}
              suffix="kr"
              minCh={1}
              grouped
              compact
              onDigitsChange={setAmountValue}
            />
          </div>
          {amountTooLowHint ? (
            <p className={resultTextClass} aria-live="polite">
              {amountTooLowHint}
            </p>
          ) : null}
        </div>
        <div aria-live="polite">
          {summaryText ? (
            <div className="pt-calc-summary mt-3">
              {/* Textstorleken sätts av pt-calc-summary i index.css. */}
              <p className="text-muted-foreground">
                {summaryText}
                {nextSessionTip ? ` ${nextSessionTip}` : null}
              </p>
              {discountLabel ? (
                <PaintbrushHighlight className="text-sm">
                  <span className="whitespace-nowrap font-semibold leading-snug text-foreground">
                    {discountLabel}
                  </span>
                </PaintbrushHighlight>
              ) : null}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  // Kassan: bara antal. Priset räknas ut och visas som en mening under rutan.
  const checkoutSummary = !quote
    ? ""
    : quote.discountPercent > 0
      ? `${quote.quantity} pass kostar totalt ${formatOfferPrice(quote.totalSek)} (${formatOfferPrice(quote.unitPriceSek)}/pass istället för ord. pris ${formatOfferPrice(quote.listUnitPriceSek)}/pass, det vill säga ${quote.discountPercent}\u00a0% rabatt).`
      : `${quote.quantity} pass kostar ${formatOfferPrice(quote.totalSek)}.`;

  return (
    <div className="min-w-0">
      {/* Instruktionen är också etiketten till antalsrutan. */}
      <label
        htmlFor={`${id}-antal`}
        className="mb-3 block text-sm font-semibold leading-snug text-foreground md:text-base"
      >
        Fyll i antal pass du vill köpa.
      </label>
      <div className="min-w-0">
        <SuffixedNumberField
          id={`${id}-antal`}
          value={value}
          suffix="pass"
          minCh={1}
          onDigitsChange={setQuantityDigits}
        />
      </div>
      <div className="mt-3 min-w-0" aria-live="polite">
        {tooHigh ? (
          <p className="text-sm leading-snug text-muted-foreground md:text-base">
            Du kan köpa högst {PT_SESSION_MAX_QUANTITY} pass.
          </p>
        ) : checkoutSummary ? (
          <p className="break-words text-sm leading-snug text-muted-foreground md:text-base">
            {checkoutSummary}
          </p>
        ) : null}
        {error ? (
          <p className="mt-1 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PtQuantityPicker;
