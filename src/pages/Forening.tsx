import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import coachFoto from "@/assets/forening-tranare.jpg";
import playerFoto from "@/assets/forening-spelare.jpg";

const choices = [
  {
    to: "/forening/tranare",
    title: "Jag är tränare eller ledare",
    text: "Få en enkel kontaktväg när en spelare i laget får ont eller skadar sig – med tydlig återkoppling till dig som tränare kring spelarens träning och nästa steg.",
    cta: "För tränare och ledare",
    image: coachFoto,
    imageAlt: "Tränare med taktikbräda på fotbollsplanen",
    imageClass: "object-[8%_42%]",
  },
  {
    to: "/forening/spelare",
    title: "Jag är spelare eller förälder",
    text: "Få hjälp med bedömning, behandling och fotbollsanpassad rehabilitering tillbaka till träning och match.",
    cta: "För spelare och föräldrar",
    image: playerFoto,
    imageAlt: "Fotbollsspelare med bollen på planen",
    imageClass: "object-[58%_72%]",
  },
] as const;

const Forening = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>För fotbollsföreningar – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="När en spelare i laget får ont kan Caselo hjälpa till med bedömning, rehabilitering och återkoppling till träningen. För tränare, spelare och föräldrar."
        />
      </Helmet>

      <section className="container px-4 py-8 md:py-14">
        <div className="mx-auto w-full max-w-5xl">
          <PageIntro
            className="mb-6 md:mb-8"
            eyebrow="För fotbollsföreningar"
            title="När en spelare i laget får ont"
          >
            Caselo kan hjälpa till med bedömning, rehabilitering och
            återkoppling till träningen. Välj om du är tränare/ledare, eller
            spelare/förälder.
          </PageIntro>

          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5">
            {choices.map((choice) => (
              <Link
                key={choice.to}
                to={choice.to}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[0_8px_28px_-10px_hsl(210_60%_15%/0.28)] transition-[var(--transition-smooth)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_32px_-10px_hsl(210_60%_15%/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row"
              >
                <div className="aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-32 md:w-36 lg:w-44">
                  <img
                    src={choice.image}
                    alt={choice.imageAlt}
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:min-h-full ${choice.imageClass}`}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-4 md:p-5">
                  <h2 className="mb-2 text-lg font-semibold leading-snug tracking-tight text-primary sm:text-xl">
                    {choice.title}
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {choice.text}
                  </p>
                  <span className="inline-flex min-h-11 w-[min(100%,14.25rem)] items-center justify-center gap-1 self-start rounded-md bg-secondary px-3.5 py-2.5 text-center text-sm font-medium leading-snug text-secondary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] group-hover:bg-[hsl(var(--secondary-hover))] group-hover:shadow-[var(--shadow-hover)]">
                    {choice.cta}
                    <ChevronRight
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Forening;
