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
    mobileText:
      "Kontaktväg och återkoppling när en spelare skadar sig.",
    cta: "För tränare och ledare",
    image: coachFoto,
    imageAlt: "Tränare med taktikbräda på fotbollsplanen",
    imageClass: "object-[8%_42%]",
  },
  {
    to: "/forening/spelare",
    title: "Jag är spelare eller förälder",
    text: "Få hjälp med bedömning, behandling och fotbollsanpassad rehabilitering tillbaka till träning och match – från första undersökning till nästa steg på planen.",
    mobileText: "Bedömning och rehab tillbaka till träning och match.",
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
          content="När en spelare i laget får ont kan Caselo hjälpa till med bedömning, rehabilitering och återkoppling till tränaren. För tränare, spelare och föräldrar."
        />
      </Helmet>

      <section className="container flex flex-col px-8 py-2 max-sm:min-h-[calc(100svh-5rem)] min-[375px]:py-5 sm:block sm:py-8 md:px-4 md:py-14">
        <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col max-sm:min-h-0">
          <PageIntro
            className="mb-1 shrink-0 [&_p]:mb-2 min-[375px]:mb-3 min-[375px]:[&_p]:mb-3 sm:mb-4 md:mb-8"
            eyebrow="För fotbollsföreningar"
            title={"När en spelare i laget får ont eller skadar\u00a0sig"}
          />
          <p className="mb-4 hidden max-w-3xl text-base leading-relaxed text-muted-foreground sm:mb-5 sm:block sm:text-lg md:mb-6 md:text-xl">
            Caselo kan hjälpa till med bedömning, rehabilitering och
            återkoppling till tränaren. Välj om du är tränare/ledare, eller
            spelare/förälder.
          </p>

          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-2 items-stretch gap-1.5 min-[375px]:gap-3 sm:grid-cols-2 sm:grid-rows-none sm:gap-4 md:gap-5">
            {choices.map((choice) => (
              <Link
                key={choice.to}
                to={choice.to}
                className="group flex h-full min-h-0 min-w-0 flex-row overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[0_8px_28px_-10px_hsl(210_60%_15%/0.28)] transition-[var(--transition-smooth)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_32px_-10px_hsl(210_60%_15%/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="w-[42%] shrink-0 overflow-hidden sm:w-32 md:w-36 lg:w-44">
                  <img
                    src={choice.image}
                    alt={choice.imageAlt}
                    className={`h-full min-h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${choice.imageClass}`}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-2.5 min-[375px]:gap-2 min-[375px]:p-3.5 sm:gap-0 sm:p-4 md:p-5">
                  <h2 className="flex items-start gap-1 break-words text-base font-semibold leading-snug tracking-tight text-primary min-[375px]:text-xl sm:mb-2 sm:text-lg md:text-xl">
                    <span className="min-w-0">{choice.title}</span>
                    <ChevronRight
                      className="mt-0.5 h-5 w-5 shrink-0 sm:hidden"
                      aria-hidden="true"
                    />
                  </h2>
                  <p className="break-words text-sm leading-snug text-muted-foreground min-[375px]:text-base min-[375px]:leading-relaxed sm:mb-4 sm:text-sm sm:leading-relaxed">
                    <span className="sm:hidden">{choice.mobileText}</span>
                    <span className="hidden sm:inline">{choice.text}</span>
                  </p>
                  <span className="mt-3 hidden min-h-11 w-[min(100%,14.25rem)] max-w-full items-center justify-center gap-1 self-start whitespace-normal rounded-md bg-secondary px-3.5 py-2.5 text-center text-sm font-medium leading-snug text-secondary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] group-hover:bg-[hsl(var(--secondary-hover))] group-hover:shadow-[var(--shadow-hover)] sm:inline-flex">
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
