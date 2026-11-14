import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import Partner from "@/components/Partner";
import PageIntro from "@/components/PageIntro";
import { Button } from "@/components/ui/button";
import {
  offerContainerClass,
  offerGoldCtaClass,
  offerH2Class,
  offerLeadClass,
  offerNarrowClass,
  offerSectionClass,
} from "@/components/erbjudanden/offerUi";
import {
  OFFER_BOOKABLE_HOURS,
  OFFER_CONTACT_EMAIL,
  OFFER_PATHS,
  OFFER_PLACE,
  type OfferBookingTypeId,
} from "@/data/erbjudanden";
import {
  isHttpUrl,
  isKaddioEmbedUrl,
  OFFER_BOOKING_CARDS,
} from "@/lib/erbjudanden/publicConfig";
import { SITE_ORIGIN } from "@/lib/booking";

const PAGE_PATH = OFFER_PATHS.boka;
const PAGE_URL = `${SITE_ORIGIN}${PAGE_PATH}`;

const isBookingType = (value: string | null): value is OfferBookingTypeId =>
  value === "snabbhet-forsta" ||
  value === "snabbhet-atertest" ||
  value === "friskvard";

const BokaErbjudande = () => {
  const [searchParams] = useSearchParams();
  const selected = isBookingType(searchParams.get("typ"))
    ? searchParams.get("typ")
    : null;

  useEffect(() => {
    if (!selected) return;
    const node = document.getElementById(selected);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  return (
    <main className="min-h-[calc(100vh-7rem)]">
      <Helmet>
        <title>Boka erbjudande – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Boka första snabbhetsbesöket, återtest eller personlig träning på Danderyd Arena."
        />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <section className={`bg-gradient-to-b from-muted/40 to-background ${offerSectionClass}`}>
        <div className={offerContainerClass}>
          <div className={`${offerNarrowClass} max-w-3xl`}>
            <PageIntro
              eyebrow="Erbjudanden"
              title="Boka din tid"
            >
              Välj den tid som hör till ditt paket. Mottagningen ligger på{" "}
              {OFFER_PLACE}. Bokningsbara tider är {OFFER_BOOKABLE_HOURS}.
            </PageIntro>
          </div>
        </div>
      </section>

      <section className={`bg-background ${offerSectionClass}`}>
        <div className={offerContainerClass}>
          <div className={offerNarrowClass}>
            <h2 className={offerH2Class}>Välj bokning</h2>
            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {OFFER_BOOKING_CARDS.map((item) => {
                const highlighted = selected === item.id;
                const url = item.url;
                const canEmbed = isKaddioEmbedUrl(url);
                const canLink = isHttpUrl(url);

                return (
                  <article
                    key={item.id}
                    id={item.id}
                    className={`scroll-mt-28 flex min-w-0 flex-col rounded-2xl border p-5 sm:p-6 ${
                      highlighted
                        ? "border-primary bg-accent/60 shadow-[var(--shadow-card)]"
                        : "border-border/60 bg-card"
                    }`}
                  >
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-primary">
                      {item.duration}
                    </p>
                    <p className={`${offerLeadClass} mb-5 flex-1`}>{item.description}</p>
                    {canLink ? (
                      <Button asChild variant="secondary" className={offerGoldCtaClass}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Boka tid
                        </a>
                      </Button>
                    ) : (
                      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        Bokningslänken för den här tiden läggs in inom kort.
                        Mejla{" "}
                        <a
                          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                          href={`mailto:${OFFER_CONTACT_EMAIL}?subject=${encodeURIComponent(`Boka ${item.title}`)}`}
                        >
                          {OFFER_CONTACT_EMAIL}
                        </a>{" "}
                        så hjälper vi dig att boka.
                      </p>
                    )}
                    {canEmbed ? (
                      <div className="mt-5 overflow-hidden rounded-xl border border-border/60">
                        <iframe
                          title={`Boka ${item.title}`}
                          src={url}
                          className="h-[32rem] w-full bg-background"
                        />
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
            <p className={`${offerLeadClass} mt-10 max-w-3xl`}>
              Har du inte köpt ännu? Läs mer om{" "}
              <Link
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                to={`${OFFER_PATHS.friskvard}#snabbhet`}
              >
                snabbhetspaketet
              </Link>{" "}
              och{" "}
              <Link
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                to={OFFER_PATHS.friskvard}
              >
                friskvårdserbjudandet
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default BokaErbjudande;
