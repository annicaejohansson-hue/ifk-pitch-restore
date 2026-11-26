/**
 * Mottagningar / bokningsorter.
 * Tjänster och priser delas tills vidare; Kaddio-filter styr faktisk plats.
 */

import type { PartnerConfig } from "@/lib/partners";

export type LocationId = "danderyd" | "mariefred";

export type LocationConfig = {
  id: LocationId;
  /** Ortsnamn (kort, utan anläggning). */
  name: string;
  /** Anläggning – endast i mottagningspresentation, inte i ortsvalet. */
  venueName: string;
  /** Kort schemarad på ortskort / bokningssteg (utan ortsnamn). */
  scheduleCard: string;
  /** Förkortade dagar under kalenderikon på mottagningssidan. */
  scheduleDaysShort: string;
  /** Schemarad i hero (med ortsnamn). */
  scheduleHeroPart: string;
  addressLine1: string;
  addressLine2: string;
  /** Query for Maps-sök/embed (helst företagsnamn så rätt pin visas). */
  mapsQuery: string;
  /** Direktlänk till Google Place (öppnas i Maps). */
  mapsUrl?: string;
  /** Kort ingress om platsen (mottagningsflik). */
  placeIntro: string;
  /** Plats-specifika punkter (inte gemensamma behandlingsmetoder). */
  placeHighlights: string[];
  /** Valfri avslutande text under punkterna (t.ex. BalanZe-erbjudande). */
  placeFooter?: string;
  /**
   * Kaddio booking-page / calendar filter segment:
   * /booking/{filter} and /booking/cal/{filter}/{slug}
   */
  kaddioCalFilter: string;
  bookingEnabled: boolean;
};

const KADDIO_ORIGIN = "https://caseloidrottsmedicin.kaddio.com";

const mariefredFilter = (
  import.meta.env.VITE_KADDIO_MARIEFRED_CAL_FILTER ?? "mariefred"
).trim() || "mariefred";

export const LOCATIONS: Record<LocationId, LocationConfig> = {
  danderyd: {
    id: "danderyd",
    name: "Danderyd",
    venueName: "Danderyd Arena",
    scheduleCard: "Mån, Tis, Ons, Fre",
    scheduleDaysShort: "Mån, Tis, Ons, Fre",
    scheduleHeroPart: "Danderyd mån–ons & fre",
    addressLine1: "Rinkebyvägen 4",
    addressLine2: "182 36 Danderyd",
    mapsQuery: "Caselo Idrottsmedicin, Rinkebyvägen 4, 182 36 Danderyd",
    mapsUrl:
      "https://www.google.com/maps/place/Caselo+Idrottsmedicin/@59.4142713,18.0431145,17z/data=!4m6!3m5!1s0x465f9d3c9078edf1:0xfe98c6b735b513c4!8m2!3d59.4142713!4d18.0431145!16s%2Fg%2F11zfbvfv96",
    placeIntro: "",
    placeHighlights: [
      "Fullstor fotbollsplan 25 meter från kliniken som möjliggör verklighetsnära rehab och testning inför återgång till träning och tävling, till exempel maxlöpningar och idrottsspecifika moment",
    ],
    kaddioCalFilter: "danderyd",
    bookingEnabled: true,
  },
  mariefred: {
    id: "mariefred",
    name: "Mariefred",
    venueName: "BalanZe Gym",
    scheduleCard: "Torsdagar",
    scheduleDaysShort: "Torsdagar",
    scheduleHeroPart: "Mariefred torsdagar",
    addressLine1: "Skogsborgsvägen 14",
    addressLine2: "647 31 Mariefred",
    mapsQuery: "Skogsborgsvägen 14, 647 31 Mariefred",
    placeIntro: "",
    placeHighlights: [
      "Gym för styrketräning, konditionsträning och funktionell träning. Som kund hos Henrik får du möjlighet att komplettera din rehabilitering med en månad gratis träning på BalanZe.",
      "Fullstor fotbollsplan 2 min med bil från kliniken som möjliggör verklighetsnära rehab och testning inför återgång till träning och tävling, till exempel maxlöpningar och idrottsspecifika moment",
    ],
    kaddioCalFilter: mariefredFilter,
    bookingEnabled: true,
  },
};

/** Kaddio-bokningssida för vanlig (icke-partner) bokning på orten. */
export function locationKaddioBookingUrl(
  location: LocationConfig | null | undefined,
): string | null {
  if (!location?.kaddioCalFilter) return null;
  return `${KADDIO_ORIGIN}/booking/${location.kaddioCalFilter}`;
}

export const LOCATION_IDS: LocationId[] = ["danderyd", "mariefred"];

export const MOTTAGNINGAR_HASH = "mottagningar";
export const MOTTAGNINGAR_PATH = `/om#${MOTTAGNINGAR_HASH}`;

export function isLocationId(
  value: string | null | undefined,
): value is LocationId {
  return value === "danderyd" || value === "mariefred";
}

export function getLocation(
  id: string | null | undefined,
): LocationConfig | null {
  return isLocationId(id) ? LOCATIONS[id] : null;
}

/** Ort är bokningsbar när `bookingEnabled` är true. */
export function isLocationBookable(
  id: LocationId,
  _partner: PartnerConfig | null = null,
): boolean {
  return LOCATIONS[id].bookingEnabled;
}
