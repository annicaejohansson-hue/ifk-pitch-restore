import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import BookingLink from "@/components/BookingLink";
import Partner from "@/components/Partner";
import PageIntro from "@/components/PageIntro";
import { Button } from "@/components/ui/button";
import GiftLayoutPicker from "@/components/erbjudanden/GiftLayoutPicker";
import PtQuantityPicker from "@/components/erbjudanden/PtQuantityPicker";
import SnabbhetCampaignPrice, {
  PaintbrushHighlight,
} from "@/components/erbjudanden/SnabbhetCampaignPrice";
import SnabbhetOfferDetails from "@/components/erbjudanden/SnabbhetOfferDetails";
import {
  offerContainerClass,
  offerH2Class,
  offerDetailsListClass,
  offerLeadClass,
  offerNarrowClass,
} from "@/components/erbjudanden/offerUi";
import {
  FRISKVARD_FOCUS_OPTIONS,
  OFFER_CONFIRMATION_LINE,
  OFFER_CONTACT_EMAIL,
  OFFER_FIRST_VISIT_END_LABEL,
  OFFER_HOURS_LINE,
  OFFER_NO_TIME_LINE,
  OFFER_PATHS,
  OFFER_PRODUCTS,
  OFFER_WEATHER_LINE,
  PT_SESSION_DEFAULT_QUANTITY,
  PT_SESSION_LIST_PRICE_SEK,
  SNABBHET_OVERVIEW_POINTS,
  formatOfferPrice,
  offerCheckoutPath,
} from "@/data/erbjudanden";
import { SITE_ORIGIN, TRAINING_BOOKING_CATEGORY_ID } from "@/lib/booking";
import { cn } from "@/lib/utils";
import henrikFoto from "@/assets/IMG_9111.jpg";
import trainingFoto from "@/assets/IMG_9118.jpg";
import snabbhetFoto from "@/assets/snabbhet-laser.jpg";

const PAGE_PATH = OFFER_PATHS.friskvard;
const PAGE_URL = `${SITE_ORIGIN}${PAGE_PATH}`;
const ptProduct = OFFER_PRODUCTS["friskvard-pass"];

const PtCampaignPrice = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1",
      className,
    )}
    {...props}
  >
    <PaintbrushHighlight>
      <span className="text-lg font-semibold leading-snug text-foreground md:text-xl">
        Upp till 30% rabatt
      </span>
    </PaintbrushHighlight>
    <span className="text-sm leading-snug text-muted-foreground md:text-base">
      (ord. pris {formatOfferPrice(PT_SESSION_LIST_PRICE_SEK)}/pass)
    </span>
  </p>
);

const PtOfferDetails = () => (
  <div className="text-sm leading-relaxed text-muted-foreground md:text-base">
    <p className="mb-1.5">Varje pass är individuellt och 60 minuter långt.</p>
    <p className="mb-1.5">Mer om fokus för passen:</p>
    <ul className="mb-1.5 list-disc space-y-1.5 pl-10">
      {FRISKVARD_FOCUS_OPTIONS.map((item) => (
        <li key={item.id}>{item.detail}</li>
      ))}
    </ul>
    <ul className={offerDetailsListClass}>
      <li>{OFFER_HOURS_LINE}</li>
      <li>{OFFER_NO_TIME_LINE}</li>
      <li>{OFFER_CONFIRMATION_LINE}</li>
      <li>{OFFER_WEATHER_LINE}</li>
      <li>
        Frågor? Mejla{" "}
        <a
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          href={`mailto:${OFFER_CONTACT_EMAIL}`}
        >
          {OFFER_CONTACT_EMAIL}
        </a>
        .
      </li>
    </ul>
  </div>
);

const snabbhetHashIds = new Set([
  "snabbhet",
  "snabbhet-bestall",
  "bestall",
  "ingar",
]);

const detailsPanelClass =
  "scroll-mt-28 rounded-2xl border border-border/60 bg-muted/50 p-4 sm:p-5";

const cardStackCtaClass =
  "!h-16 min-h-16 w-full min-w-0 flex-wrap items-center justify-center break-words !whitespace-normal px-1.5 py-1.5 text-center text-xs leading-tight shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:px-2.5 sm:text-sm sm:leading-snug";

/** Översta raden i kortens knappar: fet och något större än raden inom parentes. */
const cardCtaTitleClass = "text-[13px] font-bold sm:text-base";

/**
 * Raden inom parentes i kortens knappar: ljusare färg. Mellan md och lg är
 * knapparna som smalast (ca 147 px), så där är raden 13 px för att rymmas på en rad.
 */
const cardCtaNoteClass =
  "text-secondary-foreground/70 md:max-lg:text-[13px]";

const cardMoreLinkClass =
  "inline-flex min-h-11 items-center text-base font-medium text-primary underline underline-offset-4 hover:text-primary/80";

const Friskvard = () => {
  const [openPt, setOpenPt] = useState(false);
  const [openSnabbhet, setOpenSnabbhet] = useState(false);
  const [quantityValue, setQuantityValue] = useState(
    String(PT_SESSION_DEFAULT_QUANTITY),
  );
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === "presentkort") {
      window.requestAnimationFrame(() => {
        document
          .getElementById("presentkort")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    if (!snabbhetHashIds.has(hash)) return;
    shouldScrollRef.current = true;
    setOpenSnabbhet(true);
  }, []);

  useEffect(() => {
    if (!openSnabbhet || !shouldScrollRef.current) return;
    shouldScrollRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("snabbhet-mer")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSnabbhet]);

  return (
    <main className="min-h-[calc(100vh-7rem)]">
      <Helmet>
        <title>Personlig träning i Danderyd – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Personlig fysträning och snabbhetspaket på Danderyd Arena. PT-pass från 990 kr inklusive moms, med volymrabatt upp till 10 pass. Snabbhetstest med laserportar 1 000 kr inklusive moms."
        />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <section
        id="erbjudanden"
        // Samma luft ovanför brödsmulan som på övriga tjänstesidor.
        className="scroll-mt-28 bg-gradient-to-b from-muted/40 to-background pb-12 pt-8 md:pb-20 md:pt-14"
      >
        <div className={offerContainerClass}>
          <div className={offerNarrowClass}>
            <PageIntro
              className="mb-8 md:mb-10"
              eyebrow="Tjänster"
              eyebrowHref="/tjanster"
              title="Personlig träning efter dina mål"
            >
              Träna med leg. fysioterapeut Henrik Nilsson i Danderyd – i din
              takt, efter din idrott eller motionsform.
            </PageIntro>

            <aside className="mb-8 rounded-2xl bg-secondary/45 px-5 py-4 sm:px-6 sm:py-5">
              <p className="mb-1.5 text-lg font-semibold text-foreground md:text-xl">
                Du kan använda friskvårdsbidraget
              </p>
              <p className={offerLeadClass}>
                Betala med Swish eller bankgiro och lämna kvittot till din
                arbetsgivare (kvittot uppfyller Skatteverkets krav).
                Träningstillfällen som köps under 2026 kan genomföras till och
                med{" "}
                {OFFER_FIRST_VISIT_END_LABEL}.
              </p>
            </aside>

            <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-x-6 md:gap-y-3">
              <div className="contents min-w-0 md:row-span-2 md:grid md:grid-rows-subgrid md:gap-y-3">
                <article className="flex h-full min-w-0 flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                  <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
                    {ptProduct.name}
                  </h3>
                  <figure className="mb-3 min-w-0 overflow-hidden rounded-xl">
                    <div className="aspect-[4/3] w-full bg-muted">
                      <img
                        src={trainingFoto}
                        alt="Henrik Nilsson guidar individuell träning på knä på Danderyd Arena"
                        className="h-full w-full object-cover object-[40%_30%]"
                        width={1200}
                        height={900}
                        fetchPriority="high"
                      />
                    </div>
                  </figure>
                  <PtCampaignPrice className="mb-3" />
                  {/* Från md står korten bredvid varandra: rutans överkant
                      linjerar då med versalhöjden i grannkortets första textrad. */}
                  <div className="min-w-0 md:mt-[7px]">
                    <PtQuantityPicker
                      id="pt-antal-kort"
                      variant="offer"
                      value={quantityValue}
                      onChange={setQuantityValue}
                    />
                  </div>
                  <div className="mt-4 min-w-0">
                    <p className={`${offerLeadClass} mb-2`}>
                      Vid köpet väljer du ett eller flera fokus för dina pass:
                    </p>
                    <ul className={`${offerLeadClass} list-disc space-y-1.5 pl-5`}>
                      {FRISKVARD_FOCUS_OPTIONS.map((item) => (
                        <li key={item.id}>{item.label}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto flex flex-col gap-3 pt-8">
                    <div className="grid min-w-0 grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:gap-3">
                      <Button asChild variant="secondary" className={cardStackCtaClass}>
                        <Link
                          to={offerCheckoutPath("pass", {
                            quantity: quantityValue,
                          })}
                        >
                          <span>
                            <span className={cardCtaTitleClass}>Köp pass nu</span>
                            <br />
                            <span className={cardCtaNoteClass}>(boka tid senare)</span>
                          </span>
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" className={cardStackCtaClass}>
                        <BookingLink categoryId={TRAINING_BOOKING_CATEGORY_ID}>
                          <span>
                            <span className={cardCtaTitleClass}>Boka tid nu</span>
                            <br />
                            <span className={cardCtaNoteClass}>(betala vid besöket)</span>
                          </span>
                        </BookingLink>
                      </Button>
                    </div>
                    <button
                      type="button"
                      className={cardMoreLinkClass}
                      aria-expanded={openPt}
                      aria-controls="pt-mer"
                      onClick={() => setOpenPt((open) => !open)}
                    >
                      {openPt ? "Stäng" : "Läs mer"}
                    </button>
                  </div>
                </article>
                {openPt ? (
                  <div id="pt-mer" className={detailsPanelClass}>
                    <PtOfferDetails />
                  </div>
                ) : (
                  <div className="hidden min-h-0 md:block" aria-hidden="true" />
                )}
              </div>

              <div className="contents min-w-0 md:row-span-2 md:grid md:grid-rows-subgrid md:gap-y-3">
                <article className="flex h-full min-w-0 flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                  <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
                    Snabbhetspaketet
                  </h3>
                  <figure className="mb-3 min-w-0 overflow-hidden rounded-xl">
                    <div className="aspect-[4/3] w-full bg-muted">
                      <img
                        src={snabbhetFoto}
                        alt="Laserportar för snabbhetstest, filmade nere vid sidlinjen"
                        className="h-full w-full object-cover object-[50%_32%]"
                        width={743}
                        height={1024}
                      />
                    </div>
                  </figure>
                  <div className="mb-3 grid min-w-0 grid-cols-[minmax(0,1fr)]">
                    <SnabbhetCampaignPrice className="col-start-1 row-start-1 self-start" />
                    <PtCampaignPrice
                      aria-hidden="true"
                      className="invisible col-start-1 row-start-1 hidden md:flex"
                    />
                  </div>
                  <p className={`${offerLeadClass} mb-4`}>
                    För dig som vill träna upp din snabbhet.
                  </p>
                  <p id="snabbhet-ingar-rubrik" className={`${offerLeadClass} mb-2.5`}>
                    I paketet ingår två tillfällen:
                  </p>
                  <ol
                    aria-labelledby="snabbhet-ingar-rubrik"
                    className="mb-3 list-none space-y-2.5 p-0"
                  >
                    {SNABBHET_OVERVIEW_POINTS.map((text, index) => (
                      <li key={text} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary text-[11px] font-semibold tabular-nums text-primary"
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0 text-base leading-snug text-muted-foreground md:text-lg">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-auto flex flex-col gap-3 pt-8">
                    <div className="grid min-w-0 grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:gap-3">
                      <Button asChild variant="secondary" className={cardStackCtaClass}>
                        <Link to={offerCheckoutPath("snabbhet")}>
                          <span>
                            <span className={cardCtaTitleClass}>Köp paketet nu</span>
                            <br />
                            <span className={cardCtaNoteClass}>(boka tid senare)</span>
                          </span>
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" className={cardStackCtaClass}>
                        <BookingLink categoryId={TRAINING_BOOKING_CATEGORY_ID}>
                          <span>
                            <span className={cardCtaTitleClass}>Boka tid nu</span>
                            <br />
                            <span className={cardCtaNoteClass}>(betala vid besöket)</span>
                          </span>
                        </BookingLink>
                      </Button>
                    </div>
                    <button
                      type="button"
                      className={cardMoreLinkClass}
                      aria-expanded={openSnabbhet}
                      aria-controls="snabbhet-mer"
                      onClick={() => setOpenSnabbhet((open) => !open)}
                    >
                      {openSnabbhet ? "Stäng" : "Läs mer"}
                    </button>
                  </div>
                </article>
                {openSnabbhet ? (
                  <div id="snabbhet-mer" className={detailsPanelClass}>
                    <SnabbhetOfferDetails />
                  </div>
                ) : (
                  <div className="hidden min-h-0 md:block" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="presentkort"
        className="scroll-mt-28 bg-muted py-14 md:py-20"
      >
        <div className={offerContainerClass}>
          <div className={`${offerNarrowClass} min-w-0 overflow-x-hidden`}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Presentkort
            </p>
              <h2 className={offerH2Class}>
                Ett presentkort till julklapp eller födelsedagen
              </h2>
              <p className={`${offerLeadClass} mb-6 max-w-3xl md:mb-8`}>
                Både personlig träning och snabbhetspaketet kan köpas som
                presentkort att ge bort. Presentkortet skickas till din e-post
                inom 24 timmar efter betalning, tillsammans med information om
                hur mottagaren bokar. Presentkorten finns i fyra utformningar –
                se nedan. Du väljer utformning och text på kortet i kassan.
              </p>
            <GiftLayoutPicker
              value="neutral"
              selectable={false}
              name="gift-preview"
              productName="Träning"
            />
          </div>
        </div>
      </section>

      <section
        id="henrik"
        className="scroll-mt-28 bg-background py-14 md:py-20"
      >
        <div className={offerContainerClass}>
          <div
            className={`${offerNarrowClass} grid min-w-0 items-start gap-8 md:grid-cols-2 md:gap-12`}
          >
            <div className="min-w-0">
              <h2 className={offerH2Class}>Henrik Nilsson</h2>
              <p className={`${offerLeadClass} mb-4`}>
                Henrik är legitimerad fysioterapeut sedan 2015, med tio års
                erfarenhet av idrottsskador. Han är tidigare elitfotbollsspelare
                och UEFA A-utbildad fotbollstränare.
              </p>
              <p className={offerLeadClass}>
                Sedan fem år är han assisterande tränare i IFK Stocksunds
                herrlag i Ettan Norra. I klubben ansvarar han också för
                skadeförebyggande träning och fysisk utveckling i samtliga lag,
                från 7&nbsp;år och uppåt.
              </p>
            </div>
            <figure className="min-w-0">
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                <div className="aspect-[4/5] w-full bg-muted md:aspect-square">
                  <img
                    src={henrikFoto}
                    alt="Henrik Nilsson, legitimerad fysioterapeut, på fotbollsplanen"
                    className="h-full w-full object-cover object-[58%_12%]"
                    width={900}
                    height={1125}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Henrik Nilsson, leg. fysioterapeut
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default Friskvard;
