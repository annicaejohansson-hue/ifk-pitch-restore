import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import WellnessReceiptDocument, {
  type WellnessReceiptData,
} from "@/components/erbjudanden/WellnessReceiptDocument";
import {
  formatOfferPrice,
  formatPersonalIdInput,
  needsFriskvardBuyerDetails,
  OFFER_PRODUCTS,
  PT_SESSION_LIST_PRICE_SEK,
  SIMPLIFIED_INVOICE_MAX_SEK,
} from "@/data/erbjudanden";
import { offerGoldCtaClass, offerOutlineCtaClass } from "@/components/erbjudanden/offerUi";

type OfferKind = "pt" | "snabbhet";

const SNABBHET_PACKAGE_PRICE_SEK = OFFER_PRODUCTS.snabbhet.priceSek;

const todayLabel = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Behåll endast datumdelen om en äldre länk innehåller klockslag. */
const dateOnlyLabel = (raw: string | null | undefined) => {
  const value = (raw ?? "").trim();
  if (!value) return todayLabel();
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? value;
};

const parseAmount = (raw: string): number => {
  const normalized = raw.replace(/\s/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const parseOptionalNumber = (raw: string): number | null => {
  const normalized = raw.replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
};

type PriceEditMode = "discount" | "unit";

type PtReceiptCalc = {
  quantity: number;
  unitPriceSek: number;
  discountPercent: number;
  discountTotalSek: number;
  totalSek: number;
  listTotalSek: number;
};

const calcFromDiscountPercent = (
  quantity: number,
  discountPercent: number,
): PtReceiptCalc => {
  const safePct = Math.min(100, Math.max(0, discountPercent));
  const unitPriceSek = Math.round(
    PT_SESSION_LIST_PRICE_SEK * (1 - safePct / 100),
  );
  const listTotalSek = PT_SESSION_LIST_PRICE_SEK * quantity;
  const totalSek = unitPriceSek * quantity;
  return {
    quantity,
    unitPriceSek,
    discountPercent: safePct,
    discountTotalSek: Math.max(0, listTotalSek - totalSek),
    totalSek,
    listTotalSek,
  };
};

const calcFromUnitPrice = (
  quantity: number,
  unitPriceSek: number,
): PtReceiptCalc => {
  const safeUnit = Math.max(0, Math.round(unitPriceSek));
  const listTotalSek = PT_SESSION_LIST_PRICE_SEK * quantity;
  const totalSek = safeUnit * quantity;
  const discountTotalSek = Math.max(0, listTotalSek - totalSek);
  const discountPercent =
    listTotalSek > 0
      ? Math.round((discountTotalSek / listTotalSek) * 1000) / 10
      : 0;
  return {
    quantity,
    unitPriceSek: safeUnit,
    discountPercent,
    discountTotalSek,
    totalSek,
    listTotalSek,
  };
};

const formatDiscountReceiptLabel = (calc: PtReceiptCalc): string => {
  if (calc.discountTotalSek <= 0) return "0 kr";
  const pct =
    Number.isInteger(calc.discountPercent)
      ? String(calc.discountPercent)
      : calc.discountPercent.toFixed(1).replace(".", ",");
  return `${pct} % (${formatOfferPrice(calc.discountTotalSek)})`;
};

const buildPtServiceName = (quantity: number) =>
  `Personlig träning ${quantity} pass à 60 min`;

const buildSnabbhetServiceName = (packageCount: number) =>
  packageCount === 1
    ? "Snabbhetsträning för 1 person (två tillfällen)"
    : `Snabbhetsträning för ${packageCount} personer (två tillfällen per person)`;


type RequiredFieldKey =
  | "offerKind"
  | "productName"
  | "amount"
  | "customerName"
  | "personalId"
  | "paidAtLabel";

type FieldErrors = Partial<Record<RequiredFieldKey, string>>;

const REQUIRED_MESSAGES: Record<RequiredFieldKey, string> = {
  offerKind: "Välj typ av tjänst.",
  productName: "Ange tjänstens namn.",
  amount: "Ange beloppet inkl. moms.",
  customerName: "Ange kundens namn.",
  personalId: "Ange personnummer.",
  paidAtLabel: "Ange betalningsdatum.",
};

const Kvitto = () => {
  const [searchParams] = useSearchParams();
  const [orderRef, setOrderRef] = useState(searchParams.get("ref") ?? "");
  const [offerKind, setOfferKind] = useState<OfferKind | null>(() => {
    const raw = (searchParams.get("typ") ?? "").toLowerCase();
    if (raw === "pt" || raw === "pass" || raw === "friskvard") return "pt";
    if (raw === "snabbhet" || raw === "sn") return "snabbhet";
    const product = (searchParams.get("produkt") ?? "").toLowerCase();
    if (product.includes("snabbhet")) return "snabbhet";
    if (product.includes("träning") || product.includes("traning")) return "pt";
    return null;
  });
  const [productName, setProductName] = useState(
    searchParams.get("produkt") ?? "",
  );
  const [amountRaw, setAmountRaw] = useState(searchParams.get("belopp") ?? "");
  const [quantityRaw, setQuantityRaw] = useState(
    searchParams.get("antal") ?? "",
  );
  const [discountPercentRaw, setDiscountPercentRaw] = useState(
    searchParams.get("rabattprocent") ?? "",
  );
  const [unitPriceRaw, setUnitPriceRaw] = useState(
    searchParams.get("prisperpass") ?? "",
  );
  const [packagePriceRaw, setPackagePriceRaw] = useState(
    searchParams.get("prisperpaket") ?? String(SNABBHET_PACKAGE_PRICE_SEK),
  );
  const [priceEditMode, setPriceEditMode] = useState<PriceEditMode | null>(
    null,
  );
  const [customerName, setCustomerName] = useState(
    searchParams.get("namn") ?? "",
  );
  const [customerEmail, setCustomerEmail] = useState(
    (searchParams.get("epost") ?? searchParams.get("email") ?? "").trim(),
  );
  const [personalId, setPersonalId] = useState(
    formatPersonalIdInput(searchParams.get("personnummer") ?? ""),
  );
  const [paidAtLabel, setPaidAtLabel] = useState(
    dateOnlyLabel(searchParams.get("datum")),
  );
  const [paymentMethodLabel, setPaymentMethodLabel] = useState(
    searchParams.get("betalsatt") === "bankgiro" ? "Bankgiro" : "Swish",
  );
  const [productNameDirty, setProductNameDirty] = useState(
    Boolean(searchParams.get("produkt")?.trim()),
  );
  const [showErrors, setShowErrors] = useState(false);
  const [allowIncompletePrint, setAllowIncompletePrint] = useState(false);
  const [mailHint, setMailHint] = useState<string | null>(null);
  const prefilledFromOrder =
    Boolean(searchParams.get("ref")) &&
    Boolean(searchParams.get("produkt")) &&
    Boolean(searchParams.get("belopp"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const quantity = parseOptionalNumber(quantityRaw);
  const discountPercentInput = parseOptionalNumber(discountPercentRaw);
  const unitPriceInput = parseOptionalNumber(unitPriceRaw);
  const packagePriceInput = parseOptionalNumber(packagePriceRaw);

  const activePriceMode: PriceEditMode | null =
    priceEditMode ??
    (discountPercentInput != null && unitPriceInput == null
      ? "discount"
      : unitPriceInput != null && discountPercentInput == null
        ? "unit"
        : priceEditMode);

  const ptCalc = useMemo<PtReceiptCalc | null>(() => {
    if (offerKind !== "pt") return null;
    if (quantity == null || quantity < 1 || !Number.isInteger(quantity)) {
      return null;
    }
    if (activePriceMode === "discount" && discountPercentInput != null) {
      return calcFromDiscountPercent(quantity, discountPercentInput);
    }
    if (activePriceMode === "unit" && unitPriceInput != null) {
      return calcFromUnitPrice(quantity, unitPriceInput);
    }
    return null;
  }, [
    offerKind,
    quantity,
    discountPercentInput,
    unitPriceInput,
    activePriceMode,
  ]);

  const snabbhetCalc = useMemo(() => {
    if (offerKind !== "snabbhet") return null;
    if (quantity == null || quantity < 1 || !Number.isInteger(quantity)) {
      return null;
    }
    if (packagePriceInput == null || packagePriceInput <= 0) return null;
    return {
      quantity,
      packagePriceSek: Math.round(packagePriceInput),
      totalSek: Math.round(packagePriceInput) * quantity,
    };
  }, [offerKind, quantity, packagePriceInput]);

  useEffect(() => {
    if (!ptCalc || !activePriceMode) return;

    const nextAmount = String(ptCalc.totalSek);
    setAmountRaw((prev) => (prev === nextAmount ? prev : nextAmount));

    if (activePriceMode === "discount") {
      const nextUnit = String(ptCalc.unitPriceSek);
      setUnitPriceRaw((prev) => (prev === nextUnit ? prev : nextUnit));
      return;
    }

    const pct = ptCalc.discountPercent;
    const nextPct = Number.isInteger(pct)
      ? String(pct)
      : String(pct).replace(".", ",");
    setDiscountPercentRaw((prev) => (prev === nextPct ? prev : nextPct));
  }, [ptCalc, activePriceMode]);

  useEffect(() => {
    if (!snabbhetCalc) return;
    const nextAmount = String(snabbhetCalc.totalSek);
    setAmountRaw((prev) => (prev === nextAmount ? prev : nextAmount));
  }, [snabbhetCalc]);

  const applyOfferKind = (kind: OfferKind) => {
    setOfferKind(kind);
    setPriceEditMode(null);
    setQuantityRaw("");
    setDiscountPercentRaw("");
    setUnitPriceRaw("");
    setPackagePriceRaw(String(SNABBHET_PACKAGE_PRICE_SEK));
    setAmountRaw("");
    setProductNameDirty(false);
    setProductName("");
  };

  useEffect(() => {
    if (!offerKind || productNameDirty) return;
    if (quantity == null || quantity < 1 || !Number.isInteger(quantity)) {
      setProductName("");
      return;
    }
    const next =
      offerKind === "pt"
        ? buildPtServiceName(quantity)
        : buildSnabbhetServiceName(quantity);
    setProductName((prev) => (prev === next ? prev : next));
  }, [offerKind, quantity, productNameDirty]);

  const amountSek = parseAmount(amountRaw);
  const buyerDetailsRequired = needsFriskvardBuyerDetails(amountSek);

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    if (!offerKind) next.offerKind = REQUIRED_MESSAGES.offerKind;
    if (productName.trim().length < 2) next.productName = REQUIRED_MESSAGES.productName;
    if (amountSek <= 0) next.amount = REQUIRED_MESSAGES.amount;
    if (buyerDetailsRequired) {
      if (customerName.trim().length < 2) {
        next.customerName = REQUIRED_MESSAGES.customerName;
      }
      if (personalId.trim().length < 11) {
        next.personalId = REQUIRED_MESSAGES.personalId;
      }
    }
    if (paidAtLabel.trim().length < 8) next.paidAtLabel = REQUIRED_MESSAGES.paidAtLabel;
    return next;
  }, [
    offerKind,
    productName,
    amountSek,
    buyerDetailsRequired,
    customerName,
    personalId,
    paidAtLabel,
  ]);

  const isComplete = Object.keys(errors).length === 0;
  const visibleErrors = showErrors ? errors : {};

  useEffect(() => {
    if (isComplete) {
      setShowErrors(false);
      setAllowIncompletePrint(false);
    }
  }, [isComplete]);

  const data: WellnessReceiptData = useMemo(
    () => ({
      orderRef: orderRef.trim() || "—",
      productName: productName.trim() || "—",
      amountSek: amountSek || 0,
      quantityLabel:
        quantity != null && quantity >= 1 ? String(quantity) : "—",
      quantityCaption:
        offerKind === "snabbhet" ? "Antal paket" : "Antal pass",
      discountLabel: ptCalc ? formatDiscountReceiptLabel(ptCalc) : "—",
      showDiscountRow: offerKind !== "snabbhet",
      customerName: customerName.trim() || "—",
      personalId: personalId.trim() || "—",
      paidAtLabel: paidAtLabel.trim() || "—",
      paymentMethodLabel,
    }),
    [
      orderRef,
      productName,
      amountSek,
      quantity,
      offerKind,
      ptCalc,
      customerName,
      personalId,
      paidAtLabel,
      paymentMethodLabel,
    ],
  );

  const printReceipt = () => {
    window.print();
  };

  const handlePrintClick = () => {
    if (isComplete) {
      setShowErrors(false);
      setAllowIncompletePrint(false);
      printReceipt();
      return;
    }
    setShowErrors(true);
    setAllowIncompletePrint(true);
  };

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    customerEmail.trim(),
  );

  const customerMailContent = useMemo(() => {
    const email = customerEmail.trim();
    const subject = "Kvitto – Caselo Idrottsmedicin";
    const firstName =
      customerName.trim().split(/\s+/)[0] || "dig";
    const body = [
      `Hej ${firstName}!`,
      "",
      "Här kommer ditt kvitto från Caselo Idrottsmedicin.",
      productName.trim() ? `Tjänst: ${productName.trim()}` : null,
      amountSek > 0 ? `Belopp: ${formatOfferPrice(amountSek)} inkl. moms` : null,
      "",
      "Vänliga hälsningar",
      "Henrik",
    ]
      .filter((line): line is string => line != null)
      .join("\n");
    return { email, subject, body };
  }, [customerEmail, customerName, productName, amountSek]);

  const gmailComposeHref = emailLooksValid
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(customerMailContent.email)}&su=${encodeURIComponent(customerMailContent.subject)}&body=${encodeURIComponent(customerMailContent.body)}`
    : undefined;

  const openCustomerMail = () => {
    if (!emailLooksValid || !gmailComposeHref) {
      setMailHint("Fyll i kundens e-postadress först.");
      document.getElementById("kvitto-epost")?.focus();
      return;
    }
    setMailHint(null);
    window.open(gmailComposeHref, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>Kvitto – Caselo Idrottsmedicin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <style>{`
        @media print {
          @page {
            margin: 12mm;
            size: A4;
          }
          .no-print { display: none !important; }
          html, body {
            background: white !important;
            color: #171717 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          main {
            min-height: 0 !important;
            background: white !important;
          }
          .receipt-print-shell {
            display: block !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .receipt-print-frame {
            display: block !important;
            max-width: 36rem !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .receipt-document {
            max-width: 36rem !important;
            width: 100% !important;
            margin: 0 auto !important;
            break-inside: avoid;
          }
          .receipt-document img {
            display: block !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <section className="receipt-print-shell container px-4 py-8 md:px-4 md:py-12">
        <div className="receipt-print-frame mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="no-print space-y-5 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-[var(--shadow-card)] sm:p-6">
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                Skapa friskvårdskvitto
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {prefilledFromOrder
                  ? "Uppgifterna är förifyllda från beställningen. När betalningen syns: kontrollera kvittot, sätt datum, spara PDF, öppna mejl till kunden och bifoga filen. Lägg samma PDF i Drive-mappen Kvitton."
                  : "Fyll i uppgifterna när betalningen syns. Spara PDF, öppna mejl till kunden och bifoga filen. Lägg samma PDF i Drive-mappen Kvitton."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>{" "}
                = obligatoriskt för ett fullgott underlag för friskvårdsbidrag.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-ref">Kvittonr / referens</Label>
                <Input
                  id="kvitto-ref"
                  className="h-11 text-base"
                  value={orderRef}
                  onChange={(event) => setOrderRef(event.target.value)}
                  placeholder="t.ex. PT-ABCD12"
                />
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-foreground">
                  Typ av tjänst{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                      offerKind === "pt"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border/70 bg-background text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="kvitto-offer-kind"
                      className="h-4 w-4 accent-primary"
                      checked={offerKind === "pt"}
                      onChange={() => applyOfferKind("pt")}
                    />
                    <span>Personlig träning</span>
                  </label>
                  <label
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                      offerKind === "snabbhet"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border/70 bg-background text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="kvitto-offer-kind"
                      className="h-4 w-4 accent-primary"
                      checked={offerKind === "snabbhet"}
                      onChange={() => applyOfferKind("snabbhet")}
                    />
                    <span>
                      Snabbhets-
                      <br />
                      paketet
                    </span>
                  </label>
                </div>
                {visibleErrors.offerKind ? (
                  <p className="text-sm text-destructive" role="alert">
                    {visibleErrors.offerKind}
                  </p>
                ) : null}
              </fieldset>

              {offerKind ? (
                <>
                  {offerKind === "pt" ? (
                    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-3.5">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Ordinarie pris{" "}
                        {formatOfferPrice(PT_SESSION_LIST_PRICE_SEK)}
                        /pass. Fyll i antal pass och antingen rabattprocent
                        eller pris per pass – övriga belopp räknas ut.
                      </p>
                      <div className="space-y-1.5">
                        <Label htmlFor="kvitto-antal">Antal pass</Label>
                        <Input
                          id="kvitto-antal"
                          inputMode="numeric"
                          className="h-11 text-base focus:placeholder:text-transparent"
                          value={quantityRaw}
                          onChange={(event) =>
                            setQuantityRaw(
                              event.target.value
                                .replace(/[^\d]/g, "")
                                .slice(0, 2),
                            )
                          }
                          placeholder="Ex. 6"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="kvitto-rabattprocent">
                            Rabattprocent
                          </Label>
                          <Input
                            id="kvitto-rabattprocent"
                            inputMode="decimal"
                            className="h-11 text-base focus:placeholder:text-transparent"
                            value={discountPercentRaw}
                            onChange={(event) => {
                              setPriceEditMode("discount");
                              setDiscountPercentRaw(event.target.value);
                            }}
                            placeholder="Ex. 18"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="kvitto-pris-pass">
                            Pris per pass (kr)
                          </Label>
                          <Input
                            id="kvitto-pris-pass"
                            inputMode="numeric"
                            className="h-11 text-base focus:placeholder:text-transparent"
                            value={unitPriceRaw}
                            onChange={(event) => {
                              setPriceEditMode("unit");
                              setUnitPriceRaw(
                                event.target.value
                                  .replace(/[^\d]/g, "")
                                  .slice(0, 5),
                              );
                            }}
                            placeholder="Ex. 810"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="kvitto-belopp">
                          Belopp inkl. moms (kr){" "}
                          <span className="text-destructive" aria-hidden="true">
                            *
                          </span>
                        </Label>
                        <Input
                          id="kvitto-belopp"
                          inputMode="decimal"
                          aria-invalid={Boolean(visibleErrors.amount)}
                          aria-describedby={
                            visibleErrors.amount
                              ? "kvitto-belopp-help kvitto-belopp-error"
                              : "kvitto-belopp-help"
                          }
                          className="h-11 text-base focus:placeholder:text-transparent"
                          value={amountRaw}
                          onChange={(event) => setAmountRaw(event.target.value)}
                          placeholder="Ex. 4860"
                        />
                        <p
                          id="kvitto-belopp-help"
                          className="text-sm text-muted-foreground"
                        >
                          {ptCalc
                            ? `Uträknat från ${ptCalc.quantity} pass × ${formatOfferPrice(ptCalc.unitPriceSek)} (ordinarie ${formatOfferPrice(ptCalc.listTotalSek)}).`
                            : "Kan fyllas i manuellt, eller räknas ut via antal pass ovan."}
                        </p>
                        {visibleErrors.amount ? (
                          <p
                            id="kvitto-belopp-error"
                            className="text-sm text-destructive"
                            role="alert"
                          >
                            {visibleErrors.amount}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-3.5">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Pris per paket{" "}
                        {formatOfferPrice(SNABBHET_PACKAGE_PRICE_SEK)}{" "}
                        inkl. moms. Antal paket × pris ger totalsumman.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="kvitto-antal-paket">
                            Antal paket
                          </Label>
                          <Input
                            id="kvitto-antal-paket"
                            inputMode="numeric"
                            className="h-11 text-base focus:placeholder:text-transparent"
                            value={quantityRaw}
                            onChange={(event) =>
                              setQuantityRaw(
                                event.target.value
                                  .replace(/[^\d]/g, "")
                                  .slice(0, 2),
                              )
                            }
                            placeholder="Ex. 1"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="kvitto-pris-paket">
                            Pris per paket (kr)
                          </Label>
                          <Input
                            id="kvitto-pris-paket"
                            inputMode="numeric"
                            className="h-11 text-base focus:placeholder:text-transparent"
                            value={packagePriceRaw}
                            onChange={(event) =>
                              setPackagePriceRaw(
                                event.target.value
                                  .replace(/[^\d]/g, "")
                                  .slice(0, 5),
                              )
                            }
                            placeholder={`Ex. ${SNABBHET_PACKAGE_PRICE_SEK}`}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="kvitto-belopp-snabbhet">
                          Belopp inkl. moms (kr){" "}
                          <span className="text-destructive" aria-hidden="true">
                            *
                          </span>
                        </Label>
                        <Input
                          id="kvitto-belopp-snabbhet"
                          inputMode="decimal"
                          aria-invalid={Boolean(visibleErrors.amount)}
                          aria-describedby={
                            visibleErrors.amount
                              ? "kvitto-belopp-snabbhet-help kvitto-belopp-error"
                              : "kvitto-belopp-snabbhet-help"
                          }
                          className="h-11 text-base focus:placeholder:text-transparent"
                          value={amountRaw}
                          onChange={(event) => setAmountRaw(event.target.value)}
                          placeholder={`Ex. ${SNABBHET_PACKAGE_PRICE_SEK}`}
                        />
                        <p
                          id="kvitto-belopp-snabbhet-help"
                          className="text-sm text-muted-foreground"
                        >
                          {snabbhetCalc
                            ? `Uträknat från ${snabbhetCalc.quantity} paket × ${formatOfferPrice(snabbhetCalc.packagePriceSek)}.`
                            : "Fyll i antal paket och pris per paket."}
                        </p>
                        {visibleErrors.amount ? (
                          <p
                            id="kvitto-belopp-error"
                            className="text-sm text-destructive"
                            role="alert"
                          >
                            {visibleErrors.amount}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="kvitto-produkt">
                      Tjänstens namn{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Textarea
                      id="kvitto-produkt"
                      rows={2}
                      aria-invalid={Boolean(visibleErrors.productName)}
                      aria-describedby={
                        visibleErrors.productName
                          ? "kvitto-produkt-help kvitto-produkt-error"
                          : "kvitto-produkt-help"
                      }
                      className="min-h-11 text-base focus:placeholder:text-transparent"
                      value={productName}
                      onChange={(event) => {
                        setProductNameDirty(true);
                        setProductName(event.target.value);
                      }}
                      placeholder={
                        offerKind === "pt"
                          ? `Ex. ${buildPtServiceName(6)}`
                          : `Ex. ${buildSnabbhetServiceName(2)}`
                      }
                    />
                    <p
                      id="kvitto-produkt-help"
                      className="text-sm text-muted-foreground"
                    >
                      Förifylls från antal ovan. Du kan ändra texten manuellt.
                    </p>
                    {visibleErrors.productName ? (
                      <p
                        id="kvitto-produkt-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {visibleErrors.productName}
                      </p>
                    ) : null}
                  </div>
                </>
              ) : null}
              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="kvitto-namn">
                    Kundens namn
                    {buyerDetailsRequired ? (
                      <>
                        {" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </>
                    ) : null}
                  </Label>
                  <Input
                    id="kvitto-namn"
                    aria-invalid={Boolean(visibleErrors.customerName)}
                    aria-describedby={
                      visibleErrors.customerName
                        ? "kvitto-kund-info kvitto-namn-error"
                        : "kvitto-kund-info"
                    }
                    className="h-11 text-base"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                  />
                  {visibleErrors.customerName ? (
                    <p
                      id="kvitto-namn-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {visibleErrors.customerName}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="kvitto-pnr">
                    Personnummer
                    {buyerDetailsRequired ? (
                      <>
                        {" "}
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                      </>
                    ) : null}
                  </Label>
                  <Input
                    id="kvitto-pnr"
                    inputMode="numeric"
                    aria-invalid={Boolean(visibleErrors.personalId)}
                    aria-describedby={
                      visibleErrors.personalId
                        ? "kvitto-kund-info kvitto-pnr-error"
                        : "kvitto-kund-info"
                    }
                    className="h-11 text-base"
                    value={personalId}
                    onChange={(event) =>
                      setPersonalId(formatPersonalIdInput(event.target.value))
                    }
                    placeholder="ÅÅÅÅMMDD-NNNN"
                  />
                  {visibleErrors.personalId ? (
                    <p
                      id="kvitto-pnr-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {visibleErrors.personalId}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="kvitto-epost">Kundens e-post</Label>
                  <Input
                    id="kvitto-epost"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="h-11 text-base"
                    value={customerEmail}
                    onChange={(event) => {
                      setCustomerEmail(event.target.value);
                      if (mailHint) setMailHint(null);
                    }}
                    placeholder="namn@exempel.se"
                    aria-describedby="kvitto-epost-help"
                  />
                  <p
                    id="kvitto-epost-help"
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    Förifylls från beställningen när länken innehåller e-post.
                    Används till knappen Öppna mejl till kund.
                  </p>
                </div>
                <div
                  id="kvitto-kund-info"
                  className="space-y-1.5 text-xs leading-relaxed text-muted-foreground"
                >
                  <p>
                    Fyll som regel i både namn och personnummer, eftersom
                    arbetsgivaren kan vilja ha båda för att godkänna kvittot.
                  </p>
                  <p>
                    Skatteverket förmedlar att för belopp upp till{" "}
                    {SIMPLIFIED_INVOICE_MAX_SEK.toLocaleString("sv-SE")} kr
                    inkl. moms behöver namn och personnummer inte anges. Över{" "}
                    {SIMPLIFIED_INVOICE_MAX_SEK.toLocaleString("sv-SE")} kr
                    inkl. moms ska kundens namn och personnummer fyllas i.
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-datum">
                  Datum (betalning){" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                <div className="flex min-w-0 items-center gap-2">
                  <Input
                    id="kvitto-datum"
                    aria-invalid={Boolean(visibleErrors.paidAtLabel)}
                    aria-describedby={
                      visibleErrors.paidAtLabel
                        ? "kvitto-datum-error"
                        : undefined
                    }
                    className="h-11 min-w-0 flex-1 text-base"
                    value={paidAtLabel}
                    onChange={(event) => setPaidAtLabel(event.target.value)}
                    placeholder="2026-11-15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 shrink-0 whitespace-nowrap px-2.5 text-xs sm:px-3 sm:text-sm"
                    onClick={() => setPaidAtLabel(todayLabel())}
                  >
                    Dagens datum
                  </Button>
                </div>
                {visibleErrors.paidAtLabel ? (
                  <p
                    id="kvitto-datum-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {visibleErrors.paidAtLabel}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-betalsatt">Betalsätt</Label>
                <select
                  id="kvitto-betalsatt"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-base"
                  value={paymentMethodLabel}
                  onChange={(event) => setPaymentMethodLabel(event.target.value)}
                >
                  <option value="Swish">Swish</option>
                  <option value="Bankgiro">Bankgiro</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="secondary"
                className={`${offerGoldCtaClass} min-h-11 w-full sm:w-auto`}
                onClick={handlePrintClick}
              >
                Skriv ut / spara som PDF
              </Button>
              {gmailComposeHref ? (
                <Button
                  asChild
                  variant="outline"
                  className={`${offerOutlineCtaClass} min-h-11 w-full sm:w-auto`}
                >
                  <a
                    href={gmailComposeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Öppna mejl till kund
                  </a>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className={`${offerOutlineCtaClass} min-h-11 w-full sm:w-auto`}
                  onClick={openCustomerMail}
                >
                  Öppna mejl till kund
                </Button>
              )}
            </div>
            {mailHint ? (
              <p className="text-sm text-destructive" role="alert">
                {mailHint}
              </p>
            ) : null}
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              1) Spara PDF. 2) Öppna mejl till kund (Gmail) och bifoga PDF:en.
              3) Lägg samma fil i Caselos Google Drive-mapp{" "}
              <span className="font-medium text-foreground">Kvitton</span>.
              {!gmailComposeHref ? (
                <> Fyll i kundens e-post för att kunna öppna mejl.</>
              ) : null}
            </p>

            {allowIncompletePrint && !isComplete ? (
              <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 sm:p-4">
                <p className="text-sm leading-relaxed text-destructive">
                  Obligatoriska uppgifter saknas. Fyll i dem för ett fullgott
                  underlag, eller välj aktivt att skriva ut ändå.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className={`${offerOutlineCtaClass} border-destructive/40 text-destructive hover:bg-destructive/10`}
                  onClick={printReceipt}
                >
                  Skriv ut ändå
                </Button>
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <p className="no-print mb-3 text-sm font-medium text-foreground md:text-base">
              Förhandsgranskning
            </p>
            <WellnessReceiptDocument data={data} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Kvitto;
