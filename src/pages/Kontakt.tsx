import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import sportsImage from "@/assets/caselo-banner-kontakt.jpg";

const ADDRESS_LINE_1 = "Rinkebyvägen 4";
const ADDRESS_LINE_2 = "182 36 Danderyd";
const FULL_ADDRESS = `${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`;
const PHONE_DISPLAY = "073 756 45 09";
const PHONE_HREF = "tel:0737564509";
const EMAIL = "henrik@caseloidrottsmedicin.se";
const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(FULL_ADDRESS)}&z=15&output=embed`;

const Kontakt = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)]">
      <Helmet>
        <title>Kontakt – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Kontakta Caselo Idrottsmedicin i Danderyd. Adress, telefon, e-post och öppettider."
        />
      </Helmet>

      {/* Same chrome as Om (Therapists): full-width primary rule under header, then container */}
      <section className="border-t-2 border-primary bg-gradient-to-b from-muted/40 to-background py-10 md:py-14">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-10 md:text-5xl">
              Kontakt
            </h1>

            <div className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-6 md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
                {/* Left: contact + hours with generous spacing */}
                <div className="flex min-w-0 flex-col justify-between gap-8 sm:gap-10 lg:min-h-[280px] lg:gap-12">
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-foreground sm:mb-5 md:mb-6 md:text-2xl">
                      Kontaktuppgifter
                    </h2>
                    <ul className="space-y-5 sm:space-y-6 md:space-y-7">
                      <li className="flex items-start gap-3">
                        <MapPin
                          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <address className="not-italic text-base leading-relaxed text-foreground md:text-lg">
                            Caselo Idrottsmedicin
                            <br />
                            {ADDRESS_LINE_1}
                            <br />
                            {ADDRESS_LINE_2}
                          </address>
                          <p className="mt-2 text-sm leading-snug text-muted-foreground sm:whitespace-nowrap md:text-base md:leading-relaxed">
                            Mottagningen ligger i direkt anslutning till fotbollsplan och
                            löparbana.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <Phone
                          className="h-5 w-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <a
                          href={PHONE_HREF}
                          className="inline-flex min-h-11 items-center text-base text-foreground underline-offset-4 hover:underline md:min-h-0 md:text-lg"
                        >
                          {PHONE_DISPLAY}
                        </a>
                      </li>
                      <li className="flex items-center gap-3">
                        <Mail
                          className="h-5 w-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <a
                          href={`mailto:${EMAIL}`}
                          className="break-all text-base text-foreground underline-offset-4 hover:underline md:text-lg"
                        >
                          {EMAIL}
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="mb-5 text-xl font-bold text-foreground md:mb-6 md:text-2xl">
                      Öppettider
                    </h2>
                    <div className="flex items-start gap-3">
                      <Clock
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <p className="min-w-0 flex-1 text-base leading-relaxed text-foreground md:text-lg">
                        Helgfria vardagar måndag–fredag
                        <br className="sm:hidden" />{" "}
                        <span className="sm:ml-0">kl.&nbsp;08.00–16.00</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: flag — full width on mobile, constrained on larger */}
                <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-xl sm:max-w-[280px] md:max-w-[320px] lg:mx-0 lg:justify-self-end">
                  <img
                    src={sportsImage}
                    alt="Caselo Idrottsmedicin-flagga vid idrottsanläggningen i Danderyd"
                    className="h-auto w-full object-contain"
                    width={1000}
                    height={1472}
                  />
                </div>

                {/* Hitta hit / map — full width under image */}
                <div className="min-w-0 lg:col-span-2">
                  <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">
                    Hitta hit
                  </h2>
                  <div className="relative overflow-hidden rounded-xl border border-border/50">
                    <a
                      href={MAPS_SEARCH_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute left-3 top-3 z-10 inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border/80 bg-background/95 px-2.5 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      Öppna i Maps
                    </a>
                    <iframe
                      title={`Karta över ${FULL_ADDRESS}`}
                      src={MAPS_EMBED_URL}
                      className="h-[240px] w-full max-w-full border-0 sm:h-[280px] md:h-[360px]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Kontakt;
