const quotes = [
  "Hos Henrik har vi fått tid fort, professionellt bemötande, prisvärd produkt och hälkoppsinläggen får min son med sig direkt som är helt anpassade efter hans fötter. Andra gången vi går hit! Och inget mer ont i hälarna.",
  "Jag hade en stukning i fotleden och ville få hjälp tillbaka till träningen. Jag träffade Henrik som var extremt professionell, tålmodig och tog sig tid att förklara allt. Riktigt bra erfarenhet - han undersökte min fot noggrant, var engagerad och intresserad. Jag skulle definitivt återvända.",
  "Min son har haft hälkoppsinlägg för Severs skada i tio månader nu och det har funkat utmärkt. Han märkte direkt skillnad när vi lämnade mottagningen.",
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
                  className="block h-9 overflow-hidden select-none font-serif text-8xl leading-none text-primary/25 sm:h-8 sm:text-7xl"
                >
                  “
                </span>
                <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground md:text-base">
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
