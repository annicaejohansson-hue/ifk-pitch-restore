import {
  CASELO_ADDRESS_LINE_1,
  CASELO_ADDRESS_LINE_2,
  CASELO_EMAIL,
  CASELO_LEGAL_NAME,
  CASELO_ORG_NUMBER,
  CASELO_PHONE,
  CASELO_TRADE_NAME,
  CASELO_VAT_PERCENT,
  formatSekAmount,
  splitInclusiveVat,
} from "@/data/caseloCompany";

export type WellnessReceiptData = {
  orderRef: string;
  productName: string;
  amountSek: number;
  /** Antal pass/paket – visas som — om saknas. */
  quantityLabel: string;
  quantityCaption?: string;
  /** Rabatt som fri text, t.ex. "18 % (1 080 kr)". */
  discountLabel: string;
  discountCaption?: string;
  showDiscountRow?: boolean;
  customerName: string;
  personalId: string;
  paidAtLabel: string;
  paymentMethodLabel: string;
};

type WellnessReceiptDocumentProps = {
  data: WellnessReceiptData;
};

const Row = ({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
    <dt className="text-neutral-600">{label}</dt>
    <dd
      className={`min-w-0 text-right ${strong ? "font-semibold text-neutral-900" : "text-neutral-900"}`}
    >
      {value}
    </dd>
  </div>
);

const WellnessReceiptDocument = ({ data }: WellnessReceiptDocumentProps) => {
  const { netSek, vatSek, grossSek } = splitInclusiveVat(data.amountSek);

  return (
    <article
      className="receipt-document mx-auto w-full max-w-[36rem] border border-neutral-300 bg-white px-5 py-7 text-[13px] leading-relaxed text-neutral-900 shadow-sm print:border print:border-neutral-300 print:px-8 print:py-9 print:shadow-none sm:px-8 sm:py-9 sm:text-sm"
      aria-label="Kvitto för friskvårdsbidrag"
    >
      <div className="border-b border-neutral-900 pb-5 text-center">
        <img
          src="/caselo-logo-blue.png"
          alt={CASELO_TRADE_NAME}
          width={1200}
          height={479}
          className="mx-auto h-10 w-auto max-w-[12rem] object-contain print:h-12 print:max-w-[14rem] sm:h-12 sm:max-w-[14rem]"
        />
        <h1 className="mt-5 text-2xl font-bold tracking-[0.18em] text-neutral-900 uppercase sm:text-3xl">
          Kvitto
        </h1>
        <p className="mt-1.5 text-xs tracking-wide text-neutral-600 sm:text-sm">
          Kundens kopia
        </p>
      </div>

      <section className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 text-left sm:mt-6 sm:gap-x-8">
        <div className="min-w-0 space-y-1">
          <p className="font-semibold">{CASELO_LEGAL_NAME}</p>
          <p className="text-neutral-700">{CASELO_TRADE_NAME}</p>
          <p className="text-neutral-700">{CASELO_ADDRESS_LINE_1}</p>
          <p className="text-neutral-700">{CASELO_ADDRESS_LINE_2}</p>
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-neutral-700">Org.nr {CASELO_ORG_NUMBER}</p>
          <p className="text-neutral-700">Tel {CASELO_PHONE}</p>
          <p className="break-all text-neutral-700">{CASELO_EMAIL}</p>
          <p className="text-neutral-700">www.caseloidrottsmedicin.se</p>
        </div>
      </section>

      <section className="mt-6 border-y border-neutral-300 py-4">
        <dl className="space-y-1.5">
          <Row label="Kvittonr" value={data.orderRef} strong />
          <Row label="Datum" value={data.paidAtLabel} />
          <Row label="Betalsätt" value={data.paymentMethodLabel} />
        </dl>
      </section>

      <section className="mt-5">
        <h2 className="text-[11px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Kund
        </h2>
        <dl className="mt-2 space-y-1.5">
          <Row label="Namn" value={data.customerName} strong />
          <Row label="Personnummer" value={data.personalId} />
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-[11px] font-semibold tracking-[0.14em] text-neutral-600 uppercase">
          Specifikation
        </h2>
        <div className="mt-2 flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
          <p className="min-w-0 flex-1 font-medium">{data.productName}</p>
          <p className="shrink-0 whitespace-nowrap tabular-nums font-semibold">
            {formatSekAmount(grossSek)}
          </p>
        </div>

        <table className="mt-4 w-full text-left">
          <caption className="sr-only">Momsspecifikation</caption>
          <thead>
            <tr className="border-b border-neutral-200 text-[11px] tracking-wide text-neutral-600 uppercase">
              <th className="pb-1.5 font-semibold">Moms %</th>
              <th className="pb-1.5 text-right font-semibold">Netto</th>
              <th className="pb-1.5 text-right font-semibold">Moms</th>
              <th className="pb-1.5 text-right font-semibold">Brutto</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tabular-nums">
              <td className="pt-2">{CASELO_VAT_PERCENT}</td>
              <td className="pt-2 text-right">{formatSekAmount(netSek)}</td>
              <td className="pt-2 text-right">{formatSekAmount(vatSek)}</td>
              <td className="pt-2 text-right">{formatSekAmount(grossSek)}</td>
            </tr>
          </tbody>
        </table>

        <dl className="mt-4 space-y-1.5 border-t border-neutral-200 pt-3">
          <Row
            label={data.quantityCaption || "Antal pass"}
            value={data.quantityLabel || "—"}
          />
          {data.showDiscountRow === false ? null : (
            <Row
              label={data.discountCaption || "Rabatt"}
              value={data.discountLabel || "—"}
            />
          )}
        </dl>

        <p className="mt-5 flex items-baseline justify-between gap-3 border-t-2 border-neutral-900 pt-3 text-base font-bold sm:text-lg">
          <span>Totalt</span>
          <span className="whitespace-nowrap tabular-nums">
            {formatSekAmount(grossSek)}
          </span>
        </p>
      </section>

      <footer className="mt-8 border-t border-neutral-300 pt-4 text-center text-xs leading-relaxed text-neutral-600">
        <p>
          Kvitto utfärdat av {CASELO_LEGAL_NAME} ({CASELO_TRADE_NAME}).
        </p>
      </footer>
    </article>
  );
};

export default WellnessReceiptDocument;
