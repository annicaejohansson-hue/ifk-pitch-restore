import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useVisitor } from "@/context/VisitorContext";
import { TRAINING_BOOKING_CATEGORY_ID } from "@/lib/booking";
import { getPartner, isPartnerId, type PartnerConfig } from "@/lib/partners";

const KADDIO_BOOKING_URL = "https://caseloidrottsmedicin.kaddio.com";
const KADDIO_IFRAME_BASE = `${KADDIO_BOOKING_URL}/iframe/booking`;
/** Ignore Kaddio's immediate post-mount redirects (e.g. ?step=pickTime). */
const KADDIO_IFRAME_REDIRECT_GRACE_MS = 2000;

type BookingService = {
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
  /** IFK Stocksund overrides — same card, partner price / Kaddio type */
  ifk?: {
    priceSek: number;
    ordinaryPriceSek?: number;
    name: string;
  };
};

type BookingSubgroup = {
  id: string;
  name: string;
  services: BookingService[];
};

type BookingCategory = {
  id: string;
  name: string;
  /** Flat list when the column has no pedagogical subgroups */
  services?: BookingService[];
  /** Grouped services (e.g. Vuxen / Barn under Hälkoppsinlägg) */
  subgroups?: BookingSubgroup[];
  /** Package offers shown below the regular services */
  packages?: BookingService[];
};

const SMARTA_NYBESOK_NAME =
  "Bedömning och behandling av smärta och skador - NYBESÖK";
const SMARTA_ATERBESOK_NAME =
  "Bedömning och behandling av smärta och skador - ÅTERBESÖK";
const SNABBHET_BOOKING_NOTICE =
  "Du bokar tid för första besöket. Återtestet görs cirka 8 veckor senare.";

const BOOKING_CATEGORIES: BookingCategory[] = [
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
    // `name` must match live Kaddio booking type names exactly.
    // These types have no partner variants: partner visitors get the
    // ordinary calendar and price (see calendarPartner below).
    services: [
      {
        id: "pt-pass",
        name: "Personlig Träning (PT-pass)",
        label: "PT-pass",
        durationMin: 60,
        priceSek: 990,
        description:
          "Individuellt träningspass à 60 minuter med personlig återkoppling och övningar att fortsätta med. Passet anpassas efter dig, till exempel fotbollsfys, löpteknik och snabbhet eller fys för din idrott eller motionsform.",
      },
      {
        id: "snabbhetspaketet",
        name: "Snabbhetspaketet",
        label: "Snabbhetspaketet",
        durationMin: 75,
        priceSek: 1000,
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
  if (partner.id === "ifk-stocksund" && service.ifk?.name) {
    return service.ifk.name;
  }
  return `${service.name}${partner.kaddioNameSuffix}`;
};

const resolveServiceForVisitor = (
  service: BookingService,
  partner: PartnerConfig | null,
): BookingService => {
  if (!partner || !service.ifk) return service;
  return {
    ...service,
    name: partnerServiceName(service, partner),
    priceSek: service.ifk.priceSek,
    // Show the ordinary Caselo price beside the partner price
    ordinaryPriceSek: service.priceSek,
  };
};

const allBookingEntries = (partner: PartnerConfig | null) =>
  BOOKING_CATEGORIES.flatMap((category) => {
    const grouped = category.subgroups
      ? category.subgroups.flatMap((subgroup) =>
          subgroup.services.map((service) => ({
            categoryName: category.name,
            subgroupName: subgroup.name,
            service: resolveServiceForVisitor(service, partner),
          })),
        )
      : (category.services ?? []).map((service) => ({
          categoryName: category.name,
          subgroupName: undefined as string | undefined,
          service: resolveServiceForVisitor(service, partner),
        }));

    const packages = (category.packages ?? []).map((service) => ({
      categoryName: category.name,
      subgroupName: undefined as string | undefined,
      service: resolveServiceForVisitor(service, partner),
    }));

    return [...grouped, ...packages];
  });

const categoriesForVisitor = (partner: PartnerConfig | null): BookingCategory[] =>
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

const StepLabel = ({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) => (
  <div className="flex items-start gap-2 sm:gap-2.5">
    <span
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-[11px] font-bold text-primary-foreground sm:h-7 sm:w-7 sm:text-xs"
      aria-hidden="true"
    >
      {step}
    </span>
    <p className="min-w-0 flex-1 break-words pt-0.5 text-sm leading-snug text-muted-foreground">
      {children}
    </p>
  </div>
);

const SECTION_TONES = [
  {
    // Mörkblått
    frame: "border-[hsl(210_35%_88%)] bg-[hsl(210_30%_96%)]",
    heading: "bg-[hsl(210_60%_15%)] text-white",
  },
  {
    // Mellanblått
    frame: "border-[hsl(210_35%_88%)] bg-[hsl(210_30%_96%)]",
    heading: "bg-[hsl(210_48%_34%)] text-white",
  },
  {
    // Ljusblått
    frame: "border-[hsl(210_35%_88%)] bg-[hsl(210_30%_96%)]",
    heading: "bg-[hsl(210_42%_52%)] text-white",
  },
] as const;

const formatPrice = (priceSek: number) =>
  new Intl.NumberFormat("sv-SE").format(priceSek);


/** Match Kaddio's slugify so /booking/cal/:path locks the selected service */
const slugifyForKaddio = (value: string) => {
  let slug = value.replace(/^\s+|\s+$/g, "").toLowerCase();
  const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaaeeeeiiiioooouuuunc------";
  for (let i = 0; i < from.length; i++) {
    slug = slug.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  return slug
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/** Partner types use showOnlyInCustomerBooking — slots only appear under /cal/{filter}/... */
const iframeUrlForService = (
  serviceName: string,
  partner: PartnerConfig | null,
) => {
  const slug = slugifyForKaddio(serviceName);
  return partner
    ? `${KADDIO_IFRAME_BASE}/cal/${partner.kaddioCalFilter}/${slug}`
    : `${KADDIO_IFRAME_BASE}/cal/${slug}`;
};

const externalUrlForService = (
  serviceName: string,
  partner: PartnerConfig | null,
) => {
  const slug = slugifyForKaddio(serviceName);
  return partner
    ? `${KADDIO_BOOKING_URL}/booking/cal/${partner.kaddioCalFilter}/${slug}`
    : `${KADDIO_BOOKING_URL}/booking/cal/${slug}`;
};

/** `?kategori=` öppnar en kolumn direkt, utan att någon tjänst är vald. */
const categoryIdFromParam = (value: string | null): string | undefined =>
  BOOKING_CATEGORIES.some((category) => category.id === value)
    ? (value ?? undefined)
    : undefined;

const servicesInCategory = (category: BookingCategory) => [
  ...(category.subgroups
    ? category.subgroups.flatMap((subgroup) => subgroup.services)
    : (category.services ?? [])),
  ...(category.packages ?? []),
];


const ServiceOption = ({
  service,
  isSelected,
  onSelect,
}: {
  service: BookingService;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const hasDescription = Boolean(service.description);

  return (
    <div
      className={[
        "flex h-full min-h-[6.25rem] flex-col rounded-lg border p-2.5 transition-colors sm:min-h-[6.5rem] sm:p-3",
        service.variant === "package"
          ? isSelected
            ? "border-primary/50 bg-[hsl(210_42%_88%)]"
            : "border-[hsl(210_42%_70%)] bg-[hsl(210_42%_90%)] hover:border-primary/40 hover:bg-[hsl(210_42%_88%)]"
          : isSelected
            ? "border-primary/40 bg-primary/[0.04]"
            : "border-border/80 bg-white hover:border-primary/25 hover:bg-white",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
      className="flex w-full flex-col gap-0.5 rounded-md py-0.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span
          className={[
            "line-clamp-3 min-h-[2.5rem] text-[13px] font-semibold leading-snug tracking-tight sm:line-clamp-2 sm:text-sm",
            isSelected ? "text-primary" : "text-foreground",
          ].join(" ")}
        >
          {service.label}
        </span>
        <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-xs tabular-nums">
          {service.durationMin ? (
            <span className="text-muted-foreground">{service.durationMin} min ·</span>
          ) : null}
          <span className="font-medium text-foreground">
            {formatPrice(service.priceSek)} kr
          </span>
          {service.ordinaryPriceSek ? (
            <span className="text-[11px] text-muted-foreground/80">
              <span className="line-through decoration-muted-foreground/50">
                {formatPrice(service.ordinaryPriceSek)} kr
              </span>
            </span>
          ) : null}
        </span>
      </button>

      {hasDescription ? (
        <Collapsible
          open={infoOpen}
          onOpenChange={setInfoOpen}
          className={[
            "mt-2 border-t pt-1.5",
            service.variant === "package" ? "border-[hsl(210_35%_68%)]" : "border-border/60",
          ].join(" ")}
        >
          <CollapsibleTrigger
            className="inline-flex min-h-9 items-center gap-1 py-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm sm:min-h-0 sm:py-0.5 sm:text-sm"
            aria-label={infoOpen ? "Dölj information" : "Visa mer information"}
          >
            {infoOpen ? "Dölj info" : "Mer info"}
            <ChevronDown
              className={[
                "h-3 w-3 transition-transform duration-200",
                infoOpen ? "rotate-180" : "",
              ].join(" ")}
              aria-hidden="true"
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1.5">
            <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground break-words sm:text-sm">
              {service.description}
            </p>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  );
};

const ServiceList = ({
  services,
  selectedServiceId,
  onSelect,
  columns = 1,
}: {
  services: BookingService[];
  selectedServiceId: string | undefined;
  onSelect: (serviceId: string) => void;
  columns?: 1 | 2;
}) => (
  <div
    className={
      columns === 2
        ? "grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:gap-2.5"
        : "grid grid-cols-1 items-stretch gap-2"
    }
  >
    {services.map((service) => (
      <ServiceOption
        key={service.id}
        service={service}
        isSelected={selectedServiceId === service.id}
        onSelect={() => onSelect(service.id)}
      />
    ))}
  </div>
);

const Boka = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [iframeEpoch, setIframeEpoch] = useState(0);
  const [searchParams] = useSearchParams();
  const kategoriParam = searchParams.get("kategori");
  const [openCategoryId, setOpenCategoryId] = useState<string | undefined>(() =>
    categoryIdFromParam(kategoriParam),
  );
  const appliedKategoriRef = useRef<string | null>(kategoriParam);
  const { partner, setVisitorType } = useVisitor();
  const appliedTjanstRef = useRef<string | null>(null);
  const ignoreIframeLoadRef = useRef(false);
  const iframePhaseRef = useRef<"pick" | "form">("pick");
  const iframeReadyAtRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const partnerParam = searchParams.get("partner");
    if (isPartnerId(partnerParam)) {
      setVisitorType(partnerParam);
    }
  }, [searchParams, setVisitorType]);

  const activePartner = partner ?? getPartner(searchParams.get("partner"));

  useEffect(() => {
    const tjanst = searchParams.get("tjanst");
    if (!tjanst || appliedTjanstRef.current === tjanst) return;
    const exists = allBookingEntries(activePartner).some(
      ({ service }) => service.id === tjanst,
    );
    if (!exists) return;
    appliedTjanstRef.current = tjanst;
    setSelectedServiceId(tjanst);
  }, [searchParams, activePartner]);

  // Om adressen byter kategori medan sidan redan är öppen.
  useEffect(() => {
    if (appliedKategoriRef.current === kategoriParam) return;
    appliedKategoriRef.current = kategoriParam;
    const categoryId = categoryIdFromParam(kategoriParam);
    if (categoryId) setOpenCategoryId(categoryId);
  }, [kategoriParam]);

  const categories = useMemo(
    () => categoriesForVisitor(activePartner),
    [activePartner],
  );

  const selected = allBookingEntries(activePartner).find(
    ({ service }) => service.id === selectedServiceId,
  );

  const selectedServiceName = selected?.service.name;
  const selectedDisplayName = selected
    ? selected.subgroupName
      ? `${selected.categoryName} (${selected.subgroupName}) – ${selected.service.label}`
      : `${selected.categoryName} – ${selected.service.label}`
    : undefined;

  // Tjänster utan partnervariant finns bara i den ordinarie kalendern; under
  // partnerns kalenderfilter visar Kaddio inga lediga tider för dem.
  const calendarPartner = selected?.service.ifk ? activePartner : null;

  const iframeSrc = selectedServiceName
    ? iframeUrlForService(selectedServiceName, calendarPartner)
    : undefined;
  const fallbackHref = selectedServiceName
    ? externalUrlForService(selectedServiceName, calendarPartner)
    : activePartner
      ? activePartner.kaddioBookingUrl
      : KADDIO_BOOKING_URL;

  // When the locked calendar URL changes, reset iframe navigation tracking.
  useEffect(() => {
    if (!iframeSrc) return;
    iframePhaseRef.current = "pick";
    ignoreIframeLoadRef.current = true;
    setIframeEpoch(0);
  }, [iframeSrc]);

  /**
   * Kaddio's "Avbryt" leaves /cal/{slug} and shows all services.
   * We can't read the cross-origin iframe URL, so we track loads:
   * pick → form (time chosen), form → remount locked calendar (cancel/leave form).
   */
  const handleIframeLoad = () => {
    if (!iframeSrc) return;

    if (ignoreIframeLoadRef.current) {
      ignoreIframeLoadRef.current = false;
      iframeReadyAtRef.current = Date.now();
      return;
    }

    if (iframePhaseRef.current === "pick") {
      if (Date.now() - iframeReadyAtRef.current < KADDIO_IFRAME_REDIRECT_GRACE_MS) {
        return;
      }
      iframePhaseRef.current = "form";
      return;
    }

    iframePhaseRef.current = "pick";
    ignoreIframeLoadRef.current = true;
    setIframeEpoch((n) => n + 1);
  };

  const selectedCategory = selected
    ? categories.find((category) =>
        servicesInCategory(category).some(
          (service) => service.id === selectedServiceId,
        ),
      )
    : undefined;

  const isCategoryExpanded = (categoryId: string) =>
    Boolean(selected) || openCategoryId === categoryId;

  const toggleCategory = (categoryId: string) => {
    if (selected) return;
    setOpenCategoryId((current) =>
      current === categoryId ? undefined : categoryId,
    );
  };

  const selectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    requestAnimationFrame(() => {
      document.getElementById("kaddio-bokning")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const clearSelectedService = () => {
    setSelectedServiceId(undefined);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <main className="overflow-x-hidden">
      <Helmet>
        <title>
          {activePartner
            ? `Boka tid (${activePartner.name}) – Caselo Idrottsmedicin`
            : "Boka tid – Caselo Idrottsmedicin"}
        </title>
        <meta
          name="description"
          content="Boka tid hos Caselo Idrottsmedicin. Välj tjänst och en tid som passar dig."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/10 to-background pt-5 pb-3 md:pt-6 md:pb-3">
        <div className="container mx-auto max-w-7xl px-8 md:px-4">
          <h1 className="mb-2 break-words text-4xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-3 md:text-5xl">
            Boka tid
          </h1>
          <p className="mb-3 text-base text-muted-foreground md:mb-4 md:text-lg">
            Välkommen!
          </p>
          <StepLabel step={1}>
            Börja med att välja vilken typ av besök du vill boka. Därefter visas
            tillgängliga tider längre ned på sidan.
          </StepLabel>
        </div>
      </section>

      <section className="pt-3 pb-6 md:pt-4 md:pb-8">
        <div className="container mx-auto max-w-7xl px-8 md:px-4">
          <div className="w-full min-w-0">
            <div className="mb-6 grid grid-cols-1 items-start gap-4 lg:mb-8 lg:grid-cols-3 lg:gap-4">
              {(selected && selectedCategory
                ? [selectedCategory]
                : categories
              ).map((category, index) => {
                const tone =
                  SECTION_TONES[
                    selectedCategory
                      ? categories.findIndex((c) => c.id === category.id)
                      : index
                  ] ?? SECTION_TONES[0];
                const services = selected
                  ? servicesInCategory(category).filter(
                      (service) => service.id === selectedServiceId,
                    )
                  : servicesInCategory(category);

                const expanded = isCategoryExpanded(category.id);

                return (
                  <section
                    key={category.id}
                    aria-labelledby={`category-${category.id}`}
                    className={`flex min-w-0 flex-col overflow-hidden rounded-lg border ${
                      selected ? "lg:col-span-1" : ""
                    } ${tone.frame}`}
                  >
                    <h2 id={`category-${category.id}`} className="m-0">
                      {selected ? (
                        <span
                          className={`flex min-h-12 w-full items-start px-2.5 py-2.5 text-left text-[13px] font-semibold leading-snug tracking-tight break-words whitespace-normal sm:min-h-[3.5rem] sm:items-center sm:px-3 sm:text-sm lg:text-[13px] xl:text-[15px] ${tone.heading}`}
                        >
                          {category.name}
                        </span>
                      ) : (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`category-panel-${category.id}`}
                          onClick={() => toggleCategory(category.id)}
                          className={`flex min-h-12 w-full items-start justify-between gap-2 px-2.5 py-2.5 text-left text-[13px] font-semibold leading-snug tracking-tight break-words whitespace-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-[3.5rem] sm:items-center sm:px-3 sm:text-sm lg:text-[13px] xl:text-[15px] ${tone.heading}`}
                        >
                          <span className="min-w-0 flex-1 whitespace-normal break-words">
                            {category.name}
                          </span>
                          <ChevronDown
                            className={[
                              "mt-0.5 h-5 w-5 shrink-0 transition-transform duration-200 sm:mt-0",
                              expanded ? "rotate-180" : "",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </h2>

                    <div
                      id={`category-panel-${category.id}`}
                      className={
                        expanded
                          ? "flex flex-col p-2 sm:p-2.5"
                          : "hidden"
                      }
                    >
                      <ServiceList
                        services={services}
                        selectedServiceId={selectedServiceId}
                        onSelect={selectService}
                        columns={1}
                      />
                    </div>
                  </section>
                );
              })}
            </div>

            {selectedServiceName ? (
              <div id="kaddio-bokning" className="min-w-0 scroll-mt-20">
                <div className="mb-4 space-y-3">
                  <StepLabel step={2}>
                    Välj en tid i kalendern för ditt besök.
                  </StepLabel>
                  {selected?.service.bookingNotice ? (
                    <p className="rounded-md border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm font-semibold leading-snug text-foreground sm:ml-9 md:text-base">
                      {selected.service.bookingNotice}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:pl-9">
                    <p className="min-w-0 text-sm leading-snug text-muted-foreground md:text-base break-words">
                      Vald tjänst:{" "}
                      <span className="font-medium text-foreground">
                        {selectedDisplayName}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={clearSelectedService}
                      className="self-start text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      Byt tjänst
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-full overflow-x-hidden">
                  <iframe
                    key={`${selectedServiceId}:${iframeSrc}:${iframeEpoch}`}
                    src={iframeSrc}
                    title={`Boka tid: ${selected.service.label}`}
                    onLoad={handleIframeLoad}
                    className="w-full max-w-full min-h-[640px] border-0 sm:min-h-[800px] md:min-h-[1000px]"
                    style={{ overflowY: "auto", overflowX: "hidden" }}
                    loading="eager"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <p className="mt-6 text-sm leading-relaxed md:text-base">
                  <a
                    href={fallbackHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline underline-offset-4 hover:text-primary break-words"
                  >
                    Problem med bokningen? Öppna bokningssidan i ett nytt fönster.
                  </a>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Boka;
