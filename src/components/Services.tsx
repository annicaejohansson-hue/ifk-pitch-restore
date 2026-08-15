import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { services } from "@/data/tjanster";

const Services = () => {
  return (
    <section className="bg-gradient-to-b from-background via-muted/30 to-background pb-0 pt-12 sm:pt-16 md:pt-20">
      <div className="container px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-16">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:mb-6 md:text-5xl">
            Trygg återgång och starkare prestation
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Caselo Idrottsmedicin erbjuder professionell idrottsfysioterapi för satsande idrottare.{" "}
            <br className="hidden sm:inline" />
            Oavsett sport – vi hjälper dig nå dina mål.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={service.path}
              className="group block cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Läs mer om ${service.cardTitle}`}
            >
              <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-[var(--transition-smooth)] group-hover:shadow-[var(--shadow-card)] group-hover:border-primary/30">
                <div className="relative aspect-[4/3] overflow-hidden sm:h-64 sm:aspect-auto">
                  <img
                    src={service.image}
                    alt={service.cardTitle}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary sm:mb-3 sm:text-xl">
                    {service.cardTitle}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.cardDescription}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
