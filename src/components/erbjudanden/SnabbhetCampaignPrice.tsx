import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  OFFER_PRODUCTS,
  formatOfferPrice,
} from "@/data/erbjudanden";
import brushLeft from "@/assets/paintbrush-stroke-left.png";
import brushMid from "@/assets/paintbrush-stroke-mid.png";
import brushRight from "@/assets/paintbrush-stroke-right.png";

const product = OFFER_PRODUCTS.snabbhet;

type PaintbrushHighlightProps = {
  children: ReactNode;
  className?: string;
};

export const PaintbrushHighlight = ({
  children,
  className,
}: PaintbrushHighlightProps) => (
  <span
    className={cn(
      "relative inline-flex max-w-full items-center isolate py-[0.22em] pl-[1.25em] pr-[1.3em]",
      className,
    )}
  >
    <span
      className="pointer-events-none absolute inset-0 z-0 flex"
      aria-hidden="true"
    >
      <img
        src={brushLeft}
        alt=""
        className="h-full w-[1.55em] max-w-none shrink-0 object-fill"
      />
      <img
        src={brushMid}
        alt=""
        className="h-full min-w-0 flex-1 object-fill"
      />
      <img
        src={brushRight}
        alt=""
        className="h-full w-[1.55em] max-w-none shrink-0 object-fill"
      />
    </span>
    <span className="relative z-[1]">{children}</span>
  </span>
);

type SnabbhetCampaignPriceProps = {
  className?: string;
  size?: "card" | "detail";
};

const SnabbhetCampaignPrice = ({
  className,
  size = "card",
}: SnabbhetCampaignPriceProps) => {
  const ordinary = product.ordinaryPriceSek;
  const offerClass =
    size === "detail"
      ? "text-xl font-semibold leading-snug text-foreground md:text-2xl"
      : "text-lg font-semibold leading-snug text-foreground md:text-xl";

  return (
    <div className={cn("min-w-0", className)}>
      <p className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <PaintbrushHighlight>
          <span className={offerClass}>{formatOfferPrice(product.priceSek)}</span>
        </PaintbrushHighlight>
        {ordinary ? (
          <span className="text-sm leading-snug text-muted-foreground md:text-base">
            (ord. pris {formatOfferPrice(ordinary)})
          </span>
        ) : null}
      </p>
    </div>
  );
};

export default SnabbhetCampaignPrice;
