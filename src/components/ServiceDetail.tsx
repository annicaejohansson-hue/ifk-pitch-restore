import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/BookingLink";
import PageIntro from "@/components/PageIntro";
import type { ServiceContent } from "@/data/tjanster";

type ServiceDetailProps = {
  service: ServiceContent;
  showBookingCta?: boolean;
};

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const ServiceDetail = ({
  service,
  showBookingCta = true,
}: ServiceDetailProps) => {
  const intro = service.intro[0];

  const renderSectionBody = (section: ServiceContent["sections"][number]) => (
    <>
      <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">
        {section.title}
      </h2>
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
      <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
        <div className="min-w-0">
          <PageIntro
            className="mb-5 md:mb-6"
            eyebrow="Tjänster"
            eyebrowHref="/tjanster"
            title={service.title}
          >
            {intro}
          </PageIntro>
          {showBookingCta ? (
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild variant="secondary" className={goldCtaClass}>
                <BookingLink aria-label="Boka tid">
                  <Calendar
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  />
                  Boka tid
                </BookingLink>
              </Button>
            </div>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
          <div className="aspect-[4/3] w-full bg-muted sm:aspect-[717/557]">
            <img
              src={service.image}
              alt={service.imageAlt}
              className="h-full w-full object-cover"
              width={717}
              height={557}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {service.sections.length > 0 ? (
        service.numberedSections ? (
          <ol className="mt-10 space-y-8 md:mt-16">
            {service.sections.map((section) => (
              <li key={section.title}>{renderSectionBody(section)}</li>
            ))}
          </ol>
        ) : (
          <div className="mt-10 space-y-8 md:mt-16">
            {service.sections.map((section) => (
              <div key={section.title}>{renderSectionBody(section)}</div>
            ))}
          </div>
        )
      ) : null}

      {showBookingCta ? (
        <div className="mt-10 rounded-2xl border border-border/60 bg-card/90 px-5 py-7 text-center shadow-[var(--shadow-card)] backdrop-blur-sm sm:px-6 sm:py-8 md:mt-16 md:px-10 md:py-10">
          <h2 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
            Vill du boka tid?
          </h2>
          <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            På bokningssidan ser du tider, priser och kan välja den tjänst som
            passar dig.
          </p>
          <Button
            asChild
            variant="secondary"
            className="mx-auto h-11 w-full max-w-xs px-6 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:h-12 sm:w-auto sm:px-8 sm:text-lg"
            aria-label="Gå till bokningssidan"
          >
            <BookingLink aria-label="Gå till bokningssidan">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Boka tid
            </BookingLink>
          </Button>
        </div>
      ) : null}
    </article>
  );
};

export default ServiceDetail;
