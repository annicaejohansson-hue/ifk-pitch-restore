const quotes = [
  "Jag hade en stukning i fotleden och ville få hjälp tillbaka till träningen. Jag träffade Henrik som var extremt professionell, tålmodig och tog sig tid att förklara allt. Riktigt bra erfarenhet - han undersökte min fot noggrant, var engagerad och intresserad. Jag skulle definitivt återvända.",
  "Fantastiskt grundlig undersökning och bra vägledning - tack Henrik!",
  "Min son har haft hälkoppar för Severs skada i tio månader nu och det har funkat utmärkt. Han märkte direkt skillnad när vi lämnade mottagningen.",
];

const Testimonial = () => {
  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-20 md:py-28">
      <div className="container px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-left text-balance text-3xl font-bold tracking-tight text-primary sm:mb-8 md:mb-10 md:text-5xl">
            Vad patienter säger
          </h2>
          <div className="grid grid-cols-1 items-stretch gap-12 md:grid-cols-3 md:gap-16">
            {quotes.map((quote) => (
              <blockquote
                key={quote}
                className="flex h-full min-w-0 flex-col"
              >
                <span
                  aria-hidden="true"
                  className="mb-0 block select-none font-serif text-8xl leading-none text-primary/25 sm:mb-5 sm:text-7xl"
                >
                  “
                </span>
                <p className="-mt-12 break-words text-sm leading-relaxed text-muted-foreground sm:mt-0 md:text-base">
                  {quote}
                </p>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
