import { Calendar, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingLink from "@/components/BookingLink";
import {
  LOCATION_IDS,
  LOCATIONS,
  MOTTAGNINGAR_HASH,
  type LocationId,
} from "@/data/locations";
import pitchFoto from "@/assets/IMG_9118.jpg";

type MottagningarProps = {
  /** Extra classes on the outer section. */
  className?: string;
  /** Show page-style heading (default true). */
  showHeading?: boolean;
};

const Mottagningar = ({
  className = "",
  showHeading = true,
}: MottagningarProps) => (
  <section
    id={MOTTAGNINGAR_HASH}
    className={`scroll-mt-28 bg-gradient-to-b from-muted/40 to-background py-10 md:py-14 ${className}`}
    aria-labelledby="mottagningar-heading"
  >
    <div className="container px-8 md:px-4">
      <div className="mx-auto max-w-5xl">
        {showHeading ? (
          <div className="mb-6 md:mb-8">
            <h2
              id="mottagningar-heading"
              className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl"
            >
              Mottagningar
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Henrik tar emot i Danderyd och Mariefred. Välj ort när du bokar.
            </p>
          </div>
        ) : (
          <h2 id="mottagningar-heading" className="sr-only">
            Mottagningar
          </h2>
        )}

        <Tabs defaultValue="danderyd" className="w-full">
          <TabsList className="mb-5 grid h-auto w-full grid-cols-2 gap-1 p-1 sm:mb-6">
            {LOCATION_IDS.map((id) => (
              <TabsTrigger
                key={id}
                value={id}
                className="min-h-11 px-3 py-2.5 text-sm sm:text-base"
              >
                {LOCATIONS[id].name}
              </TabsTrigger>
            ))}
          </TabsList>

          {LOCATION_IDS.map((id: LocationId) => {
            const location = LOCATIONS[id];
            const mapsUrl =
              location.mapsUrl ??
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;
            return (
              <TabsContent
                key={id}
                value={id}
                className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <article className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-[var(--shadow-card)] sm:p-6 md:p-8">
                  <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        {location.name}
                      </h3>
                      <ul className="mt-3 space-y-3 text-base leading-snug text-muted-foreground md:text-lg">
                        <li className="flex items-start gap-2.5">
                          <MapPin
                            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span>
                            <span className="block text-foreground">
                              {location.venueName}
                            </span>
                            <span className="block text-sm md:text-base">
                              {location.addressLine1}, {location.addressLine2}
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CalendarDays
                            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span className="text-foreground">
                            {location.scheduleDaysShort}
                          </span>
                        </li>
                      </ul>

                      {location.placeIntro ? (
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                          {location.placeIntro}
                        </p>
                      ) : null}

                      {location.placeHighlights.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                          {location.placeHighlights.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <CheckCircle2
                                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              <span className="min-w-0 text-sm leading-relaxed text-foreground md:text-base">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {location.placeFooter ? (
                        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                          {location.placeFooter}
                        </p>
                      ) : null}

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        {location.bookingEnabled ? (
                          <Button
                            asChild
                            variant="secondary"
                            className="min-h-11 w-full shadow-[var(--shadow-button)] sm:w-auto"
                          >
                            <BookingLink
                              locationId={id}
                              aria-label={`Boka tid i ${location.name}`}
                            >
                              <Calendar
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                              />
                              Boka i {location.name}
                            </BookingLink>
                          </Button>
                        ) : (
                          <p className="w-full text-sm font-medium text-muted-foreground sm:w-auto sm:text-base">
                            Bokning i {location.name} öppnar snart
                          </p>
                        )}
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 sm:text-base"
                        >
                          Öppna i Maps
                        </a>
                      </div>
                    </div>

                    <figure className="min-w-0">
                      <div className="overflow-hidden rounded-xl shadow-[var(--shadow-card)]">
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
                </article>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  </section>
);

export default Mottagningar;
