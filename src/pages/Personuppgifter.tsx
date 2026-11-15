import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import PageIntro from "@/components/PageIntro";
import Partner from "@/components/Partner";
import { OFFER_CONTACT_EMAIL } from "@/data/erbjudanden";
import { SITE_ORIGIN } from "@/lib/booking";

export const PRIVACY_PATH = "/personuppgifter";
const PAGE_URL = `${SITE_ORIGIN}${PRIVACY_PATH}`;

const ADDRESS_LINE_1 = "Rinkebyvägen 4";
const ADDRESS_LINE_2 = "182 36 Danderyd";

const sectionClass = "space-y-3";
const h2Class =
  "text-xl font-bold tracking-tight text-foreground md:text-2xl";
const bodyClass =
  "break-words text-base leading-relaxed text-muted-foreground md:text-lg";
const listClass = `${bodyClass} list-disc space-y-2 pl-5`;

/**
 * Personuppgiftspolicy enligt GDPR (EU 2016/679). Uppgifterna bygger på
 * kontaktuppgifter som redan syns på sajten; organisationsnummer anges inte
 * här förrän det finns verifierat.
 */
const Personuppgifter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>Personuppgiftspolicy – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Hur Caselo Idrottsmedicin behandlar personuppgifter enligt GDPR."
        />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <section className="py-8 md:py-14">
        <div className="container px-8 md:px-4">
          <div className="mx-auto max-w-3xl">
            <PageIntro
              className="mb-8 md:mb-10"
              eyebrow="Startsida"
              eyebrowHref="/"
              title="Personuppgiftspolicy"
            >
              Här beskriver vi hur Caselo Idrottsmedicin behandlar
              personuppgifter när du använder webbplatsen, köper erbjudanden
              eller bokar tid.
            </PageIntro>

            <div className="space-y-8 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6 md:space-y-10 md:p-8">
              <section className={sectionClass}>
                <h2 className={h2Class}>1. Personuppgiftsansvarig</h2>
                <p className={bodyClass}>
                  Personuppgiftsansvarig är Caselo Idrottsmedicin, med
                  mottagning på {ADDRESS_LINE_1}, {ADDRESS_LINE_2}. Kontakt:
                  mejla{" "}
                  <a
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    href={`mailto:${OFFER_CONTACT_EMAIL}`}
                  >
                    {OFFER_CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>2. Vilka uppgifter vi behandlar</h2>
                <p className={bodyClass}>
                  Vilka uppgifter som samlas in beror på vad du gör på
                  webbplatsen. Det kan till exempel vara:
                </p>
                <ul className={listClass}>
                  <li>
                    namn och e-postadress när du köper ett erbjudande eller
                    skickar en förfrågan
                  </li>
                  <li>
                    uppgifter om beställningen, till exempel antal pass, fokus,
                    presentkort och om du vill ha kvitto för friskvårdsbidrag
                  </li>
                  <li>
                    personnummer, om du begär kvitto för friskvårdsbidrag
                    (namn och personnummer står båda på kvittot)
                  </li>
                  <li>
                    betalningsreferens och uppgift om hur du valt att betala
                    (Swish eller bankgiro)
                  </li>
                  <li>
                    teknisk information om hur webbplatsen används, om du
                    godkänner cookies för statistik
                  </li>
                </ul>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>3. Varför vi behandlar uppgifterna</h2>
                <ul className={listClass}>
                  <li>
                    för att ta emot och leverera din beställning, skicka
                    bekräftelse, kvitto och bokningsinstruktion
                  </li>
                  <li>
                    för att kunna matcha din betalning och kontakta dig om
                    något behöver kompletteras
                  </li>
                  <li>
                    för att uppfylla bokförings- och andra rättsliga krav
                  </li>
                  <li>
                    för att förstå hur webbplatsen används, om du har godkänt
                    cookies för statistik
                  </li>
                </ul>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>4. Rättslig grund</h2>
                <ul className={listClass}>
                  <li>
                    <span className="font-medium text-foreground">
                      Avtal:
                    </span>{" "}
                    behandling som behövs för att fullgöra köpet eller
                    bokningen
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Rättslig förpliktelse:
                    </span>{" "}
                    till exempel bokföring och kvitton
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Samtycke:
                    </span>{" "}
                    när du godkänner behandling i kassan eller cookies för
                    statistik; samtycket kan återkallas
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Berättigat intresse:
                    </span>{" "}
                    i begränsad omfattning för att svara på frågor och
                    förbättra webbplatsen, när det väger tyngre än
                    integritetsintrånget
                  </li>
                </ul>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>5. Hur länge sparas uppgifterna?</h2>
                <p className={bodyClass}>
                  Uppgifter som hör till ett köp sparas så länge det behövs för
                  leverans och kundservice, och därefter så länge bokföringslagen
                  kräver (normalt sju år). Uppgifter från en förfrågan sparas
                  tills ärendet är avslutat och en kort tid därefter.
                  Statistikuppgifter från cookies sparas enligt den
                  cookieinställning du har godkänt.
                </p>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>6. Vem får ta del av uppgifterna?</h2>
                <p className={bodyClass}>
                  Uppgifterna hanteras av Caselo Idrottsmedicin. De kan också
                  behandlas av leverantörer som behövs för driften, till exempel
                  för att skicka beställningsmejl, hosta webbplatsen eller ta
                  emot betalning via Swish och bankgiro. Sådana leverantörer får
                  bara behandla uppgifterna enligt våra instruktioner.
                </p>
                <p className={bodyClass}>
                  Vi säljer inte dina personuppgifter. Uppgifter lämnas till
                  myndighet om vi är skyldiga enligt lag.
                </p>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>7. Överföring utanför EU/EES</h2>
                <p className={bodyClass}>
                  Om någon leverantör behandlar uppgifter utanför EU/EES sker
                  det bara med lagligt stöd, till exempel EU-kommissionens
                  standardavtalsklausuler eller motsvarande skydd.
                </p>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>8. Dina rättigheter</h2>
                <p className={bodyClass}>
                  Du har enligt GDPR bland annat rätt att:
                </p>
                <ul className={listClass}>
                  <li>få information om vilka uppgifter vi behandlar om dig</li>
                  <li>få felaktiga uppgifter rättade</li>
                  <li>
                    i vissa fall få uppgifter raderade eller behandlingen
                    begränsad
                  </li>
                  <li>invända mot behandling som bygger på berättigat intresse</li>
                  <li>
                    återkalla samtycke när behandlingen bygger på samtycke
                  </li>
                  <li>
                    i vissa fall få ut uppgifter i ett maskinläsbart format
                    (dataportabilitet)
                  </li>
                  <li>
                    lämna klagomål till Integritetsskyddsmyndigheten (IMY),{" "}
                    <a
                      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                      href="https://www.imy.se"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.imy.se
                    </a>
                  </li>
                </ul>
                <p className={bodyClass}>
                  Kontakta oss på{" "}
                  <a
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    href={`mailto:${OFFER_CONTACT_EMAIL}`}
                  >
                    {OFFER_CONTACT_EMAIL}
                  </a>{" "}
                  om du vill använda dina rättigheter.
                </p>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>9. Cookies</h2>
                <p className={bodyClass}>
                  Webbplatsen kan använda cookies för statistik om hur sidan
                  används. Sådana cookies sätts först om du godkänner dem. Du
                  kan ändra ditt val genom att rensa sparade uppgifter för
                  webbplatsen i webbläsaren och ladda om sidan.
                </p>
              </section>

              <section className={sectionClass}>
                <h2 className={h2Class}>10. Ändringar</h2>
                <p className={bodyClass}>
                  Vi kan uppdatera den här policyn när vår verksamhet eller
                  lagstiftningen ändras. Den senaste versionen publiceras på
                  den här sidan. Senast uppdaterad: 15 november 2026.
                </p>
              </section>

              <p className={bodyClass}>
                <Link
                  to="/kontakt"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Gå till kontaktsidan
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default Personuppgifter;
