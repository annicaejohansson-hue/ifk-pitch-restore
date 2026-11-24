import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Clock, ExternalLink, Mail, MapPin } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import sportsImage from "@/assets/caselo-banner-kontakt.jpg";
import { CASELO_EMAIL } from "@/data/caseloCompany";
import {
  LOCATION_IDS,
  LOCATIONS,
  MOTTAGNINGAR_PATH,
  type LocationId,
} from "@/data/locations";

const OPENING_HOURS: Record<
  LocationId,
  { days: string; timeNote: string }
> = {
  danderyd: {
    days: "Mån, Tis, Ons, Fre",
    timeNote: "kl. 09.30–15.00",
  },
  mariefred: {
    days: "Torsdagar",
    timeNote: "kl. 08.00–16.00",
  },
};

function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

const mapsLinkClass =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border/80 bg-background px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-muted/60";

const Kontakt = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] overflow-x-hidden">
      <Helmet>
        <title>Kontakt – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Kontakta Caselo Idrottsmedicin. Adress, e-post och öppettider för mottagningarna i Danderyd och Mariefred."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-muted/40 to-background py-8 md:py-14">
        <div className="container px-4 sm:px-8 md:px-4">
          <div className="mx-auto max-w-5xl">
            <PageIntro
              className="mb-8 md:mb-10"
              eyebrow="Kontakt"
              title="Hör av dig"
            >
              Här hittar du e-post, öppettider och karta för mottagningarna i
              Danderyd och Mariefred.{" "}
              <Link
                to={MOTTAGNINGAR_PATH}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Läs mer
              </Link>{" "}
              om mottagningarna.
            </PageIntro>

            <div className="mb-8 rounded-2xl border border-border/60 bg-card/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:mb-10 sm:p-6 md:p-8">
              <h2 className="mb-4 text-xl font-bold text-foreground md:mb-5 md:text-2xl">
                E-post
              </h2>
              <div className="flex items-center gap-3">
                <Mail
                  className="h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${CASELO_EMAIL}`}
                  className="inline-flex min-h-11 min-w-0 items-center break-words text-base leading-relaxed text-foreground underline-offset-4 hover:underline md:text-lg"
                >
                  henrik@<wbr />
                  caseloidrottsmedicin.se
                </a>
              </div>
            </div>

            <div className="space-y-8 md:space-y-10">
              {LOCATION_IDS.map((id) => {
                const location = LOCATIONS[id];
                const hours = OPENING_HOURS[id];
                const searchUrl =
                  location.mapsUrl ?? mapsSearchUrl(location.mapsQuery);
                const embedUrl = mapsEmbedUrl(location.mapsQuery);
                const showBanner = id === "danderyd";

                return (
                  <article
                    key={id}
                    className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-6 md:p-8 lg:p-10"
                  >
                    <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
                      <div className="order-1 min-w-0">
                        <h2 className="mb-4 text-xl font-bold text-foreground sm:mb-5 md:mb-6 md:text-2xl">
                          {location.name}
                        </h2>
                        <ul className="space-y-5 sm:space-y-6">
                          <li className="flex items-start gap-3">
                            <MapPin
                              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                            <address className="min-w-0 not-italic text-base leading-relaxed text-foreground md:text-lg">
                              <span className="block font-medium">
                                {location.venueName}
                              </span>
                              {location.addressLine1}
                              <br />
                              {location.addressLine2}
                            </address>
                          </li>
                          <li className="flex items-start gap-3">
                            <Clock
                              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                            <p className="min-w-0 flex-1 text-base leading-relaxed text-foreground md:text-lg">
                              {hours.days}
                              <br />
                              <span className="text-muted-foreground">
                                {hours.timeNote}
                              </span>
                            </p>
                          </li>
                        </ul>
                      </div>

                      <div className="order-2 min-w-0 lg:order-3 lg:col-span-2">
                        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <h3 className="text-lg font-bold text-foreground md:text-xl">
                            Hitta hit – {location.name}
                          </h3>
                          <a
                            href={searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${mapsLinkClass} w-full sm:hidden`}
                          >
                            <ExternalLink
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            Öppna i Maps
                          </a>
                        </div>
                        <div className="relative w-full max-w-full overflow-hidden rounded-xl border border-border/50">
                          <a
                            href={searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${mapsLinkClass} absolute left-3 top-3 z-10 hidden sm:inline-flex`}
                          >
                            <ExternalLink
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            Öppna i Maps
                          </a>
                          <iframe
                            title={`Karta över ${location.venueName}, ${location.mapsQuery}`}
                            src={embedUrl}
                            className="block h-[220px] w-full max-w-full border-0 sm:h-[280px] md:h-[360px]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                          />
                        </div>
                      </div>

                      {showBanner ? (
                        <div className="order-3 mx-auto w-full max-w-[200px] overflow-hidden rounded-xl sm:max-w-[280px] md:max-w-[320px] lg:order-2 lg:mx-0 lg:justify-self-end">
                          <img
                            src={sportsImage}
                            alt="Caselo Idrottsmedicin-flagga vid idrottsanläggningen i Danderyd"
                            className="h-auto w-full object-contain"
                            width={1000}
                            height={1472}
                          />
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Kontakt;
