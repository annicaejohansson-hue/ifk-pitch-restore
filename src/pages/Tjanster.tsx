import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/BookingLink";
import Partner from "@/components/Partner";
import { services } from "@/data/tjanster";

const Tjanster = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>Tjänster – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Smärta och skador, skräddarsydda hälkoppsinlägg samt test och träning för ökad fysisk prestation hos Caselo Idrottsmedicin."
        />
      </Helmet>

      <section className="container px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 max-w-3xl md:mb-14">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:mb-5 md:text-5xl">
              Tjänster
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Hos Caselo Idrottsmedicin får du evidensbaserad bedömning, behandling
              och träning anpassad efter dig – oavsett om målet är att bli av med
              smärta, återgå till idrott eller utveckla din fysiska kapacitet.
            </p>
          </header>

          <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={service.path}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-[var(--shadow-card)] backdrop-blur-sm transition-[var(--transition-smooth)] hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="aspect-[4/3] w-full shrink-0 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 text-left sm:p-6 md:p-7">
                  <h2 className="mb-3 text-xl font-bold tracking-tight text-primary md:text-2xl">
                    {service.title}
                  </h2>
                  <p className="mb-4 flex-1 text-base leading-relaxed text-muted-foreground">
                    {service.overviewBlurb}
                  </p>
                  <span className="mt-auto text-sm font-medium text-primary transition-colors group-hover:underline md:text-base">
                    Läs mer
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border/60 bg-card/90 px-5 py-7 text-left shadow-[var(--shadow-card)] backdrop-blur-sm sm:px-6 sm:py-8 md:mt-10 md:px-10 md:py-10">
            <h2 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
              Redo att boka?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              På bokningssidan ser du tider, priser och kan välja den tjänst
              som passar dig.
            </p>
            <Button
              asChild
              variant="secondary"
              className="h-11 w-full max-w-xs px-6 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:h-12 sm:w-auto sm:px-8 sm:text-lg"
              aria-label="Gå till bokningssidan"
            >
              <BookingLink>Boka tid</BookingLink>
            </Button>
          </div>
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default Tjanster;
