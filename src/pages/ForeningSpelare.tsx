import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BookingLink from "@/components/BookingLink";
import Partner from "@/components/Partner";
import AudienceSwitch from "@/components/forening/AudienceSwitch";
import ProcessSteps from "@/components/forening/ProcessSteps";
import henrikFoto from "@/assets/IMG_9111.jpg";
import rehabFoto from "@/assets/IMG_9118.jpg";
import heroFoto from "@/assets/forening-spelare.jpg";
import { HEEL_CUP_SERVICE_PATH } from "@/data/tjanster";

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const outlineCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const henrikFacts = [
  "Mottagning i direkt anslutning till fotbollsplan",
  "Ultraljud och stötvågsbehandling",
  "Skräddarsydda hälkoppsinlägg till barn och unga med hälsmärta",
];

const playerSteps = [
  {
    title: "Boka",
    text: "Du eller din vårdnadshavare bokar en tid.",
  },
  {
    title: "Bedömning",
    text: "Vi går igenom besvären och undersöker vad som orsakar problemen och vad du klarar av just nu.",
  },
  {
    title: "Rehabilitering",
    text: "Du får en plan för behandling, träning och successiv ökning av belastningen.",
  },
  {
    title: "Återkoppling",
    text: "Med ditt eller vårdnadshavarens samtycke kan tränaren få direkt återkoppling.",
  },
];

const ForeningSpelare = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>För spelare och föräldrar – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Ont eller skadad och vill tillbaka till fotbollen? Caselo Idrottsmedicin hjälper med bedömning, behandling och fotbollsanpassad rehabilitering."
        />
      </Helmet>

      <section className="container px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <p className="min-w-0 text-sm font-medium text-primary sm:pt-1.5 sm:text-base">
              För spelare och föräldrar
            </p>
            <AudienceSwitch
              to="/forening/tranare"
              label="Är du tränare eller ledare? →"
            />
          </div>
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
            <div className="min-w-0">
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-5 md:text-5xl">
                Ont eller skadad och vill tillbaka till fotbollen?
              </h1>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                På Caselo Idrottsmedicin får du hjälp med bedömning, behandling och
                rehabilitering anpassad efter fotbollens krav – från första
                undersökning till återgång i träning och match.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild variant="secondary" className={goldCtaClass}>
                  <BookingLink aria-label="Gå till bokningssidan">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    Boka tid
                  </BookingLink>
                </Button>
                <Button asChild variant="outline" className={outlineCtaClass}>
                  <a href="#sa-fungerar-det">Så fungerar det</a>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <div className="aspect-[4/3] w-full bg-muted sm:aspect-[717/557]">
                <img
                  src={heroFoto}
                  alt="Fotbollsspelare med bollen på planen"
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

      <section
        id="sa-fungerar-det"
        className="scroll-mt-28 bg-muted py-12 md:py-20"
      >
        <div className="container px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-10 md:text-4xl">
              Från första bedömning till tillbaka på planen
            </h2>
            <ProcessSteps steps={playerSteps} />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="min-w-0">
              <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Rehabilitering som tar dig hela vägen tillbaka till fotbollen
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Caselo Idrottsmedicin har sin mottagning i direkt anslutning
                till Danderyd Arena. Därför kan rehaben successivt flyttas ut
                på planen och innehålla moment som löpning, accelerationer,
                riktningsförändringar, bollmoment och andra
                fotbollsspecifika belastningar.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <img
                src={rehabFoto}
                alt="Rehabilitering på fotbollsplanen hos Caselo Idrottsmedicin"
                className="h-auto w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-20">
        <div className="container px-4">
          <Card className="mx-auto max-w-5xl border-border/50 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6 md:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row md:gap-8">
              <figure className="mx-auto w-full max-w-[200px] shrink-0 sm:mx-0 sm:max-w-[220px] md:max-w-[240px]">
                <div className="overflow-hidden rounded-xl shadow-[var(--shadow-card)]">
                  <img
                    src={henrikFoto}
                    alt="Henrik Nilsson, legitimerad fysioterapeut och fotbollstränare"
                    className="h-auto w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="mt-2 text-center text-sm text-muted-foreground sm:text-left">
                  Henrik Nilsson, leg. fysioterapeut
                </figcaption>
              </figure>
              <div className="min-w-0 flex-1">
                <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  Fysioterapeut och fotbollstränare
                </h2>
                <p className="mb-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Henrik Nilsson är legitimerad fysioterapeut med 10 års
                  erfarenhet av idrottsskador, UEFA A-utbildad och assisterande
                  tränare i IFK Stocksunds herrlag i Division 1.
                </p>
                <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Tränarperspektivet finns med i allt han gör. Det gör det
                  möjligt att kombinera den medicinska bedömningen med
                  förståelse för vilka krav som väntar när du ska tillbaka till
                  träning och match.
                </p>
                <ul className="space-y-3">
                  {henrikFacts.map((item) => (
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
                  Läs mer om{" "}
                  <Link
                    to={HEEL_CUP_SERVICE_PATH}
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    hälkoppsinlägg för barn med hälsmärta
                  </Link>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="boka" className="scroll-mt-28 py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card px-5 py-7 shadow-[var(--shadow-card)] sm:px-6 sm:py-8 md:px-10 md:py-10">
            <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-8 md:text-4xl">
              Boka tid
            </h2>
            <ul className="space-y-5 sm:space-y-6">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <address className="not-italic text-base leading-relaxed text-foreground md:text-lg">
                  Caselo Idrottsmedicin
                  <br />
                  Danderyd Arena
                </address>
              </li>
              <li className="flex items-start gap-3">
                <Globe
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <a
                  href="https://www.caseloidrottsmedicin.se/"
                  className="break-all text-base text-foreground underline-offset-4 hover:underline md:text-lg"
                >
                  www.caseloidrottsmedicin.se
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <Button asChild variant="secondary" className={goldCtaClass}>
                <BookingLink aria-label="Gå till bokningssidan">
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

export default ForeningSpelare;
