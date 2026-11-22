/**
 * Gemensam bokningskatalog (tjänster, priser, texter).
 * Ortspecifika avvikelser kan läggas till senare utan att duplicera hela listan.
 */
import { TRAINING_BOOKING_CATEGORY_ID } from "@/lib/booking";
import type { PartnerConfig } from "@/lib/partners";
import type { LocationId } from "@/data/locations";

export type BookingService = {
  id: string;
  /** Full name used by Kaddio calendar URLs (ordinary booking) */
  name: string;
  /** Short display title shown in the list */
  label: string;
  durationMin?: number;
  priceSek: number;
  ordinaryPriceSek?: number;
  description?: string;
  variant?: "package";
  /** Shown above the calendar when this service is selected */
  bookingNotice?: string;
  /**
   * Partnerpris (IFK Stocksund / Enebybergs IF).
   * Om `name` saknas visas bara partnerpriset; bokningen går i ordinarie Kaddio-kalender.
   * Om `sharedAcrossPartners` är true används samma Kaddio-typ för alla partnerföreningar
   * (t.ex. "… - Partner"), annars IFK-namn respektive `name + kaddioNameSuffix`.
   */
  ifk?: {
    priceSek: number;
    ordinaryPriceSek?: number;
    name?: string;
    sharedAcrossPartners?: boolean;
  };
};

export type BookingSubgroup = {
  id: string;
  name: string;
  services: BookingService[];
};

export type BookingCategory = {
  id: string;
  name: string;
  services?: BookingService[];
  subgroups?: BookingSubgroup[];
  packages?: BookingService[];
};

const SMARTA_NYBESOK_NAME =
  "Bedömning och behandling av smärta och skador - NYBESÖK";
const SMARTA_ATERBESOK_NAME =
  "Bedömning och behandling av smärta och skador - ÅTERBESÖK";
export const SNABBHET_BOOKING_NOTICE =
  "Du bokar tid för första besöket. Återtestet görs cirka 8 veckor senare.";

/** Baskatalog – samma för alla orter tills vidare. */
export const BOOKING_CATEGORIES: BookingCategory[] = [
  {
    id: "smarta-och-skador",
    name: "Bedömning och behandling av smärta och skador",
    services: [
      {
        id: "smarta-nybesok",
        name: SMARTA_NYBESOK_NAME,
        label: "Nybesök",
        durationMin: 40,
        priceSek: 895,
        ifk: {
          priceSek: 750,
          name: `${SMARTA_NYBESOK_NAME} (IFK Stocksund)`,
        },
        description:
          "Nybesök bokas när du kommer första gången för ett besvär. Tjänsten är för dig som har ont eller är skadad och vill få hjälp med bedömning/diagnos och individuellt anpassade åtgärder för att minska besvären och hjälpa dig återgå till idrott, arbete eller vardag. Besöket kan innehålla behandling, rehabiliteringsövningar, träningsupplägg och råd om belastning.",
      },
      {
        id: "smarta-aterbesok",
        name: SMARTA_ATERBESOK_NAME,
        label: "Återbesök",
        durationMin: 30,
        priceSek: 695,
        ifk: {
          priceSek: 590,
          name: `${SMARTA_ATERBESOK_NAME} (IFK Stocksund)`,
        },
        description:
          "Återbesök bokas när du redan har undersökts hos Caselo Idrottsmedicin för besväret du söker för.",
      },
    ],
  },
  {
    id: "halkoppsinlagg",
    name: "Tillverkning av skräddarsydda hälkoppsinlägg",
    services: [
      {
        id: "halkopp-vuxen-nybesok",
        name: "Hälkoppsinlägg Vuxen - NYBESÖK",
        label: "Nybesök - VUXEN (fyllda 18 år eller äldre)",
        durationMin: 40,
        priceSek: 1495,
        ifk: {
          priceSek: 1270,
          name: "Hälkoppsinlägg Vuxen - NYBESÖK (IFK Stocksund)",
        },
        description:
          "För dig som ska göra hälkoppsinlägg för första gången. Besöket omfattar undersökning och tillverkning av personligt utformade hälkoppsinlägg. Inlägget formas efter din häl för att ge stöd, minska belastningen på hälen, dämpa smärta och göra det lättare att gå, springa och vara aktiv.",
      },
      {
        id: "halkopp-vuxen-aterbesok",
        name: "Hälkoppsinlägg Vuxen - ÅTERBESÖK",
        label: "Återbesök - VUXEN (fyllda 18 år eller äldre)",
        durationMin: 30,
        priceSek: 1295,
        ifk: {
          priceSek: 1100,
          name: "Hälkoppsinlägg Vuxen - ÅTERBESÖK (IFK Stocksund)",
        },
        description:
          "Tillverkning av fler personligt utformade hälkoppsinlägg. Bokas av dig som tidigare genomfört ett nybesök.",
      },
      {
        id: "halkopp-barn-nybesok",
        name: "Hälkoppsinlägg Barn - NYBESÖK",
        label: "Nybesök - BARN (ej fyllda 18 år)",
        durationMin: 40,
        priceSek: 1295,
        ifk: {
          priceSek: 1100,
          name: "Hälkoppsinlägg Barn - NYBESÖK (IFK Stocksund)",
        },
        description:
          "För dig som ska göra hälkoppsinlägg för första gången. Besöket omfattar undersökning och tillverkning av personligt utformade hälkoppsinlägg. Inlägget formas efter din häl för att ge stöd, minska belastningen på hälen, dämpa smärta och göra det lättare att gå, springa och vara aktiv.",
      },
      {
        id: "halkopp-barn-aterbesok",
        name: "Hälkoppsinlägg Barn - ÅTERBESÖK",
        label: "Återbesök - BARN (ej fyllda 18 år)",
        durationMin: 30,
        priceSek: 1095,
        ifk: {
          priceSek: 930,
          name: "Hälkoppsinlägg Barn - ÅTERBESÖK (IFK Stocksund)",
        },
        description:
          "Tillverkning av fler personligt utformade hälkoppsinlägg. Bokas av dig som tidigare genomfört ett nybesök.",
      },
    ],
  },
  {
    id: TRAINING_BOOKING_CATEGORY_ID,
    name: "Personlig träning",
    services: [
      {
        id: "pt-pass",
        name: "Personlig Träning (PT-pass)",
        label: "PT-pass",
        durationMin: 60,
        priceSek: 990,
        ifk: {
          priceSek: 840,
          name: "Personlig Träning (PT-pass) - Partner",
          sharedAcrossPartners: true,
        },
        description:
          "Individuellt träningspass à 60 minuter med personlig återkoppling och övningar att fortsätta med. Passet anpassas efter dig, till exempel fotbollsfys, löpteknik och snabbhet eller fys för din idrott eller motionsform.",
      },
      {
        id: "snabbhetspaketet",
        name: "Snabbhetspaketet",
        label: "Snabbhetspaketet",
        durationMin: 75,
        priceSek: 1000,
        ordinaryPriceSek: 2685,
        description: `Du testar din snabbhet med laserportar på 10, 20 och 30 meter, får ett träningsprogram anpassat efter dig och kommer tillbaka efter cirka 8 veckor för ett uppföljande test. Första besöket tar ca 75 min och återbesöket ca 45 min.\n\n${SNABBHET_BOOKING_NOTICE}`,
        bookingNotice: SNABBHET_BOOKING_NOTICE,
      },
    ],
  },
];

const partnerServiceName = (
  service: BookingService,
  partner: PartnerConfig,
): string => {
  if (!service.ifk?.name) return service.name;
  if (service.ifk.sharedAcrossPartners) return service.ifk.name;
  if (partner.id === "ifk-stocksund") return service.ifk.name;
  return `${service.name}${partner.kaddioNameSuffix}`;
};

export const resolveServiceForVisitor = (
  service: BookingService,
  partner: PartnerConfig | null,
): BookingService => {
  const resolved =
    partner && service.ifk
      ? {
          ...service,
          name: partnerServiceName(service, partner),
          priceSek: service.ifk.priceSek,
          ordinaryPriceSek: service.priceSek,
        }
      : service;

  if (service.id !== "pt-pass" || !service.description) return resolved;

  const discountNote = partner
    ? "Eventuell ytterligare rabatt visas i nästa steg."
    : "Eventuell rabatt vidare i nästa steg";

  return {
    ...resolved,
    description: `${service.description}\n\n${discountNote}`,
  };
};

/**
 * Katalog för en ort. Just nu identisk överallt – hook för framtida skillnader.
 */
export const bookingCategoriesForLocation = (
  _locationId: LocationId | null,
  partner: PartnerConfig | null,
): BookingCategory[] =>
  BOOKING_CATEGORIES.map((category) => ({
    ...category,
    services: category.services?.map((service) =>
      resolveServiceForVisitor(service, partner),
    ),
    subgroups: category.subgroups?.map((subgroup) => ({
      ...subgroup,
      services: subgroup.services.map((service) =>
        resolveServiceForVisitor(service, partner),
      ),
    })),
    packages: category.packages?.map((service) =>
      resolveServiceForVisitor(service, partner),
    ),
  }));

export const allBookingEntries = (
  locationId: LocationId | null,
  partner: PartnerConfig | null,
) =>
  bookingCategoriesForLocation(locationId, partner).flatMap((category) => {
    const grouped = category.subgroups
      ? category.subgroups.flatMap((subgroup) =>
          subgroup.services.map((service) => ({
            categoryName: category.name,
            subgroupName: subgroup.name,
            service,
          })),
        )
      : (category.services ?? []).map((service) => ({
          categoryName: category.name,
          subgroupName: undefined as string | undefined,
          service,
        }));

    const packages = (category.packages ?? []).map((service) => ({
      categoryName: category.name,
      subgroupName: undefined as string | undefined,
      service,
    }));

    return [...grouped, ...packages];
  });

export const servicesInCategory = (category: BookingCategory) => [
  ...(category.subgroups
    ? category.subgroups.flatMap((subgroup) => subgroup.services)
    : (category.services ?? [])),
  ...(category.packages ?? []),
];

export const categoryIdFromParam = (value: string | null): string | undefined =>
  BOOKING_CATEGORIES.some((category) => category.id === value)
    ? (value ?? undefined)
    : undefined;
