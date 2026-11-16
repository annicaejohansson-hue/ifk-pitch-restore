import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import clubFoto from "@/assets/caselo-banner-kontakt.jpg";
import teamFoto from "@/assets/forening-tranare.jpg";

const choices = [
  {
    to: "/forening/klubb",
    title: "Jag företräder en förening",
    text: "Erbjud föreningens spelare en enkel väg till bedömning och rehab med rabatterade priser, och ett personligt bollplank till era tränare.",
    mobileText:
      "Enkel väg till bedömning och rehab med rabatter, och bollplank till tränarna.",
    fits: "Ex. Klubbchef, Sportchef, Styrelse",
    image: clubFoto,
    imageAlt: "Caselo Idrottsmedicin vid Danderyd Arena",
    imageClass: "object-[72%_35%]",
  },
  {
    to: "/forening/tranare",
    title: "Jag företräder ett lag",
    text: "Få en enkel kontaktväg när en spelare i laget får ont eller skadar sig – med tydlig återkoppling till dig som tränare kring spelarens träning och nästa steg.",
    mobileText:
      "Kontaktväg och återkoppling när en spelare skadar sig.",
    fits: "Ex. Tränare, Ledare, Fysansvarig",
    image: teamFoto,
    imageAlt: "Tränare med taktikbräda på fotbollsplanen",
    imageClass: "object-[8%_42%]",
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
          content="När spelare får ont kan Caselo hjälpa till med bedömning, rehabilitering och återkoppling. För föreningsledning och lag."
        />
      </Helmet>

      <section className="container flex flex-col px-8 py-2 max-sm:min-h-[calc(100svh-5rem)] min-[375px]:py-5 sm:block sm:py-8 md:px-4 md:py-14">
        <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col max-sm:min-h-0">
          <PageIntro
            className="mb-1 shrink-0 [&_p]:mb-2 min-[375px]:mb-3 min-[375px]:[&_p]:mb-3 sm:mb-4 md:mb-8"
            eyebrow="För fotbollsföreningar"
            title={"När spelare får ont eller skadar\u00a0sig"}
          />
          <p className="mb-4 hidden max-w-3xl text-base leading-relaxed text-muted-foreground sm:mb-5 sm:block sm:text-lg md:mb-6 md:text-xl">
            Caselo hjälper föreningar och lag med bedömning, rehabilitering och
            återkoppling till tränare. Välj om du företräder föreningen eller
            ett lag.
          </p>

          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-2 items-stretch gap-1.5 min-[375px]:gap-3 sm:grid-cols-2 sm:grid-rows-none sm:gap-12 md:gap-16 lg:gap-20">
            {choices.map((choice) => (
              <Link
                key={choice.to}
                to={choice.to}
                className="group flex h-full min-h-0 min-w-0 flex-row overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[0_8px_28px_-10px_hsl(210_60%_15%/0.28)] transition-[var(--transition-smooth)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_32px_-10px_hsl(210_60%_15%/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="w-[36%] shrink-0 overflow-hidden sm:w-28 md:w-32 lg:w-40">
                  <img
                    src={choice.image}
                    alt={choice.imageAlt}
                    className={`h-full min-h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${choice.imageClass}`}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-2.5 min-[375px]:gap-1.5 min-[375px]:p-3.5 sm:gap-2 sm:p-4 md:p-5">
                  <h2 className="flex min-w-0 items-start gap-0.5 text-[0.8125rem] font-semibold leading-snug tracking-tight text-primary min-[375px]:text-sm sm:items-center sm:text-base md:text-lg lg:text-xl">
                    <span className="min-w-0 text-balance sm:whitespace-nowrap">
                      {choice.title}
                    </span>
                    <ChevronRight
                      className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0 sm:h-5 sm:w-5 md:h-6 md:w-6"
                      aria-hidden="true"
                    />
                  </h2>
                  <p className="break-words text-[0.7rem] italic leading-snug text-muted-foreground/70 min-[375px]:text-xs sm:text-sm">
                    {choice.fits}
                  </p>
                  <p className="break-words text-sm leading-snug text-muted-foreground min-[375px]:text-base min-[375px]:leading-relaxed sm:text-sm sm:leading-relaxed">
                    <span className="sm:hidden">{choice.mobileText}</span>
                    <span className="hidden sm:inline">{choice.text}</span>
                  </p>
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
