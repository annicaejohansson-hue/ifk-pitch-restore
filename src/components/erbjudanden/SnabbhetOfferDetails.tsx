import { offerDetailsListClass } from "@/components/erbjudanden/offerUi";
import {
  OFFER_CONFIRMATION_LINE,
  OFFER_CONTACT_EMAIL,
  OFFER_HOURS_LINE,
  OFFER_NO_TIME_LINE,
  OFFER_SALES_UNTIL_LINE,
  OFFER_SURFACE_LINE,
  SNABBHET_DETAIL_POINTS,
} from "@/data/erbjudanden";

const SnabbhetOfferDetails = () => {
  return (
    <div id="ingar" className="scroll-mt-28 min-w-0 max-w-3xl overflow-x-hidden">
      <ul className={offerDetailsListClass}>
        {SNABBHET_DETAIL_POINTS.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
        <li>{OFFER_SALES_UNTIL_LINE}</li>
        <li>{OFFER_HOURS_LINE}</li>
        <li>{OFFER_NO_TIME_LINE}</li>
        <li>{OFFER_SURFACE_LINE}</li>
        <li>{OFFER_CONFIRMATION_LINE}</li>
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
};

export default SnabbhetOfferDetails;
