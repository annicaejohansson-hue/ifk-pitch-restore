import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/BookingLink";
import Partner from "@/components/Partner";
import { useVisitor } from "@/context/VisitorContext";
import { trackKontaktLank } from "@/lib/analytics";
import { SITE_ORIGIN } from "@/lib/booking";
import { HEEL_CUP_SERVICE_PATH } from "@/data/tjanster";
import henrikFoto from "@/assets/IMG_9111.jpg";
import pitchFoto from "@/assets/IMG_9118.jpg";

const PAGE_PATH = "/om";
const PAGE_URL = `${SITE_ORIGIN}${PAGE_PATH}`;

const SEO_TITLE = "Om Caselo Idrottsmedicin | Henrik Nilsson";
const SEO_DESCRIPTION =
  "Möt Henrik Nilsson, legitimerad fysioterapeut med tio års erfarenhet av idrottsskador. Mottagning på Danderyd Arena, 25 meter från fotbollsplan.";

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const outlineCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const inlineLinkClass =
  "font-medium text-primary underline underline-offset-4 hover:text-primary/80";

const heroFacts = [
  "UEFA A-tränarlicens och tidigare elitfotbollsspelare",
  "Bedömning och rehab på fotbollsplanen",
  "Ultraljud, stötvåg och hälkoppsinlägg",
];

const clinicStrengths = [
  "Fullstor fotbollsplan 25 meter från kliniken – bedömning och rehab i den miljö du ska tillbaka till",
  "Realistisk testning inför återgång till träning och match, med maxlöpningar, inlägg och skott",
  "Löparbana och laserportar för objektiv mätning av acceleration och snabbhet",
  "Diagnostik med ultraljud och stötvågsbehandling",
  "Individuellt tillverkade hälkoppsinlägg, till exempel vid hälsporre, hälkuddesyndrom och Severs skada",
  "Objektiv styrkemätning med handhållen dynamometer",
];

const education = [
  "Legitimerad fysioterapeut, kandidatexamen vid Linköpings universitet 2015",
  "UEFA A-tränarlicens",
  "Vidareutbildning inom OMT, MDT och ultraljudsdiagnostik",
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Henrik Nilsson",
  jobTitle: "Legitimerad fysioterapeut",
  url: PAGE_URL,
  worksFor: {
    "@type": "MedicalClinic",
    name: "Caselo Idrottsmedicin",
    url: `${SITE_ORIGIN}/`,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Linköpings universitet",
  },
  description: SEO_DESCRIPTION,
};

const Om = () => {
  const { visitorType } = useVisitor();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="bg-background py-8 md:py-14">
        <div className="container px-4">
          <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2 md:gap-10">
            <div className="min-w-0">
              <p className="mb-3 text-sm font-medium text-primary sm:text-base">
                Om Caselo Idrottsmedicin
              </p>
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-5 md:text-[2.75rem] md:leading-tight lg:text-5xl">
                Idrottsskador – med planen utanför dörren
              </h1>
              <p className="mb-5 text-base leading-relaxed text-muted-foreground sm:text-lg md:mb-6 md:text-xl">
                Caselo drivs av Henrik Nilsson, legitimerad fysioterapeut med
                tio års erfarenhet av idrottsskador. Mottagningen ligger på
                Danderyd Arena, 25 meter från fullstor fotbollsplan. Inriktningen
                är fotbollsspelare – men vi tar emot alla med besvär.
              </p>
              <ul className="mb-6 space-y-2.5 md:mb-8">
                {heroFacts.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 text-base leading-snug text-foreground md:text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild variant="secondary" className={goldCtaClass}>
                  <BookingLink aria-label="Boka tid">
                    <Calendar
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      aria-hidden="true"
                    />
                    Boka tid
                  </BookingLink>
                </Button>
              </div>
            </div>
            <figure className="min-w-0">
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                <div className="aspect-[4/5] w-full bg-muted md:aspect-square">
                  <img
                    src={henrikFoto}
                    alt="Henrik Nilsson, legitimerad fysioterapeut, på fotbollsplanen vid Danderyd Arena"
                    className="h-full w-full object-cover object-[58%_12%]"
                    width={900}
                    height={1125}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Henrik Nilsson, leg. fysioterapeut
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-6 md:text-4xl">
              En behandlare som förstår idrottens krav
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p className="text-foreground">
                Henrik är legitimerad fysioterapeut sedan 2015. De första fem
                åren arbetade han i primärvården i Norrköping, varav tre år på
                den idrottsmedicinska specialistenheten MIE. Därefter fem år på
                Ortomed i Stockholm, med särskild inriktning på fötter,
                ultraljudsdiagnostik, stötvågsbehandling och tillverkning av
                sko- och hälkoppsinlägg.
              </p>
              <p>
                Han är tidigare elitfotbollsspelare och har UEFA
                A-tränarlicens. Sedan fem år är han assisterande tränare i IFK
                Stocksunds herrlag i Ettan Norra. I klubben arbetar han också
                som fysioterapeut, med dagliga bedömningar och ansvar för
                skadeförebyggande träning och fysisk utveckling i samtliga lag
                – från 7-åringar till herrlaget.
              </p>
              <p>
                Tränarperspektivet finns med i bedömningen. Rehabiliteringen
                utgår inte bara från skadan, utan från vad du faktiskt behöver
                kunna göra när du ska tillbaka till träning och match. Läs mer
                om{" "}
                <Link to="/forening" className={inlineLinkClass}>
                  samarbetet med fotbollsföreningar
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2 md:gap-12">
            <div className="min-w-0">
              <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-6 md:text-4xl">
                Rehab i den miljö du ska tillbaka till
              </h2>
              <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                När kliniken ligger intill fotbollsplan och löparbana kan
                bedömning, träning och tester göras där kraven faktiskt finns.
                Det gör vägen tillbaka mer konkret – för fotbollsspelare och
                för andra idrottare.
              </p>
              <ul className="space-y-3.5">
                {clinicStrengths.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 text-base leading-relaxed text-foreground md:text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                Caselo tillverkar bland annat{" "}
                <Link to={HEEL_CUP_SERVICE_PATH} className={inlineLinkClass}>
                  hälkoppsinlägg för barn med hälsmärta
                </Link>.
              </p>
            </div>
            <figure className="min-w-0">
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                <div className="aspect-[4/3] w-full bg-muted">
                  <img
                    src={pitchFoto}
                    alt="Henrik Nilsson undersöker en fotbollsspelare på planen vid Danderyd Arena"
                    className="h-full w-full object-cover object-[40%_40%]"
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-8 md:text-4xl">
              Utbildning
            </h2>
            <ul className="space-y-3 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6 md:p-8">
              {education.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 text-base leading-relaxed text-foreground md:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card px-5 py-7 text-center shadow-[var(--shadow-card)] sm:px-6 sm:py-8 md:px-10 md:py-10">
            <h2 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
              Vill du boka en bedömning?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              På bokningssidan ser du tider, priser och kan välja den tjänst som
              passar dig.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="secondary" className={goldCtaClass}>
                <BookingLink aria-label="Boka tid för bedömning">
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

      <Partner />
    </main>
  );
};

export default Om;
