import { useEffect, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const KADDIO_BOOKING_URL = "https://caseloidrottsmedicin.kaddio.com";
const KADDIO_IFRAME_BASE = `${KADDIO_BOOKING_URL}/iframe/booking`;

type BookingService = {
  id: string;
  /** Full name used by Kaddio calendar URLs */
  name: string;
  /** Short display title shown in the list */
  label: string;
  durationMin: number;
  priceSek: number;
  description?: string;
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
  /** Non-bookable note shown above the services (e.g. package price) */
  packageNote?: string;
};

const BOOKING_CATEGORIES: BookingCategory[] = [
  {
    id: "smarta-och-skador",
    name: "Bedömning och behandling av smärta och skador",
    services: [
      {
        id: "smarta-nybesok",
        name: "Smärta och skador - NYBESÖK",
        label: "Nybesök",
        durationMin: 40,
        priceSek: 895,
        description:
          "Nybesök bokas när du kommer första gången för ett besvär. Tjänsten är för dig som har ont eller är skadad och vill få hjälp med bedömning/diagnos och individuellt anpassade åtgärder för att minska besvären och hjälpa dig återgå till idrott, arbete eller vardag. Besöket kan innehålla behandling, rehabiliteringsövningar, träningsupplägg och råd om belastning.",
      },
      {
        id: "smarta-aterbesok",
        name: "Smärta och skador - ÅTERBESÖK",
        label: "Återbesök",
        durationMin: 30,
        priceSek: 695,
        description:
          "Återbesök bokas när du redan har undersökts hos Caselo Idrottsmedicin för besväret du söker för.",
      },
    ],
  },
  {
    id: "halkoppsinlagg",
    name: "Tillverkning av skräddarsydda hälkoppsinlägg",
    subgroups: [
      {
        id: "halkopp-vuxen",
        name: "Vuxen",
        services: [
          {
            id: "halkopp-vuxen-nybesok",
            name: "Hälkoppsinlägg Vuxen - NYBESÖK",
            label: "Nybesök",
            durationMin: 40,
            priceSek: 1495,
            description:
              "För dig som ska göra hälkoppsinlägg för första gången. Besöket omfattar undersökning och tillverkning av personligt utformade hälkoppsinlägg. Inlägget formas efter din häl för att ge stöd, minska belastningen på hälen, dämpa smärta och göra det lättare att gå, springa och vara aktiv.",
          },
          {
            id: "halkopp-vuxen-aterbesok",
            name: "Hälkoppsinlägg Vuxen - ÅTERBESÖK",
            label: "Återbesök",
            durationMin: 30,
            priceSek: 1295,
            description:
              "Tillverkning av fler personligt utformade hälkoppsinlägg. Bokas av dig som tidigare genomfört ett nybesök.",
          },
        ],
      },
      {
        id: "halkopp-barn",
        name: "Barn",
        services: [
          {
            id: "halkopp-barn-nybesok",
            name: "Hälkoppsinlägg Barn - NYBESÖK",
            label: "Nybesök",
            durationMin: 40,
            priceSek: 1295,
            description:
              "För dig som ska göra hälkoppsinlägg för första gången. Besöket omfattar undersökning och tillverkning av personligt utformade hälkoppsinlägg. Inlägget formas efter din häl för att ge stöd, minska belastningen på hälen, dämpa smärta och göra det lättare att gå, springa och vara aktiv.",
          },
          {
            id: "halkopp-barn-aterbesok",
            name: "Hälkoppsinlägg Barn - ÅTERBESÖK",
            label: "Återbesök",
            durationMin: 30,
            priceSek: 1095,
            description:
              "Tillverkning av fler personligt utformade hälkoppsinlägg. Bokas av dig som tidigare genomfört ett nybesök.",
          },
        ],
      },
    ],
  },
  {
    id: "prestationsutveckling",
    name: "Test och träning för ökad fysisk prestation",
    // `name` must match Kaddio booking type names exactly (slugify → /iframe/booking/cal/:slug).
    // `label` is what we show in the UI and may differ (e.g. "Din prestationsprofil").
    services: [
      {
        id: "prestationsprofil",
        name: "Prestationsprofil",
        label: "Steg 1: Test och analys av fysisk kapacitet",
        durationMin: 90,
        priceSek: 1795,
        description:
          "Vi kartlägger din acceleration, snabbhet, hoppförmåga och/eller styrka utifrån dina målsättningar. Efter besöket analyseras resultaten och du får en personlig prestationsprofil med dina styrkor och viktigaste utvecklingsområden.",
      },
      {
        id: "resultatgenomgang",
        name: "Träningsupplägg utifrån din prestationsprofil",
        label: "Steg 2: Personligt träningsupplägg",
        durationMin: 45,
        priceSek: 1195,
        description:
          "Vi går igenom din prestationsprofil och omsätter resultaten till konkreta träningsprioriteringar. Du får ett individuellt träningsupplägg och praktisk vägledning i de viktigaste övningarna för din fortsatta träning.",
      },
      {
        id: "prestationsuppfoljning",
        name: "Prestationsuppföljning",
        label: "Steg 3: Uppföljning för att mäta din utveckling",
        durationMin: 75,
        priceSek: 1495,
        description:
          "Efter träningsperioden upprepar vi relevanta tester och jämför med dina tidigare resultat. Du ser vad som har utvecklats och får nya rekommendationer inför nästa träningsperiod.",
      },
    ],
    packageNote:
      "Köp steg 1-3 för paketpriset 3 995 kr (ord. 4 485 kr). Du bokar besöken var för sig – rabatten dras vid betalning.",
  },
];

const allBookingEntries = () =>
  BOOKING_CATEGORIES.flatMap((category) => {
    if (category.subgroups) {
      return category.subgroups.flatMap((subgroup) =>
        subgroup.services.map((service) => ({
          categoryName: category.name,
          subgroupName: subgroup.name,
          service,
        })),
      );
    }
    return (category.services ?? []).map((service) => ({
      categoryName: category.name,
      subgroupName: undefined as string | undefined,
      service,
    }));
  });

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
    <p className="min-w-0 flex-1 pt-0.5 text-sm leading-snug text-muted-foreground">
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
  const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaaeeeeiiiioooouuuunc------";
  let slug = value.trim().toLowerCase();
  for (let i = 0; i < from.length; i++) {
    slug = slug.replaceAll(from.charAt(i), to.charAt(i));
  }
  return slug
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const iframeUrlForService = (serviceName: string) =>
  `${KADDIO_IFRAME_BASE}/cal/${slugifyForKaddio(serviceName)}`;

const externalUrlForService = (serviceName: string) =>
  `${KADDIO_BOOKING_URL}/booking/cal/${slugifyForKaddio(serviceName)}`;


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
        "flex h-full flex-col rounded-lg border border-border/80 bg-white p-2.5 transition-colors sm:p-3",
        isSelected
          ? "border-primary/40 bg-primary/[0.04]"
          : "hover:border-primary/25 hover:bg-white",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className="flex w-full flex-1 flex-col gap-0.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span
          className={[
            "text-[13px] font-semibold tracking-tight sm:text-sm",
            isSelected ? "text-primary" : "text-foreground",
          ].join(" ")}
        >
          {service.label}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {service.durationMin} min · {formatPrice(service.priceSek)} kr
        </span>
      </button>

      {hasDescription ? (
        <Collapsible open={infoOpen} onOpenChange={setInfoOpen} className="mt-2 border-t border-border/60 pt-1.5">
          <CollapsibleTrigger
            className="inline-flex items-center gap-1 py-0.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm sm:text-sm"
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
            <p className="text-xs leading-relaxed text-muted-foreground break-words sm:text-sm">
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
  <div className="flex flex-col gap-2">
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selected = allBookingEntries().find(
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
    ? iframeUrlForService(selectedServiceName)
    : undefined;
  const fallbackHref = selectedServiceName
    ? externalUrlForService(selectedServiceName)
    : KADDIO_BOOKING_URL;

  const selectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    requestAnimationFrame(() => {
      document.getElementById("kaddio-bokning")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <main className="overflow-x-hidden">
      <Helmet>
        <title>Boka tid – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Boka tid hos Caselo Idrottsmedicin. Välj tjänst och en tid som passar dig."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/10 to-background pt-5 pb-3 md:pt-6 md:pb-3">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="mb-3 text-xl font-bold tracking-tight text-primary md:mb-4 md:text-2xl">
            Boka tid
          </h1>
          <StepLabel step={1}>
            Börja med att välja vilken typ av besök du vill boka. Därefter visas
            tillgängliga tider längre ned på sidan.
          </StepLabel>
        </div>
      </section>

      <section className="pt-3 pb-6 md:pt-4 md:pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="w-full min-w-0">
            <div className="mb-6 grid grid-cols-1 items-stretch gap-4 lg:mb-8 lg:grid-cols-3 lg:gap-4">
              {BOOKING_CATEGORIES.map((category, index) => {
                const tone = SECTION_TONES[index] ?? SECTION_TONES[0];

                return (
                  <section
                    key={category.id}
                    aria-labelledby={`category-${category.id}`}
                    className={`flex h-full min-w-0 flex-col overflow-hidden rounded-lg border ${tone.frame}`}
                  >
                    <h2
                      id={`category-${category.id}`}
                      className={`w-full shrink-0 whitespace-nowrap px-2.5 py-2 text-[13px] font-semibold leading-none tracking-tight sm:px-3 sm:text-sm lg:text-[13px] xl:text-[15px] ${tone.heading}`}
                    >
                      {category.name}
                    </h2>

                    <div className="flex flex-1 flex-col gap-3 p-2 sm:p-2.5">
                      {category.packageNote ? (
                        <p className="px-0.5 text-xs leading-snug tracking-tight text-muted-foreground">
                          {category.packageNote}
                        </p>
                      ) : null}

                      {category.subgroups ? (
                        <div className="flex flex-1 flex-col gap-3">
                          {category.subgroups.map((subgroup) => (
                            <div
                              key={subgroup.id}
                              className="flex min-w-0 flex-col gap-2"
                            >
                              <h3 className="px-0.5 text-xs font-semibold uppercase tracking-wide text-foreground/70">
                                {subgroup.name}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                                {subgroup.services.map((service) => (
                                  <ServiceOption
                                    key={service.id}
                                    service={service}
                                    isSelected={selectedServiceId === service.id}
                                    onSelect={() => selectService(service.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1">
                          <ServiceList
                            services={category.services ?? []}
                            selectedServiceId={selectedServiceId}
                            onSelect={selectService}
                          />
                        </div>
                      )}
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:pl-9">
                    <p className="min-w-0 text-sm leading-snug text-muted-foreground md:text-base break-words">
                      Vald tjänst:{" "}
                      <span className="font-medium text-foreground">
                        {selectedDisplayName}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedServiceId(undefined)}
                      className="self-start text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      Byt tjänst
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-full overflow-x-hidden">
                  <iframe
                    key={iframeSrc}
                    src={iframeSrc}
                    title="Boka tid via Kaddio"
                    className="w-full max-w-full min-h-[640px] border-0 sm:min-h-[800px] md:min-h-[1000px]"
                    style={{ overflowY: "auto", overflowX: "hidden" }}
                    loading="lazy"
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
