import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/BookingLink";
import Partner from "@/components/Partner";
import PageIntro from "@/components/PageIntro";
import Mottagningar from "@/components/Mottagningar";
import { SITE_ORIGIN } from "@/lib/booking";
import { MOTTAGNINGAR_HASH } from "@/data/locations";
import henrikFoto from "@/assets/IMG_9111.jpg";

const PAGE_PATH = "/om";
const PAGE_URL = `${SITE_ORIGIN}${PAGE_PATH}`;

const SEO_TITLE = "Om Caselo Idrottsmedicin | Henrik Nilsson";
const SEO_DESCRIPTION =
  "Möt Henrik Nilsson, legitimerad fysioterapeut med tio års erfarenhet av idrottsskador. Mottagningar i Danderyd och Mariefred.";

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const outlineCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const education = [
  "Legitimerad fysioterapeut, kandidatexamen vid Linköpings universitet 2015",
  "UEFA A-tränarlicens",
  "Vidareutbildning inom ortopedisk manuell terapi (OMT), McKenzie-metoden (MDT) och ultraljudsdiagnostik",
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
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === `#${MOTTAGNINGAR_HASH}`) {
      requestAnimationFrame(() => {
        document
          .getElementById(MOTTAGNINGAR_HASH)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [hash]);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="bg-background py-8 md:py-14">
        <div className="container px-8 md:px-4">
          <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2 md:gap-10">
            <div className="min-w-0">
              <PageIntro
                className="mb-5 md:mb-6"
                eyebrow="Om Caselo Idrottsmedicin"
                title="Fysioterapi i Danderyd och Mariefred"
              >
                Caselo drivs av Henrik Nilsson, legitimerad fysioterapeut med
                tio års erfarenhet av idrottsskador. Mottagning i Danderyd och
                Mariefred. Inriktningen är idrottare – men vi tar emot alla med
                besvär.
              </PageIntro>
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-8">
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

      <Mottagningar />

      <section className="bg-muted py-12 md:py-20">
        <div className="container px-8 md:px-4">
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
                kunna göra när du ska tillbaka till träning och match.
              </p>
            </div>

            <h3 className="mb-4 mt-8 text-xl font-bold tracking-tight text-foreground md:mt-10 md:text-2xl">
              Utbildning
            </h3>
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
        <div className="container px-8 md:px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card px-5 py-7 text-center shadow-[var(--shadow-card)] sm:px-6 sm:py-8 md:px-10 md:py-10">
            <p className="mx-auto mb-6 max-w-2xl text-base font-semibold leading-relaxed text-foreground md:text-lg">
              Läs mer om våra tjänster, eller gå direkt till bokningen.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="outline" className={outlineCtaClass}>
                <Link to="/tjanster">Tjänster</Link>
              </Button>
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
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default Om;
