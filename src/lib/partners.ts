export type PartnerId =
  | "ifk-stocksund"
  | "enebybergs-if"
  | "fc-djursholm"
  | "ifk-mariefred";

export type PartnerConfig = {
  id: PartnerId;
  name: string;
  landingPath: string;
  bookingUrl: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  kaddioBookingUrl: string;
  kaddioCalFilter: string;
  kaddioNameSuffix: string;
};

const KADDIO_ORIGIN = "https://caseloidrottsmedicin.kaddio.com";
/** Kaddio-bokningssida för partners i Danderyd (IFK Stocksund, Enebyberg, FC Djursholm, …). */
const PARTNER_DANDERYD_KADDIO_BOOKING_URL = `${KADDIO_ORIGIN}/booking/partner-danderyd`;
const PARTNER_DANDERYD_KADDIO_CAL_FILTER = "partner-danderyd";
/** Kaddio-bokningssida för partners i Mariefred. */
export const PARTNER_MARIEFRED_KADDIO_BOOKING_URL = `${KADDIO_ORIGIN}/booking/partner-mariefred`;
export const PARTNER_MARIEFRED_KADDIO_CAL_FILTER = "partner-mariefred";

const IFK_MARIEFRED_LOGO_SRC =
  "https://az729104.cdn.laget.se/emblem_4818200.png;width=480;height=480;paddingWidth=16;mode=pad;scale=both;anchor=middlecenter";

/** Kalenderfilter för partner + ort (samma tjänstenamn, olika Kaddio-sidor). */
export function partnerKaddioCalFilter(
  partner: PartnerConfig | null,
  locationId: string | null | undefined,
): string {
  if (!partner) return "";
  if (locationId === "mariefred") return PARTNER_MARIEFRED_KADDIO_CAL_FILTER;
  if (locationId === "danderyd") return PARTNER_DANDERYD_KADDIO_CAL_FILTER;
  return partner.kaddioCalFilter;
}

/** Bokningsstartsida i Kaddio för partner + ort. */
export function partnerKaddioBookingUrl(
  partner: PartnerConfig | null,
  locationId: string | null | undefined,
): string | null {
  if (!partner) return null;
  if (locationId === "mariefred") return PARTNER_MARIEFRED_KADDIO_BOOKING_URL;
  if (locationId === "danderyd") return PARTNER_DANDERYD_KADDIO_BOOKING_URL;
  return partner.kaddioBookingUrl;
}

export const PARTNERS: Record<PartnerId, PartnerConfig> = {
  "ifk-stocksund": {
    id: "ifk-stocksund",
    name: "IFK Stocksund",
    landingPath: "/ifk-stocksund",
    bookingUrl: "/boka?partner=ifk-stocksund",
    logoSrc: "https://irp.cdn-website.com/e6471f24/dms3rep/multi/g10.png",
    logoAlt: "IFK Stocksund",
    logoWidth: 350,
    logoHeight: 438,
    kaddioBookingUrl: PARTNER_DANDERYD_KADDIO_BOOKING_URL,
    kaddioCalFilter: PARTNER_DANDERYD_KADDIO_CAL_FILTER,
    kaddioNameSuffix: " (IFK Stocksund)",
  },
  "enebybergs-if": {
    id: "enebybergs-if",
    name: "Enebybergs IF",
    landingPath: "/enebybergs-if",
    bookingUrl: "/boka?partner=enebybergs-if",
    logoSrc: "/enebyberglogo.jpeg",
    logoAlt: "Enebybergs IF",
    logoWidth: 148,
    logoHeight: 148,
    kaddioBookingUrl: PARTNER_DANDERYD_KADDIO_BOOKING_URL,
    kaddioCalFilter: PARTNER_DANDERYD_KADDIO_CAL_FILTER,
    kaddioNameSuffix: " (Enebybergs IF)",
  },
  "fc-djursholm": {
    id: "fc-djursholm",
    name: "FC Djursholm",
    landingPath: "/fc-djursholm",
    bookingUrl: "/boka?partner=fc-djursholm",
    logoSrc: "/fc-djursholm-logo.png",
    logoAlt: "FC Djursholm",
    logoWidth: 509,
    logoHeight: 560,
    kaddioBookingUrl: PARTNER_DANDERYD_KADDIO_BOOKING_URL,
    kaddioCalFilter: PARTNER_DANDERYD_KADDIO_CAL_FILTER,
    kaddioNameSuffix: " (FC Djursholm)",
  },
  "ifk-mariefred": {
    id: "ifk-mariefred",
    name: "IFK Mariefred",
    landingPath: "/ifk-mariefred",
    bookingUrl: "/boka?partner=ifk-mariefred&ort=mariefred",
    logoSrc: IFK_MARIEFRED_LOGO_SRC,
    logoAlt: "IFK Mariefred",
    logoWidth: 480,
    logoHeight: 480,
    kaddioBookingUrl: PARTNER_MARIEFRED_KADDIO_BOOKING_URL,
    kaddioCalFilter: PARTNER_MARIEFRED_KADDIO_CAL_FILTER,
    kaddioNameSuffix: " (IFK Mariefred)",
  },
};

export function isPartnerId(value: string | null | undefined): value is PartnerId {
  return (
    value === "ifk-stocksund" ||
    value === "enebybergs-if" ||
    value === "fc-djursholm" ||
    value === "ifk-mariefred"
  );
}

export function getPartner(
  id: string | null | undefined,
): PartnerConfig | null {
  return isPartnerId(id) ? PARTNERS[id] : null;
}
