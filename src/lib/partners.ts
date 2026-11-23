export type PartnerId = "ifk-stocksund" | "enebybergs-if" | "fc-djursholm";

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
    kaddioBookingUrl: `${KADDIO_ORIGIN}/booking/ifk-stocksund`,
    kaddioCalFilter: "ifk-stocksund",
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
    kaddioBookingUrl: `${KADDIO_ORIGIN}/booking/enebybergs-if`,
    kaddioCalFilter: "enebybergs-if",
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
    kaddioBookingUrl: `${KADDIO_ORIGIN}/booking/fc-djursholm`,
    kaddioCalFilter: "fc-djursholm",
    kaddioNameSuffix: " (FC Djursholm)",
  },
};

export function isPartnerId(value: string | null | undefined): value is PartnerId {
  return (
    value === "ifk-stocksund" ||
    value === "enebybergs-if" ||
    value === "fc-djursholm"
  );
}

export function getPartner(
  id: string | null | undefined,
): PartnerConfig | null {
  return isPartnerId(id) ? PARTNERS[id] : null;
}
