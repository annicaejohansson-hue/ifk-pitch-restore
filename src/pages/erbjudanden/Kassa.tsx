import { Helmet } from "react-helmet";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Partner from "@/components/Partner";
import PageIntro from "@/components/PageIntro";
import OfferOrderForm from "@/components/erbjudanden/OfferOrderForm";
import {
  offerContainerClass,
  offerLeadClass,
  offerNarrowClass,
  offerSectionClass,
} from "@/components/erbjudanden/offerUi";
import {
  OFFER_PATHS,
  OFFER_PAYMENT_HASH,
  offerCheckoutPath,
} from "@/data/erbjudanden";
import { SITE_ORIGIN } from "@/lib/booking";

const PAGE_PATH = OFFER_PATHS.kassa;
const PAGE_URL = `${SITE_ORIGIN}${PAGE_PATH}`;

const parseProduct = (value: string | null): "snabbhet" | "friskvard" | null => {
  if (value === "snabbhet") return "snabbhet";
  if (value === "pass" || value === "friskvard" || value === "friskvard-pass") {
    return "friskvard";
  }
  return null;
};

const Kassa = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const productId = parseProduct(searchParams.get("produkt"));
  const onPayment = location.hash === `#${OFFER_PAYMENT_HASH}`;

  const title =
    productId === "snabbhet"
      ? "Köp snabbhetspaketet"
      : productId === "friskvard"
        ? "Köp personlig träning"
        : "Kassa";

  return (
    <main className="min-h-[calc(100vh-7rem)]">
      <Helmet>
        <title>{title} – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Beställ personlig träning eller snabbhetspaket och betala med Swish eller bankgiro."
        />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <section
        className={`bg-gradient-to-b from-muted/40 to-background ${offerSectionClass}`}
      >
        <div className={offerContainerClass}>
          <div className={offerNarrowClass}>
            <PageIntro
              className="mb-8 md:mb-10"
              eyebrow="Tillbaka till erbjudanden"
              eyebrowHref={OFFER_PATHS.friskvard}
              title={title}
            >
              {productId
                ? onPayment
                  ? undefined
                  : "Fyll i dina uppgifter."
                : "Välj vilket erbjudande du vill köpa."}
            </PageIntro>

            {productId ? (
              <OfferOrderForm key={productId} productId={productId} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  to={offerCheckoutPath("pass")}
                  className="min-h-11 rounded-2xl border border-border/60 bg-card p-5 text-left shadow-[var(--shadow-card)] hover:border-primary/40"
                >
                  <p className="text-lg font-semibold text-foreground">
                    Personlig träning
                  </p>
                  <p className={`${offerLeadClass} mt-1`}>
                    Välj antal pass, fokus och ev. presentkort i nästa steg.
                  </p>
                </Link>
                <Link
                  to={offerCheckoutPath("snabbhet")}
                  className="min-h-11 rounded-2xl border border-border/60 bg-card p-5 text-left shadow-[var(--shadow-card)] hover:border-primary/40"
                >
                  <p className="text-lg font-semibold text-foreground">
                    Snabbhetspaketet
                  </p>
                  <p className={`${offerLeadClass} mt-1`}>
                    Beställ test, program och återtest. Presentkort väljs i
                    nästa steg.
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default Kassa;
