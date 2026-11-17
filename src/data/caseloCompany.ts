/** Verifierade företagsuppgifter för kvitto och formella underlag. */

export const CASELO_LEGAL_NAME = "Caselo AB";
/** Namn som används mot kund i marknadsföring. */
export const CASELO_TRADE_NAME = "Caselo Idrottsmedicin";
/** Organisationsnummer utan bindestreck. */
export const CASELO_ORG_NUMBER_DIGITS = "5595609362";
export const CASELO_ORG_NUMBER = "559560-9362";
export const CASELO_VAT_PERCENT = 6;
export const CASELO_VAT_RATE = CASELO_VAT_PERCENT / 100;
export const CASELO_PHONE_DIGITS = "0737564509";
export const CASELO_PHONE = "073-756 45 09";
export const CASELO_ADDRESS_LINE_1 = "Rinkebyvägen 4";
export const CASELO_ADDRESS_LINE_2 = "182 36 Danderyd";
export const CASELO_ADDRESS = `${CASELO_ADDRESS_LINE_1}, ${CASELO_ADDRESS_LINE_2}`;
export const CASELO_EMAIL = "henrik@caseloidrottsmedicin.se";

export const WELLNESS_RECEIPT_PATH = "/kvitto";

export function formatSekAmount(amountSek: number): string {
  return `${new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountSek)} SEK`;
}

/**
 * Delar upp belopp inklusive moms i netto och moms.
 * Räknas i ören så att netto + moms alltid blir brutto.
 */
export function splitInclusiveVat(
  amountInclSek: number,
  rate: number = CASELO_VAT_RATE,
): { netSek: number; vatSek: number; grossSek: number } {
  const grossOre = Math.round(amountInclSek * 100);
  const netOre = Math.round(grossOre / (1 + rate));
  const vatOre = grossOre - netOre;
  return {
    netSek: netOre / 100,
    vatSek: vatOre / 100,
    grossSek: grossOre / 100,
  };
}
