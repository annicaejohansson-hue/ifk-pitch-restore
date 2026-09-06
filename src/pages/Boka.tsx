import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useVisitor } from "@/context/VisitorContext";
import { IFK_STOCKSUND_KADDIO_URL } from "@/lib/booking";

const KADDIO_BOOKING_URL = "https://caseloidrottsmedicin.kaddio.com";
const KADDIO_IFRAME_BASE = `${KADDIO_BOOKING_URL}/iframe/booking`;
/** Customer-booking filter slug for IFK Stocksund (required for IFK free times). */
const KADDIO_IFK_CAL_FILTER = "ifk-stocksund";
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

const STEG1_DESCRIPTION =
  "Vi kartlägger din acceleration, snabbhet, hoppförmåga och/eller styrka utifrån dina målsättningar. Efter besöket analyseras resultaten och du får en personlig prestationsprofil med dina styrkor och viktigaste utvecklingsområden.";
const STEG2_DESCRIPTION =
  "Vi går igenom din prestationsprofil och omsätter resultaten till konkreta träningsprioriteringar. Du får ett individuellt träningsupplägg och praktisk vägledning i de viktigaste övningarna för din fortsatta träning.";
const STEG3_DESCRIPTION =
  "Efter träningsperioden upprepar vi relevanta tester och jämför med dina tidigare resultat. Du ser vad som har utvecklats och får nya rekommendationer inför nästa träningsperiod.";
const STEG1_KADDIO_NAME = "Steg 1: Test och analys av fysisk kapacitet";
const STEG1_KADDIO_NAME_IFK =
  "Steg 1: Test och analys av fysisk kapacitet (IFK Stocksund)";
const STEG2_KADDIO_NAME = "Steg 2: Personligt träningsupplägg";
const STEG2_KADDIO_NAME_IFK =
  "Steg 2: Personligt träningsupplägg (IFK Stocksund)";
const STEG3_KADDIO_NAME = "Steg 3: Uppföljning för att mäta din utveckling";
const STEG3_KADDIO_NAME_IFK =
  "Steg 3: Uppföljning för att mäta din utveckling (IFK Stocksund)";
const SMARTA_NYBESOK_NAME =
  "Bedömning och behandling av smärta och skador - NYBESÖK";
const SMARTA_ATERBESOK_NAME =
  "Bedömning och behandling av smärta och skador - ÅTERBESÖK";
const STEG_FOLLOWUP_NOTICE = "OBS: Detta steg bokas efter att Steg 1 genomförts.";
const PAKET_1_3_NOTICE =
  "Du bokar endast tid för Steg 1. Tidsbokning för Steg 2 och 3 görs efter att Steg 1 genomförts.";
const PAKET_1_OCH_3_NOTICE =
  "Du bokar endast tid för Steg 1. Tidsbokning för Steg 3 görs efter att Steg 1 genomförts.";

/** IFK package prices derived from live IFK step prices (same relative discount as ordinary packages). */
const IFK_STEG1 = 1525;
const IFK_STEG2 = 1015;
const IFK_STEG3 = 1270;
const IFK_PAKET_1_3_ORD = IFK_STEG1 + IFK_STEG2 + IFK_STEG3; // 3810
const IFK_PAKET_1_3 = 3395;
const IFK_PAKET_1_OCH_3_ORD = IFK_STEG1 + IFK_STEG3; // 2795
const IFK_PAKET_1_OCH_3 = 2545;

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
    id: "prestationsutveckling",
    name: "Test och träning för ökad fysisk prestation",
    // Ordinary `name` must match live Kaddio booking type names exactly.
    // IFK uses separate Kaddio types (verified on /booking/ifk-stocksund).
    services: [
      {
        id: "prestationsprofil",
        name: STEG1_KADDIO_NAME,
        label: "Steg 1: Test och analys av fysisk kapacitet",
        durationMin: 90,
        priceSek: 1795,
        ifk: {
          priceSek: IFK_STEG1,
          name: STEG1_KADDIO_NAME_IFK,
        },
        description: STEG1_DESCRIPTION,
      },
      {
        id: "resultatgenomgang",
        name: STEG2_KADDIO_NAME,
        label: "Steg 2: Personligt träningsupplägg",
        durationMin: 45,
        priceSek: 1195,
        ifk: {
          priceSek: IFK_STEG2,
          name: STEG2_KADDIO_NAME_IFK,
        },
        description: `${STEG2_DESCRIPTION}\n\n${STEG_FOLLOWUP_NOTICE}`,
        bookingNotice: STEG_FOLLOWUP_NOTICE,
      },
      {
        id: "prestationsuppfoljning",
        name: STEG3_KADDIO_NAME,
        label: "Steg 3: Uppföljning för att mäta din utveckling",
        durationMin: 75,
        priceSek: 1495,
        ifk: {
          priceSek: IFK_STEG3,
          name: STEG3_KADDIO_NAME_IFK,
        },
        description: `${STEG3_DESCRIPTION}\n\n${STEG_FOLLOWUP_NOTICE}`,
        bookingNotice: STEG_FOLLOWUP_NOTICE,
      },
    ],
    packages: [
      {
        id: "paket-steg-1-3",
        name: STEG1_KADDIO_NAME,
        label: "Paket: Steg 1-3",
        priceSek: 3995,
        ordinaryPriceSek: 4485,
        ifk: {
          priceSek: IFK_PAKET_1_3,
          ordinaryPriceSek: IFK_PAKET_1_3_ORD,
          name: STEG1_KADDIO_NAME_IFK,
        },
        variant: "package",
        bookingNotice: PAKET_1_3_NOTICE,
        description:
          `Steg 1 – Test och analys av fysisk kapacitet\n${STEG1_DESCRIPTION}\n\nSteg 2 – Personligt träningsupplägg\n${STEG2_DESCRIPTION}\n\nSteg 3 – Uppföljning för att mäta din utveckling\n${STEG3_DESCRIPTION}\n\n${PAKET_1_3_NOTICE}`,
      },
      {
        id: "paket-steg-1-3-utan-2",
        name: STEG1_KADDIO_NAME,
        label: "Paket: Steg 1 och 3",
        priceSek: 2995,
        ordinaryPriceSek: 3290,
        ifk: {
          priceSek: IFK_PAKET_1_OCH_3,
          ordinaryPriceSek: IFK_PAKET_1_OCH_3_ORD,
          name: STEG1_KADDIO_NAME_IFK,
        },
        variant: "package",
        bookingNotice: PAKET_1_OCH_3_NOTICE,
        description:
          `Steg 1 – Test och analys av fysisk kapacitet\n${STEG1_DESCRIPTION}\n\nSteg 3 – Uppföljning för att mäta din utveckling\n${STEG3_DESCRIPTION}\n\n${PAKET_1_OCH_3_NOTICE}`,
      },
    ],
  },
];

const resolveServiceForVisitor = (
  service: BookingService,
  isIfk: boolean,
): BookingService => {
  if (!isIfk || !service.ifk) return service;
  return {
    ...service,
    name: service.ifk.name,
    priceSek: service.ifk.priceSek,
    // Show the ordinary Caselo price beside the IFK partner price
    ordinaryPriceSek: service.priceSek,
  };
};

const allBookingEntries = (isIfk: boolean) =>
  BOOKING_CATEGORIES.flatMap((category) => {
    const grouped = category.subgroups
      ? category.subgroups.flatMap((subgroup) =>
          subgroup.services.map((service) => ({
            categoryName: category.name,
            subgroupName: subgroup.name,
            service: resolveServiceForVisitor(service, isIfk),
          })),
        )
      : (category.services ?? []).map((service) => ({
          categoryName: category.name,
          subgroupName: undefined as string | undefined,
          service: resolveServiceForVisitor(service, isIfk),
        }));

    const packages = (category.packages ?? []).map((service) => ({
      categoryName: category.name,
      subgroupName: undefined as string | undefined,
      service: resolveServiceForVisitor(service, isIfk),
    }));

    return [...grouped, ...packages];
  });

const categoriesForVisitor = (isIfk: boolean): BookingCategory[] =>
  BOOKING_CATEGORIES.map((category) => ({
    ...category,
    services: category.services?.map((service) =>
      resolveServiceForVisitor(service, isIfk),
    ),
    subgroups: category.subgroups?.map((subgroup) => ({
      ...subgroup,
      services: subgroup.services.map((service) =>
        resolveServiceForVisitor(service, isIfk),
      ),
    })),
    packages: category.packages?.map((service) =>
      resolveServiceForVisitor(service, isIfk),
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

/** IFK types use showOnlyInCustomerBooking — slots only appear under /cal/ifk-stocksund/... */
const iframeUrlForService = (serviceName: string, isIfk: boolean) => {
  const slug = slugifyForKaddio(serviceName);
  return isIfk
    ? `${KADDIO_IFRAME_BASE}/cal/${KADDIO_IFK_CAL_FILTER}/${slug}`
    : `${KADDIO_IFRAME_BASE}/cal/${slug}`;
};

const externalUrlForService = (serviceName: string, isIfk: boolean) => {
  const slug = slugifyForKaddio(serviceName);
  return isIfk
    ? `${KADDIO_BOOKING_URL}/booking/cal/${KADDIO_IFK_CAL_FILTER}/${slug}`
    : `${KADDIO_BOOKING_URL}/booking/cal/${slug}`;
};

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
  const [openCategoryId, setOpenCategoryId] = useState<string | undefined>();
  const [iframeEpoch, setIframeEpoch] = useState(0);
  const [searchParams] = useSearchParams();
  const { isIfkStocksund, setVisitorType } = useVisitor();
  const appliedTjanstRef = useRef<string | null>(null);
  const ignoreIframeLoadRef = useRef(false);
  const iframePhaseRef = useRef<"pick" | "form">("pick");
  const iframeReadyAtRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (searchParams.get("partner") === "ifk-stocksund") {
      setVisitorType("ifk-stocksund");
    }
  }, [searchParams, setVisitorType]);

  useEffect(() => {
    const tjanst = searchParams.get("tjanst");
    if (!tjanst || appliedTjanstRef.current === tjanst) return;
    const exists = allBookingEntries(isIfkStocksund).some(
      ({ service }) => service.id === tjanst,
    );
    if (!exists) return;
    appliedTjanstRef.current = tjanst;
    setSelectedServiceId(tjanst);
  }, [searchParams, isIfkStocksund]);

  const categories = useMemo(
    () => categoriesForVisitor(isIfkStocksund),
    [isIfkStocksund],
  );

  const selected = allBookingEntries(isIfkStocksund).find(
    ({ service }) => service.id === selectedServiceId,
  );

  const selectedServiceName = selected?.service.name;
  const selectedDisplayName = selected
    ? selected.subgroupName
      ? `${selected.categoryName} (${selected.subgroupName}) – ${selected.service.label}`
      : selected.categoryName === "Test och träning för ökad fysisk prestation"
        ? selected.service.label
        : `${selected.categoryName} – ${selected.service.label}`
    : undefined;

  const iframeSrc = selectedServiceName
    ? iframeUrlForService(selectedServiceName, isIfkStocksund)
    : undefined;
  const fallbackHref = selectedServiceName
    ? externalUrlForService(selectedServiceName, isIfkStocksund)
    : isIfkStocksund
      ? IFK_STOCKSUND_KADDIO_URL
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
          {isIfkStocksund
            ? "Boka tid (IFK Stocksund) – Caselo Idrottsmedicin"
            : "Boka tid – Caselo Idrottsmedicin"}
        </title>
        <meta
          name="description"
          content="Boka tid hos Caselo Idrottsmedicin. Välj tjänst och en tid som passar dig."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/10 to-background pt-5 pb-3 md:pt-6 md:pb-3">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-3 md:text-5xl">
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
        <div className="container mx-auto max-w-7xl px-4">
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
                          className={`flex min-h-12 w-full items-center px-2.5 py-2.5 text-left text-[13px] font-semibold leading-snug tracking-tight text-balance break-words sm:min-h-[3.5rem] sm:px-3 sm:text-sm lg:text-[13px] xl:text-[15px] ${tone.heading}`}
                        >
                          {category.name}
                        </span>
                      ) : (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`category-panel-${category.id}`}
                          onClick={() => toggleCategory(category.id)}
                          className={`flex min-h-12 w-full items-center justify-between gap-2 px-2.5 py-2.5 text-left text-[13px] font-semibold leading-snug tracking-tight text-balance break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-[3.5rem] sm:px-3 sm:text-sm lg:text-[13px] xl:text-[15px] ${tone.heading}`}
                        >
                          <span className="min-w-0 flex-1">{category.name}</span>
                          <ChevronDown
                            className={[
                              "h-5 w-5 shrink-0 transition-transform duration-200",
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
