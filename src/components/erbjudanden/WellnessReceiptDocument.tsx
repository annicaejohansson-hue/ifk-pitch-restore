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
  customerName: string;
  personalId: string;
  paidAtLabel: string;
  paymentMethodLabel: string;
};

type WellnessReceiptDocumentProps = {
  data: WellnessReceiptData;
};

const WellnessReceiptDocument = ({ data }: WellnessReceiptDocumentProps) => {
  const { netSek, vatSek, grossSek } = splitInclusiveVat(data.amountSek);

  return (
    <article
      className="mx-auto w-full max-w-[28rem] border border-border bg-white px-5 py-6 text-[13px] leading-snug text-foreground shadow-sm print:max-w-none print:border-0 print:shadow-none sm:px-6 sm:py-7 sm:text-sm"
      aria-label="Kvitto för friskvårdsbidrag"
    >
      <header className="space-y-1 text-center">
        <p className="text-base font-bold tracking-tight sm:text-lg">
          {CASELO_LEGAL_NAME}
        </p>
        <p className="text-muted-foreground">{CASELO_TRADE_NAME}</p>
        <p className="pt-1 text-xs text-muted-foreground sm:text-sm">
          Kundens kopia, spara kvittot
        </p>
      </header>

      <dl className="mt-5 space-y-1">
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">Telefon</dt>
          <dd className="tabular-nums">{CASELO_PHONE}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">Adress</dt>
          <dd className="text-right">
            {CASELO_ADDRESS_LINE_1}
            <br />
            {CASELO_ADDRESS_LINE_2}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">Organisationsnummer</dt>
          <dd className="tabular-nums">{CASELO_ORG_NUMBER}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">E-post</dt>
          <dd className="break-all text-right">{CASELO_EMAIL}</dd>
        </div>
      </dl>

      <div className="my-5 border-t border-dashed border-border" />

      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 font-medium">{data.productName}</p>
        <p className="shrink-0 whitespace-nowrap tabular-nums font-semibold">
          {formatSekAmount(grossSek)}
        </p>
      </div>

      <div className="my-5 border-t border-dashed border-border" />

      <table className="w-full text-left">
        <caption className="sr-only">Momsspecifikation</caption>
        <thead>
          <tr className="text-muted-foreground">
            <th className="pb-1 font-normal">Moms %</th>
            <th className="pb-1 text-right font-normal">Netto</th>
            <th className="pb-1 text-right font-normal">Moms</th>
            <th className="pb-1 text-right font-normal">Brutto</th>
          </tr>
        </thead>
        <tbody>
          <tr className="tabular-nums">
            <td>{CASELO_VAT_PERCENT}</td>
            <td className="text-right">{formatSekAmount(netSek)}</td>
            <td className="text-right">{formatSekAmount(vatSek)}</td>
            <td className="text-right">{formatSekAmount(grossSek)}</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-5 flex items-baseline justify-between gap-3 text-base font-bold sm:text-lg">
        <span>Att betala</span>
        <span className="whitespace-nowrap tabular-nums">
          {formatSekAmount(grossSek)}
        </span>
      </p>

      <div className="mt-3 flex flex-wrap justify-between gap-x-3">
        <span className="text-muted-foreground">{data.paymentMethodLabel}</span>
        <span className="tabular-nums font-medium">
          {formatSekAmount(grossSek)}
        </span>
      </div>

      <div className="my-5 border-t border-dashed border-border" />

      <dl className="space-y-1">
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">Kvittonr</dt>
          <dd className="font-medium tabular-nums">{data.orderRef}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">Datum</dt>
          <dd className="tabular-nums">{data.paidAtLabel}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">Kund</dt>
          <dd className="text-right font-medium">{data.customerName}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt className="text-muted-foreground">Personnummer</dt>
          <dd className="tabular-nums">{data.personalId}</dd>
        </div>
      </dl>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Kvitto för friskvårdsbidrag från {CASELO_LEGAL_NAME}
      </p>
    </article>
  );
};

export default WellnessReceiptDocument;
