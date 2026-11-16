import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Partner from "@/components/Partner";
import PageIntro from "@/components/PageIntro";
import AudienceSwitch from "@/components/forening/AudienceSwitch";
import ProcessSteps from "@/components/forening/ProcessSteps";
import henrikFoto from "@/assets/IMG_9111-guidance.jpg";
import caseloFlagga from "@/assets/caselo-banner-kontakt.jpg";
import rehabFoto from "@/assets/IMG_9118.jpg";
import { useVisitor } from "@/context/VisitorContext";
import { trackKontaktEpost } from "@/lib/analytics";
import {
  CASELO_EMAIL,
  CASELO_PHONE,
  CASELO_PHONE_DIGITS,
} from "@/data/caseloCompany";
import type { ProcessStep } from "@/components/forening/ProcessSteps";

const ADDRESS_LINE_1 = "Rinkebyvägen 4";
const ADDRESS_LINE_2 = "182 36 Danderyd";
const FULL_ADDRESS = `${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`;
const EMAIL = CASELO_EMAIL;
const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(FULL_ADDRESS)}&z=15&output=embed`;

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const contactLinkClass =
  "break-words text-base text-foreground underline-offset-4 hover:underline md:text-lg";

const sectionY = "py-8 md:py-12";
const sectionX = "container px-8 md:px-4";

const clubSteps: ProcessStep[] = [
  {
    title: "Hör av er",
    text: "Maila Henrik eller slå en signal – vi pratar ihop oss om ett möjligt upplägg.",
    detail: (
      <span className="flex flex-col gap-2.5">
        <span className="flex flex-col gap-0.5">
          <a
            href={`mailto:${CASELO_EMAIL}`}
            className="inline-flex min-h-9 items-center gap-2 font-medium leading-snug text-primary underline-offset-4 hover:underline"
            aria-label={`Mejla ${CASELO_EMAIL}`}
          >
            <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="break-all">{CASELO_EMAIL}</span>
          </a>
          <a
            href={`tel:${CASELO_PHONE_DIGITS}`}
            className="inline-flex min-h-9 items-center gap-2 font-medium leading-snug text-primary underline-offset-4 hover:underline"
            aria-label={`Ring ${CASELO_PHONE}`}
          >
            <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{CASELO_PHONE}</span>
          </a>
        </span>
        <span>Berätta kort om föreningens behov så tar vi det därifrån.</span>
      </span>
    ),
  },
  {
    title: "Förankra internt",
    text: "Ni förankrar upplägget internt utifrån era behov – i den form och takt som passar er.",
    detail:
      "Kort startsträcka: muntlig eller skriftlig överenskommelse via mejl räcker – formellt avtal behövs bara om ni själva vill. Ingen avgift, bindningstid eller uppsägningstid, och det behöver inte vara exklusivt.",
  },
  {
    title: "Dela vidare",
    text: "Vi skickar länken till er personliga bokningssida – ni tipsar medlemmarna och sedan är vi igång.",
    detail:
      "Tipsa spelare, tränare och föräldrar. Vi hjälper gärna till med enkla formuleringar att klistra in i mejl eller på hemsidan.",
  },
];

const clubOffers = [
  "Henrik Nilsson: leg. fysioterapeut och UEFA A-licensierad fotbollstränare",
  "Personlig kontakt och bollplank för föreningens tränare",
  "Rabatterade priser för alla era medlemmar",
  "Bokningsbara tider samma dag eller dagen efter",
];

const ForeningKlubb = () => {
  const { visitorType } = useVisitor();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-background">
      <Helmet>
        <title>För föreningsledning – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="För klubbchef, sportchef, styrelse och kansli: lokal idrottsmedicin, rehab och stöd till lagen när spelare får ont eller skadar sig."
        />
      </Helmet>

      <section className={`bg-background ${sectionX} pt-6 pb-8 md:pt-8 md:pb-10`}>
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="mb-4 flex justify-end md:mb-5">
            <AudienceSwitch
              to="/forening/tranare"
              label="Företräder du ett lag? →"
            />
          </div>
          <div className="grid min-w-0 items-start gap-5 md:grid-cols-2 md:gap-10">
            <div className="contents min-w-0 md:flex md:flex-col">
              <PageIntro
                className="min-w-0 max-md:order-1"
                eyebrow="För föreningsledning"
                title="Stöd till föreningens medlemmar när de skadar sig"
                mobileTitle="Stöd till föreningens medlemmar när de skadar sig"
              >
                <p>
                  Caselo är en idrottsmedicinsk mottagning vid Danderyd Arena.
                  Här får era spelare hjälp med bedömning och rehab, och era
                  tränare en personlig kontakt och ett bollplank.
                </p>
              </PageIntro>

              <a
                href="#sa-fungerar-det"
                className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-primary sm:text-lg max-md:order-2 md:mt-6"
              >
                Läs mer om hur ett samarbete kan fungera
                <ArrowDown className="h-5 w-5 shrink-0" aria-hidden="true" />
              </a>
            </div>

            <figure className="min-w-0 max-md:order-3">
              <div className="overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)]">
                <div className="aspect-[4/5] w-full md:aspect-[5/4]">
                  <img
                    src={rehabFoto}
                    alt="Henrik Nilsson undersöker en fotbollsspelare på planen vid Danderyd Arena"
                    className="h-full w-full object-cover object-[42%_38%] md:object-[40%_42%]"
                    width={1200}
                    height={900}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className={`bg-muted ${sectionY}`}>
        <div className={sectionX}>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-5 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Detta kan Caselo erbjuda er förening
            </h2>
            <ul className="mb-5 space-y-2.5">
              {clubOffers.map((item) => (
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
            <p className="mb-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Mottagningen på Danderyd Arena ligger 25 meter från en fullstor
              fotbollsplan, så bedömning och rehab kan ske i den miljö spelarna
              ska tillbaka till. Vid behov används ultraljud och
              stötvågsbehandling, och vid hälsmärta kan individuella
              hälkoppsinlägg utformas.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="secondary" className={goldCtaClass}>
                <Link to="/tjanster">Alla tjänster</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="sa-fungerar-det" className={`scroll-mt-28 bg-background ${sectionY}`}>
        <div className={sectionX}>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-5 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-6 md:text-4xl">
              Kom igång så här
            </h2>
            <ProcessSteps steps={clubSteps} compact />
          </div>
        </div>
      </section>

      <section className={`bg-muted ${sectionY}`}>
        <div className={sectionX}>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-stretch md:gap-8">
              <figure className="mx-auto w-full max-w-[16.5rem] shrink-0 overflow-hidden md:mx-0 md:w-[15.5rem] md:min-h-0 lg:w-[16.5rem]">
                <div className="h-full overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                  <img
                    src={caseloFlagga}
                    alt="Caselo Idrottsmedicin-flagga vid idrottsanläggningen i Danderyd"
                    className="h-auto w-full object-cover object-center md:h-full md:w-full"
                    width={1000}
                    height={1472}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
              <div className="min-w-0 w-full max-w-xl">
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  Partnersamarbete som passar er förening
                </h2>
                <p className="mb-3 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  Flera föreningar samarbetar redan med Caselo så att spelare får
                  rabatterade priser vid bokning. De värdesätter särskilt snabb
                  tillgång till bedömning, personlig kontakt för tränarna och en
                  tydlig vårdväg tillbaka till spel – utan merarbete för
                  föreningen.
                </p>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  Vill ni diskutera hur ett samarbete kan se ut för just er
                  förening – omfattning, kommunikation till lag och föräldrar,
                  eller hur tränarna hittar rätt – hör gärna av er.
                </p>
              </div>
            </div>
            <Partner variant="inline" />
          </div>
        </div>
      </section>

      <section className={`bg-background ${sectionY}`}>
        <div className={sectionX}>
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-stretch md:gap-8">
            <div className="min-w-0 w-full max-w-xl max-md:order-2">
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Henrik Nilsson
              </h2>
              <p className="mb-3 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                Legitimerad fysioterapeut med tio års erfarenhet av
                idrottsskador, UEFA A-utbildad fotbollstränare och assisterande
                tränare i IFK Stocksunds herrlag i Division 1.
              </p>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                Det ger föreningen en kontakt som både förstår vårdvägen och
                fotbollens krav – från bedömning och rehab till hur träningen
                kan anpassas när spelaren är på väg tillbaka.
              </p>
            </div>
            <figure className="mx-auto w-full max-w-[22rem] shrink-0 overflow-hidden max-md:order-1 md:mx-0 md:ml-auto md:w-[20rem] md:min-h-0 lg:w-[22rem]">
              <div className="h-full overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                <img
                  src={henrikFoto}
                  alt="Henrik Nilsson, legitimerad fysioterapeut och fotbollstränare, på planen vid Danderyd Arena"
                  className="h-auto w-full object-cover object-top md:h-full md:w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section id="kontakt-henrik" className={`scroll-mt-28 bg-muted ${sectionY}`}>
        <div className={`${sectionX} min-w-0`}>
          <div className="mx-auto grid w-full min-w-0 max-w-5xl gap-6 md:gap-8">
            <div className="min-w-0 overflow-x-hidden rounded-2xl border border-border/60 bg-card px-5 py-6 shadow-[var(--shadow-card)] sm:px-6 sm:py-7 md:px-8 md:py-8">
              <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Vill ni prata samarbete? Hör av er!
              </h2>

              <ul className="space-y-4 sm:space-y-5">
                <li className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent("Samarbete förening – Caselo Idrottsmedicin")}`}
                    className={contactLinkClass}
                    onClick={() => trackKontaktEpost(visitorType)}
                  >
                    henrik@<wbr />caseloidrottsmedicin.se
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <address className="not-italic text-base leading-relaxed text-foreground md:text-lg">
                      Caselo Idrottsmedicin
                      <br />
                      {ADDRESS_LINE_1} (Danderyd Arena)
                      <br />
                      {ADDRESS_LINE_2}
                    </address>
                    <a
                      href={MAPS_SEARCH_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-primary underline-offset-4 hover:underline"
                    >
                      <ExternalLink
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      Öppna i Maps
                    </a>
                  </div>
                </li>
              </ul>

              <div className="relative mt-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border/50">
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
                  className="block h-[200px] w-full max-w-full border-0 sm:h-[240px] md:h-[280px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card px-5 py-6 shadow-[var(--shadow-card)] sm:px-6 sm:py-7 md:px-8 md:py-8">
              <h2 className="mb-3 text-balance text-xl font-bold tracking-tight text-foreground md:text-2xl">
                Information till era tränare
              </h2>
              <p className="mb-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Läs mer om hur hänvisning, bedömning och återkoppling fungerar
                för tränare och ledare.
              </p>
              <Button asChild variant="secondary" className={goldCtaClass}>
                <Link to="/forening/tranare">Till lagsidan</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForeningKlubb;
