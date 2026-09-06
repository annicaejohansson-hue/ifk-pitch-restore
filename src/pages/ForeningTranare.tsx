import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BookingLink from "@/components/BookingLink";
import Partner from "@/components/Partner";
import AudienceSwitch from "@/components/forening/AudienceSwitch";
import ProcessSteps from "@/components/forening/ProcessSteps";
import CoachInterestButton from "@/components/forening/CoachInterestButton";
import henrikFoto from "@/assets/IMG_9111.jpg";
import heroFoto from "@/assets/forening-tranare.jpg";
import trainingFoto from "@/assets/comeback-training.jpg";
import { HEEL_CUP_SERVICE_PATH } from "@/data/tjanster";

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const outlineCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const coachSteps = [
  {
    title: "Kontakt",
    text: "När en spelare får ont eller skadar sig kan du som tränare hänvisa spelaren eller vårdnadshavaren till Caselo.",
  },
  {
    title: "Bokning",
    text: "Spelaren eller vårdnadshavaren bokar själv en tid.",
  },
  {
    title: "Bedömning och rehabilitering",
    text: "Henrik bedömer besvären, behandlar och planerar vägen tillbaka till fotbollen.",
  },
  {
    title: "Återkoppling",
    text: "Med spelarens eller vårdnadshavarens samtycke kan tränaren få tydlig återkoppling kring vad spelaren kan delta i, vad som bör anpassas och vad nästa steg är.",
  },
];

const henrikFacts = [
  "Mottagning i direkt anslutning till fotbollsplan",
  "Ultraljud och stötvågsbehandling",
  "Skräddarsydda hälkoppsinlägg till barn och unga med hälsmärta",
];

const trainingHelp = [
  "Om spelaren kan delta i träningen",
  "Vilka moment som bör undvikas eller anpassas",
  "Vad spelaren kan göra istället",
  "När belastningen kan ökas",
  "När spelaren närmar sig full träning och match",
];

const ForeningTranare = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>För tränare och ledare – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="En enkel kontaktväg när en spelare får ont eller skadar sig. Caselo Idrottsmedicin ger bedömning, rehabilitering och återkoppling till träningen."
        />
      </Helmet>

      <section className="container px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <p className="min-w-0 text-sm font-medium text-primary sm:pt-1.5 sm:text-base">
              För tränare och ledare
            </p>
            <AudienceSwitch
              to="/forening/spelare"
              label="Är du spelare eller förälder? →"
            />
          </div>
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
            <div className="min-w-0">
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-5 md:text-5xl">
                En kontaktväg när en spelare får ont eller skadar sig
              </h1>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                När en spelare får ont uppstår snabbt praktiska frågor: Vad kan
                spelaren vara med på? Vad bör undvikas? Och när är det dags att ta
                nästa steg? Caselo Idrottsmedicin kan vara ett stöd från första
                bedömning till återgång i träning och match.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CoachInterestButton />
                <Button asChild variant="outline" className={outlineCtaClass}>
                  <a href="#sa-fungerar-det">Så fungerar det</a>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <div className="aspect-[4/3] w-full bg-muted sm:aspect-[717/557]">
                <img
                  src={heroFoto}
                  alt="Tränare med taktikbräda på fotbollsplanen"
                  className="h-full w-full object-cover object-[8%_42%]"
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
              Så fungerar det
            </h2>
            <ProcessSteps steps={coachSteps} />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="min-w-0">
              <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Tydligare beslut kring spelarens träning
              </h2>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground md:mb-8 md:text-lg">
                Du behöver inte själv göra en medicinsk bedömning av skadan. Efter
                undersökningen kan Caselo hjälpa till att omsätta rehabiliteringen
                till konkreta råd för fotbollsträningen.
              </p>
              <ul className="space-y-3">
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
            <figure className="min-w-0">
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                <img
                  src={trainingFoto}
                  alt="Tränare och barn på fotbollsplanen under träning. Bilden är illustrativ och föreställer inte patienter hos Caselo."
                  className="h-auto w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-2 text-xs leading-relaxed text-foreground/20">
                Foto: W.carter / Wikimedia Commons. Illustrativ bild, inte
                patienter hos Caselo.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-20">
        <div className="container px-4">
          <Card className="mx-auto max-w-5xl border-border/50 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6 md:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row md:gap-8">
              <figure className="mx-auto w-full max-w-[200px] shrink-0 sm:mx-0 sm:max-w-[220px] md:max-w-[260px]">
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
                  Fysioterapi med fotbollen som utgångspunkt
                </h2>
                <p className="mb-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Henrik Nilsson är legitimerad fysioterapeut med 10 års
                  erfarenhet av idrottsskador, UEFA A-utbildad fotbollstränare
                  och assisterande tränare i IFK Stocksunds herrlag i Division
                  1.
                </p>
                <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Tränarperspektivet finns med i allt han gör. Rehabiliteringen
                  utgår därför inte bara från skadan, utan också från vad
                  spelaren faktiskt behöver kunna göra på planen – springa,
                  accelerera, bromsa, byta riktning, passa, skjuta och
                  successivt återgå till lagträning och match.
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

      <section className="py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-secondary/50 bg-secondary/30 px-5 py-7 sm:px-6 sm:py-8 md:px-10 md:py-10">
            <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Ingen kostnad eller något åtagande för föreningen
            </h2>
            <p className="mb-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Föreningen behöver inte teckna något avtal eller stå för någon
              kostnad. Spelaren eller vårdnadshavaren bokar och betalar sitt
              besök direkt hos Caselo Idrottsmedicin.
            </p>
            <p className="max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
              Tränaren får samtidigt en enkel kontaktväg att använda när behov
              uppstår.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card px-5 py-7 text-center shadow-[var(--shadow-card)] sm:px-6 sm:py-8 md:px-10 md:py-10">
            <h2 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
              Ha länken nära till hands när någon i laget får ont
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Spara sidan eller skicka den direkt till spelaren eller
              vårdnadshavaren.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="secondary" className={goldCtaClass}>
                <Link to="/forening/spelare">
                  Till sidan för spelare och föräldrar
                </Link>
              </Button>
              <Button asChild variant="outline" className={outlineCtaClass}>
                <BookingLink aria-label="Gå till bokningssidan">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
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

export default ForeningTranare;
