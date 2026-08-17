import { Button } from "@/components/ui/button";
import BookingLink from "@/components/BookingLink";
import type { ServiceContent } from "@/data/tjanster";

type ServiceDetailProps = {
  service: ServiceContent;
  /** Use h1 on dedicated pages; h2 when embedded */
  headingLevel?: "h1" | "h2";
  showBookingCta?: boolean;
};

const ServiceDetail = ({
  service,
  headingLevel = "h1",
  showBookingCta = true,
}: ServiceDetailProps) => {
  const Heading = headingLevel;
  const imageBlock = (
    <div className="overflow-hidden rounded-xl sm:rounded-2xl">
      <img
        src={service.image}
        alt={service.imageAlt}
        className="aspect-[16/10] h-auto w-full object-cover md:aspect-auto md:h-48"
      />
    </div>
  );

  const introBlock =
    service.intro.length === 1 ? (
      <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
        {service.intro[0]}
      </p>
    ) : (
      <div className="space-y-4">
        {service.intro.map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "text-base leading-relaxed text-foreground/90 md:text-lg"
                : "text-base leading-relaxed text-muted-foreground md:text-lg"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    );

  const renderSectionBody = (section: ServiceContent["sections"][number]) => (
    <>
      <h3 className="mb-2 text-lg font-semibold text-foreground md:text-xl">
        {section.title}
      </h3>
      {section.paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={[
            "text-base leading-relaxed text-muted-foreground md:text-lg",
            index < section.paragraphs.length - 1 ? "mb-3" : "",
          ].join(" ")}
        >
          {paragraph}
        </p>
      ))}
    </>
  );

  return (
    <article>
      <Heading className="mb-4 text-balance text-2xl font-bold tracking-tight text-primary md:mb-6 md:text-3xl">
        {service.title}
      </Heading>

      <div
        className={[
          "mb-6 flex flex-col items-stretch gap-3 sm:gap-4 md:mb-6 md:flex-row md:items-start md:gap-5",
          service.imagePosition === "right" ? "md:flex-row-reverse" : "",
        ].join(" ")}
      >
        <div className="w-full min-w-0 shrink-0 md:w-56 lg:w-72">
          {imageBlock}
        </div>
        <div className="min-w-0 flex-1">{introBlock}</div>
      </div>

      {service.numberedSections ? (
        <ol className="space-y-8">
          {service.sections.map((section) => (
            <li key={section.title}>{renderSectionBody(section)}</li>
          ))}
        </ol>
      ) : (
        <div className="space-y-8">
          {service.sections.map((section) => (
            <div key={section.title}>{renderSectionBody(section)}</div>
          ))}
        </div>
      )}

      {showBookingCta ? (
        <div className="mt-10 rounded-2xl border border-border/60 bg-card/90 px-5 py-7 text-center shadow-[var(--shadow-card)] backdrop-blur-sm sm:px-6 sm:py-8 md:mt-16 md:px-10 md:py-10">
          <h2 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
            Redo att boka?
          </h2>
          <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            På bokningssidan ser du tider, priser och kan välja den tjänst som
            passar dig.
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
      ) : null}
    </article>
  );
};

export default ServiceDetail;
