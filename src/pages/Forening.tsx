import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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

const longestCta = choices.reduce(
  (longest, choice) => (choice.cta.length > longest.length ? choice.cta : longest),
  "",
);

const Forening = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-7rem)] flex-col bg-[#0e1627]">
      <Helmet>
        <title>Förening – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Caselo Idrottsmedicin hjälper fotbollsspelare med bedömning, behandling och rehabilitering – och kan vara ett stöd för tränare när en spelare får ont."
        />
      </Helmet>

      <section className="container flex flex-1 flex-col px-4 py-8 md:py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
          <div className="mt-8 flex flex-1 flex-col justify-center pb-6 md:mt-2 md:pb-20">
            <div className="mb-8 md:mb-10">
              <h1 className="text-2xl font-light tracking-wide text-primary-foreground sm:text-3xl md:text-4xl">
                Rätt stöd från skada till spel
              </h1>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-12">
              {choices.map((choice) => (
                <Link
                  key={choice.to}
                  to={choice.to}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-card shadow-[var(--shadow-card)] transition-[var(--transition-smooth)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex-row"
                >
                  <div className="aspect-[16/9] w-full shrink-0 overflow-hidden md:aspect-auto md:w-40 lg:w-48">
                    <img
                      src={choice.image}
                      alt={choice.imageAlt}
                      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] md:min-h-full ${choice.imageClass}`}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                    <h3 className="mb-2 text-lg font-normal leading-snug tracking-wide text-primary sm:text-xl">
                      {choice.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {choice.text}
                    </p>
                    <span className="mt-auto inline-grid w-max max-w-full justify-items-stretch">
                      <span
                        className="invisible col-start-1 row-start-1 inline-flex min-h-11 items-center gap-1 whitespace-nowrap px-4 py-2 text-sm font-medium sm:text-base"
                        aria-hidden="true"
                      >
                        {longestCta}
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      </span>
                      <span className="col-start-1 row-start-1 inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] group-hover:bg-[hsl(var(--secondary-hover))] group-hover:shadow-[var(--shadow-hover)] sm:text-base">
                        {choice.cta}
                        <ChevronRight
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Forening;
