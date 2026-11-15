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
  CASELO_LEGAL_NAME,
  CASELO_ORG_NUMBER,
  CASELO_PHONE,
  CASELO_VAT_PERCENT,
} from "@/data/caseloCompany";
import { formatPersonalIdInput } from "@/data/erbjudanden";
import { offerGoldCtaClass, offerOutlineCtaClass } from "@/components/erbjudanden/offerUi";

const todayLabel = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
};

const parseAmount = (raw: string): number => {
  const normalized = raw.replace(/\s/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const Kvitto = () => {
  const [searchParams] = useSearchParams();
  const [orderRef, setOrderRef] = useState(searchParams.get("ref") ?? "");
  const [productName, setProductName] = useState(
    searchParams.get("produkt") ?? "",
  );
  const [amountRaw, setAmountRaw] = useState(searchParams.get("belopp") ?? "");
  const [customerName, setCustomerName] = useState(
    searchParams.get("namn") ?? "",
  );
  const [personalId, setPersonalId] = useState(
    formatPersonalIdInput(searchParams.get("personnummer") ?? ""),
  );
  const [paidAtLabel, setPaidAtLabel] = useState(
    searchParams.get("datum") ?? todayLabel(),
  );
  const [paymentMethodLabel, setPaymentMethodLabel] = useState(
    searchParams.get("betalsatt") === "bankgiro" ? "Bankgiro" : "Swish",
  );
  const prefilledFromOrder =
    Boolean(searchParams.get("ref")) &&
    Boolean(searchParams.get("produkt")) &&
    Boolean(searchParams.get("belopp"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const amountSek = parseAmount(amountRaw);
  const ready =
    orderRef.trim().length >= 4 &&
    productName.trim().length >= 2 &&
    amountSek > 0 &&
    customerName.trim().length >= 2 &&
    personalId.trim().length >= 11 &&
    paidAtLabel.trim().length >= 8;

  const data: WellnessReceiptData = useMemo(
    () => ({
      orderRef: orderRef.trim() || "—",
      productName: productName.trim() || "—",
      amountSek: amountSek || 0,
      customerName: customerName.trim() || "—",
      personalId: personalId.trim() || "—",
      paidAtLabel: paidAtLabel.trim() || "—",
      paymentMethodLabel,
    }),
    [
      orderRef,
      productName,
      amountSek,
      customerName,
      personalId,
      paidAtLabel,
      paymentMethodLabel,
    ],
  );

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>Kvitto för friskvårdsbidrag – Caselo</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <style>{`
        @media print {
          header, .no-print { display: none !important; }
          main { min-height: 0 !important; background: white !important; }
          body { background: white !important; }
        }
      `}</style>

      <section className="container px-4 py-8 md:px-4 md:py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="no-print space-y-5 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-[var(--shadow-card)] sm:p-6">
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                Skapa friskvårdskvitto
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {prefilledFromOrder
                  ? "Uppgifterna är förifyllda från beställningen. När betalningen syns: kontrollera förhandsgranskningen, sätt betalningsdatum, spara som PDF och mejla till kunden."
                  : "Fyll i uppgifterna från beställningen när betalningen syns. Kontrollera kvittot, spara som PDF och mejla till kunden."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Avsändare på kvittot: {CASELO_LEGAL_NAME}, org.nr{" "}
                {CASELO_ORG_NUMBER}, moms {CASELO_VAT_PERCENT} %, tel{" "}
                {CASELO_PHONE}.
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
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-produkt">Produkt</Label>
                <Textarea
                  id="kvitto-produkt"
                  rows={3}
                  className="min-h-11 text-base"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="t.ex. 6 individuella träningspass à 60 minuter…"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-belopp">Belopp inkl. moms (kr)</Label>
                <Input
                  id="kvitto-belopp"
                  inputMode="decimal"
                  className="h-11 text-base"
                  value={amountRaw}
                  onChange={(event) => setAmountRaw(event.target.value)}
                  placeholder="4860"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-namn">Kundens namn</Label>
                <Input
                  id="kvitto-namn"
                  className="h-11 text-base"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-pnr">Personnummer</Label>
                <Input
                  id="kvitto-pnr"
                  inputMode="numeric"
                  className="h-11 text-base"
                  value={personalId}
                  onChange={(event) =>
                    setPersonalId(formatPersonalIdInput(event.target.value))
                  }
                  placeholder="ÅÅÅÅMMDD-NNNN"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kvitto-datum">Datum (betalning)</Label>
                <Input
                  id="kvitto-datum"
                  className="h-11 text-base"
                  value={paidAtLabel}
                  onChange={(event) => setPaidAtLabel(event.target.value)}
                  placeholder="2026-11-15 14:30"
                />
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
                className={offerGoldCtaClass}
                disabled={!ready}
                onClick={() => window.print()}
              >
                Skriv ut / spara som PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                className={offerOutlineCtaClass}
                onClick={() => setPaidAtLabel(todayLabel())}
              >
                Sätt dagens datum
              </Button>
            </div>
            {!ready ? (
              <p className="text-sm text-muted-foreground">
                Fyll i alla fält innan du skriver ut.
              </p>
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
