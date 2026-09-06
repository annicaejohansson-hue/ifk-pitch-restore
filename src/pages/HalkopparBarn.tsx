import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BookingLink from "@/components/BookingLink";
import Partner from "@/components/Partner";
import { useVisitor } from "@/context/VisitorContext";
import {
  trackKontaktEpost,
  trackKontaktLank,
} from "@/lib/analytics";
import {
  CHILD_HEEL_CUP_BOOKING_ID,
  SITE_ORIGIN,
} from "@/lib/booking";
import { HEEL_CUP_SERVICE_PATH } from "@/data/tjanster";
import heroImage from "@/assets/forening-spelare.jpg";

const PAGE_PATH = HEEL_CUP_SERVICE_PATH;
const PAGE_URL = `${SITE_ORIGIN}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_ORIGIN}/og-halkoppar-barn.jpg`;
const LAST_REVIEWED = "2026-09-06";
const LAST_REVIEWED_DISPLAY = "6 september 2026";

const SEO_TITLE = "Hälkoppsinlägg för barn med hälsmärta | Caselo Danderyd";
const SEO_DESCRIPTION =
  "Har ditt barn ont i hälen vid fotboll eller annan idrott? Hos Caselo i Danderyd får barnet en fysioterapeutisk bedömning och individuellt anpassade hälkoppsinlägg när det är lämpligt.";

const EMAIL = "henrik@caseloidrottsmedicin.se";
const ADDRESS_STREET = "Rinkebyvägen 4";
const ADDRESS_POSTAL = "182 36";
const ADDRESS_LOCALITY = "Danderyd";

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const outlineCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const inlineLinkClass =
  "font-medium text-primary underline underline-offset-4 hover:text-primary/80";

const symptoms = [
  "Barnet får ont i hälen under eller efter träning",
  "Smärtan ökar vid löpning och hopp",
  "Barnet haltar eller går på tå efter aktivitet",
  "Besvären återkommer under perioder med mer träning",
  "Fotbollsskor eller hårda underlag gör mer ont",
];

const reasons = [
  "Legitimerad fysioterapeut med erfarenhet av fotboll och idrottsskador",
  "Bedömning, hjälpmedel och rehabilitering i ett sammanhållet upplägg",
  "Förståelse för vägen tillbaka till träning och match",
  "Mottagning på Danderyd Arena, i anslutning till fotbollsplan",
  "Möjlighet till dialog med tränare när spelaren och vårdnadshavaren samtycker",
];

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    id: "vad-ar-halkoppar",
    question: "Vad är hälkoppsinlägg?",
    answer:
      "Hälkoppsinlägg är personligt utformade inlägg som formas efter barnets häl. De används i skon för att ge stöd och avlastning vid hälsmärta.",
  },
  {
    id: "nar-kan-halkoppar-hjalpa",
    question: "När kan hälkoppsinlägg hjälpa ett barn med ont i hälen?",
    answer:
      "Hälkoppsinlägg kan vara ett möjligt hjälpmedel när en fysioterapeutisk bedömning visar att avlastning av hälen är lämplig, till exempel vid hälsmärta kopplad till idrott. De passar inte automatiskt vid alla typer av hälbesvär, och resultatet beror på orsaken till smärtan och barnets belastning.",
  },
  {
    id: "samma-som-skoinlagg",
    question: "Är hälkoppsinlägg samma sak som vanliga skoinlägg?",
    answer:
      "Hälkoppsinlägg är personligt utformade inlägg som formas efter barnets häl. De är inte samma sak som ett färdigt skoinlägg från butik.",
  },
  {
    id: "vad-ar-severs",
    question: "Vad är Severs skada?",
    answer:
      "Severs skada, även kallad Severs sjukdom eller calcaneal apofysit, är en vanlig orsak till hälsmärta hos aktiva barn i tillväxt. Den hänger ihop med belastning på tillväxtzonen i hälbenet, ofta vid löpning och hopp. Diagnos ska inte ställas utifrån en webbsida – en individuell bedömning behövs.",
  },
  {
    id: "fotbollsskor",
    question: "Passar hälkoppsinlägg i fotbollsskor?",
    answer:
      "Som regel passar hälkoppsinlägg bra i fotbollsskor. För extra smala fotbollsskor kan inläggen behöva anpassas något - det löser vi på plats.",
  },
];

const sources = [
  {
    label: "StatPearls / NCBI: Sever Disease (Calcaneal Apophysitis)",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK441928/",
  },
  {
    label: "Cambridge University Hospitals NHS: Calcaneal apophysitis (Sever’s disease)",
    href: "https://www.cuh.nhs.uk/patient-information/severs-disease/",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MedicalClinic", "LocalBusiness"],
      "@id": `${SITE_ORIGIN}/#clinic`,
      name: "Caselo Idrottsmedicin",
      url: `${SITE_ORIGIN}/`,
      email: EMAIL,
      image: `${SITE_ORIGIN}/favicon-192.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS_STREET,
        postalCode: ADDRESS_POSTAL,
        addressLocality: ADDRESS_LOCALITY,
        addressCountry: "SE",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "16:00",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: SEO_TITLE,
      description: SEO_DESCRIPTION,
      inLanguage: "sv-SE",
      isPartOf: { "@id": `${SITE_ORIGIN}/#clinic` },
      lastReviewed: LAST_REVIEWED,
      reviewedBy: {
        "@type": "Person",
        name: "Henrik Nilsson",
        jobTitle: "Legitimerad fysioterapeut",
      },
    },
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Hälkoppsinlägg för barn med hälsmärta",
      serviceType:
        "Fysioterapeutisk bedömning och skräddarsydda hälkoppsinlägg för barn",
      url: PAGE_URL,
      provider: { "@id": `${SITE_ORIGIN}/#clinic` },
      areaServed: [
        { "@type": "City", "name": "Danderyd" },
        { "@type": "AdministrativeArea", "name": "Stockholm" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startsida",
          item: `${SITE_ORIGIN}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tjänster",
          item: `${SITE_ORIGIN}/tjanster`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Hälkoppsinlägg för barn",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

const HalkopparBarn = () => {
  const { visitorType } = useVisitor();

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sv_SE" />
        <meta property="og:site_name" content="Caselo Idrottsmedicin" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Fotboll på gräsplan. Illustrativ bild, inte en patient hos Caselo."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />

        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="container px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <Breadcrumb className="mb-6 md:mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Startsida</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/tjanster">Tjänster</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Hälkoppsinlägg för barn</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
            <div className="min-w-0">
              <p className="mb-3 text-sm font-medium text-primary sm:text-base">
                Specialiserad tjänst för barn och unga med hälbesvär
              </p>
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-5 md:text-5xl">
                Hälkoppsinlägg för barn med ont i hälen
              </h1>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                Hälsmärta är vanligt hos växande barn som spelar fotboll eller
                ägnar sig åt annan idrott med mycket löpning och hopp. Hos
                Caselo får barnet en fysioterapeutisk bedömning och, när det är
                lämpligt, individuellt anpassade hälkoppsinlägg som kan avlasta
                hälen.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild variant="secondary" className={goldCtaClass}>
                  <BookingLink
                    serviceId={CHILD_HEEL_CUP_BOOKING_ID}
                    aria-label="Boka tid"
                  >
                    <Calendar
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      aria-hidden="true"
                    />
                    Boka tid
                  </BookingLink>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <div className="aspect-[717/557] w-full bg-muted">
                <img
                  src={heroImage}
                  alt="Fotboll på gräsplan. Bilden är illustrativ och föreställer inte en patient hos Caselo."
                  className="h-full w-full object-cover object-[58%_72%]"
                  width={717}
                  height={557}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-8 md:text-4xl">
              Känner du igen det här?
            </h2>
            <ul className="max-w-3xl space-y-3.5 sm:space-y-4">
              {symptoms.map((item) => (
                <li key={item} className="flex items-start gap-3 sm:gap-3.5">
                  <span
                    className="mt-[0.55rem] h-2.5 w-2.5 shrink-0 rounded-full bg-primary sm:mt-[0.6rem]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 text-base leading-relaxed text-foreground md:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Många barn i åldern 9 till 15 år drabbas av hälsmärta som kan gå
              ut över både idrott och vardag. En vanlig orsak är Severs skada,
              där hälkoppsinlägg visat sig vara en mycket effektiv behandling.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-6 md:text-4xl">
              Varför får barn ont i hälen?
            </h2>
            <p className="mb-4 text-base leading-relaxed text-foreground md:text-lg">
              Hälsmärta hos idrottande barn beror ofta på hög belastning under
              tillväxten, och en vanlig orsak är Severs skada.
            </p>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>
                Kroppen förändras under tillväxten. Upprepad belastning från
                löpning och hopp – till exempel efter fotboll – kan göra hälen
                känslig. Severs skada, även kallad Severs sjukdom eller
                calcaneal apofysit, är då en vanlig orsak till hälsmärta hos
                aktiva barn.
              </p>
              <p>
                Hos Caselo i Danderyd gör en fysioterapeut en individuell
                bedömning innan ni tillsammans tar ställning till hjälp vid
                hälsmärta hos barn, till exempel hälkoppsinlägg.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-6 md:text-4xl">
              Vad är hälkoppsinlägg?
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p className="text-foreground">
                Hälkoppsinlägg är personligt utformade
                inlägg som formas efter barnets häl. De används i skon för att
                ge stöd och avlastning vid hälsmärta.
              </p>
              <p>
                Inlägget formas efter hälen för att kunna dämpa belastningen
                och göra det lättare att gå, springa och vara aktiv.
              </p>
              <p>
                Hur hälkoppsinläggen används i vardagen och i idrottsskor går vi
                igenom vid besöket. Caselo tillverkar också hälkoppsinlägg för
                vuxna; det bokas som ett eget nybesök på{" "}
                <BookingLink className={inlineLinkClass}>
                  bokningssidan
                </BookingLink>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-8 md:text-4xl">
              Därför väljer familjer Caselo
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Caselo erbjuder en specialiserad tjänst för barn och unga med
              hälbesvär.
            </p>
            <ul className="space-y-3">
              {reasons.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-base leading-relaxed text-foreground md:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              För idrottande barn som spelar fotboll finns också{" "}
              <Link to="/forening/spelare" className={inlineLinkClass}>
                fotbollsanpassad rehabilitering
              </Link>{" "}
              och information för{" "}
              <Link to="/forening" className={inlineLinkClass}>
                fotbollsföreningar
              </Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-8 md:text-4xl">
              Vanliga frågor
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="min-h-11 py-4 text-left text-base font-semibold leading-snug hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground md:text-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card/90 px-5 py-7 text-center shadow-[var(--shadow-card)] backdrop-blur-sm sm:px-6 sm:py-8 md:px-10 md:py-10">
            <h2 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
              Vill ni boka en bedömning?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Boka ett nybesök för barn. På{" "}
              <BookingLink
                serviceId={CHILD_HEEL_CUP_BOOKING_ID}
                className={inlineLinkClass}
              >
                bokningssidan
              </BookingLink>{" "}
              ser du tider och priser. Är du osäker på vilken tid som ska
              bokas kan du mejla.
            </p>
            <div className="mb-6 flex flex-col items-center justify-center gap-2 text-base text-foreground sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 md:text-lg">
              <a
                href={`mailto:${EMAIL}`}
                className={`${inlineLinkClass} inline-flex min-h-11 items-center gap-2 break-all`}
                onClick={() => trackKontaktEpost(visitorType)}
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {EMAIL}
              </a>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="secondary" className={goldCtaClass}>
                <BookingLink
                  serviceId={CHILD_HEEL_CUP_BOOKING_ID}
                  aria-label="Boka tid för bedömning av hälbesvär"
                >
                  <Calendar
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  />
                  Boka tid
                </BookingLink>
              </Button>
              <Button asChild variant="outline" className={outlineCtaClass}>
                <Link
                  to="/kontakt"
                  onClick={() => trackKontaktLank(visitorType)}
                >
                  Kontakt
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl text-sm leading-relaxed text-muted-foreground md:text-base">
            <h2 className="mb-3 text-lg font-semibold text-foreground md:text-xl">
              Sakkunnighet och källor
            </h2>
            <p className="mb-2">
              <strong className="font-semibold text-foreground">
                Medicinskt innehåll granskat av:
              </strong>{" "}
              Henrik Nilsson, legitimerad fysioterapeut
            </p>
            <p className="mb-4">
              Sidan senast granskad: {LAST_REVIEWED_DISPLAY}.
            </p>
            <p className="mb-3">
              Källorna beskriver hälsmärta och Severs skada i allmänhet.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              {sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={inlineLinkClass}
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default HalkopparBarn;
