import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Partner from "@/components/Partner";
import PageIntro from "@/components/PageIntro";
import ProcessSteps from "@/components/forening/ProcessSteps";
import SharePlayerLink from "@/components/forening/SharePlayerLink";
import henrikFoto from "@/assets/IMG_9111-guidance.jpg";
import rehabFoto from "@/assets/IMG_9118.jpg";
import { useVisitor } from "@/context/VisitorContext";
import { trackKontaktEpost } from "@/lib/analytics";

const ADDRESS_LINE_1 = "Rinkebyvägen 4";
const ADDRESS_LINE_2 = "182 36 Danderyd";
const FULL_ADDRESS = `${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`;
const EMAIL = "henrik@caseloidrottsmedicin.se";
const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(FULL_ADDRESS)}&z=15&output=embed`;

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const contactLinkClass =
  "break-words text-base text-foreground underline-offset-4 hover:underline md:text-lg";

const sectionY = "py-8 md:py-12";
const sectionX = "container px-8 md:px-4";

const coachSteps = [
  {
    title: "Hänvisa spelaren",
    text: "Tipsa spelaren eller vårdnadshavaren om Caselo. De bokar och betalar själva – ingen kostnad för laget eller föreningen, och inget avtal krävs. Mottagning på Danderyd Arena.",
  },
  {
    title: "Bedömning och rehab",
    text: "Henrik bedömer besvären och tar fram en plan för rehab och återgång till fotbollen – anpassad efter vad spelaren behöver kunna på planen.",
  },
  {
    title: "Återkoppling till tränare",
    text: "Med spelarens eller vårdnadshavarens samtycke ger Henrik dig som tränare tydliga råd om hur spelaren kan delta i och stegra sin träning, och tryggt återgå till match.",
  },
];

const trainingHelp = [
  "Om spelaren kan delta i träningen",
  "Vilka moment som bör undvikas eller anpassas",
  "Vad spelaren kan göra istället",
  "När belastningen kan ökas",
  "När spelaren närmar sig full träning och match",
];

const ForeningTranare = () => {
  const { visitorType } = useVisitor();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>För tränare och ledare – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="När en spelare skadas: kan hen träna, hur anpassas träningen, när är match okej? Hänvisa till leg. fysioterapeut Henrik Nilsson på Caselo Idrottsmedicin."
        />
      </Helmet>

      <section className={`${sectionX} pt-6 pb-8 md:pt-8 md:pb-10`}>
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="grid min-w-0 items-start gap-5 md:grid-cols-2 md:gap-10">
            <div className="contents min-w-0 md:flex md:flex-col">
              <PageIntro
                className="min-w-0 max-md:order-1"
                eyebrow="För tränare och ledare"
                title="En kontaktväg när en spelare får ont eller skadar sig"
                mobileTitle={"En kontaktväg när en spelare skadar\u00a0sig"}
              >
                <p>
                  När en spelare skadar sig kan det vara svårt för tränaren att
                  veta: Kan spelaren träna? Hur bör träningen anpassas? När är
                  det okej att spela match igen?
                </p>
                <p>
                  Hänvisa spelaren till leg. fysioterapeut Henrik Nilsson för
                  bedömning och rehabilitering – och få som tränare vägledning
                  kring återgången till träning och match.
                </p>
              </PageIntro>

              <a
                href="#sa-fungerar-det"
                className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-primary sm:text-lg max-md:order-2 md:mt-6"
              >
                Så fungerar det
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
              <figcaption className="mt-2.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                Henrik Nilsson – legitimerad fysioterapeut och UEFA A-utbildad
                fotbollstränare.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="sa-fungerar-det" className={`scroll-mt-28 bg-muted ${sectionY}`}>
        <div className={sectionX}>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-5 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-6 md:text-4xl">
              Så fungerar det
            </h2>
            <ProcessSteps steps={coachSteps} compact />
          </div>
        </div>
      </section>

      <section className={sectionY}>
        <div className={sectionX}>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Fysioterapi med fotbollen som utgångspunkt
            </h2>
            <p className="mb-3 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Henrik Nilsson är legitimerad fysioterapeut med 10 års erfarenhet
              av idrottsskador, UEFA A-utbildad fotbollstränare och assisterande
              tränare i IFK Stocksunds herrlag i Division 1.
            </p>
            <p className="mb-3 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Mottagningen ligger 25 meter från en fullstor fotbollsplan, vilket
              gör att bedömning och rehab kan ske i den miljö spelaren ska tillbaka
              till. Rehabiliteringen utgår från vad spelaren behöver kunna på
              planen, med realistisk testning inför återgång till träning och
              match – maxlöpningar, inlägg och skott.
            </p>
            <p className="mb-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Acceleration och snabbhet mäts på löparbanan med laserportar, och
              styrkan följs upp med dynamometer. Vid behov används ultraljud i
              diagnostiken och stötvågsbehandling. För hälsmärta som drabbar
              många unga fotbollsspelare som växer tillverkas hälkoppsinlägg
              individuellt.
            </p>
            <div className="mt-5">
              <Button asChild variant="secondary" className={goldCtaClass}>
                <Link to="/tjanster">Läs mer om tjänsterna</Link>
              </Button>
            </div>
            <Partner variant="inline" />
          </div>
        </div>
      </section>

      <section className={`bg-muted ${sectionY}`}>
        <div className={sectionX}>
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-stretch md:gap-8">
            <figure className="mx-auto w-full max-w-[16.5rem] shrink-0 overflow-hidden md:mx-0 md:w-[15.5rem] md:min-h-0 lg:w-[16.5rem]">
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
            <div className="min-w-0 w-full max-w-xl">
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Tydlig vägledning kring spelarens återgång till spel
              </h2>
              <p className="mb-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                Efter bedömning, och med spelarens eller vårdnadshavarens
                samtycke, får du som tränare konkret vägledning:
              </p>
              <ul className="space-y-2.5">
                {trainingHelp.map((item) => (
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
            </div>
          </div>
        </div>
      </section>

      <section id="kontakt-henrik" className={`scroll-mt-28 ${sectionY}`}>
        <div className={`${sectionX} min-w-0`}>
          <div className="mx-auto grid w-full min-w-0 max-w-5xl gap-6 md:gap-8">
            <div className="min-w-0 overflow-x-hidden rounded-2xl border border-border/60 bg-card px-5 py-6 shadow-[var(--shadow-card)] sm:px-6 sm:py-7 md:px-8 md:py-8">
              <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Har du frågor? Hör gärna av dig!
              </h2>

              <ul className="space-y-4 sm:space-y-5">
                <li className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${EMAIL}`}
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
                Länk för spelare och föräldrar
              </h2>
              <p className="mb-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Kopiera länken till sidan för spelare och föräldrar. Där bokar de
                själva tiden för besöket.
              </p>
              <SharePlayerLink />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForeningTranare;
