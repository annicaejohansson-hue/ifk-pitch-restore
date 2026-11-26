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
   * Ortspecifika namn/priser för vanlig bokning (utan partnerbanner), t.ex. Mariefred.
   */
  byLocation?: Partial<
    Record<LocationId, { name: string; priceSek: number }>
  >;
  /**
   * Partnerpris (IFK Stocksund / Enebybergs IF / FC Djursholm / IFK Mariefred m.fl.).
   * Om `name` saknas visas bara partnerpriset; bokningen går i ordinarie Kaddio-kalender.
   * Med `sharedAcrossPartners: true` används samma Kaddio-typ för alla partnerföreningar
   * (namn som slutar med " (Partner)" / " (Partner Mariefred)").
   * `priceByLocation` / `nameByLocation` åsidosätter per ort (t.ex. Mariefred).
   */
  ifk?: {
    priceSek: number;
    ordinaryPriceSek?: number;
    name?: string;
    sharedAcrossPartners?: boolean;
    priceByLocation?: Partial<Record<LocationId, number>>;
    nameByLocation?: Partial<Record<LocationId, string>>;
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

/** Kaddio-namn för vanlig bokning i Danderyd (utan partnerbanner). */
const SMARTA_NYBESOK_NAME = "Smärta och skador - NYBESÖK (Danderyd)";
const SMARTA_ATERBESOK_NAME = "Smärta och skador - ÅTERBESÖK (Danderyd)";
/** Kaddio-namn för partners i Danderyd (IFK Stocksund, Enebyberg, FC Djursholm, Parsian IF, …). */
const SMARTA_NYBESOK_PARTNER_NAME =
  "Smärta och skador - NYBESÖK (Partner Danderyd)";
const SMARTA_ATERBESOK_PARTNER_NAME =
  "Smärta och skador - ÅTERBESÖK (Partner Danderyd)";
/** Kaddio-namn för partners i Mariefred. */
const SMARTA_NYBESOK_PARTNER_MF_NAME =
  "Smärta och skador - NYBESÖK (Partner Mariefred)";
const SMARTA_ATERBESOK_PARTNER_MF_NAME =
  "Smärta och skador - ÅTERBESÖK (Partner Mariefred)";
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
        byLocation: {
          mariefred: {
            name: "Smärta och skador - NYBESÖK (Mariefred)",
            priceSek: 600,
          },
        },
        ifk: {
          priceSek: 750,
          name: SMARTA_NYBESOK_PARTNER_NAME,
          sharedAcrossPartners: true,
          priceByLocation: { mariefred: 600 },
          nameByLocation: { mariefred: SMARTA_NYBESOK_PARTNER_MF_NAME },
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
        byLocation: {
          mariefred: {
            name: "Smärta och skador - ÅTERBESÖK (Mariefred)",
            priceSek: 450,
          },
        },
        ifk: {
          priceSek: 590,
          name: SMARTA_ATERBESOK_PARTNER_NAME,
          sharedAcrossPartners: true,
          priceByLocation: { mariefred: 450 },
          nameByLocation: { mariefred: SMARTA_ATERBESOK_PARTNER_MF_NAME },
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
        name: "Hälkoppsinlägg Vuxen - NYBESÖK (Danderyd)",
        label: "Nybesök - VUXEN (fyllda 18 år eller äldre)",
        durationMin: 40,
        priceSek: 1495,
        byLocation: {
          mariefred: {
            name: "Hälkoppsinlägg Vuxen - NYBESÖK (Mariefred)",
            priceSek: 1495,
          },
        },
        ifk: {
          priceSek: 1270,
          name: "Hälkoppsinlägg Vuxen - NYBESÖK (Partner Danderyd)",
          sharedAcrossPartners: true,
          nameByLocation: {
            mariefred: "Hälkoppsinlägg Vuxen - NYBESÖK (Partner Mariefred)",
          },
        },
        description:
          "För dig som ska göra hälkoppsinlägg för första gången. Besöket omfattar undersökning och tillverkning av personligt utformade hälkoppsinlägg. Inlägget formas efter din häl för att ge stöd, minska belastningen på hälen, dämpa smärta och göra det lättare att gå, springa och vara aktiv.",
      },
      {
        id: "halkopp-vuxen-aterbesok",
        name: "Hälkoppsinlägg Vuxen - ÅTERBESÖK (Danderyd)",
        label: "Återbesök - VUXEN (fyllda 18 år eller äldre)",
        durationMin: 30,
        priceSek: 1295,
        byLocation: {
          mariefred: {
            name: "Hälkoppsinlägg Vuxen - ÅTERBESÖK (Mariefred)",
            priceSek: 1295,
          },
        },
        ifk: {
          priceSek: 1100,
          name: "Hälkoppsinlägg Vuxen - ÅTERBESÖK (Partner Danderyd)",
          sharedAcrossPartners: true,
          nameByLocation: {
            mariefred: "Hälkoppsinlägg Vuxen - ÅTERBESÖK (Partner Mariefred)",
          },
        },
        description:
          "Tillverkning av fler personligt utformade hälkoppsinlägg. Bokas av dig som tidigare genomfört ett nybesök.",
      },
      {
        id: "halkopp-barn-nybesok",
        name: "Hälkoppsinlägg Barn - NYBESÖK (Danderyd)",
        label: "Nybesök - BARN (ej fyllda 18 år)",
        durationMin: 40,
        priceSek: 1295,
        byLocation: {
          mariefred: {
            name: "Hälkoppsinlägg Barn - NYBESÖK (Mariefred)",
            priceSek: 1295,
          },
        },
        ifk: {
          priceSek: 1100,
          name: "Hälkoppsinlägg Barn - NYBESÖK (Partner Danderyd)",
          sharedAcrossPartners: true,
          nameByLocation: {
            mariefred: "Hälkoppsinlägg Barn - NYBESÖK (Partner Mariefred)",
          },
        },
        description:
          "För dig som ska göra hälkoppsinlägg för första gången. Besöket omfattar undersökning och tillverkning av personligt utformade hälkoppsinlägg. Inlägget formas efter din häl för att ge stöd, minska belastningen på hälen, dämpa smärta och göra det lättare att gå, springa och vara aktiv.",
      },
      {
        id: "halkopp-barn-aterbesok",
        name: "Hälkoppsinlägg Barn - ÅTERBESÖK (Danderyd)",
        label: "Återbesök - BARN (ej fyllda 18 år)",
        durationMin: 30,
        priceSek: 1095,
        byLocation: {
          mariefred: {
            name: "Hälkoppsinlägg Barn - ÅTERBESÖK (Mariefred)",
            priceSek: 1095,
          },
        },
        ifk: {
          priceSek: 930,
          name: "Hälkoppsinlägg Barn - ÅTERBESÖK (Partner Danderyd)",
          sharedAcrossPartners: true,
          nameByLocation: {
            mariefred: "Hälkoppsinlägg Barn - ÅTERBESÖK (Partner Mariefred)",
          },
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
        name: "Personlig Träning (Danderyd)",
        label: "PT-pass",
        durationMin: 60,
        priceSek: 990,
        byLocation: {
          mariefred: {
            name: "Personlig Träning (Mariefred)",
            priceSek: 990,
          },
        },
        ifk: {
          priceSek: 840,
          name: "Personlig Träning (Partner Danderyd)",
          sharedAcrossPartners: true,
          nameByLocation: {
            mariefred: "Personlig Träning (Partner Mariefred)",
          },
        },
        description:
          "Individuellt träningspass à 60 minuter med personlig återkoppling och övningar att fortsätta med. Passet anpassas efter dig, till exempel fotbollsfys, löpteknik och snabbhet eller fys för din idrott eller motionsform.",
      },
      {
        id: "snabbhetspaketet",
        name: "Snabbhetspaketet (Danderyd)",
        label: "Snabbhetspaketet",
        durationMin: 75,
        priceSek: 1000,
        ordinaryPriceSek: 2685,
        byLocation: {
          mariefred: {
            name: "Snabbhetspaketet (Mariefred)",
            priceSek: 1000,
          },
        },
        ifk: {
          priceSek: 1000,
          name: "Snabbhetspaketet (Partner Danderyd)",
          sharedAcrossPartners: true,
          nameByLocation: {
            mariefred: "Snabbhetspaketet (Partner Mariefred)",
          },
        },
        description: `Du testar din snabbhet med laserportar på 10, 20 och 30 meter, får ett träningsprogram anpassat efter dig och kommer tillbaka efter cirka 8 veckor för ett uppföljande test. Första besöket tar ca 75 min och återbesöket ca 45 min.\n\n${SNABBHET_BOOKING_NOTICE}`,
        bookingNotice: SNABBHET_BOOKING_NOTICE,
      },
    ],
  },
];

const partnerServiceName = (
  service: BookingService,
  partner: PartnerConfig,
  locationId: LocationId | null,
): string => {
  if (!service.ifk?.name) return service.name;
  const locationName =
    locationId && service.ifk.nameByLocation
      ? service.ifk.nameByLocation[locationId]
      : undefined;
  if (locationName) return locationName;
  if (service.ifk.sharedAcrossPartners) return service.ifk.name;
  if (partner.id === "ifk-stocksund") return service.ifk.name;
  // Legacy fallback om en tjänst ännu inte har delat Partner-namn i Kaddio.
  return `${service.name}${partner.kaddioNameSuffix}`;
};

export const resolveServiceForVisitor = (
  service: BookingService,
  partner: PartnerConfig | null,
  locationId: LocationId | null = null,
): BookingService => {
  if (partner && service.ifk) {
    const locationPrice =
      locationId && service.ifk.priceByLocation
        ? service.ifk.priceByLocation[locationId]
        : undefined;
    const partnerPrice = locationPrice ?? service.ifk.priceSek;
    // Överstruket = ordinarie listpris (Danderyd) / kampanjens ordinaryPriceSek.
    const comparePrice = service.ordinaryPriceSek ?? service.priceSek;

    return {
      ...service,
      name: partnerServiceName(service, partner, locationId),
      priceSek: partnerPrice,
      ordinaryPriceSek:
        comparePrice !== partnerPrice ? comparePrice : undefined,
    };
  }

  if (locationId && service.byLocation?.[locationId]) {
    const loc = service.byLocation[locationId];
    // Mariefred m.fl.: visa lokalt pris med ordinarie (t.ex. 895/695) överstruket.
    const comparePrice =
      service.ordinaryPriceSek && service.ordinaryPriceSek !== loc.priceSek
        ? service.ordinaryPriceSek
        : loc.priceSek !== service.priceSek
          ? service.priceSek
          : undefined;

    return {
      ...service,
      name: loc.name,
      priceSek: loc.priceSek,
      ordinaryPriceSek: comparePrice,
    };
  }

  return service;
};

/**
 * Katalog för en ort. Partnerpriser kan skilja per ort (t.ex. Mariefred).
 */
export const bookingCategoriesForLocation = (
  locationId: LocationId | null,
  partner: PartnerConfig | null,
): BookingCategory[] =>
  BOOKING_CATEGORIES.map((category) => ({
    ...category,
    services: category.services?.map((service) =>
      resolveServiceForVisitor(service, partner, locationId),
    ),
    subgroups: category.subgroups?.map((subgroup) => ({
      ...subgroup,
      services: subgroup.services.map((service) =>
        resolveServiceForVisitor(service, partner, locationId),
      ),
    })),
    packages: category.packages?.map((service) =>
      resolveServiceForVisitor(service, partner, locationId),
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
