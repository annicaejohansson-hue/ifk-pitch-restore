import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, MapPin } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useVisitor } from "@/context/VisitorContext";
import {
  BOOKING_LOCATION_PARAM,
  TRAINING_BOOKING_CATEGORY_ID,
} from "@/lib/booking";
import {
  getPartner,
  isPartnerId,
  partnerKaddioBookingUrl,
  partnerKaddioCalFilter,
  type PartnerConfig,
} from "@/lib/partners";
import {
  ptPrepaidFromRefAndQuantity,
  type PtPrepaidDisplay,
} from "@/data/erbjudanden-prepaid";
import { PT_SESSION_LIST_PRICE_SEK } from "@/data/erbjudanden";
import { verifyPrepaidBookingToken } from "@/lib/erbjudanden/api";
import {
  CASELO_EMAIL,
  CASELO_PHONE,
  CASELO_PHONE_DIGITS,
} from "@/data/caseloCompany";
import {
  allBookingEntries,
  bookingCategoriesForLocation,
  categoryIdFromParam,
  servicesInCategory,
  type BookingCategory,
  type BookingService,
} from "@/data/bookingCatalog";
import {
  getLocation,
  isLocationBookable,
  isLocationId,
  LOCATION_IDS,
  LOCATIONS,
  locationKaddioBookingUrl,
  type LocationConfig,
  type LocationId,
} from "@/data/locations";

const KADDIO_BOOKING_URL = "https://caseloidrottsmedicin.kaddio.com";
const KADDIO_IFRAME_BASE = `${KADDIO_BOOKING_URL}/iframe/booking`;
/** Ignore Kaddio's immediate post-mount redirects (e.g. ?step=pickTime). */
const KADDIO_IFRAME_REDIRECT_GRACE_MS = 2000;

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
    frame: "border-[hsl(210_35%_88%)] bg-[hsl(210_30%_96%)]",
    heading: "bg-[hsl(210_60%_15%)] text-white",
  },
  {
    frame: "border-[hsl(210_35%_88%)] bg-[hsl(210_30%_96%)]",
    heading: "bg-[hsl(210_48%_34%)] text-white",
  },
  {
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

/**
 * Build Kaddio calendar URL filter segment under /cal/{filter}/…
 * Partner + ort: partner-danderyd / partner-mariefred.
 * Utan partner: danderyd / mariefred.
 */
const calendarFilterFor = (
  location: LocationConfig | null,
  partner: PartnerConfig | null,
) => {
  const partnerFilter = partnerKaddioCalFilter(partner, location?.id ?? null);
  if (partnerFilter) return partnerFilter;
  if (location?.kaddioCalFilter) return location.kaddioCalFilter;
  return "";
};

const iframeUrlForService = (
  serviceName: string,
  location: LocationConfig | null,
  partner: PartnerConfig | null,
) => {
  const slug = slugifyForKaddio(serviceName);
  const filter = calendarFilterFor(location, partner);
  return filter
    ? `${KADDIO_IFRAME_BASE}/cal/${filter}/${slug}`
    : `${KADDIO_IFRAME_BASE}/cal/${slug}`;
};

const externalUrlForService = (
  serviceName: string,
  location: LocationConfig | null,
  partner: PartnerConfig | null,
) => {
  const slug = slugifyForKaddio(serviceName);
  const filter = calendarFilterFor(location, partner);
  return filter
    ? `${KADDIO_BOOKING_URL}/booking/cal/${filter}/${slug}`
    : `${KADDIO_BOOKING_URL}/booking/cal/${slug}`;
};

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
            <span className="text-muted-foreground">
              {service.durationMin} min ·
            </span>
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
            service.variant === "package"
              ? "border-[hsl(210_35%_68%)]"
              : "border-border/60",
          ].join(" ")}
        >
          <CollapsibleTrigger
            className="inline-flex min-h-9 items-center gap-1 rounded-sm py-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-0 sm:py-0.5 sm:text-sm"
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
            <p className="whitespace-pre-line break-words text-xs leading-relaxed text-muted-foreground sm:text-sm">
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
}: {
  services: BookingService[];
  selectedServiceId: string | undefined;
  onSelect: (serviceId: string) => void;
}) => (
  <div className="grid grid-cols-1 items-stretch gap-2">
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

const LocationPicker = ({
  highlightedId,
  onChoose,
  partner,
}: {
  highlightedId: LocationId | null;
  onChoose: (id: LocationId) => void;
  partner: PartnerConfig | null;
}) => (
  <div className="w-full max-w-2xl" role="group" aria-label="Välj mottagning">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-stretch sm:gap-4">
      {LOCATION_IDS.map((id) => {
        const location = LOCATIONS[id];
        const bookable = isLocationBookable(id, partner);
        const selected = bookable && highlightedId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (!bookable) return;
              onChoose(id);
            }}
            disabled={!bookable}
            aria-pressed={bookable ? selected : undefined}
            aria-disabled={!bookable}
            className={[
              "flex w-full min-h-[5.75rem] flex-col items-start justify-center rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-[8.5rem] sm:px-5 sm:py-5",
              !bookable
                ? "cursor-not-allowed border-border/40 bg-muted/30 text-muted-foreground"
                : selected
                  ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
                  : "border-border/70 bg-card hover:border-primary/35 hover:bg-primary/[0.03]",
            ].join(" ")}
          >
            <span
              className={[
                "text-xl font-bold tracking-tight sm:text-2xl",
                bookable ? "text-foreground" : "text-muted-foreground",
              ].join(" ")}
            >
              {location.name}
            </span>
            {bookable ? (
              <span className="mt-1.5 text-sm leading-snug text-muted-foreground sm:mt-2 sm:text-base">
                {location.scheduleCard}
              </span>
            ) : (
              <span className="mt-1.5 max-w-[16rem] text-pretty text-sm leading-snug text-muted-foreground sm:mt-2 sm:max-w-none sm:text-base">
                Bokning i {location.name} öppnar snart
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const Boka = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<
    string | undefined
  >();
  const [iframeEpoch, setIframeEpoch] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const kategoriParam = searchParams.get("kategori");
  const prepaidToken = searchParams.get("forbetalt");
  const prepaidRef = searchParams.get("ref");
  const prepaidAntal = searchParams.get("antal");
  const ortParam = searchParams.get(BOOKING_LOCATION_PARAM);
  const partnerFromParams = getPartner(searchParams.get("partner"));
  const suggestedLocationId =
    isLocationId(ortParam) && isLocationBookable(ortParam, partnerFromParams)
      ? ortParam
      : null;

  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [pendingLocationId, setPendingLocationId] = useState<LocationId | null>(
    () =>
      isLocationId(ortParam) && isLocationBookable(ortParam, partnerFromParams)
        ? ortParam
        : null,
  );

  const [ptPrepaid, setPtPrepaid] = useState<PtPrepaidDisplay | null>(null);
  const [openCategoryId, setOpenCategoryId] = useState<string | undefined>(() =>
    categoryIdFromParam(kategoriParam),
  );
  const appliedKategoriRef = useRef<string | null>(kategoriParam);
  const { partner, setVisitorType } = useVisitor();
  const appliedTjanstRef = useRef<string | null>(null);
  const ignoreIframeLoadRef = useRef(false);
  const iframePhaseRef = useRef<"pick" | "form">("pick");
  const iframeReadyAtRef = useRef(0);
  const prevOrtRef = useRef<string | null>(ortParam);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const partnerParam = searchParams.get("partner");
    if (isPartnerId(partnerParam)) {
      setVisitorType(partnerParam);
    }
  }, [searchParams, setVisitorType]);

  const activePartner = partner ?? partnerFromParams;
  const activeLocationId: LocationId | null = locationConfirmed
    ? pendingLocationId
    : null;
  const activeLocation = getLocation(activeLocationId);

  // Ort från länk: markera men kräv bekräftelse. Generell bokning: ingen förval.
  useEffect(() => {
    if (prevOrtRef.current === ortParam) return;
    prevOrtRef.current = ortParam;
    if (isLocationId(ortParam) && isLocationBookable(ortParam, activePartner)) {
      setPendingLocationId(ortParam);
      setLocationConfirmed(false);
      setSelectedServiceId(undefined);
      setPtPrepaid(null);
      appliedTjanstRef.current = null;
    } else {
      setPendingLocationId(null);
      setLocationConfirmed(false);
    }
  }, [ortParam, activePartner]);

  const writeOrtParam = (id: LocationId | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id) next.set(BOOKING_LOCATION_PARAM, id);
        else next.delete(BOOKING_LOCATION_PARAM);
        return next;
      },
      { replace: true },
    );
  };

  const resetServiceAndTime = () => {
    setSelectedServiceId(undefined);
    setPtPrepaid(null);
    appliedTjanstRef.current = null;
    setIframeEpoch((n) => n + 1);
  };

  const confirmLocation = (id: LocationId) => {
    if (!isLocationBookable(id, activePartner)) return;
    const changing =
      locationConfirmed && pendingLocationId && pendingLocationId !== id;
    setPendingLocationId(id);
    setLocationConfirmed(true);
    // Avoid the ort-param effect undoing confirm when we write ?ort= ourselves.
    prevOrtRef.current = id;
    writeOrtParam(id);
    if (changing || !locationConfirmed) {
      resetServiceAndTime();
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const chooseLocationCard = (id: LocationId) => {
    confirmLocation(id);
  };

  const startChangeLocation = () => {
    setLocationConfirmed(false);
    resetServiceAndTime();
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (!locationConfirmed) return;
    const tjanst =
      searchParams.get("tjanst") ||
      (prepaidToken || prepaidRef ? "pt-pass" : null);
    if (!tjanst || appliedTjanstRef.current === tjanst) return;
    const exists = allBookingEntries(activeLocationId, activePartner).some(
      ({ service }) => service.id === tjanst,
    );
    if (!exists) return;
    appliedTjanstRef.current = tjanst;
    setSelectedServiceId(tjanst);
    if (tjanst === "pt-pass") {
      setOpenCategoryId(TRAINING_BOOKING_CATEGORY_ID);
    }
  }, [
    searchParams,
    activePartner,
    activeLocationId,
    locationConfirmed,
    prepaidToken,
    prepaidRef,
  ]);

  useEffect(() => {
    if (appliedKategoriRef.current === kategoriParam) return;
    appliedKategoriRef.current = kategoriParam;
    const categoryId = categoryIdFromParam(kategoriParam);
    if (categoryId) setOpenCategoryId(categoryId);
  }, [kategoriParam]);

  // Förbetalda PT-länkar från mejl (utan synlig formulärpanel).
  useEffect(() => {
    let cancelled = false;
    const token = prepaidToken?.trim();
    if (token) {
      void verifyPrepaidBookingToken(token)
        .then((result) => {
          if (cancelled) return;
          setPtPrepaid({
            orderRef: result.orderRef,
            quantity: result.quantity,
            unitPriceSek: result.unitPriceSek,
            listUnitPriceSek: result.listUnitPriceSek,
            verified: true,
          });
        })
        .catch(() => {
          if (!cancelled) setPtPrepaid(null);
        });
      return () => {
        cancelled = true;
      };
    }

    const fromParams = ptPrepaidFromRefAndQuantity(
      prepaidRef ?? "",
      prepaidAntal,
    );
    setPtPrepaid(fromParams);
    return () => {
      cancelled = true;
    };
  }, [prepaidToken, prepaidRef, prepaidAntal]);

  const categories = useMemo(
    () => bookingCategoriesForLocation(activeLocationId, activePartner),
    [activeLocationId, activePartner],
  );

  const selected = allBookingEntries(activeLocationId, activePartner).find(
    ({ service }) => service.id === selectedServiceId,
  );

  const selectedService =
    selected?.service.id === "pt-pass" && ptPrepaid
      ? {
          ...selected.service,
          priceSek: ptPrepaid.unitPriceSek,
          ordinaryPriceSek:
            ptPrepaid.listUnitPriceSek || PT_SESSION_LIST_PRICE_SEK,
        }
      : selected?.service;

  const selectedServiceName = selectedService?.name;
  const selectedDisplayName = selected
    ? selected.subgroupName
      ? `${selected.categoryName} (${selected.subgroupName}) – ${selected.service.label}`
      : `${selected.categoryName} – ${selected.service.label}`
    : undefined;

  // Tjänster utan Kaddio-partnervariant bokas i ordinarie kalenderfilter.
  const calendarPartner = selectedService?.ifk?.name ? activePartner : null;
  const bookingReady = Boolean(
    activeLocationId && isLocationBookable(activeLocationId, activePartner),
  );

  const iframeSrc =
    selectedServiceName && bookingReady && activeLocation
      ? iframeUrlForService(
          selectedServiceName,
          activeLocation,
          calendarPartner,
        )
      : undefined;
  const fallbackHref =
    selectedServiceName && bookingReady && activeLocation
      ? externalUrlForService(
          selectedServiceName,
          activeLocation,
          calendarPartner,
        )
      : partnerKaddioBookingUrl(activePartner, activeLocationId) ??
        locationKaddioBookingUrl(activeLocation) ??
        KADDIO_BOOKING_URL;

  useEffect(() => {
    if (!iframeSrc) return;
    iframePhaseRef.current = "pick";
    ignoreIframeLoadRef.current = true;
    setIframeEpoch(0);
  }, [iframeSrc]);

  const handleIframeLoad = () => {
    if (!iframeSrc) return;

    if (ignoreIframeLoadRef.current) {
      ignoreIframeLoadRef.current = false;
      iframeReadyAtRef.current = Date.now();
      return;
    }

    if (iframePhaseRef.current === "pick") {
      if (
        Date.now() - iframeReadyAtRef.current <
        KADDIO_IFRAME_REDIRECT_GRACE_MS
      ) {
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
    if (serviceId !== "pt-pass") setPtPrepaid(null);
    requestAnimationFrame(() => {
      document.getElementById("kaddio-bokning")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const clearSelectedService = () => {
    setSelectedServiceId(undefined);
    setPtPrepaid(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const showLocationStep = !locationConfirmed;
  const pickerHighlight =
    pendingLocationId ?? (suggestedLocationId && !locationConfirmed
      ? suggestedLocationId
      : null);

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
          content="Boka tid hos Caselo Idrottsmedicin i Danderyd eller Mariefred. Välj ort, tjänst och en tid som passar dig."
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
          {showLocationStep ? (
            <StepLabel step={1}>
              Börja med att välja mottagning.
            </StepLabel>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                <p className="flex min-w-0 items-start gap-2 text-sm font-medium text-foreground md:items-center md:text-base">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary md:mt-0"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 text-pretty">
                    Mottagning:{" "}
                    <span className="font-bold">
                      {activeLocation?.name}
                    </span>
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · {activeLocation?.scheduleCard}
                    </span>
                  </span>
                </p>
                <button
                  type="button"
                  onClick={startChangeLocation}
                  className="inline-flex min-h-11 items-center self-start text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 sm:min-h-0 sm:py-1"
                >
                  Byt ort
                </button>
              </div>
              <StepLabel step={2}>
                Välj vilken typ av besök du vill boka. Därefter visas
                tillgängliga tider längre ned på sidan.
              </StepLabel>
            </div>
          )}
        </div>
      </section>

      {showLocationStep ? (
        <section className="pt-4 pb-10 md:pt-6 md:pb-12">
          <div className="container mx-auto max-w-7xl px-8 md:px-4">
            <LocationPicker
              highlightedId={pickerHighlight}
              onChoose={chooseLocationCard}
              partner={activePartner}
            />
          </div>
        </section>
      ) : (
        <section className="pt-3 pb-6 md:pt-4 md:pb-8">
          <div className="container mx-auto max-w-7xl px-8 md:px-4">
            <div className="w-full min-w-0">
              <div className="mb-6 grid grid-cols-1 items-start gap-4 lg:mb-8 lg:grid-cols-3 lg:gap-4">
                {(selected && selectedCategory
                  ? [selectedCategory]
                  : categories
                ).map((category: BookingCategory, index: number) => {
                  const tone =
                    SECTION_TONES[
                      selectedCategory
                        ? categories.findIndex((c) => c.id === category.id)
                        : index
                    ] ?? SECTION_TONES[0];
                  const services = selected
                    ? servicesInCategory(category)
                        .filter((service) => service.id === selectedServiceId)
                        .map((service) =>
                          service.id === "pt-pass" && ptPrepaid
                            ? {
                                ...service,
                                priceSek: ptPrepaid.unitPriceSek,
                                ordinaryPriceSek:
                                  ptPrepaid.listUnitPriceSek ||
                                  PT_SESSION_LIST_PRICE_SEK,
                              }
                            : service,
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
                          expanded ? "flex flex-col p-2 sm:p-2.5" : "hidden"
                        }
                      >
                        <ServiceList
                          services={services}
                          selectedServiceId={selectedServiceId}
                          onSelect={selectService}
                        />
                      </div>
                    </section>
                  );
                })}
              </div>

              {selectedServiceName && selectedService ? (
                <div id="kaddio-bokning" className="min-w-0 scroll-mt-20">
                  <div className="mb-4 space-y-3">
                    <StepLabel step={3}>
                      Välj en tid i kalendern för ditt besök i{" "}
                      {activeLocation?.name}.
                    </StepLabel>
                    {selectedService.bookingNotice ? (
                      <p className="rounded-md border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm font-semibold leading-snug text-foreground sm:ml-9 md:text-base">
                        {selectedService.bookingNotice}
                      </p>
                    ) : null}
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:pl-9">
                      <p className="min-w-0 break-words text-sm leading-snug text-muted-foreground md:text-base">
                        Vald tjänst:{" "}
                        <span className="font-medium text-foreground">
                          {selectedDisplayName}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={clearSelectedService}
                        className="inline-flex min-h-11 items-center self-start text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 sm:min-h-0"
                      >
                        Byt tjänst
                      </button>
                    </div>
                  </div>

                  {bookingReady && iframeSrc ? (
                    <>
                      <div className="w-full max-w-full overflow-x-hidden">
                        <iframe
                          key={`${activeLocationId}:${selectedServiceId}:${iframeSrc}:${iframeEpoch}`}
                          src={iframeSrc}
                          title={`Boka tid i ${activeLocation?.name}: ${selectedService.label}`}
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
                          className="break-words text-muted-foreground underline underline-offset-4 hover:text-primary"
                        >
                          Problem med bokningen? Öppna bokningssidan i ett nytt
                          fönster.
                        </a>
                      </p>
                    </>
                  ) : (
                    <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-5 sm:px-5 sm:py-6">
                      <p className="text-base font-semibold text-foreground md:text-lg">
                        Kalendern kunde inte laddas just nu.
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                        Prova att öppna bokningssidan i ett nytt fönster, eller
                        mejla/ring så hjälper vi dig boka i{" "}
                        {activeLocation?.name}.
                      </p>
                      <ul className="mt-4 space-y-2 text-sm md:text-base">
                        <li>
                          <a
                            href={fallbackHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            Öppna bokningssidan i nytt fönster
                          </a>
                        </li>
                        <li>
                          <a
                            href={`mailto:${CASELO_EMAIL}?subject=${encodeURIComponent(`Bokning ${activeLocation?.name ?? ""} – ${selectedDisplayName ?? "tid"}`)}`}
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            {CASELO_EMAIL}
                          </a>
                        </li>
                        <li>
                          <a
                            href={`tel:${CASELO_PHONE_DIGITS}`}
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            {CASELO_PHONE}
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Boka;
